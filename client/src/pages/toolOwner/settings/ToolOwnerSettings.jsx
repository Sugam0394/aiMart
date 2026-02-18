import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import LogoutButton from "../../../components/LogoutButton/Logout";
import "./ToolOwnerSettings.css";

function ToolOwnerSettings({ isDark, setIsDark }) { // Props received here
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // Tab logic added
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
    <div className="settings-layout"> {/* Consistent layout wrapper */}
      <aside className="settings-sidebar">
        <div className="sidebar-user-section">
          <div className="avatar-wrapper">
             {profile.profilePicture ? (
               <img src={profile.profilePicture} alt="Owner" className="sidebar-avatar" />
             ) : (
               <div className="owner-placeholder">{profile.name?.charAt(0)}</div>
             )}
          </div>
          <div className="user-info-text">
            <h4>{profile.name}</h4>
            <span className="role-badge tool-owner-role">Tool Owner</span>
          </div>
        </div>

        <nav className="sidebar-nav-links">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 Profile Info
          </button>
          <button className={activeTab === "appearance" ? "active" : ""} onClick={() => setActiveTab("appearance")}>
            🌙 Appearance
          </button>
        </nav>

        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      <main className="settings-view">
        {activeTab === "profile" && (
          <div className="profile-details">
             <header className="owner-header">
               <div>
                 <h1>Creator Settings</h1>
                 <p>Manage your professional identity and listing permissions.</p>
               </div>
               <div className="status-pill">
                  <span className="dot"></span> Active Provider
               </div>
             </header>

             <section className="info-grid">
               <div className="info-item">
                 <label>Legal Name</label>
                 <div className="value-box">{profile.name}</div>
               </div>
               <div className="info-item">
                 <label>Business Email</label>
                 <div className="value-box muted">{profile.email}</div>
               </div>
             </section>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="appearance-section">
            <h2>Appearance</h2>
            <p>Customize the look and feel of your dashboard.</p>
            <div className="theme-toggle-card">
              <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ToolOwnerSettings; 
