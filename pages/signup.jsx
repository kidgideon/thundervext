import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/signup.css";
import useAuth from "../Hooks/auth";
import { useNavigate, Link  } from "react-router-dom";
import { toast } from "sonner"; // ✅ NEW

const Signup = () => {
  const { signup, verifyCode, error, loading ,  loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, firstName, lastName, username } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const result = await signup({ email, password, firstName, lastName, username });

    if (result.codeSent) {
      setCodeSent(true);
      toast.success("Verification code sent to your email.");
    } else {
      toast.error(result.error || "Failed to send verification code.");
    }
  };

 const handleVerify = async () => {
  if (verificationInput.length !== 6) return;

  const result = await verifyCode(verificationInput, formData);
  if (result.success) {
    toast.success("✅ Account created successfully.");
    navigate("/dashboard"); // ✅ this line navigates the user
  } else {
    toast.error(result.error || "❌ Verification failed.");
  }
};

const handleGoogleLogin = async () => {
  const result = await loginWithGoogle();
  if (result.success) {
    toast.success("🎉 Signed in with Google!");
    navigate("/dashboard");
  }
};


  return (
    <div className="signup-interface">
      <NavBar />

      <div className="signupForm">
        <div className="topLayer">
          <span>Join</span>
          <i className="fa-solid fa-bolt icon"></i>
          <h3 className="iconText">THUNDERVEXT</h3>
        </div>

        <form className="formInputsSign" onSubmit={handleSignup}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div className="passwordInputWrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="togglePassword" onClick={() => setShowPassword((v) => !v)}>
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <div className="passwordInputWrapper">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span className="togglePassword" onClick={() => setShowConfirm((v) => !v)}>
              <i className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <div className="termsRow">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button className="signupBtn" type="submit" disabled={loading}>
            <i className="fa-solid fa-user-plus"></i> Create Account
          </button>

          {error && <div className="statusMsg error">{error}</div>}

          <div className="orDivider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

       <button className="googleBtn" type="button" onClick={handleGoogleLogin}>
  <i className="fa-brands fa-google"></i> Continue with Google
</button>


       <div className="loginRow">
  Already have an account? <Link to="/login">Sign in</Link>
</div>
        </form>
      </div>

      {/* Code Entry Modal */}
      {codeSent && (
        <div className="codeModal">
          <div className="codeModalContent">
            <h4>🔐 Enter Verification Code</h4>
            <p>Sent to <strong>{formData.email}</strong></p>

            <div className="codeBoxes">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="codeInput"
                  value={verificationInput[index] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^[0-9]?$/.test(val)) return;

                    const updated = verificationInput.split("");
                    updated[index] = val;
                    setVerificationInput(updated.join(""));

                    if (val && index < 5) {
                      document.getElementById(`code-${index + 1}`)?.focus();
                    }
                  }}
                  id={`code-${index}`}
                />
              ))}
            </div>

            <button
              className="verifyBtn"
              onClick={handleVerify}
              disabled={verificationInput.length !== 6}
            >
              ✅ Verify Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
