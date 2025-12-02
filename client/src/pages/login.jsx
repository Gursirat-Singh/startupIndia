import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { sanitizeLoginForm } from "../utils/sanitize";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setError("Full name is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const safeData = sanitizeLoginForm(formData);
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin
        ? { email: safeData.email, password: safeData.password }
        : {
            fullName: safeData.fullName,
            email: safeData.email,
            password: safeData.password,
          };

      // Mock API call - replace with actual API endpoint
      console.log(`${isLogin ? "Login" : "Signup"} attempt:`, payload);

      // Simulate API response
      setSuccess(isLogin ? "Login successful!" : "Signup successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form-card card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="login-subtitle">
              {isLogin
                ? "Sign in to your account to continue"
                : "Join us to get started with your startup"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success">
              <span>✓</span>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Full Name - Only for Signup */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Confirm Password - Only for Signup */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="login-footer">
            <p className="toggle-text">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="toggle-btn"
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <div className="divider">Or continue with</div>
            <div className="social-buttons">
              <button type="button" className="social-btn" disabled={loading}>
                <span>🔵</span> Google
              </button>
              <button type="button" className="social-btn" disabled={loading}>
                <span>📱</span> GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Side Image/Info */}
        <div className="login-info">
          <div className="info-content">
            <h2>StartupHub</h2>
            <p>Empowering Indian startups to reach their potential</p>
            <ul className="info-features">
              <li>✓ Track startup growth</li>
              <li>✓ Analyze market trends</li>
              <li>✓ Connect with investors</li>
              <li>✓ Access resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
