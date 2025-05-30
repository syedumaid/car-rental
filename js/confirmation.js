document.addEventListener("DOMContentLoaded", () => {
  const details = JSON.parse(localStorage.getItem("confirmedOrder"));
  const container = document.getElementById("confirmationDetails");
  const confirmBtn = document.getElementById("confirmOrderBtn");
  const heading = document.getElementById("confirmationHeading");

  if (!details) {
    container.innerHTML = "<p style='color: red;'>No reservation found. Please make a reservation first.</p>";
    confirmBtn.style.display = "none";
    return;
  }

  function updateDisplay(status) {
    const badgeColor = status === "confirmed" ? "green" : "orange";
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    heading.textContent = status === "confirmed" ? "Reservation Confirmed" : "Order Pending";
    heading.className = status === "confirmed" ? "text-success" : "text-warning";

    container.innerHTML = `
      <p><strong>Name:</strong> ${details.customer.name}</p>
      <p><strong>Email:</strong> ${details.customer.email}</p>
      <p><strong>Phone:</strong> ${details.customer.phoneNumber}</p>
      <p><strong>License No:</strong> ${details.customer.driversLicenseNumber}</p>
      <p><strong>Car VIN:</strong> ${details.car.vin}</p>
      <p><strong>Rental Start Date:</strong> ${details.rental.startDate}</p>
      <p><strong>Rental Return Date:</strong> ${details.rental.returnDate}</p>
      <p><strong>Rental Period:</strong> ${details.rental.rentalPeriod} days</p>
      <p><strong>Total Price:</strong> $${details.rental.totalPrice}</p>
      <p><strong>Status:</strong> 
        <span style="color: white; background-color: ${badgeColor}; padding: 0.2rem 0.6rem; border-radius: 4px;">
          ${statusText}
        </span>
      </p>
    `;
  }

  updateDisplay(details.rental.status);

  confirmBtn.addEventListener("click", async () => {
    if (details.rental.status === "confirmed") return;

    try {
      const response = await fetch(`/data/orders/${details.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" })
      });

      if (!response.ok) throw new Error("Failed to confirm order");

      details.rental.status = "confirmed";
      localStorage.setItem("confirmedOrder", JSON.stringify(details));
      updateDisplay("confirmed");
      confirmBtn.disabled = true;
      confirmBtn.textContent = "Order Confirmed";
      confirmBtn.style.backgroundColor = "#ccc";
      confirmBtn.style.cursor = "default";
    } catch (error) {
      alert("Error confirming reservation. Server may be down.");
    }
  });
});
