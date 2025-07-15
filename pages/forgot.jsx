import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/config";
import { toast } from "sonner";
import "../styles/signup.css";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendResetEmail = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("✅ Reset link sent. Check your email!");
      navigate("/login");
    } catch (error) {
      // Handle known Firebase errors more explicitly if you want
      toast.error("❌ Failed to send reset email. Check your input.");
    }
  };

  return (
    <div style={{padding: "0px", margin: "0px"}} className="signup-interface">
      <NavBar/>
      <div className="signupForm">
        <span style={{width: "100%", textAlign: "center"}}>Reset Password</span>
        <div className="topLayer">
          <i className="fa-solid fa-bolt icon"></i>
          <h3 className="iconText">Gainovia</h3>
        </div>

        <div className="formInputsSign">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="signupBtn" onClick={handleSendResetEmail}>
            <i className="fa-solid fa-envelope"></i> Send Reset Email
          </button>
        </div>

        <div className="loginRow" style={{ marginTop: "16px" }}>

          <Link to={"/login"}> Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
