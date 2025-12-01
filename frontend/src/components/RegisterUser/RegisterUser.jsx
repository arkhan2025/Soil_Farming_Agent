import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmail, minLength } from "../../utils/validation";
import { registerUser } from "../../api/api";
import "./RegisterUser.css";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmail(email)) return setMessage("Invalid email!") && setType("error");
    if (!minLength(password, 6)) return setMessage("Password must be at least 6 characters!") && setType("error");

    try {
      const data = await registerUser(email, password);

      if (data.success) {
        setType("success");
        setMessage("Registration successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setType("error");
        setMessage(data.message || "Registration failed!");
      }
    } catch (err) {
      setType("error");
      setMessage("Server error, try again!");
    }
  };

  return (
    <div className="register">
      <h2>User Registration</h2>
      {message && <div className={`popup ${type}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
