import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import ApplyToolOwner from "../../toolOwner/dashboard/ApplyToolOwner"; 
import "../css/UserSettings.css";
import LogoutButton from "../../../components/LogoutButton/Logout";

// isDark aur setIsDark props App.jsx se aayenge
function UserSettings({ isDark, setIsDark }) {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res?.data || res?.user || res); 
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        {/* TOP: User Info Section */}
        <div className="sidebar-user-section">
          <img src={profile?.profilePicture || "https://via.placeholder.com/50"} alt="Profile" className="sidebar-avatar" />
          <div className="user-info-text">
            <h4>{profile?.name || "User"}</h4>
            <span className="role-badge">{profile?.role}</span>
          </div>
        </div>

        {/* MIDDLE: Nav Links */}
        <div className="sidebar-nav-links">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 My Account
          </button>
          
          {/* Appearance Tab Button */}
          <button className={activeTab === "appearance" ? "active" : ""} onClick={() => setActiveTab("appearance")}>
            🌙 Appearance
          </button>

          {profile?.role === "user" && (
            <button className={activeTab === "apply" ? "active" : ""} onClick={() => setActiveTab("apply")}>
              🚀 Creator Program
            </button>
          )}
        </div>

        {/* BOTTOM: Logout Button Fixed in Sidebar */}
        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      <main className="settings-view">
        {activeTab === "profile" && (
          <div className="profile-details">
            <h2>Profile Settings</h2>
            <div className="data-box">
              <label>NAME</label>
              <p>{profile?.name || "N/A"}</p>
            </div>
            <div className="data-box">
              <label>EMAIL</label>
              <p>{profile?.email || "N/A"}</p>
            </div>
          </div>
        )}

        {/* Appearance Tab Content */}
        {activeTab === "appearance" && (
          <div className="appearance-section">
            <h2>Appearance</h2>
            <p className="section-desc">Customize your theme preference.</p>
            <div className="theme-toggle-card">
              <div className="theme-info">
                <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={isDark} 
                  onChange={() => setIsDark(!isDark)} 
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "apply" && <ApplyToolOwner />}
      </main>
    </div>
  );
}

export default UserSettings; 
 