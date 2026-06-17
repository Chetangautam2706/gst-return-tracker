import express from "express";
import {
  addClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/add", addClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
