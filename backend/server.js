import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import clientRoutes from "./routes/clientRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import gstr1Routes from "./routes/gstr1Routes.js";
import gstr3bRoutes from "./routes/gstr3bRoutes.js";
import "./utils/cronJob.js";
import admin from "./config/firebaseAdmin.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/gstr1", gstr1Routes);
app.use("/api/gstr3b", gstr3bRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
