const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serve frontend files

// Helper: Read JSON
async function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper: Write JSON
async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// 🔹 GET all cars
app.get('/data/cars', async (req, res) => {
  try {
    const data = await readJsonFile('cars.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read cars.json' });
  }
});

// 🔹 GET all orders
app.get('/data/orders', async (req, res) => {
  try {
    const data = await readJsonFile('orders.json');
    res.json(data.orders || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders.json' });
  }
});

// 🔹 POST a new order
app.post('/data/orders', async (req, res) => {
  try {
    const order = req.body;
    const ordersData = await readJsonFile('orders.json');
    const carsData = await readJsonFile('cars.json');

    // Add ID if missing
    if (!order.id) order.id = Date.now().toString();
    order.rental.status = 'pending';

    // Add to orders
    ordersData.orders = ordersData.orders || [];
    ordersData.orders.push(order);
    await writeJsonFile('orders.json', ordersData);

    // Optional: toggle availability
    const car = carsData.cars.find(c => c.vin === order.car.vin);
    if (car) {
      car.available = false;
      await writeJsonFile('cars.json', carsData);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 🔹 PATCH to confirm order
app.patch('/data/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const ordersData = await readJsonFile('orders.json');
    const order = ordersData.orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.rental.status = status;
    await writeJsonFile('orders.json', ordersData);

    // Update car availability and unavailableDates if confirmed
    if (status === 'confirmed') {
      const carsData = await readJsonFile('cars.json');
      const car = carsData.cars.find(c => c.vin === order.car.vin);
      if (car) {
        if (!car.unavailableDates) car.unavailableDates = [];
        car.unavailableDates.push({
          start: order.rental.startDate,
          end: order.rental.returnDate
        });
        await writeJsonFile('cars.json', carsData);
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

// 🔹 DELETE order
app.delete('/data/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const ordersData = await readJsonFile('orders.json');
    const orderIndex = ordersData.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });

    const carVin = ordersData.orders[orderIndex].car.vin;
    ordersData.orders.splice(orderIndex, 1);
    await writeJsonFile('orders.json', ordersData);

    // Optional: make car available again
    const carsData = await readJsonFile('cars.json');
    const car = carsData.cars.find(c => c.vin === carVin);
    if (car) {
      car.available = true;
      await writeJsonFile('cars.json', carsData);
    }

    res.json({ status: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
