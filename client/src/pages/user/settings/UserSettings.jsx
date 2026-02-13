import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import LogoutButton from "../../../components/LogoutButton.jsx/Logout";
import ApplyToolOwner from "../../toolOwner/dashboard/ApplyToolOwner"; 
import "../css/UserSettings.css";

function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        // Backend 'res.data' bhej raha hai ya 'res' khud data hai, ye check kar lena
        setProfile(res.data || res); 
      } catch (err) {
        console.error("Settings load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loader">Loading Profile...</div>;

  return (
    <div className="settings-layout">
      {/* 🟢 Sidebar */}
      <aside className="settings-sidebar">
  <div className="sidebar-nav-links">
    <button 
      className={activeTab === "profile" ? "active" : ""} 
      onClick={() => setActiveTab("profile")}
    >
      👤 My Account
    </button>
    
    {profile?.role === "user" && (
      <button 
        className={activeTab === "apply" ? "active apply-tab" : "apply-tab"} 
        onClick={() => setActiveTab("apply")}
      >
        🚀 Creator Program
      </button>
    )}
  </div>

  {/* Logout button wrapper */}
  <div className="sidebar-footer">
     <LogoutButton />
  </div>
</aside>

      {/* 🔵 Content Area */}
      <main className="settings-view">
        {activeTab === "profile" ? (
          <div className="tab-content anim-fade">
            <header className="view-header">
              <h2>Profile Settings</h2>
              <p>Your personal identity on AI-Mart</p>
            </header>
            
            <section className="profile-details-card">
              <div className="data-row">
                <label>Name</label>
                <p>{profile?.name || "N/A"}</p>
              </div>
              <div className="data-row">
                <label>Email</label>
                <p>{profile?.email || "N/A"}</p>
              </div>
              <div className="data-row">
                <label>Account Role</label>
                <p style={{textTransform: 'capitalize'}}>{profile?.role}</p>
              </div>
            </section>
          </div>
        ) : (
          <div className="tab-content anim-fade">
             <ApplyToolOwner />
          </div>
        )}
      </main>
    </div>
  );
}

export default UserSettings; 
