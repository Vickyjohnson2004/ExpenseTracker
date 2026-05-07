import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { loginStyles } from "../assets/dummyStyles.js";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async (token) => {
    if (!token) return null;
    try {
      const res = await axios.get(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (profile) storage.setItem("user", JSON.stringify(profile));
      if (token) storage.setItem("token", token);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const data = res.data || {};
      const token = data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // 1. Get profile (from response or fetch it)
      let profile = data.user || (await fetchProfile(token));

      if (!profile) {
        profile = { email }; // Fallback
      }

      // 2. Persist to storage
      persistAuth(profile, token);

      // 3. Update App State
      if (typeof onLogin === "function") {
        onLogin(profile, rememberMe, token);
      }

      // 4. Redirect
      navigate("/");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.cardContainer}>
        <div className={loginStyles.header}>
          <div className={loginStyles.avatar}>
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className={loginStyles.headerTitle}>Welcome Back</h1>
          <p className={loginStyles.headerSubtitle}>
            Sign in to your ExpenseTracker account
          </p>
        </div>

        <div className={loginStyles.formContainer}>
          {error && (
            <div className={loginStyles.errorContainer}>
              <div className={loginStyles.errorIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className={loginStyles.errorText}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className={loginStyles.label}>
                Email Address
              </label>
              <div className={loginStyles.inputContainer}>
                <div className={loginStyles.inputIcon}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={loginStyles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className={loginStyles.label}>
                Password
              </label>
              <div className={loginStyles.inputContainer}>
                <div className={loginStyles.inputIcon}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"} // FIXED: Dynamic type
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={loginStyles.input}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className={loginStyles.passwordToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className={loginStyles.checkboxContainer}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={loginStyles.checkbox}
              />
              <label htmlFor="remember" className={loginStyles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${loginStyles.button} ${isLoading ? loginStyles.buttonDisabled : ""}`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className={loginStyles.signUpContainer}>
            <p className={loginStyles.signUpText}>
              Don't have an account?{" "}
              <Link to="/signup" className={loginStyles.signUpLink}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
