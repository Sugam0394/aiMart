 import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../app/features/AuthSlice'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import "./Register.css"
import GoogleAuthButton from '../../components/GoogleAuthButton/AuthButton'

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ FIX (Bug #4): Async handleSubmit pattern (No useEffect)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating account...");

    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("Welcome to aiMart! 🎉", { id: toastId });
      navigate("/explore", { replace: true });
    } catch (err) {
      toast.error(err || "Registration failed", { id: toastId });
    }
  };

  return (
    <div className='register-container'>
      <div className='register-box'>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join the AI-Mart community</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
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
            placeholder="Password (min 6 characters)" 
            value={formData.password} 
            onChange={handleChange} 
            minLength={6}
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Register"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <GoogleAuthButton />
        
        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;