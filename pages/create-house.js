import { useState } from "react";
import HouseForm from "../components/HouseForm";

export default function CreateHousePage() {
  const [createdHouse, setCreatedHouse] = useState(null);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Create a House</h1>
      <HouseForm onCreated={(house) => setCreatedHouse(house)} />

      {createdHouse && (
        <div style={{ marginTop: "1rem", background: "#eee", padding: "1rem" }}>
          <p><strong>House Created!</strong></p>
          <p>Name: {createdHouse.name}</p>
          <p>Join Code: {createdHouse.joinCode}</p>
        </div>
      )}
    </div>
  );
}
