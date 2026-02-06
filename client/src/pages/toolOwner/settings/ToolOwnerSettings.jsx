 import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import LogoutButton from "../../../components/LogoutButton.jsx/Logout";
import "./ToolOwnerSettings.css";

function ToolOwnerSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="settings-loader"><div className="spinner"></div></div>;
  if (error) return <div className="settings-error">{error}</div>;

  return (
    <div className="owner-settings-container">
      {/* Header with Title and Status */}
      <header className="owner-header">
        <div>
          <h1>Creator Settings</h1>
          <p>Manage your professional identity and listing permissions.</p>
        </div>
        <div className="status-pill">
           <span className="dot"></span> Active Provider
        </div>
      </header>

      <div className="owner-main-card">
        {/* Profile Hero Section */}
        <section className="profile-hero">
          <div className="avatar-wrapper">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Owner" className="owner-img" />
            ) : (
              <div className="owner-placeholder">{profile.name?.charAt(0)}</div>
            )}
            <div className="online-indicator"></div>
          </div>
          <div className="hero-text">
            <h2>{profile.name}</h2>
            <p>{profile.role.toUpperCase()} • AI-Mart Partner</p>
          </div>
        </section>

        {/* Professional Info Grid */}
        <section className="info-grid">
          <div className="info-item">
            <label>Legal Name</label>
            <div className="value-box">{profile.name}</div>
          </div>
          <div className="info-item">
            <label>Business Email</label>
            <div className="value-box muted">{profile.email}</div>
          </div>
          <div className="info-item">
            <label>Account Type</label>
            <div className="value-box">
               <span className="owner-badge">{profile.role}</span>
            </div>
          </div>
        </section>

        {/* Security & Action Section */}
        <section className="action-area">
          <div className="security-notice">
            <h4>Security & Privacy</h4>
            <p>Your account is protected with role-based access control.</p>
          </div>
          <div className="logout-container">
            <LogoutButton redirectTo="/login" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ToolOwnerSettings;
