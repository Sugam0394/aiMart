import React, { useEffect, useState } from "react";
 import { getMyProfile } from "../../../api/toolOwner/setting.api";
 import LogoutButton from "../../../components/LogoutButton.jsx/Logout";
import "../css/UserSettings.css";

function UserSettings() {
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

  if (loading) return <p className="settings-state">Loading...</p>;
  if (error) return <p className="settings-state error">{error}</p>;

  return (
    <section className="settings-page">
      <div className="settings-card">
        <h2 className="settings-title">User Account</h2>

        <div className="profile-card">
          <div className="avatar">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="profile" />
            ) : (
              <span>{profile.name?.charAt(0)}</span>
            )}
          </div>

          <div className="profile-info">
            <p><strong>Name</strong><span>{profile.name}</span></p>
            <p><strong>Email</strong><span>{profile.email}</span></p>
            <p><strong>Role</strong><span className="badge">{profile.role}</span></p>
          </div>
        </div>

        <div className="logout-wrap">
          <LogoutButton redirectTo="/login" />
        </div>
      </div>
    </section>
  );
}

export default UserSettings;
