import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import LogoutButton from "../../../components/LogoutButton/Logout";
import "./FounderSettings.css";

function FounderSettings() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
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
    <div className="founder-settings-layout">
      {/* SIDEBAR */}
      <aside className="settings-sidebar">
        <div className="sidebar-user-section">
          <div className="avatar-wrapper admin-crown">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Founder" className="sidebar-avatar" />
            ) : (
              <div className="owner-placeholder">{profile.name?.charAt(0)}</div>
            )}
          </div>
          <div className="user-info-text">
            <h4>{profile.name}</h4>
            <span className="role-badge founder-role">Founder & CEO</span>
          </div>
        </div>

        <nav className="sidebar-nav-links">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👑 Admin Profile
          </button>
        </nav>

        <div className="sidebar-footer">
          <LogoutButton redirectTo="/login" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="settings-view">
        {activeTab === "profile" && (
          <div className="profile-details animate-fade">
            <header className="owner-header">
              <div>
                <h1>Founder Settings</h1>
                <p>Full administrative control over aiMart ecosystem.</p>
              </div>
              <div className="status-pill admin-pill">
                <span className="dot"></span> System Admin
              </div>
            </header>

            <section className="info-grid">
              <div className="info-item">
                <label>Founder Name</label>
                <div className="value-box">{profile.name}</div>
              </div>
              <div className="info-item">
                <label>Admin Email</label>
                <div className="value-box muted">{profile.email}</div>
              </div>
              <div className="info-item">
                <label>Platform Role</label>
                <div className="value-box">
                  <span className="founder-badge-text">{profile.role}</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default FounderSettings; 
