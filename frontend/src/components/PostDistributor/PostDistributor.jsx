import React, { useState } from "react";
import { postDistributor } from "../../api/api";
import "./PostDistributor.css";

const PostDistributor = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [seedType, setSeedType] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await postDistributor({
        name,
        contact,
        seedType,
        price,
        quantity,
      });

      if (data.success) {
        setType("success");
        setMessage("Distributor details submitted successfully!");

        // clear fields
        setName("");
        setContact("");
        setSeedType("");
        setPrice("");
        setQuantity("");
      } else {
        setType("error");
        setMessage(data.message || "Submission failed!");
      }
    } catch {
      setType("error");
      setMessage("Server error!");
    }
  };

  return (
    <div className="post-distributor">
      <h2>Post Distributor Details</h2>

      {message && <div className={`popup ${type}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Distributor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Seed Type (e.g., BR-28 Rice)"
          value={seedType}
          onChange={(e) => setSeedType(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price (per kg)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity (kg)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostDistributor;
