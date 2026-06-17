import mongoose from "mongoose";
const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    periodicity: {
      type: String,
      enum: ["Monthly", "Quarterly"],
      required: true,
    },

    loginId: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    filingDate: {
      type: String,
    },

    preparedBy: {
      type: String,
    },

    reviewedBy: {
      type: String,
    },
  },
  { timestamps: true },
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
