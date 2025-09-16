import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/login.css";
import useAuth from "../config/Hooks/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const result = await login(email, password);
    if (result.success) navigate("/home");
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) navigate("/home");
  };

  return (
    <div className="authpage-interface">
      <NavBar />
      <div className="authpage-form">
        <span className="welcomeBack">Welcome Back</span>
        <div className="topLayer">
          <i className="fa-solid fa-bolt icon"></i>
          <h3 className="iconText">Gainovia</h3>
        </div>
        <form className="authpage-formInputs" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <div className="authpage-passwordInputWrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="authpage-togglePassword"
              onClick={() => setShowPassword((v) => !v)}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <div className="authpage-forgotRow">
            <Link to="/reset-pwd" className="authpage-forgotLink">
              Forgot your password?
            </Link>
          </div>

          <button className="authpage-loginBtn" type="submit">
            <i className="fa-solid fa-right-to-bracket"></i> Sign In
          </button>

          <div className="authpage-orDivider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button
            className="authpage-googleBtn"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="fa-brands fa-google"></i> Continue with Google
          </button>

          <div className="authpage-loginRow">
            New here? <Link to="/signup">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
