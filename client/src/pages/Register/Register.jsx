import React from 'react'
import { useState , useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { registerUser } from '../../app/features/AuthSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import "./Register.css"

function Register() {


 const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

 useEffect(() => {
  // loading toast
  if (loading) {
    toast.loading("Creating account...", { id: "register" });
  }

  // success
  if (!loading && user && !error) {
    toast.success("Account created successfully 🎉 Please log in to continue. ", { id: "register" });
    navigate("/login");
  }

  // error
  if (!loading && error) {
    toast.error(error, { id: "register" });
  }
}, [loading, user, error, navigate]);
















  return (
    <div className='register-container'>
    
      <div className='register-box'>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

    
    </div>
     </div>
  )
}

export default Register