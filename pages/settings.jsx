import React, { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/config";
import DashboardNav from "../components/dashboardNav";
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

// Pulse animation style
const style = document.createElement("style");
style.innerHTML = `@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}`;
document.head.appendChild(style);

const Settings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    secondaryEmail: "",
    picture: null,
    dob: "",
    address: "",
    nationality: "",
    idType: "",
    idNumber: "",
    govIdImage: null,
    proofOfAddress: null,
  });
  const [previewImage, setPreviewImage] = useState(flag);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUser(currentUser);
          setForm((prev) => ({
            ...prev,
            ...data,
            picture: null,
          }));
          setPreviewImage(data.picture || flag);
        } else {
          setUser(currentUser);
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

  const uploadFile = async (file, path) => {
    const fileRef = ref(storage, `kyc/${user.uid}/${path}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const updates = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      secondaryEmail: form.secondaryEmail,
      dob: form.dob,
      address: form.address,
      nationality: form.nationality,
      idType: form.idType,
      idNumber: form.idNumber,
    };

    try {
      if (form.picture) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          updates.picture = reader.result;
          await updateDoc(doc(db, "users", user.uid), updates);
          toast.success("Profile updated.");
          setEditing(false);
        };
        reader.readAsDataURL(form.picture);
      } else {
        // Handle gov ID & proof upload
        if (form.govIdImage) {
          updates.govIdImageUrl = await uploadFile(form.govIdImage, "gov_id");
        }
        if (form.proofOfAddress) {
          updates.proofOfAddressUrl = await uploadFile(form.proofOfAddress, "proof_address");
        }

        await updateDoc(doc(db, "users", user.uid), updates);
        toast.success("Profile updated.");
        setEditing(false);
      }
    } catch (err) {
      toast.error("Failed to save settings.");
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
        <DashboardNav />
        <div className="settings-content">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="settings-card">
                <h2 className="settings-section-title">Profile Information</h2>
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
                    <div className="settings-profile-email">{user?.email}</div>
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
                    <p>First Name:</p>
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
                <h2 className="settings-section-title">Contact Details</h2>
                <div className="settings-fields">
                  <label>
                    <p>Phone Number:</p>
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
                <h2 className="settings-section-title">KYC Information</h2>
                <div className="settings-fields">
                  <label>
                    <p>Date of Birth:</p>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Residential Address:</p>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Nationality:</p>
                    <input
                      type="text"
                      name="nationality"
                      value={form.nationality}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>ID Type:</p>
                    <select
                      name="idType"
                      value={form.idType}
                      onChange={handleInputChange}
                      disabled={!editing}
                    >
                      <option value="">Select</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Social Security Number">Social Security Number</option>
                    </select>
                  </label>
                  <label>
                    <p>ID Number:</p>
                    <input
                      type="text"
                      name="idNumber"
                      value={form.idNumber}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Upload Government ID:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForm(prev => ({ ...prev, govIdImage: e.target.files[0] }))}
                      disabled={!editing}
                    />
                  </label>
                  <label>
                    <p>Proof of Address (optional):</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForm(prev => ({ ...prev, proofOfAddress: e.target.files[0] }))}
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

export default Settings;
