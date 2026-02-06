 import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
import LogoutButton from "../../../components/LogoutButton.jsx/Logout";
import ApplyToolOwner from "../../toolOwner/dashboard/ApplyToolOwner"; 
import "../css/UserSettings.css";

function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // 🚀 Default: Clean Profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch { /* Handle error */ } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loader">...</div>;

  return (
    <div className="settings-layout">
      {/* 🟢 Sidebar: Settings Nav */}
      <aside className="settings-sidebar">
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
                <p>{profile?.name}</p>
              </div>
              <div className="data-row">
                <label>Email</label>
                <p>{profile?.email}</p>
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
