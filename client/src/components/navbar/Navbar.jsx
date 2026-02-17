import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Navbar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className='nav-container'>
      <div className="nav-logo-wrapper">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="nav-logo-text">AI-Mart</h2>
        </Link>
      </div>

      <ul className="nav-links">
        {user ? (
          // Agar user logged in hai
          <li>
            <Link to="/explore" className="dashboard-btn">Go to App 🚀</Link>
          </li>
        ) : (
          // Agar user logged out hai (Logout ke baad yahi dikhega)
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register" className="register-btn">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
} 

export default Navbar