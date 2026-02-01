import React from 'react'
import { useState , useEffect } from 'react'
import { useDispatch , useSelector} from 'react-redux'
import { loginUser } from '../../app/features/AuthSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import "./Login.css"



function Login() {

 const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

 useEffect(() => {
  if (loading) {
    toast.loading("Logging in...", { id: "login" });
    return;
  }

  if (error) {
    toast.error(error, { id: "login" });
    return;
  }

  if (user && role) {
    toast.success("Login successful 🚀", { id: "login" });

    if (role === "user") {
      navigate("/home", { replace: true });
    } else if (role === "toolOwner") {
      navigate("/toolowner/dashboard", { replace: true });
    } else if (role === "founder") {
      navigate("/founder/dashboard", { replace: true });
    }
  }
}, [loading, user, role, error, navigate]);







  return (
    <div className='login-container'>  
       <div className='login-box'>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

     
    </div>
     </div>
  )
}

export default Login