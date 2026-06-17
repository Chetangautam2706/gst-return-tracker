import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    type: {
      type: String,
      enum: ["GSTR1", "GSTR3B"],
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Filed", "Overdue"],
      default: "Pending",
    },

    filingDate: {
      type: Date,
      default: null,
    },

    preparedBy: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Return = mongoose.model("Return", returnSchema);

export default Return;
