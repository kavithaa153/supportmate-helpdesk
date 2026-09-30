import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      setMessage("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Reset instructions have been sent to your email.");
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <span className="forgot-password-eyebrow">
            ACCOUNT RECOVERY
          </span>

          <h1 className="forgot-password-title">
            Forgot Password?
          </h1>

          <p className="forgot-password-subtitle">
            Enter your email address to recover your account.
          </p>
        </div>

        <form
          className="forgot-password-form"
          onSubmit={handleSubmit}
        >
          <div className="forgot-password-group">
            <label
              htmlFor="recovery-email"
              className="forgot-password-label"
            >
              Email Address
            </label>

            <input
              id="recovery-email"
              type="email"
              className="forgot-password-input"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder="Enter your email"
            />

            {error && (
              <span className="forgot-password-error">
                {error}
              </span>
            )}
          </div>

          {message && (
            <div className="forgot-password-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="forgot-password-submit"
          >
            Send Reset Instructions
          </button>
        </form>

        <button
          type="button"
          className="forgot-password-back"
          onClick={() => navigate("/")}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;