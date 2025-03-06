import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { doctorModel, validate } from "../models/doctorModel.js";
import dotenv from "dotenv";

dotenv.config();



const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const doctor = await doctorModel.findOne({ email: req.body.email });
    if (doctor)
      return res
        .status(409)
        .send({ message: "Doctor with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new doctorModel({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "Doctor registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


export default router;