import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { db } from "../config/config";
import { toast } from "sonner";
import "../styles/allUsers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const  navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSendNotification = async () => {
    if (!notification.trim()) {
      toast.error("Notification cannot be empty");
      return;
    }

    const toastId = toast.loading("Sending notification...");
    setLoading(true);
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        notifications: [
          ...(selectedUser.notifications || []),
          {
            text: notification,
            date: new Date().toISOString(),
            read: false,
            link: "/home",
          },
        ],
      });
      toast.success("Notification sent");
      setNotification("");
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const handleDeactivateUser = async () => {
    const confirm = window.confirm(
      `Are you sure you want to deactivate ${selectedUser.username}'s account?`
    );
    if (!confirm) return;

    const toastId = toast.loading("Deactivating user...");
    setLoading(true);
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, { isActive: false });
      toast.success("User deactivated");
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate user");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
    <div className="x-users-container">
      <h2 className="x-users-title">All Users</h2>
      <div className="x-users-grid">
        {users.map((user) => (
          <div className="x-user-card" key={user.id}>
            <img
              src={user.picture}
              alt="Profile"
              className="x-user-avatar"
            />
            <div className="x-user-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button
                className="x-user-action-btn"
                onClick={() => navigate(`/manage/${user.username}`)}
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="x-popup-overlay">
          <div className="x-popup">
            <h3>Manage {selectedUser.username}'s account</h3>
            <textarea
              placeholder="Notification message"
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
            />
            <div className="x-popup-actions">
              <button
                className="x-popup-btn primary"
                onClick={handleSendNotification}
                disabled={loading}
              >
                Send Notification
              </button>
              <button
                className="x-popup-btn danger"
                onClick={handleDeactivateUser}
                disabled={loading}
              >
                Deactivate User
              </button>
              <button
                className="x-popup-btn cancel"
                onClick={() => {
                  setSelectedUser(null);
                  setNotification("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
