 import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className='nav-container'>
      <div className="nav-logo-wrapper">
        <Link to="" style={{ textDecoration: 'none' }}>
          <h2 className="nav-logo-text">AI-Mart</h2>
        </Link>
      </div>

      <ul className="nav-links">
        {user ? (
          // Logged In State: Separated links into their own <li> for better spacing
          <>
            <li><Link to="/home" className="dashboard-btn">Home</Link></li>
            <li><Link to="/explore" className="dashboard-btn">Explore</Link></li>
            <li><Link to="/save" className="dashboard-btn">Saved</Link></li>
          </>
        ) : (
          // Logged Out State
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register" className="register-btn">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;