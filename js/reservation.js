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

<<<<<<< HEAD
  // const validateForm = () => {
  //   const fields = [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput];
  //   let isValid = true;
  //   fields.forEach(field => {
  //     if (!field.value.trim()) {
  //       field.style.borderColor = "red";
  //       isValid = false;
  //     } else {
  //       field.style.borderColor = "green";
  //     }
  //   });
  //   submitBtn.disabled = !isValid;
  //   return isValid;
  // };
  function validateForm() {
    let isValid = true;
  
    // Clear all previous errors
    document.querySelectorAll(".error-message").forEach(div => div.textContent = "");
  
    // Name
    if (!/^[a-zA-Z ]{2,}$/.test(nameInput.value)) {
      showError("nameError", "Name must be at least 2 letters.");
      nameInput.style.borderColor = "red";
      isValid = false;
    } else {
      nameInput.style.borderColor = "green";
    }
  
    // Phone
    const phoneVal = phoneInput.value.trim();
    if (!/^\+?[0-9\s\-]{7,15}$/.test(phoneVal)) {
      showError("phoneWarning", "Phone number must be 7-15 digits (can include +, -, or space).");
      phoneInput.style.borderColor = "red";
      isValid = false;
    } else {
      phoneInput.style.borderColor = "green";
    }
  
    // Email
    const emailVal = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      showError("emailError", "Please enter a valid email address.");
      emailInput.style.borderColor = "red";
      isValid = false;
    } else {
      emailInput.style.borderColor = "green";
    }
  
    // License
    if (!/^[A-Za-z0-9]{5,20}$/.test(licenseInput.value)) {
      showError("licenseError", "License must be alphanumeric (5–20 characters).");
      licenseInput.style.borderColor = "red";
      isValid = false;
    } else {
      licenseInput.style.borderColor = "green";
    }
  
    // Start Date
    if (!startDateInput.value) {
      showError("startDateError", "Please select a rental start date.");
      startDateInput.style.borderColor = "red";
      isValid = false;
    } else {
      startDateInput.style.borderColor = "green";
    }
  
    // Return Date
    if (!returnDateInput.value) {
      showError("returnDateError", "Please select a rental return date.");
      returnDateInput.style.borderColor = "red";
      isValid = false;
    } else {
      returnDateInput.style.borderColor = "green";
    }
  
    submitBtn.disabled = !isValid;
    return isValid;
  }
  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.color = "red";
      element.style.marginTop = "4px";
      element.style.fontSize = "0.9rem";
    }
  }
    
  document.getElementById("phone").addEventListener("input", function () {
    this.value = this.value.replace(/[A-Za-z]/g, "");
  });

  const phoneWarning = document.getElementById("phoneWarning");

phoneInput.addEventListener("input", function () {
  const value = this.value;
  const validPattern = /^\+?[0-9\- ]{7,15}$/;

  if (/[a-zA-Z]/.test(value)) {
    phoneWarning.textContent = "Letters are not allowed. Example: +1234567890";
    this.style.borderColor = "red";
  } else if (!validPattern.test(value)) {
    phoneWarning.textContent = "Phone number should be 7 to 15 digits (can include +, - or spaces).";
    this.style.borderColor = "orange";
  } else {
    phoneWarning.textContent = "";
    this.style.borderColor = "green";
  }
});

const cancelBtn = document.getElementById("cancelBtn");

cancelBtn.addEventListener("click", () => {
  // Clear form fields
  form.reset();

  // Reset border colors and validation
  [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput].forEach(field => {
    field.style.borderColor = "";
  });

  // Clear warning message if any
  phoneWarning.textContent = "";

  // Clear localStorage keys related to form and selection
  localStorage.removeItem("form_name");
  localStorage.removeItem("form_phone");
  localStorage.removeItem("form_email");
  localStorage.removeItem("form_license");
  localStorage.removeItem("form_startDate");
  localStorage.removeItem("form_returnDate");
  localStorage.removeItem("selectedVIN");

  // Optionally redirect to homepage
  window.location.href = "index.html";
});

=======
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
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)

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
<<<<<<< HEAD
  

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const order = {
=======

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const start = new Date(startDateInput.value);
    const end = new Date(returnDateInput.value);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total = rentalDays * selectedCar.pricePerDay;

    const order = {
      id: Date.now().toString(),
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)
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
<<<<<<< HEAD
        rentalPeriod: Math.ceil((new Date(returnDateInput.value) - new Date(startDateInput.value)) / (1000 * 60 * 60 * 24)),
        totalPrice: Math.ceil((new Date(returnDateInput.value) - new Date(startDateInput.value)) / (1000 * 60 * 60 * 24)) * selectedCar.pricePerDay,
=======
        rentalPeriod: rentalDays,
        totalPrice: total,
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)
        orderDate: new Date().toISOString().split("T")[0],
        status: "pending"
      }
    };

<<<<<<< HEAD
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
  
  if (!vin) {
    document.getElementById("reservationForm").style.display = "none";
    document.getElementById("noCarMsg").style.display = "block";
    return; 
  }
  // document.getElementById("goHomeBtn").addEventListener("click", () => {
  //   window.location.href = "index.html";
  // });
=======
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
  
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)
  

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
<<<<<<< HEAD
        `;        
=======
        `;
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)
        }
        restoreForm();
        updateTotalPrice();
        validateForm();
      });
  }
<<<<<<< HEAD
=======
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
  
>>>>>>> 95210c9 (fixed node.js-FINALLYYYY)
});
