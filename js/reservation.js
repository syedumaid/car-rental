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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const order = {
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
        rentalPeriod: Math.ceil((new Date(returnDateInput.value) - new Date(startDateInput.value)) / (1000 * 60 * 60 * 24)),
        totalPrice: Math.ceil((new Date(returnDateInput.value) - new Date(startDateInput.value)) / (1000 * 60 * 60 * 24)) * selectedCar.pricePerDay,
        orderDate: new Date().toISOString().split("T")[0],
        status: "pending"
      }
    };

    const orders = JSON.parse(localStorage.getItem("mock_orders")) || [];
    orders.push(order);
    localStorage.setItem("mock_orders", JSON.stringify(orders));
    localStorage.setItem("confirmedOrder", JSON.stringify(order));

    localStorage.removeItem("form_name");
    localStorage.removeItem("form_phone");
    localStorage.removeItem("form_email");
    localStorage.removeItem("form_license");
    localStorage.removeItem("form_startDate");
    localStorage.removeItem("form_returnDate");
    localStorage.removeItem("selectedVIN");

    window.location.href = "confirmation.html";
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
});
