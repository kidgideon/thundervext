import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/dashboardNav.css";
import flag from "../images/pic.webp";
import Notification from "./notification";

const fallbackPic = flag;

const NAV_ITEMS = [
  {
    label: "Home",
    route: "/home",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    route: "/portfolio",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
      </svg>
    ),
  },
  {
    label: "Stocks",
    route: "/stocks",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    route: "/wallet",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
      </svg>
    ),
  },
  {
    label: "Market",
    route: "/market",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
  },
  {
    label: "Crypto",
    route: "/crypto",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    label: "ETF",
    route: "/etf",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    route: "/settings",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: "Logout",
    route: "/logout", // We'll override this below
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
    ),
    isLogout: true,
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

const DashboardNav = () => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [user, setUser] = useState({ firstName: "", lastName: "", picture: flag });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Responsive: update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (isMobile) setExpanded(false);
  }, [isMobile]);

  // Get user data from Firestore user collection
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              picture: data.picture || fallbackPic,
            });
            // Fetch notifications and count unread
            if (Array.isArray(data.notifications)) {
              const unread = data.notifications.filter(n => n && n.read === false).length;
              setUnreadCount(unread);
            } else {
              setUnreadCount(0);
            }
          } else {
            setUser({ firstName: "", lastName: "", picture: flag });
            setUnreadCount(0);
          }
        } catch (err) {
          setUser({ firstName: "", lastName: "", picture: flag });
          setUnreadCount(0);
        }
      } else {
        setUser({ firstName: "", lastName: "", picture: flag });
        setUnreadCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for notification panel close to refresh unread count
  const handleNotificationPanelClose = async () => {
    setNotificationOpen(false);
    // Refresh unread count after panel closes (in case user read some notifications)
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

  // Show sidebar when clicking the bars icon on mobile
  const handleBarsClick = () => {
    if (isMobile) setExpanded(true);
  };

  // Hide sidebar when overlay is clicked (mobile or desktop)
  const handleOverlayClick = () => setExpanded(false);

  // Logout handler with confirmation
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/"); // or to your login page
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
            <span className="unread-count"
            >
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

      {/* Overlay only when expanded */}
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

      {/* Sidebar: only show on desktop or when expanded on mobile */}
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
                  {/* Close SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ) : (
                <span className="expand" onClick={() => setExpanded(true)}>
                  {/* Expand SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-7.5-7.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              )}
            </div>
            {/* Only show profile section when expanded */}
            {expanded && (
              <div onClick={() => navigate("/profile")}  className="side-nav-profile-section">
                <img
                  className="nav-dp"
                  src={user.picture}
                  alt="profile"
                  onError={e => { e.target.onerror = null; e.target.src = flag; }}
                />
                <p>{user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : "John Doe"}</p>
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
                      if (isMobile) setExpanded(false); // auto-close on mobile
                    }
                  }}
                  onMouseEnter={() => !expanded && setHoveredIndex(idx)}
                  onMouseLeave={() => !expanded && setHoveredIndex(null)}
                >
                  <div className="item-icon">{item.svg}</div>
                  {/* Only show label when expanded */}
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

export default DashboardNav;