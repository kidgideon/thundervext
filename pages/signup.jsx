import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/signup.css";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="signup-interface">
            <NavBar />

            <div className="signupForm">
                <div className="topLayer">
                    <span>Join</span>
                    <i className="fa-solid fa-bolt icon"></i>
                    <h3 className="iconText">THUNDERVEXT</h3>
                </div>
                <form className="formInputsSign">
                    <input type="text" placeholder="First Name" required />
                    <input type="text" placeholder="Last Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="text" placeholder="Username" required />

                    <div className="passwordInputWrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                        />
                        <span
                            className="togglePassword"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>
                    <div className="passwordInputWrapper">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                        />
                        <span
                            className="togglePassword"
                            onClick={() => setShowConfirm((v) => !v)}
                        >
                            <i className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>

                    <div className="termsRow">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                        </label>
                    </div>

                    <button className="signupBtn" type="submit">
                        <i className="fa-solid fa-user-plus"></i> Create Account
                    </button>

                    <div className="orDivider">
                        <span></span>
                        <p>or</p>
                        <span></span>
                    </div>

                    <button className="googleBtn" type="button">
                        <i className="fa-brands fa-google"></i> Continue with Google
                    </button>

                    <div className="loginRow">
                        Already have an account? <a href="/login">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;