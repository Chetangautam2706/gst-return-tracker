import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalClients: 0,
    filed: 0,
    pending: 0,
    overdue: 0,
  });
  const [clients, setClients] = useState([]);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/stats");

      setDashboardStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients");

      setClients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchClients();
  }, []);

  const exportToExcel = () => {
    const formattedData = clients.map((client, index) => ({
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

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

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
      type: "application/vnd.openxmlformats-officedocument,spreadsheetml.sheet;charset-UTF-8",
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
          "S.No",
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

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>Reports Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="card">
          <h3>Total Clients</h3>
          <p>{dashboardStats.totalClients}</p>
        </div>
        <div className="card">
          <h3>Filed Returns</h3>
          <p>{dashboardStats.filed}</p>
        </div>
        <div className="card">
          <h3>Pending Returns</h3>
          <p>{dashboardStats.pending}</p>
        </div>
        <div className="card">
          <h3>Overdue Returns</h3>
          <p>{dashboardStats.overdue}</p>
        </div>
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
        <h2
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
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
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
          }}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: "10px",
            width: "180px",
          }}
        >
          <option value="">All Status</option>
          <option value="Filed">Filed</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: "10px",
            width: "180px",
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
      </div>

      <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
        <button
          onClick={exportToExcel}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Export Excel
        </button>
        <button
          onClick={exportToPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Export PDF
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Status-wise Table</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "50%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Filed</td>
              <td>{dashboardStats.filed}</td>
            </tr>
            <tr>
              <td>Pending</td>
              <td>{dashboardStats.pending}</td>
            </tr>
            <tr>
              <td>Overdue</td>
              <td>{dashboardStats.overdue}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Recent Activity</h2>

        <ul>
          <li>Client added : {dashboardStats.totalClients}</li>
          <li>Filed Returns : {dashboardStats.filed}</li>
          <li>Pending Returns : {dashboardStats.pending}</li>
          <li>Overdue Returns : {dashboardStats.overdue}</li>
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        Generated on: {new Date().toLocaleDateString("en-GB")}
      </div>
    </div>
  );
}

export default Reports;
