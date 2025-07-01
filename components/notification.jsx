import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import { toast } from "sonner";
import "../styles/notification.css";

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.uid);
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          if (!Array.isArray(data.notifications)) {
            await updateDoc(userRef, { notifications: [] });
            setNotifications([]);
          } else {
            const notifArray = data.notifications;
            notifArray.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setNotifications(notifArray);
          }
        } else {
          toast.error("User document not found.");
        }
      } catch (err) {
        console.error("Notification fetch error:", err);
        toast.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Mark notification as read when clicked
  const handleNotificationClick = async (notif, idx) => {
    if (notif.read) return;

    try {
      const updatedNotifications = [...notifications];
      updatedNotifications[idx] = { ...notif, read: true };
      setNotifications(updatedNotifications);

      if (userId) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { notifications: updatedNotifications });
      }
    } catch (err) {
      toast.error("Failed to mark notification as read.");
    }
  };

  return (
    <div className="notification-panel-interface">
      <div className="top-area-notification">
        <p>Notifications</p>
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 18,
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            zIndex: 1010,
          }}
          aria-label="Close notifications"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {loading ? (
        <div className="when-theres-no-notification">
          <div className="no-notification-div">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          </div>
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="when-theres-no-notification">
          <div className="no-notification-div">
            <i className="fa-solid fa-envelope"></i>
          </div>
          <p>You have no notifications</p>
        </div>
      ) : (
        <div className="notifications-if-there-is">
          <div className="scrolls">
            {notifications.map((notif, index) => (
              <a
                key={index}
                href="#"
                className={`notification ${notif.read ? "read" : "unread"}`}
                onClick={async (e) => {
                  e.preventDefault();
                  await handleNotificationClick(notif, index);
                  if (notif.link) window.location.href = notif.link;
                }}
              >
                <div className="icon-area">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div className="notificationText">
                  <p className="actual-text">{notif.text}</p>
                  <p className="time-note">
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
