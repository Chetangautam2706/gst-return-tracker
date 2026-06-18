import { useEffect, useState } from "react";
import axios from "axios";

const GSTR1Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://gst-return-tracker-531mzty36-chetangautam2706s-projects.vercel.app/api/gstr1",
      );
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2>GSTR1 Returns</h2>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Type</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.clientId?.clientName || "N/A"}</td>
              <td>
                {item.month}/{item.year}
              </td>
              <td>
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </td>
              <td
                style={{
                  color:
                    item.status === "Filed"
                      ? "green"
                      : item.status === "Pending"
                        ? "orange"
                        : "red",
                  fontWeight: "bold",
                }}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GSTR1Table;
