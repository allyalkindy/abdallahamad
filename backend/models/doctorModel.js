import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

dotenv.config();

const doctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "doctor" },
    joinedAt: { type: Date, required: false, default: Date.now() },
    imageUrl: { type: String, required: false, default: "/assets/default-doctor.png" }
  },
  { timestamps: true }
);

doctorSchema.methods.generateAuthToken = function () {
  const doctorToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
  return doctorToken;
};

export const doctorModel = mongoose.model("doctorModel", doctorSchema);

export const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().label("Role"),
    joinedAt: Joi.date().optional().label("Joined At")
  });

  return schema.validate(data);
};
