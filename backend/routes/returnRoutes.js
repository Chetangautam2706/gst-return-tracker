import express from "express";
import {
  getGSTR1Returns,
  getGSTR3BReturns,
  updateReturnStatus,
  searchReturnStatus,
} from "../controllers/returnController.js";

const router = express.Router();

router.get("/gstr1", getGSTR1Returns);
router.get("/gstr3b", getGSTR3BReturns);

router.put("/:id", updateReturnStatus);
router.get("/search", searchReturnStatus);
export default router;
