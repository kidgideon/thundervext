import React, { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import AdminNavbar from "../components/adminNavbar";
import flag from "../images/pic.webp";
import { toast } from "sonner";
import "../styles/settings.css";

const SkeletonCard = () => (
  <div
    style={{
      background: "#f3f3f7",
      borderRadius: "16px",
      padding: "32px",
      marginBottom: "32px",
      boxShadow: "0 2px 16px rgba(31,11,58,0.06)",
      minHeight: 180,
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      animation: "pulse 1.5s infinite",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#e0e0e0",
        }}
      />
      <div>
        <div
          style={{
            width: 120,
            height: 18,
            background: "#e0e0e0",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: 180,
            height: 14,
            background: "#e0e0e0",
            borderRadius: 6,
          }}
        />
      </div>
    </div>
    <div
      style={{
        width: "100%",
        height: 18,
        background: "#e0e0e0",
        borderRadius: 6,
        marginTop: 18,
      }}
    />
    <div
      style={{
        width: "60%",
        height: 18,
        background: "#e0e0e0",
        borderRadius: 6,
      }}
    />
  </div>
);

// Add keyframes for pulse animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}`;
document.head.appendChild(style);

const AdminSettings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    secondaryEmail: "",
    picture: null,
  });
  const [previewImage, setPreviewImage] = useState(flag);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() || {};
            setUser(currentUser);
            setForm({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              phone: data.phone || "",
              secondaryEmail: data.secondaryEmail || "",
              picture: null,
            });
            setPreviewImage(data.picture || flag);
          } else {
            setUser(currentUser);
            setForm({
              firstName: "",
              lastName: "",
              phone: "",
              secondaryEmail: "",
              picture: null,
            });
            setPreviewImage(flag);
          }
        } catch (err) {
          setUser(currentUser);
          setForm({
            firstName: "",
            lastName: "",
            phone: "",
            secondaryEmail: "",
            picture: null,
          });
          setPreviewImage(flag);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setForm((prev) => ({ ...prev, picture: file }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const updates = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      secondaryEmail: form.secondaryEmail,
    };

    // If profile picture is uploaded
    if (form.picture) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          updates.picture = reader.result;
          await updateDoc(doc(db, "users", user.uid), updates);
          toast.success("Profile updated.");
          setEditing(false);
        };
        reader.readAsDataURL(form.picture);
      } catch (err) {
        toast.error("Failed to update picture.");
        setLoading(false);
        return;
      }
    } else {
      await updateDoc(doc(db, "users", user.uid), updates);
      toast.success("Profile updated.");
      setEditing(false);
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return toast.error("No email available.");
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset link sent to your email.");
    } catch (err) {
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <div className="settings-interface-area">
      <div className="area">
        <AdminNavbar />
        <div className="settings-content">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="settings-card">
                <h2 className="settings-section-title"> Profile Information</h2>
                <div className="settings-profile">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="settings-profile-pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = flag;
                    }}
                  />
                  <div>
                    <div className="settings-profile-name">
                      {form.firstName} {form.lastName}
                    </div>
                    <div className="settings-profile-email">{user?.email || ""}</div>
                  </div>
                </div>
                {editing && (
                  <div className="settings-image-upload">
                    <label>
                      <p>Change Profile Picture:</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
                <div className="settings-fields">
                  <label>
                    <p> First Name:</p>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Last Name:</p>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h2 className="settings-section-title"> Contact Details</h2>
                <div className="settings-fields">
                  <label>
                    <p> Phone Number:</p>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Secondary Email:</p>
                    <input
                      type="email"
                      name="secondaryEmail"
                      value={form.secondaryEmail}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h2 className="settings-section-title">Security</h2>
                <button className="settings-btn" onClick={handlePasswordReset}>
                  Send Password Reset Email
                </button>
              </div>

              <div className="settings-actions">
                {editing ? (
                  <>
                    <button className="settings-btn" onClick={handleSave} disabled={loading}>
                      Save Changes
                    </button>
                    <button className="settings-btn" onClick={() => setEditing(false)} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="settings-btn" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
