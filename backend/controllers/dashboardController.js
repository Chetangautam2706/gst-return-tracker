import Client from "../models/Client.js";
import Return from "../models/Return.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalClients = await Client.countDocuments();

    const filed = await Return.countDocuments({ status: "Filed" });

    const pending = await Return.countDocuments({ status: "Pending" });

    const overdue = await Return.countDocuments({
      status: "Pending",
      dueDate: { $lt: today },
    });

    const upcomingReturns = await Return.find({
      status: "Pending",
      dueDate: { $gte: today, $lte: next7Days },
    })

      .populate("clientId", "clientName")
      .sort({ dueDate: 1 });

    console.log(
      upcomingReturns.map((r) => ({
        type: r.type,
        dueDate: r.dueDate,
        status: r.status,
      })),
    );

    const dueTodayRaw = await Return.find({
      status: "Pending",
      dueDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
      .populate("clientId", "clientName")
      .sort({ dueDates: 1 });

    const dueToday = dueTodayRaw.map((r) => ({
      _id: r._id,
      clientName: r.clientId?.clientName || "Unknown Client",
      dueDate: r.dueDate,
      type: r.type,
      status: r.status,
    }));

    const recentActivity = await Return.find()
      .populate("clientId", "clientName")
      .sort({ updatedAt: -1 })
      .limit(10);

    const formattedActitvity = recentActivity.map((r) => ({
      _id: r._id,
      clientName: r.clientId?.clientName || "Unknow Client",
      type: r.type,
      status: r.status,
      updatedAt: r.updatedAt,
    }));

    const formattedUpcoming = upcomingReturns.map((r) => ({
      _id: r._id,
      clientName: r.clientId?.clientName || "Unknown Client",
      dueDate: r.dueDate,
      type: r.type,
      status: r.status,
    }));

    res.json({
      totalClients,
      filed,
      pending,
      overdue,
      upcomingReturns: formattedUpcoming,
      dueToday,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
