// import React from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { loginStyles } from "../assets/dummyStyles.js";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin, API_URL = "http://localhost:4000" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // to fetch profile
  const fetchProfile = async (token) => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
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

  // to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(" ");
    try {
      const res = await axios.post(
        `${API_URL}/api/user/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = (await res.data) || {};
      const token = data.token || null;

      // to derive user profile
      let profile = data.user || (token ? await fetchProfile(token) : null);
      if (!profile) {
        const copy = { ...data };
        delete copy.token;
        delete copy.user;

        if (Object.keys(copy).length) {
          profile = copy;
        }

        if (!profile && token) {
          try {
            profile = await fetchProfile(token);
          } catch (error) {
            console.error("Error fetching profile after login:", error);
            profile = { email };
          }
        }

        if (!profile) profile = { email };

        persistAuth(profile, token);

        if (typeof onLogin === "function") {
          try {
            onLogin(profile, rememberMe, token);
          } catch (error) {
            console.warn("onLogin callback error:", error);
            navigate("/");
          }
        } else {
          navigate("/");
        }

        setPassword(""); // Clear password after login
      }
      persistAuth(profile, token);
      onLogin(profile, rememberMe, token);
    } catch (err) {
      console.error("Login error:", err?.err || err.message || err);
      const serverMsg =
        err?.response?.data?.message ||
        (err.response?.data ? JSON.stringify(err.response?.data) : null) ||
        err?.message ||
        "Login failed. Please try again.";
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

          {/* Login Form handleSubmit */}
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
                  type="password"
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
              {isLoading ? (
                <>
                  <svg
                    className={loginStyles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
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
