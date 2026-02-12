import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../app/features/AuthSlice'
import { useNavigate, Link } from 'react-router-dom' // Link add kiya
import toast from 'react-hot-toast'
import "./Login.css"

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (loading) { toast.loading("Logging in...", { id: "login" }); return; }
    if (error) { toast.error(error, { id: "login" }); return; }
    if (user && role) {
      toast.success("Login successful 🚀", { id: "login" });
      const paths = { user: "/explore", toolOwner: "/toolowner/dashboard", founder: "/founder/dashboard" };
      navigate(paths[role] || "/", { replace: true });
    }
  }, [loading, user, role, error, navigate]);

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your AI tools</p>

        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button className="google-btn-fake" onClick={() => toast("Google Login coming soon! 🚀")}>
          Continue with Google
        </button>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login 