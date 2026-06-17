import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartPie,
  FaUsers,
  FaFileInvoice,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { FaBell } from "react-icons/fa";

function Dashboard({ setIsLoggedIn }) {
  const [clientName, setClientName] = useState("");
  const [periodicity, setPeriodicity] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filingDate, setFilingDate] = useState("");

  const [preparedBy, setPreparedBy] = useState("");

  const [reviewedBy, setReviewedBy] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");

  const [month, setMonth] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  const [clients, setClients] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalClients: 0,
    filed: 0,
    pending: 0,
    overdue: 0,
    upcomingReturns: [],
    dueToday: [],
    recentActivity: [],
  });

  const [showNotifications, setShowNotifications] = useState(false);

  const filteredClients = clients.filter((client) => {
    const clientMonth = client.filingDate
      ? (new Date(client.filingDate).getMonth() + 1).toString().padStart(2, "0")
      : "";

    const monthMatch = !selectedMonth || clientMonth === selectedMonth;

    const statusMatch = !selectedStatus || client.status === selectedStatus;

    return monthMatch && statusMatch;
  });
  console.log(clients);
  const exportToExcel = () => {
    const formatedData = clients.map((client, index) => ({
      "S.NO.": index + 1,
      "CLIENT NAME": client.clientName,
      PERIODICITY: client.periodicity,
      "LOGIN ID": client.loginId,
      PASSWORD: client.password,
      STATUS: client.status,
      "FILING DATE": client.filingDate,
      "PREPARED BY": client.preparedBy,
      "REVIEWED By": client.reviewedBy,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatedData);

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "GST_Clients.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("GST Client Data", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "S.No.",
          "Client Name",
          "Periodicity",
          "Login ID",
          "Password",
          "Status",
          "Filing Date",
          "Prepared By",
          "Reviewed By",
        ],
      ],

      body: clients.map((client, index) => [
        index + 1,
        client.clientName,
        client.periodicity,
        client.loginId,
        client.password,
        client.status,
        client.filingDate,
        client.preparedBy,
        client.reviewedBy,
      ]),
    });

    doc.save("GST_Clients.pdf");
  };

  const chartData = [
    { name: "Filed", value: dashboardStats.filed || 0 },
    { name: "Pending", value: dashboardStats.pending || 0 },
    { name: "Overdue", value: dashboardStats.overdue || 0 },
  ];

  const COLORS = ["#00C49F", "#FF8042", "#ef4444"];

  const addClient = async () => {
    console.log("editIndex =", editIndex);
    console.log("Function started");

    if (!clientName || !periodicity) {
      alert("Please fill required fields");

      return;
    }
    const newClient = {
      clientName: clientName,
      periodicity,
      loginId,
      password,
      status,
      filingDate,
      preparedBy,
      reviewedBy,
    };
    console.log(newClient);

    try {
      if (editIndex !== null) {
        await axios.put(
          `http://localhost:5000/api/clients/${clients[editIndex]._id}`,
          newClient,
        );

        fetchClients();
        fetchDashboardStats();

        toast.success("Client Updated Successfully");

        setEditIndex(null);
      } else {
        await axios.post("http://localhost:5000/api/clients/add", newClient);

        fetchClients();
        fetchDashboardStats();

        toast.success("Client Added Successfully");
      }

      setClientName("");
      setPeriodicity("");
      setLoginId("");
      setPassword("");
      setStatus("");
      setFilingDate("");
    } catch (error) {
      console.log("ERROR =", error);

      if (error.response) {
        console.log("BACKEND =", error.response.data);
      }
    }
  };
  const deleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);

      fetchClients();
      fetchDashboardStats();

      toast.success("Client Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const editClient = (index) => {
    const client = clients[index];

    setClientName(client.clientName);
    setPeriodicity(client.periodicity);
    setLoginId(client.loginId);
    setPassword(client.password);
    setStatus(client.status);
    setFilingDate(client.filingDate);
    setPreparedBy(client.preparedBy);
    setReviewedBy(client.reviewedBy);

    setEditIndex(index);
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/clients?t=" + Date.now(),
      );

      console.log(res.data);

      setClients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/stats");

      setDashboardStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/returns/search?clientName=${clientName}&month=${month}`,
      );

      setSearchResult(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const load = () => {
      fetchClients();
      fetchDashboardStats();
    };

    load();
  }, []);

  useEffect(() => {
    if (!clientName && !month) {
      setSearchResult([]);
      return;
    }
    searchStatus();
  }, [clientName, month]);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>GST Panel</h2>
        <ul>
          <li>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "15px",
                backgroundColor: "#2196F3",
                borderRadius: "8px",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              <FaChartPie />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/clients"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "15px",
                backgroundColor: "#2196F3",
                borderRadius: "8px",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              <FaUsers />
              Clients
            </Link>
          </li>
          <li>
            <Link
              to="/gstr1"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "15px",
                backgroundColor: "#2196F3",
                borderRadius: "8px",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              <FaFileInvoice />
              GSTR1
            </Link>
          </li>
          <li>
            <Link
              to="/gstr3b"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "15px",
                backgroundColor: "#2196F3",
                borderRadius: "8px",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              <FaFileInvoice />
              GSTR3B
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "15px",
                backgroundColor: "#2196F3",
                borderRadius: "8px",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              <FaClipboardList />
              Reports
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: "240px" }}>
        <h1>GST Return Tracker</h1>

        <button
          onClick={() => setIsLoggedIn(false)}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            float: "right",
            marginBottom: "20px",
          }}
        >
          Logout
        </button>

        <div
          style={{
            display: "inline-block",
            marginLeft: "20px",
            position: "relative",
          }}
        >
          <FaBell
            size={22}
            style={{ cursor: "pointer" }}
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {dashboardStats.upcomingReturns?.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {dashboardStats.upcomingReturns.length}
            </span>
          )}

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                left: 0,
                width: "320px",
                background: "#fff",
                color: "#000",
                borderRadius: "10px",
                boxShadow: "0 8px 25px rgba()0,0,0,0.25)",
                zIndex: 9999,
                overflow: "hidden",
              }}
            >
              {dashboardStats.dueToday?.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "10px",
                      background: "#ffebee",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    Due Today ({dashboardStats.dueToday.length}){" "}
                  </div>
                  {dashboardStats.dueToday.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>
                        {item.clientName}
                      </div>

                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {item.type}
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #eee",
                }}
              >
                Upcoming Returns
              </div>

              {Array.isArray(dashboardStats.upcomingReturns) &&
              dashboardStats.upcomingReturns?.length > 0 ? (
                dashboardStats.upcomingReturns.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{item.clientName}</div>

                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {item.type}
                    </div>

                    <div
                      style={{
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Due: {new Date(item.dueDate).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "12px" }}>No upcoming returns</div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <select
            value={periodicity}
            onChange={(e) => setPeriodicity(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          >
            <option value="">Select Periodicity</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>

          <input
            type="text"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Filed">Filed</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Filed">Filed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <input
            type="date"
            value={filingDate}
            onChange={(e) => setFilingDate(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <input
            type="text"
            placeholder="PreparedBy"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <input
            type="text"
            placeholder="ReviewedBy"
            value={reviewedBy}
            onChange={(e) => setReviewedBy(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          />

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "10px",
              width: "180px",
              margin: "10px",
            }}
          >
            <option value="">All Months</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>

          <button
            onClick={() => {
              console.log("Button clicked");
              addClient();
            }}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            {editIndex !== null ? "Update Client" : "Add Client"}
          </button>

          <button
            onClick={exportToExcel}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Export Excel
          </button>

          <button
            onClick={exportToPDF}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: "#ff5722",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Export PDF
          </button>
        </div>

        <div
          className="stats"
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            className="card"
            onClick={() => setSelectedStatus("")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#2196F3",
              color: "white",
              minWidth: "180px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Total Clients</h3>
            <p>{dashboardStats.totalClients}</p>
          </div>

          <div
            className="card"
            onClick={() => setSelectedStatus("Filed")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              minWidth: "180px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Filed Returns</h3>
            <p>{dashboardStats.filed}</p>
          </div>

          <div
            className="card"
            onClick={() => setSelectedStatus("Pending")}
            style={{
              cursor: "pointer",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#FF9800",
              color: "white",
              minWidth: "180px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Pending Returns</h3>
            <p>{dashboardStats.pending}</p>
          </div>
          <div
            className="card"
            onClick={() => setSelectedStatus("Overdue")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#F44336",
              color: "white",
              minWidth: "180px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Overdue Returns</h3>

            <p style={{ fontWeight: "bold", fontSize: "24px" }}>
              {dashboardStats.overdue}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Upcoming Returns (Next 7 Days)</h2>

          {dashboardStats.upcomingReturns &&
          dashboardStats.upcomingReturns.length > 0 ? (
            dashboardStats.upcomingReturns.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>{item.clientName}</strong>
                  <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                    {item.type}
                  </p>

                  <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                    Due: {new Date(item.dueDate).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <span style={{ color: "orange", fontWeight: "bold" }}>
                  Upcoming
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>No upcoming returns</p>
          )}
        </div>

        <div
          style={{
            width: "400px",
            height: "350px",
            background: "#1e1e1e",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "30px",
          }}
        >
          <h2 style={{ color: "white", textAlign: "center" }}>
            GST Return Status
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#1e1e1e",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Recent Activity</h3>

          {dashboardStats.recentActivity?.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{item.clientName}</strong>

              <div>
                {item.type} - {item.status}
              </div>

              <small>
                {new Date(item.updatedAt).toLocaleDateString("en-GB")}
              </small>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Search GST Status</h2>

          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>

          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Type</th>
                <th>Month</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {searchResult.map((item, index) => (
                <tr key={index}>
                  <td>{item.clientName}</td>
                  <td>{item.type}</td>
                  <td>
                    {item.month}/{item.year}
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <input
          type="text"
          placeholder="Search Client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            padding: "10px",
            width: "300px",
          }}
        />

        <h2>Client GST Data</h2>

        <div className="table-container">
          <table
            className="client-table"
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Client Name</th>
                <th>Periodicity</th>
                <th>Login ID</th>
                <th>Password</th>
                <th>Status</th>
                <th>Filing Date</th>
                <th>Prepared By</th>
                <th>Reviewed By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredClients
                .filter(
                  (client) =>
                    !selectedStatus || client.status === selectedStatus,
                )
                .filter((client) =>
                  (client.clientName || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((client, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{client.clientName}</td>
                    <td>{client.periodicity}</td>
                    <td>{client.loginId}</td>
                    <td>{client.password}</td>
                    <td
                      style={{
                        color:
                          client.status === "Filed"
                            ? "green"
                            : client.status === "Pending"
                              ? "orange"
                              : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {client.status}
                    </td>
                    <td>
                      {client.filingDate
                        ? new Date(client.filingDate)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "_")
                        : "N/A"}
                    </td>
                    <td>{client.preparedBy}</td>
                    <td>{client.reviewedBy}</td>

                    <td>
                      <button
                        onClick={() => editClient(index)}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          marginRight: "8px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this client?",
                            )
                          ) {
                            deleteClient(client._id);
                          }
                        }}
                        style={{
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
