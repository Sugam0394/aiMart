import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../app/features/AuthSlice'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import "./Register.css"

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

   // Register.jsx mein update karo
 useEffect(() => {
  if (loading) {
    toast.loading("Creating account...", { id: "register" });
  }

  if (!loading && user && !error) {
    toast.success("Welcome to aiMart! 🎉", { id: "register" });

    // Since default role is user
    navigate("/explore", { replace: true });
  }

  if (!loading && error) {
    toast.error(error, { id: "register" });
  }
}, [loading, user, error, navigate]);


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
        
        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register 