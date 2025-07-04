import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import { motion, AnimatePresence } from "framer-motion";
import flag from "../images/pic.webp";
import Notification from "./notification";
import "../styles/dashboardNav.css";

const NAV_ITEMS = [
  {
    label: "Home",
    route: "/admin/home",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Payment",
    route: "/admin/payment",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
      </svg>
    ),
  },
  {
    label: "Traders",
    route: "/admin/traders",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75A2.25 2.25 0 1 1 15 4.5a2.25 2.25 0 0 1 2.25 2.25Zm-10.5 0A2.25 2.25 0 1 1 4.5 4.5a2.25 2.25 0 0 1 2.25 2.25ZM12 6.75A2.25 2.25 0 1 1 9.75 4.5 2.25 2.25 0 0 1 12 6.75ZM12 21v-4.5m0 0c0-2.485-2.015-4.5-4.5-4.5S3 14.015 3 16.5V21m9-4.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5V21" />
      </svg>
    ),
  },
  {
    label: "Activities",
    route: "/admin/activities",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3A2.25 2.25 0 0 0 8.25 5.25V9m7.5 0v9A2.25 2.25 0 0 1 13.5 20.25h-3A2.25 2.25 0 0 1 8.25 18V9m7.5 0H8.25" />
      </svg>
    ),
  },
  {
    label: "Settings",
    route: "/admin/settings",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: "Logout",
    isLogout: true,
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
    ),
  },
];

const SIDEBAR_WIDTH_EXPANDED = 300;
const SIDEBAR_WIDTH_COLLAPSED = 70;

const sidebarVariants = {
  open: (isMobile) => ({
    x: 0,
    width: SIDEBAR_WIDTH_EXPANDED,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      bounce: 0.25,
    },
  }),
  closed: (isMobile) => ({
    x: isMobile ? -SIDEBAR_WIDTH_EXPANDED : 0,
    width: SIDEBAR_WIDTH_COLLAPSED,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      bounce: 0.25,
    },
  }),
};

const AdminNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [user, setUser] = useState({ firstName: "", lastName: "", picture: flag });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setExpanded(false);
  }, [isMobile, location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          firstName: currentUser.displayName?.split(" ")[0] || "",
          lastName: currentUser.displayName?.split(" ")[1] || "",
          picture: currentUser.photoURL || flag,
        });
        // Fetch admin notifications and count unread
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (Array.isArray(data.notifications)) {
              const unread = data.notifications.filter(n => n && n.read === false).length;
              setUnreadCount(unread);
            } else {
              setUnreadCount(0);
            }
          } else {
            setUnreadCount(0);
          }
        } catch {
          setUnreadCount(0);
        }
      } else {
        setUser({ firstName: "", lastName: "", picture: flag });
        setUnreadCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  // Refresh unread count after closing notification panel
  const handleNotificationPanelClose = async () => {
    setNotificationOpen(false);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (Array.isArray(data.notifications)) {
          const unread = data.notifications.filter(n => n && n.read === false).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      }
    }
  };

  const handleBarsClick = () => {
    if (isMobile) setExpanded(true);
  };

  const handleOverlayClick = () => setExpanded(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/admin-login");
      } catch (err) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="horizontal-interface">
        <i
          className="fa-solid fa-bars"
          style={{ cursor: "pointer" }}
          onClick={handleBarsClick}
        ></i>
        <div className="searchbox">
          <div className="search-area">
            <i className="fa-solid fa-magnifying-glass bsElaem"></i>
            <input type="text" placeholder="search" />
          </div>
        </div>
        <div className="notification-area" style={{ position: "relative" }}>
          <i
            style={{ color: "black", cursor: "pointer", position: "relative" }}
            className="fa-solid fa-bell"
            onClick={() => setNotificationOpen(true)}
          ></i>
          {unreadCount > 0 && (
            <span className="unread-count">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Overlay for notification panel */}
      {notificationOpen && (
        <div
          className="dashboard-nav-overlay"
          style={{ zIndex: 999 }}
          onClick={handleNotificationPanelClose}
        />
      )}

      {/* Notification panel */}
      {notificationOpen && (
        <Notification onClose={handleNotificationPanelClose} />
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="dashboard-nav-overlay"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isMobile || expanded) && (
          <motion.div
            key="sidebar"
            className={`SideNavD${expanded ? " expanded" : " collapsed"}`}
            initial="closed"
            animate={expanded ? "open" : "closed"}
            exit="closed"
            custom={isMobile}
            variants={sidebarVariants}
            style={{
              minWidth: expanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
              maxWidth: expanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
              left: isMobile ? 0 : undefined,
              top: isMobile ? 0 : undefined,
              height: isMobile ? "100vh" : undefined,
              position: isMobile ? "fixed" : "fixed",
              zIndex: 1200,
            }}
          >
            <div className="side-nav-top">
              {expanded ? (
                <span className="close" onClick={() => setExpanded(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ) : (
                <span className="expand" onClick={() => setExpanded(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-7.5-7.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              )}
            </div>
            {expanded && (
              < div onClick={() => navigate("/profile")} className="side-nav-profile-section">
                <img
                  className="nav-dp"
                  src={user.picture}
                  alt="profile"
                  onError={e => { e.target.onerror = null; e.target.src = flag; }}
                />
                <p>
                  {user.firstName || user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Admin"}
                </p>
              </div>
            )}
            <div className="nav-items-section">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  className={`nav-item${expanded ? "" : " collapsed"}${hoveredIndex === idx ? " hovered" : ""}`}
                  key={item.label}
                  onClick={() => {
                    if (item.isLogout) {
                      handleLogout();
                    } else {
                      navigate(item.route);
                      if (isMobile) setExpanded(false);
                    }
                  }}
                  onMouseEnter={() => !expanded && setHoveredIndex(idx)}
                  onMouseLeave={() => !expanded && setHoveredIndex(null)}
                >
                  <div className="item-icon">{item.svg}</div>
                  {expanded ? (
                    <div className="item-name">{item.label}</div>
                  ) : (
                    hoveredIndex === idx && (
                      <span className="sidebar-tooltip">{item.label}</span>
                    )
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;