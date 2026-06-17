import express from "express";
import { getGSTR1Returns } from "../controllers/returnController.js";

const router = express.Router();
router.get("/", getGSTR1Returns);

export default router;
