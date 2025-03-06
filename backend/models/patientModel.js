import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

dotenv.config();

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date, required: true },
      disease: { type: String, required: true },
    treatments: { type: String, required: true },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctorModel', required: true },
    patientPhone: { type: String, required: true },
    notes: { type: String, required: true },
   
  },
  { timestamps: true }
);

patientSchema.methods.generateAuthToken = function () {
  const patientToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
  return patientToken;
};

export const patientModel = mongoose.model("patientModel", patientSchema);

export const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    gender: Joi.string().valid('Male', 'Female', 'Other').required().label("Gender"),
    dateOfBirth: Joi.date().required().label("Date of Birth"),
    disease: Joi.string().required().label("Disease"),
    treatments: Joi.string().required().label("Treatments"),
    assignedDoctor: Joi.string().required().label("Assigned Doctor"),
    patientPhone: Joi.string().required().label("Patient Phone"),
    notes: Joi.string().required().label("Notes"),
  });

  return schema.validate(data);
};
