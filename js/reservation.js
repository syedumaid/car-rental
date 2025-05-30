document.addEventListener("DOMContentLoaded", () => {
  const vin = localStorage.getItem("selectedVIN");
  const form = document.getElementById("reservationForm");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const licenseInput = document.getElementById("license");
  const startDateInput = document.getElementById("startDate");
  const returnDateInput = document.getElementById("returnDate");
  const totalPriceDisplay = document.getElementById("totalPrice");
  const submitBtn = document.getElementById("submitBtn");

  let selectedCar = null;

  const today = new Date().toISOString().split("T")[0];
  startDateInput.setAttribute("min", today);
  returnDateInput.setAttribute("min", today);

  const restoreForm = () => {
    nameInput.value = localStorage.getItem("form_name") || "";
    phoneInput.value = localStorage.getItem("form_phone") || "";
    emailInput.value = localStorage.getItem("form_email") || "";
    licenseInput.value = localStorage.getItem("form_license") || "";
    startDateInput.value = localStorage.getItem("form_startDate") || "";
    returnDateInput.value = localStorage.getItem("form_returnDate") || "";
  };

  const saveForm = () => {
    localStorage.setItem("form_name", nameInput.value);
    localStorage.setItem("form_phone", phoneInput.value);
    localStorage.setItem("form_email", emailInput.value);
    localStorage.setItem("form_license", licenseInput.value);
    localStorage.setItem("form_startDate", startDateInput.value);
    localStorage.setItem("form_returnDate", returnDateInput.value);
  };

  const validateForm = () => {
    const fields = [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput];
    let isValid = true;
    fields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = "red";
        isValid = false;
      } else {
        field.style.borderColor = "green";
      }
    });
    submitBtn.disabled = !isValid;
    return isValid;
  };

  const updateTotalPrice = () => {
    const start = new Date(startDateInput.value);
    const end = new Date(returnDateInput.value);

    if (start && end && end > start && selectedCar) {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const total = days * selectedCar.pricePerDay;
      totalPriceDisplay.textContent = `$${total}`;
    } else {
      totalPriceDisplay.textContent = "$0";
    }
  };

  [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput].forEach(input => {
    input.addEventListener("input", () => {
      saveForm();
      updateTotalPrice();
      validateForm();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const start = new Date(startDateInput.value);
    const end = new Date(returnDateInput.value);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total = rentalDays * selectedCar.pricePerDay;

    const order = {
      id: Date.now().toString(),
      customer: {
        name: nameInput.value,
        phoneNumber: phoneInput.value,
        email: emailInput.value,
        driversLicenseNumber: licenseInput.value
      },
      car: { vin: selectedCar.vin },
      rental: {
        startDate: startDateInput.value,
        returnDate: returnDateInput.value,
        rentalPeriod: rentalDays,
        totalPrice: total,
        orderDate: new Date().toISOString().split("T")[0],
        status: "pending"
      }
    };

    try {
      const response = await fetch("/data/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      if (!response.ok) throw new Error("Server error");

      localStorage.setItem("confirmedOrder", JSON.stringify(order));
      localStorage.removeItem("selectedVIN");

      window.location.href = "/confirmation.html";
    } catch (err) {
      alert("Failed to submit order. Please ensure the server is running.");
    }
  });
  document.getElementById("cancelBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to cancel the reservation and clear the form?")) {
      // Clear all stored form data
      localStorage.removeItem("form_name");
      localStorage.removeItem("form_phone");
      localStorage.removeItem("form_email");
      localStorage.removeItem("form_license");
      localStorage.removeItem("form_startDate");
      localStorage.removeItem("form_returnDate");
      localStorage.removeItem("selectedVIN");
  
      // Reset form visually
      form.reset();
      document.getElementById("totalPrice").textContent = "0";
  
      const today = new Date().toISOString().split("T")[0];
      startDateInput.setAttribute("min", today);
      returnDateInput.setAttribute("min", today);
  
      // ✅ Redirect to homepage
      window.location.href = "index.html";
    }
  });
  
  

  if (vin) {
    fetch("data/cars.json")
      .then(res => res.json())
      .then(data => {
        selectedCar = data.cars.find(car => car.vin === vin);
        if (selectedCar) {
          document.getElementById("carDetails").innerHTML = `
          <div class="reservation-car-info">
            <img src="${selectedCar.image}" alt="${selectedCar.brand} ${selectedCar.carModel}" class="car-img" />
            <h3>${selectedCar.brand} ${selectedCar.carModel}</h3>
            <p>${selectedCar.description}</p>
            <p><strong>Type:</strong> ${selectedCar.carType}</p>
            <p><strong>Year:</strong> ${selectedCar.yearOfManufacture}</p>
            <p><strong>Fuel:</strong> ${selectedCar.fuelType}</p>
            <p><strong>Price Per Day:</strong> $${selectedCar.pricePerDay}</p>
          </div>
        `;
        }
        restoreForm();
        updateTotalPrice();
        validateForm();
      });
  }
  if (!vin) {
    document.getElementById("reservationForm").style.display = "none";
    document.getElementById("carDetails").style.display = "none";
  
    const msgBox = document.getElementById("noCarMsg");
    msgBox.style.display = "block";
    msgBox.innerHTML = `
      <h3>No car selected.</h3>
      <button id="goHomeBtn" style="padding:10px 20px; background:#c0392b; color:#fff; border:none; border-radius:5px; font-size:16px; cursor:pointer;">
        Country roads, take me home
      </button>
    `;
  
    document.getElementById("goHomeBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  
    return; // stop further execution
  }
  
});
