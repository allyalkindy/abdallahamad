import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

dotenv.config();

const treatmentSchema = new mongoose.Schema(
  {
    disease: {type:String , required: true},
    medication: { type: String, required: true },
    description: { type: String, required: false },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctorModel', required: true },
   
  },
  { timestamps: true }
);

treatmentSchema.methods.generateAuthToken = function () {
  const treatmentToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
  return treatmentToken;
};

export const treatmentModel = mongoose.model("treatmentModel", treatmentSchema);

export const validate = (data) => {
  const schema = Joi.object({
    disease: Joi.string().required().label("Disease"),
    medication: Joi.string().required().label("Medication"),
    description: Joi.string().optional().label("Description"),
    doctor: Joi.string().required().label("Doctor"),
  });

  return schema.validate(data);
};
