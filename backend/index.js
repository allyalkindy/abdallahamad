import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { patientModel } from "./models/patientModel.js";
import { treatmentModel } from "./models/treatmentModel.js";
import { doctorModel } from "./models/doctorModel.js";
import authenticationRoute from "./routes/authRoute.js";
import signUpRoute from "./routes/signUpRoute.js";
import path from "path";
import appRoutes from "./routes/appRoutes.js";






const __dirname = path.resolve();
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, "public")));

const connString = process.env.MONGO_URL;
const Port = process.env.PORT || 5000;

app.use("/api", appRoutes);
app.use("/auth", authenticationRoute);
app.use("/signup", signUpRoute);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

mongoose
  .connect(connString)
  .then(() => {
    console.log("the database connected successfully");
    app.listen(Port, () => {
      console.log(`Listening on port ${Port}`);
    });
  })
  .catch((err) => console.log(err));


