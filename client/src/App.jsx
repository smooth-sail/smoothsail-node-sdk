import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "./components/Table";

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchUserRows = async () => {
      const { data } = await axios.get("http://localhost:3005/users");
      setRows(data);
    };
    fetchUserRows();
  }, []);

  return (
    <>
      <DataTable rows={rows} />
    </>
  );
}

export default App;
