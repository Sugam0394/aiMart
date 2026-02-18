import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/toolOwner/setting.api";
 // import LogoutButton from "../../../components/LogoutButton/LogoutButton"; // Fix path if needed
import ApplyToolOwner from "../../toolOwner/dashboard/ApplyToolOwner"; 
import "../css/UserSettings.css";
import LogoutButton from "../../../components/LogoutButton/Logout";

function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        // Check if response has .user or .data based on your backend
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
        <div className="sidebar-nav-links">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 My Account
          </button>
          {profile?.role === "user" && (
            <button className={activeTab === "apply" ? "active" : ""} onClick={() => setActiveTab("apply")}>
              🚀 Creator Program
            </button>
          )}
        </div>
        
      </aside>

      <main className="settings-view">
        {activeTab === "profile" ? (
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
             <div className="sidebar-footer">
          <LogoutButton />
        </div>
          </div>
        ) : (
          <ApplyToolOwner />
        )}
      </main>
    </div>
  );
}

export default UserSettings; 
 