import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function ClientForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    periodicity: "",
    loginId: "",
    password: "",
    status: "",
    filingDate: "",
    preparedBy: "",
    reviewedBy: "",
  });

  const [clients, setClients] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/clients", formData);

      setFormData({
        clientName: "",
        periodicity: "",
        loginId: "",
        password: "",
        status: "",
        filingDate: "",
        preparedBy: "",
        reviewedBy: "",
      });

      fetchClients();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="form-section" onSubmit={handleSubmit}>
        <input
          className="input-box"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
        />

        <select
          className="input-box"
          name="periodicity"
          value={formData.periodicity}
          onChange={handleChange}
        >
          <option value="">Select Periodicity</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
        </select>
        <input
          className="input-box"
          name="loginId"
          placeholder="Login ID"
          value={formData.loginId}
          onChange={handleChange}
        />

        <input
          className="input-box"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          className="input-box"
          name="status"
          placeholder="Filed / Pending"
          value={formData.status}
          onChange={handleChange}
        />

        <input
          className="input-box"
          name="filingDate"
          value={formData.filingDate}
          onChange={handleChange}
        />

        <input
          className="input-box"
          name="preparedBy"
          placeholder="Prepared By"
          value={formData.preparedBy}
          onChange={handleChange}
        />

        <input
          className="input-box"
          name="reviewedBy"
          placeholder="Reviewed By"
          value={formData.reviewedBy}
          onChange={handleChange}
        />

        <button className="add-btn" type="submit">
          Add Client
        </button>
      </form>

      <h2>Client List</h2>

      <table border="1" cellPadding="10" width="100%">
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
          </tr>
        </thead>

        <tbody>
          {clients.map((client, index) => (
            <tr key={client._id || index}>
              <td>{index + 1}</td>
              <td>{client.clientName}</td>
              <td>{client.periodicity}</td>
              <td>{client.loginId}</td>
              <td>{client.password}</td>
              <td>{client.status}</td>
              <td>{client.filingDate}</td>
              <td>{client.preparedBy}</td>
              <td>{client.reviewedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientForm;
