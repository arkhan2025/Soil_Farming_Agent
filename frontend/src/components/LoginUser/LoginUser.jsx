import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/api";
import "./LoginUser.css";

const LoginUser = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser(email, password);
    if (data.success) {
      login({ email, role: data.role }); 
      setType("success");
      setMessage(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} login successful!`);
      setTimeout(() => navigate("/"), 1200);
    } else {
      setType("error");
      setMessage(data.message || "Invalid credentials!");
    }
  } catch (err) {
    setType("error");
    setMessage("Server error, try again!");
  }
};

  return (
    <div className="login">
      <h2>User Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginUser;
