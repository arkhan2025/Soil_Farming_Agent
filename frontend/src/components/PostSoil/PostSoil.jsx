import React, { useState } from "react";
import { postSoil } from "../../api/api";
import "./PostSoil.css";

const PostSoil = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [suitableCrops, setSuitableCrops] = useState("");
  const [phLevel, setPhLevel] = useState("");
  const [nutrients, setNutrients] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const soilData = {
      name,
      description: description || null,
      suitableCrops:
        suitableCrops.trim() === ""
          ? []
          : suitableCrops.split(",").map((c) => c.trim()),

      phLevel: phLevel.trim() === "" ? null : parseFloat(phLevel),

      nutrients:
        nutrients.trim() === ""
          ? []
          : nutrients.split(",").map((n) => n.trim()),
    };

    const data = await postSoil(soilData);

    if (data.success) {
      setType("success");
      setMessage("Soil details added successfully!");
      setName("");
      setDescription("");
      setSuitableCrops("");
      setPhLevel("");
      setNutrients("");
    } else {
      setType("error");
      setMessage(data.message || "Submission failed!");
    }
  };

  return (
    <div className="post-soil">
      <h2>Post Soil Details</h2>
      {message && <div className={`popup ${type}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Soil Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Suitable Crops (comma separated)"
          value={suitableCrops}
          onChange={(e) => setSuitableCrops(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder="pH Level (optional)"
          value={phLevel}
          onChange={(e) => setPhLevel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nutrients (comma separated)"
          value={nutrients}
          onChange={(e) => setNutrients(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostSoil;
