import express from "express";
import { getGSTR3BReturns } from "../controllers/returnController.js";

const router = express.Router();

router.get("/", getGSTR3BReturns);

export default router;
