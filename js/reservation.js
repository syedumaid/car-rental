document.addEventListener("DOMContentLoaded", () => {
  const vin = localStorage.getItem("selectedVIN");
  const carDetailsContainer = document.getElementById("carDetails");
  const noCarMsg = document.getElementById("noCarMsg");
  const form = document.getElementById("reservationForm");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const licenseInput = document.getElementById("license");
  const startDateInput = document.getElementById("startDate");
  const returnDateInput = document.getElementById("returnDate");
  const rentalDaysInput = document.getElementById("rentalDays");
  const totalPriceDisplay = document.getElementById("totalPrice");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  let selectedCar = null;

  // Set min date for start and return
  const today = new Date().toISOString().split("T")[0];
  startDateInput.setAttribute("min", today);
  returnDateInput.setAttribute("min", today);

  // Restore form from localStorage
  function restoreForm() {
    nameInput.value = localStorage.getItem("form_name") || "";
    phoneInput.value = localStorage.getItem("form_phone") || "";
    emailInput.value = localStorage.getItem("form_email") || "";
    licenseInput.value = localStorage.getItem("form_license") || "";
    startDateInput.value = localStorage.getItem("form_startDate") || "";
    returnDateInput.value = localStorage.getItem("form_returnDate") || "";
  }

  // Save form to localStorage
  function saveForm() {
    localStorage.setItem("form_name", nameInput.value);
    localStorage.setItem("form_phone", phoneInput.value);
    localStorage.setItem("form_email", emailInput.value);
    localStorage.setItem("form_license", licenseInput.value);
    localStorage.setItem("form_startDate", startDateInput.value);
    localStorage.setItem("form_returnDate", returnDateInput.value);
  }

  // Validate form
  function validateForm() {
    const fields = [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput];
    let isValid = true;

    fields.forEach(field => {
      if (!field.checkValidity()) {
        field.style.borderColor = "red";
        isValid = false;
      } else {
        field.style.borderColor = "green";
      }
    });

    return isValid;
  }

  // Calculate rental duration and price
  function updateTotalPrice() {
    const start = new Date(startDateInput.value);
    const end = new Date(returnDateInput.value);

    if (startDateInput.value && returnDateInput.value && end > start && selectedCar) {
      const diffInMs = end - start;
      const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      const total = days * selectedCar.pricePerDay;

      rentalDaysInput.value = days;
      totalPriceDisplay.textContent = total;
    } else {
      rentalDaysInput.value = "";
      totalPriceDisplay.textContent = "0";
    }
  }

  // Event listeners for live input handling
  [nameInput, phoneInput, emailInput, licenseInput, startDateInput, returnDateInput].forEach(input => {
    input.addEventListener("input", () => {
      saveForm();
      updateTotalPrice();
      validateForm();
    });
  });

  // Cancel button
  cancelBtn.addEventListener("click", () => {
    localStorage.removeItem("selectedVIN");
    localStorage.removeItem("form_name");
    localStorage.removeItem("form_phone");
    localStorage.removeItem("form_email");
    localStorage.removeItem("form_license");
    localStorage.removeItem("form_startDate");
    localStorage.removeItem("form_returnDate");
    window.location.href = "index.html";
  });

  // Submit button
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all fields correctly.");
      return;
    }

    fetch("data/cars.json")
      .then(res => res.json())
      .then(data => {
        const latestCar = data.cars.find(car => car.vin === selectedCar.vin);

        if (!latestCar || !latestCar.available) {
          alert("Sorry, this car has just been booked by someone else.");
          return;
        }

        const order = {
          customer: {
            name: nameInput.value,
            phoneNumber: phoneInput.value,
            email: emailInput.value,
            driversLicenseNumber: licenseInput.value
          },
          car: {
            vin: selectedCar.vin
          },
          rental: {
            startDate: startDateInput.value,
            returnDate: returnDateInput.value,
            rentalPeriod: parseInt(rentalDaysInput.value),
            totalPrice: parseInt(rentalDaysInput.value) * selectedCar.pricePerDay,
            orderDate: new Date().toISOString().split("T")[0]
          }
        };

        let mockOrders = JSON.parse(localStorage.getItem("mock_orders")) || [];
        mockOrders.push(order);
        localStorage.setItem("mock_orders", JSON.stringify(mockOrders));

        selectedCar.available = false;

        localStorage.setItem("confirmedOrder", JSON.stringify(order));
        localStorage.removeItem("selectedVIN");
        localStorage.removeItem("form_name");
        localStorage.removeItem("form_phone");
        localStorage.removeItem("form_email");
        localStorage.removeItem("form_license");
        localStorage.removeItem("form_startDate");
        localStorage.removeItem("form_returnDate");

        window.location.href = "confirmation.html";
      })
      .catch(err => {
        console.error("Error rechecking availability:", err);
        alert("An error occurred. Please try again.");
      });
  });

  // Load selected car
  if (vin) {
    fetch("data/cars.json")
      .then(res => res.json())
      .then(data => {
        selectedCar = data.cars.find(car => car.vin === vin);

        if (!selectedCar) {
          noCarMsg.style.display = "block";
          form.style.display = "none";
          return;
        }

        if (!selectedCar.available) {
          carDetailsContainer.innerHTML = `<h3>This car is no longer available. Please select another car.</h3>`;
          form.style.display = "none";
          return;
        }

        carDetailsContainer.innerHTML = `
          <img src="${selectedCar.image}" alt="${selectedCar.carModel}" class="car-img"/>
          <h2>${selectedCar.brand} ${selectedCar.carModel}</h2>
          <p>${selectedCar.description}</p>
          <p><strong>Type:</strong> ${selectedCar.carType}</p>
          <p><strong>Year:</strong> ${selectedCar.yearOfManufacture}</p>
          <p><strong>Mileage:</strong> ${selectedCar.mileage}</p>
          <p><strong>Fuel Type:</strong> ${selectedCar.fuelType}</p>
          <p><strong>Price Per Day:</strong> $${selectedCar.pricePerDay}</p>
        `;

        restoreForm();
        updateTotalPrice();
        validateForm();
      })
      .catch(err => {
        carDetailsContainer.innerHTML = "<p>Error loading car details.</p>";
        form.style.display = "none";
        console.error("Error loading car:", err);
      });
  } else {
    noCarMsg.style.display = "block";
    form.style.display = "none";
  }
});
