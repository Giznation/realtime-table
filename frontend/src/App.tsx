import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";

// Connect to backend Socket.IO server
const socket: Socket = io("http://localhost:4000");

// Type definition for a single record
interface RecordItem {
  id: number;
  name: string;
  value: string;
}

function App() {
  const [data, setData] = useState<RecordItem[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get<RecordItem[]>("http://localhost:4000/data");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // useEffect for initial fetch and socket subscription
  useEffect(() => {
    fetchData();

    // Subscribe to updates
    socket.on("dataUpdated", fetchData);

    // Cleanup on unmount
    return () => {
      socket.off("dataUpdated", fetchData);
    };
  }, []);

  // Add a new record
  const addRecord = async () => {
    if (!name || !value) return;
    try {
      await axios.post("http://localhost:4000/data", { name, value });
      setName("");
      setValue("");
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Realtime Table</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 5 }}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ marginRight: 5 }}
        />
        <button onClick={addRecord}>Add</button>
      </div>

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
