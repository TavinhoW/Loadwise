import { useEffect, useState } from "react";
import { fetchBackendStatus } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchBackendStatus();
      setData(result);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>LoadWise Dashboard</h1>

      {data ? (
        <>
          <p><strong>Response:</strong> {data.message}</p>
          <p><strong>Latency:</strong> {data.latency} ms</p>
          <p><strong>Last update:</strong> {data.timestamp}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
