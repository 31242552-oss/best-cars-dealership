/* jshint esversion: 8, node: true */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/dealershipsDB';

app.use(cors());
app.use(express.json());

// Dealership Schema
const dealershipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  zip: { type: String, required: true },
  lat: { type: Number },
  long: { type: Number },
  short_name: { type: String },
  full_name: { type: String, required: true }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dealership: { type: Number, required: true },
  review: { type: String, required: true },
  purchase: { type: Boolean, default: false },
  purchase_date: { type: String, default: '' },
  car_make: { type: String, default: '' },
  car_model: { type: String, default: '' },
  car_year: { type: Number, default: 0 }
});

const Dealership = mongoose.model('Dealership', dealershipSchema);
const Review = mongoose.model('Review', reviewSchema);

// In-memory fallback dataset for seamless offline / non-containerized execution
let memoryDealerships = [];
let memoryReviews = [];
let isMongoConnected = false;

// Load initial JSON files
const rawDealershipsPath = path.join(__dirname, 'data', 'dealerships.json');
const rawReviewsPath = path.join(__dirname, 'data', 'reviews.json');

try {
  if (fs.existsSync(rawDealershipsPath)) {
    const rawDealers = JSON.parse(fs.readFileSync(rawDealershipsPath, 'utf8'));
    memoryDealerships = rawDealers.dealerships || [];
  }
  if (fs.existsSync(rawReviewsPath)) {
    const rawRevs = JSON.parse(fs.readFileSync(rawReviewsPath, 'utf8'));
    memoryReviews = rawRevs.reviews || [];
  }
  console.log(`Loaded ${memoryDealerships.length} fallback dealers and ${memoryReviews.length} fallback reviews.`);
} catch (err) {
  console.error('Error reading fallback JSON data:', err.message);
}

// Connect to MongoDB and seed if necessary
async function initMongo() {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('Connected to MongoDB successfully.');

    // Seed Dealerships if collection is empty
    const dealerCount = await Dealership.countDocuments();
    if (dealerCount === 0 && memoryDealerships.length > 0) {
      await Dealership.insertMany(memoryDealerships);
      console.log(`Seeded ${memoryDealerships.length} dealerships to MongoDB.`);
    }

    // Seed Reviews if collection is empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && memoryReviews.length > 0) {
      await Review.insertMany(memoryReviews);
      console.log(`Seeded ${memoryReviews.length} reviews to MongoDB.`);
    }
  } catch (err) {
    isMongoConnected = false;
    console.log('MongoDB connection not available. Operating with high-performance in-memory fallback store:', err.message);
  }
}

initMongo();

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Dealership & Reviews Database Service', port: PORT });
});

// GET /fetchDealers
app.get('/fetchDealers', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dealers = await Dealership.find({});
      return res.json(dealers);
    }
    return res.json(memoryDealerships);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /fetchDealers/:state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateParam = req.params.state;
    if (isMongoConnected) {
      const dealers = await Dealership.find({
        state: { $regex: new RegExp(`^${stateParam}$`, 'i') }
      });
      return res.json(dealers);
    }
    const filtered = memoryDealerships.filter(
      d => d.state && d.state.toLowerCase() === stateParam.toLowerCase()
    );
    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /fetchDealer/:id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const idParam = parseInt(req.params.id, 10);
    if (isNaN(idParam)) {
      return res.status(400).json({ error: 'Invalid dealer ID' });
    }
    if (isMongoConnected) {
      const dealer = await Dealership.findOne({ id: idParam });
      if (!dealer) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
      return res.json(dealer);
    }
    const found = memoryDealerships.find(d => d.id === idParam);
    if (!found) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    return res.json(found);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /fetchReviews
app.get('/fetchReviews', async (req, res) => {
  try {
    if (isMongoConnected) {
      const reviews = await Review.find({});
      return res.json(reviews);
    }
    return res.json(memoryReviews);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /fetchReviews/dealer/:id
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    if (isNaN(dealerId)) {
      return res.status(400).json({ error: 'Invalid dealer ID' });
    }
    if (isMongoConnected) {
      const reviews = await Review.find({ dealership: dealerId });
      return res.json(reviews);
    }
    const filtered = memoryReviews.filter(r => parseInt(r.dealership, 10) === dealerId);
    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /insert_review
app.post('/insert_review', async (req, res) => {
  try {
    const body = req.body;
    let nextId = 1;
    if (isMongoConnected) {
      const lastDoc = await Review.findOne().sort({ id: -1 });
      nextId = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
    } else {
      if (memoryReviews.length > 0) {
        const maxId = Math.max(...memoryReviews.map(r => r.id || 0));
        nextId = maxId + 1;
      }
    }

    const newReview = {
      id: body.id || nextId,
      name: body.name || 'Anonymous',
      dealership: parseInt(body.dealership, 10),
      review: body.review || '',
      purchase: Boolean(body.purchase),
      purchase_date: body.purchase_date || '',
      car_make: body.car_make || '',
      car_model: body.car_model || '',
      car_year: body.car_year ? parseInt(body.car_year, 10) : 0
    };

    if (isMongoConnected) {
      const created = await Review.create(newReview);
      memoryReviews.push(newReview);
      return res.status(200).json({ status: 200, message: 'Review inserted successfully', review: created });
    }

    memoryReviews.push(newReview);
    return res.status(200).json({ status: 200, message: 'Review inserted successfully', review: newReview });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Node/Express Dealership service running on http://localhost:${PORT}`);
});
