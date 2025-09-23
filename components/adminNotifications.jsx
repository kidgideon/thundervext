import { useEffect, useState } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/config";
import { toast } from "sonner";

const AdminUserNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) throw new Error("User not found");

        const userData = userSnap.data();
        const sortedNotifs = (userData.notifications || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotifications(sortedNotifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const deleteNotification = async (index) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const newNotifs = [...notifications];
      newNotifs.splice(index, 1);

      await updateDoc(doc(db, "users", userId), {
        notifications: newNotifs,
      });
      setNotifications(newNotifs);
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="admin-notifications-table">
      <h2>User Notifications</h2>
      <table>
        <thead>
          <tr>
            <th>Text</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </td>
            </tr>
          ) : notifications.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                No notifications
              </td>
            </tr>
          ) : (
            notifications.map((notif, i) => (
              <tr key={i}>
                <td>{notif.text}</td>
                <td>{new Date(notif.date).toLocaleString()}</td>
                <td>
                  <button onClick={() => deleteNotification(i)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserNotifications;
