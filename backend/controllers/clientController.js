import Client from "../models/Client.js";
import Return from "../models/Return.js";

export const addClient = async (req, res) => {
  console.log("REQ BODY =", req.body);
  try {
    const client = await Client.create(req.body);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const returnTypes = ["GSTR1", "GSTR3B"];

    const returnDocs = returnTypes.map((type) => ({
      clientId: client._id,
      type,
      month,
      year,
      dueDate:
        type === "GSTR1"
          ? new Date(year, month - 1, 11)
          : new Date(year, month - 1, 20),
      status: "Pending",
    }));

    await Return.insertMany(returnDocs);

    res.status(201).json({
      success: true,
      message: "Client + Returns created successfully",
      data: client,
    });
  } catch (error) {
    console.log("Add Client Error =", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Client updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);

    res.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
