import express from "express";
import {
  addClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import verifyFirebase from "../middleware/verifyFirebase.js";

const router = express.Router();

router.post("/clients", verifyFirebase, addClient);
router.get("/clients", verifyFirebase, getClients);
router.put("/clients/:id", verifyFirebase, updateClient);
router.delete("/clients/:id", verifyFirebase, deleteClient);

export default router;
