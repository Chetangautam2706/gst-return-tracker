import Return from "../models/Return.js";

export const getGSTR1Returns = async (req, res) => {
  try {
    const returns = await Return.find({ type: "GSTR1" }).populate("clientId");

    const today = new Date();

    const updatedReturns = returns.map((item) => {
      let status;

      if (item.filingDate) {
        status = "Filed";
      } else if (today > item.dueDate) {
        status = "Overdue";
      } else {
        status = "Pending";
      }

      return {
        ...item.toObject(),
        status,
      };
    });

    res.json(updatedReturns);
  } catch (error) {
    console.error("Return Search Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGSTR3BReturns = async (req, res) => {
  try {
    const returns = await Return.find({ type: "GSTR3B" }).populate("clientId");

    const today = new Date();

    const updatedReturns = returns.map((item) => {
      let status;

      if (item.filingDate) {
        status = "Filed";
      } else if (today > item.dueDate) {
        status = "Overdue";
      } else {
        status = "Pending";
      }

      return {
        ...item.toObject(),
        status,
      };
    });

    res.json(updatedReturns);
  } catch (error) {
    console.error("Return Search Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const updatedReturn = await Return.findByIdAndUpdate(
      req.params.id,

      {
        status: req.body.status,
        filingDate: req.body.filingDate || null,
        preparedBy: req.body.preparedBy || "",
        reviewedBy: req.body.reviewedBy || "",
      },
      { new: true },
    ).populate("clientId");

    res.json({
      message: "Return updated successfully",
      data: updatedReturn,
    });
  } catch (error) {
    console.error("Return Search Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const searchReturnStatus = async (req, res) => {
  try {
    const { clientName, month } = req.query;

    let query = {};

    if (month) {
      query.month = Number(month);
    }

    const returns = await Return.find(query).populate("clientId");

    const filteredReturns = returns.filter((item) => {
      if (!clientName) return true;

      return item.clientId?.clientName
        ?.toLowerCase()
        .includes(clientName.toLowerCase());
    });

    const today = new Date();

    const result = filteredReturns.map((item) => {
      let status;

      if (item.filingDate) {
        status = "Filed";
      } else if (today > item.dueDate) {
        status = "Overdue";
      } else {
        status = "Pending";
      }

      return {
        clientName: item.clientId?.clientName,
        month: item.month,
        year: item.year,
        type: item.type,
        status,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Return Search Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
