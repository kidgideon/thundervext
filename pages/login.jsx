import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/login.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="authpage-interface">
            <NavBar />
            <div className="authpage-form">
                   <span className="welcomeBack">Welcome Back</span>
                <div className="topLayer">
                    <i className="fa-solid fa-bolt icon"></i>
                    <h3 className="iconText">THUNDERVEXT</h3>
                </div>
                <form className="authpage-formInputs">
                    <input type="email" placeholder="Email" required />
                    <div className="authpage-passwordInputWrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                        />
                        <span
                            className="authpage-togglePassword"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>

                    <div className="authpage-forgotRow">
                        <a href="#" className="authpage-forgotLink">
                          Forgot your password?
                        </a>
                    </div>

                    <button className="authpage-loginBtn" type="submit">
                        <i className="fa-solid fa-right-to-bracket"></i> Sign In
                    </button>

                    <div className="authpage-orDivider">
                        <span></span>
                        <p>or</p>
                        <span></span>
                    </div>

                    <button className="authpage-googleBtn" type="button">
                        <i className="fa-brands fa-google"></i> Continue with Google
                    </button>

                    <div className="authpage-loginRow">
                        New here? <a href="/signup">Create an account</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;