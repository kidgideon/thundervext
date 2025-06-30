import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import DashboardNav from "../components/dashboardNav";
import flag from "../images/pic.webp";
import "../styles/settings.css";

const Settings = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    picture: flag,
  });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    picture: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUser({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: currentUser.email || "",
            picture: data.picture || flag,
          });
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            picture: data.picture || "",
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        firstName: form.firstName,
        lastName: form.lastName,
        picture: form.picture,
      });
      setUser((prev) => ({
        ...prev,
        firstName: form.firstName,
        lastName: form.lastName,
        picture: form.picture || flag,
      }));
      setEdit(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="settings-interface-area">
      <div className="area">
        <DashboardNav />
        <div className="settings-content">
          <h1 className="settings-title">Settings</h1>
          {loading ? (
            <div className="settings-loading">Loading...</div>
          ) : (
            <div className="settings-card">
              <div className="settings-profile">
                <img
                  src={user.picture || flag}
                  alt="profile"
                  className="settings-profile-pic"
                  onError={e => { e.target.onerror = null; e.target.src = flag; }}
                />
                <div>
                  <div className="settings-profile-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="settings-profile-email">{user.email}</div>
                </div>
              </div>
              <hr className="settings-divider" />
              <div className="settings-fields">
                <label>
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={edit ? form.firstName : user.firstName}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={edit ? form.lastName : user.lastName}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                </label>
                <label>
                  Profile Picture URL:
                  <input
                    type="text"
                    name="picture"
                    value={edit ? form.picture : user.picture}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                </label>
              </div>
              <div className="settings-actions">
                {edit ? (
                  <>
                    <button className="settings-btn" onClick={handleSave} disabled={loading}>
                      Save
                    </button>
                    <button className="settings-btn" onClick={() => setEdit(false)} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="settings-btn" onClick={() => setEdit(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;