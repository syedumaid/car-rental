document.addEventListener("DOMContentLoaded", () => {
  const carGrid = document.getElementById("carGrid");
  const searchBox = document.getElementById("searchBox");
  const suggestions = document.getElementById("suggestions");
  const filterType = document.getElementById("filterType");
  const filterBrand = document.getElementById("filterBrand");
  const resetBtn = document.getElementById("resetBtn");

  let allCars = [];

  // Load cars from JSON
  fetch("data/cars.json")
    .then(response => response.json())
    .then(data => {
      allCars = data.cars;
      renderCars(allCars);
      populateFilters(allCars);
    })
    .catch(error => console.error("Error loading cars.json:", error));

  // Render car grid
  function renderCars(cars) {
    carGrid.innerHTML = "";
    cars.forEach(car => {
      const card = document.createElement("div");
      card.classList.add("car-card");

      card.innerHTML = `
        <img src="${car.image}" alt="${car.carModel}" />
        <h3>${car.brand} ${car.carModel}</h3>
        <p>${car.carType} | ${car.fuelType}</p>
        <p>Year: ${car.yearOfManufacture}</p>
        <p>Mileage: ${car.mileage}</p>
        <p>Price: $${car.pricePerDay}/day</p>
        <p><strong>${car.available ? "Available" : "Unavailable"}</strong></p>
        <button class="rent-btn" ${!car.available ? "disabled" : ""} data-vin="${car.vin}">
          Rent
        </button>
      `;

      carGrid.appendChild(card);
    });
  }

  // Populate Brand and Type filters dynamically
  function populateFilters(cars) {
    const types = new Set();
    const brands = new Set();

    cars.forEach(car => {
      types.add(car.carType);
      brands.add(car.brand);
    });

    filterType.innerHTML = `<option value="">All Types</option>`;
    [...types].sort().forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      filterType.appendChild(option);
    });

    filterBrand.innerHTML = `<option value="">All Brands</option>`;
    [...brands].sort().forEach(brand => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      filterBrand.appendChild(option);
    });
  }

  // Search Suggestions
  searchBox.addEventListener("input", () => {
    const input = searchBox.value.toLowerCase();
    suggestions.innerHTML = "";

    if (!input) return;

    const keywordSet = new Set();
    allCars.forEach(car => {
      [car.brand, car.carModel, car.carType, car.description].forEach(field => {
        if (field.toLowerCase().includes(input)) {
          keywordSet.add(field);
        }
      });
    });

    [...keywordSet].slice(0, 5).forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.classList.add("suggestion");
      suggestions.appendChild(li);
    });
  });

  // Handle suggestion click
  suggestions.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      searchBox.value = e.target.textContent;
      suggestions.innerHTML = "";
      filterAndRender();
    }
  });

  // Unified filter and search
  function filterAndRender() {
    const keyword = searchBox.value.toLowerCase();
    const selectedType = filterType.value;
    const selectedBrand = filterBrand.value;

    const filtered = allCars.filter(car => {
      const matchesKeyword = keyword === "" ||
        car.brand.toLowerCase().includes(keyword) ||
        car.carModel.toLowerCase().includes(keyword) ||
        car.carType.toLowerCase().includes(keyword) ||
        car.description.toLowerCase().includes(keyword);

      const matchesType = selectedType === "" || car.carType === selectedType;
      const matchesBrand = selectedBrand === "" || car.brand === selectedBrand;

      return matchesKeyword && matchesType && matchesBrand;
    });

    renderCars(filtered);
  }

  // Event listeners
  filterType.addEventListener("change", filterAndRender);
  filterBrand.addEventListener("change", filterAndRender);
  searchBox.addEventListener("keyup", filterAndRender);

  // Reset filters
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterType.value = "";
      filterBrand.value = "";
      searchBox.value = "";
      suggestions.innerHTML = "";
      renderCars(allCars);
    });
  }

  // Handle Rent button click
  carGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("rent-btn")) {
      const vin = e.target.dataset.vin;
      localStorage.setItem("selectedVIN", vin);
      window.location.href = "reservation.html";
    }
  });
});
