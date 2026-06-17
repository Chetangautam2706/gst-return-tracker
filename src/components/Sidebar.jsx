import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#1e1e2f",
        color: "white",
        padding: "20px",
        position: "fixed",
        left: "0",
        top: "0",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Menu</h2>

      <div>
        <p style={{ marginBottom: "15px" }}>
          <Link to="/gstr1" style={{ color: "white", textDecoration: "none" }}>
            GSTR1
          </Link>
        </p>

        <p style={{ marginBottom: "15px" }}>
          <Link to="/gstr3b" style={{ color: "white", textDecoration: "none" }}>
            GSTR3B
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
