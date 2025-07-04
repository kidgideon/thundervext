import styles from "../styles/userProfile.module.css";
import DashboardNav from "../components/dashboardNav";
import Transactions from "../components/transactions";
import { useEffect, useState } from "react";
import { db, auth } from "../config/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        toast.error("You must be logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const toastId = toast.loading("Loading profile...");
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setUserData(snapshot.docs[0].data());
        toast.success("Profile loaded");
      } else {
        toast.error("User not found.");
      }
    } catch (error) {
      toast.error("Error loading profile.");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (!userData) return null;

  return (
    <div className={styles.userProfileArea}>
      <DashboardNav />
      <div className={styles.profileContainer}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img
              className={styles.avatar}
              src={userData.picture || "/default-avatar.png"}
              alt="avatar"
            />
            <div>
              <h2 className={styles.name}>
                {userData.firstName} {userData.lastName}
                {userData.verified && (
                  <span className={styles.verified} title="Verified">
                    <i className="fas fa-badge-check"></i>
                  </span>
                )}
              </h2>
              <div className={styles.username}>@{userData.username}</div>
              <div className={styles.bio}>
                {userData.bio || "No bio yet."}
              </div>
              <div className={styles.meta}>
                <span>
                  <i className="fas fa-envelope"></i> {userData.email}
                </span>
                {userData.location && (
                  <span>
                    <i className="fas fa-map-marker-alt"></i> {userData.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Badges (static for now, adapt if dynamic later) */}
          <div className={styles.badges}>
            {userData.badges?.map((badge, i) => (
              <span
                key={i}
                className={styles.badge}
                style={{
                  background: badge.color + "22",
                  color: badge.color,
                }}
                title={badge.label}
              >
                <i className={`fas ${badge.icon}`}></i> {badge.label}
              </span>
            )) || <span>No badges yet</span>}
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div>
              <div className={styles.statValue}>${userData.walletBalance?.toFixed(2) || "0.00"}</div>
              <div className={styles.statLabel}>Portfolio Balance</div>
            </div>
            <div>
              <div className={styles.statValue} style={{ color: "#10b981" }}>
                {userData.profit ? `$${userData.profit.toFixed(2)}` : "+$0.00"}
              </div>
              <div className={styles.statLabel}>Total Profit</div>
            </div>
            <div>
              <div className={styles.statValue}>{userData.totalTrades || 0}</div>
              <div className={styles.statLabel}>Trades</div>
            </div>
            <div>
              <div className={styles.statValue}>{userData.followers?.length || 0}</div>
              <div className={styles.statLabel}>Followers</div>
            </div>
            <div>
              <div className={styles.statValue}>{userData.following?.length || 0}</div>
              <div className={styles.statLabel}>Following</div>
            </div>
            <div>
              <div className={styles.statValue}>{userData.level || "Basic"}</div>
              <div className={styles.statLabel}>Account Level</div>
            </div>
          </div>
        </div>

        <Transactions />
      </div>
    </div>
  );
};

export default UserProfile;
