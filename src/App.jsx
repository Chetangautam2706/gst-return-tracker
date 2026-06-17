import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reports from "./components/Reports";
import GSTR1Table from "./components/GSTR1Table";
import GSTR3BTable from "./components/GSTR3BTable";
import ClientForm from "./components/ClientForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <Routes>
          <Route
            path="/"
            element={<Dashboard setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route path="/reports" element={<Reports />} />

          <Route path="/gstr1" element={<GSTR1Table />} />

          <Route path="/gstr3b" element={<GSTR3BTable />} />

          <Route path="/clients" element={<ClientForm />} />
        </Routes>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </BrowserRouter>
  );
}

export default App;
