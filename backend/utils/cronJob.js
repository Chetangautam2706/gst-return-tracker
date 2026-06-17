import cron from "node-cron";
import Return from "../models/Return.js";

const updateOverdue = async () => {
  try {
    const today = new Date();

    const result = await Return.updateMany(
      {
        status: "Pending",
        dueDate: { $lt: today },
      },
      {
        $set: { status: "Overdue" },
      },
    );

    console.log(`${result.modifiedCount} returns marked as Overdue`);

    console.log("Overdue check done");
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("0 0 * * *", () => {
  updateOverdue();
});

export default updateOverdue;
