import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../app/features/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";
import GoogleAuthButton from "../../components/GoogleAuthButton/AuthButton";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");

    try {
      const user = await dispatch(loginUser(formData)).unwrap();

      toast.success("Login successful 🚀", { id: toastId });

      const paths = {
        user: "/explore",
        toolOwner: "/toolowner/dashboard",
        founder: "/founder/dashboard",
      };

      navigate(paths[user.role] || "/", { replace: true });

    } catch (err) {
      toast.error(err || "Login failed", { id: toastId });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your AI tools</p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* 2. Fake button hatakar Asli Google Login yahan chipka diya */}
        <div className="google-btn-container">
           <GoogleAuthButton />
        </div>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
 