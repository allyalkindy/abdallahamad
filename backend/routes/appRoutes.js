import express from "express";
import { patientModel } from "../models/patientModel.js";
import { treatmentModel } from "../models/treatmentModel.js";
import { doctorModel } from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// At the top of your file, after imports
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug log
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ 
      message: 'Invalid token',
      error: err.message 
    });
  }
};

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'doctor-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all patients from the database
router.get("/patients", verifyToken, async (req, res) => {
  try {
    const patients = await patientModel.find({});
    return res.status(200).json({
      count: patients.length,
      data: patients,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// Move the profile route BEFORE any routes with :id parameters
router.get("/doctor/profile", verifyToken, async (req, res) => {
  try {
    console.log('Getting profile for doctor ID:', req.user._id);
    
    const doctor = await doctorModel.findById(req.user._id)
      .select('-password')
      .lean();

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log('Found doctor:', doctor);
    return res.status(200).json(doctor);
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ 
      message: "Error fetching doctor profile",
      error: err.message 
    });
  }
});

// Then put your other doctor routes AFTER the profile route
router.get("/doctor/:id", verifyToken, async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all treatments from the database
router.get("/treatments", verifyToken, async (req, res) => {
  try {
    const treatments = await treatmentModel.find({});
    return res.status(200).json({
      count: treatments.length,
      data: treatments,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

//get all doctors from the database
router.get("/doctors", verifyToken, async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    return res.status(200).json({
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});




// Post patient to the database
router.post("/patients", async (req, res) => {
    console.log(req.body);
  try {
    if (!req.body.fullName || !req.body.gender || !req.body.dateOfBirth || !req.body.disease || 
        !req.body.treatments || !req.body.assignedDoctor || !req.body.patientPhone || !req.body.notes) {
      return res.status(400).send("All required fields must be provided");
    }

    const newPatient = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      disease: req.body.disease,
      treatments: req.body.treatments,
      assignedDoctor: req.body.assignedDoctor,
      patientPhone: req.body.patientPhone,
      notes: req.body.notes
    };

    const patient = await patientModel.create(newPatient);
    return res.status(201).send(patient);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// Post treatment to the database
router.post("/treatments", async (req, res) => {
    console.log(req.body);
  try {
    if (!req.body.disease || !req.body.medication || !req.body.doctor) {
      return res.status(400).send("All required fields must be provided");
    }

    const newTreatment = {
      disease: req.body.disease,
      medication: req.body.medication,
      description: req.body.description,
      doctor: req.body.doctor
    };

    const treatment = await treatmentModel.create(newTreatment);
    return res.status(201).send(treatment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// get only one patient with id from database
router.get("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).send({ message: "Patient not found" });
    }
    return res.status(200).json(patient);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// get only one doctor with id
router.get("/doctor/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }
    return res.status(200).json(doctor);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// get only one treatment with id from database
router.get("/treatment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const treatment = await treatmentModel.findById(id);
    if (!treatment) {
      return res.status(404).send({ message: "Treatment not found" });
    }
    return res.status(200).json(treatment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

// update a patient from database using id
router.put("/patient/:id", async (req, res) => {
  try {
    if (!req.body.fullName || !req.body.gender || !req.body.dateOfBirth || !req.body.disease || !req.body.treatments || !req.body.assignedDoctor || !req.body.patientPhone || !req.body.notes) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const { id } = req.params;
    const result = await patientModel.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).send({ message: "Patient not found" });
    }
    return res.status(200).send({ message: "Patient was updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// update a treatment from database using id
router.put("/treatment/:id", async (req, res) => {
  try {
    if (!req.body.disease || !req.body.medication || !req.body.doctor) {
      return res.status(400).send({ message: "All required fields must be provided" });
    }
    const { id } = req.params;
    const result = await treatmentModel.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).send({ message: "Treatment not found" });
    }
    return res.status(200).send({ message: "Treatment was updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Delete patient by id
router.delete("/patient/:id", verifyToken, async (req, res) => {
  try {
    const deletedPatient = await patientModel.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete treatment by id
router.delete("/treatment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await treatmentModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({ message: "Treatment not found" });
    }
    return res.status(200).send({ message: "Treatment was deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Add the image upload route
router.post("/doctor/upload-image", verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Saving image URL:', imageUrl); // Debug log

    const doctor = await doctorModel.findByIdAndUpdate(
      req.user._id,
      { imageUrl: imageUrl },
      { new: true }
    ).select('-password');

    if (!doctor) {
      fs.unlinkSync(path.join(process.cwd(), 'public', imageUrl));
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log('Updated doctor:', doctor); // Debug log
    console.log('Image should be accessible at:', `http://localhost:5000${imageUrl}`); // Add this line

    res.status(200).json({
      message: "Image uploaded successfully",
      doctor: doctor
    });
  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
});

// Test route to verify API is working
router.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

export default router;
