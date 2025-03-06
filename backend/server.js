import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import appRoutes from './routes/appRoutes.js';
import authRoute from './routes/authRoute.js';
import signUpRoute from './routes/signupRoute.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Add CORS headers for image requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Routes
app.use('/api', appRoutes);
app.use('/auth', authRoute);
app.use('/signup', signUpRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  }); 