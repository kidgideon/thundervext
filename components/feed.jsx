import "../styles/feed.css";
import { auth, db } from "../config/config";
import logo from "../images/logo.jpg";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import GeoHeatMap from "./heatmap";
import Transactions from "./transactions";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [imageModal, setImageModal] = useState(null);
  const [likeMap, setLikeMap] = useState({});
  const [shareMap, setShareMap] = useState({});
  const [likedLocal, setLikedLocal] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "feeds"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(0);
            const dateB = b.date?.toDate?.() || new Date(0);
            return dateB - dateA;
          });

        setFeeds(data);

        setLikeMap((prev) => {
          const updated = { ...prev };
          data.forEach((doc) => {
            if (!(doc.id in updated)) {
              updated[doc.id] = Math.floor(3000 + Math.random() * 97000);
            }
          });
          return updated;
        });

        setShareMap((prev) => {
          const updated = { ...prev };
          data.forEach((doc) => {
            if (!(doc.id in updated)) {
              updated[doc.id] = Math.floor(10000 + Math.random() * 90000);
            }
          });
          return updated;
        });

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching feeds:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLike = (feedId) => {
    setLikedLocal((prev) => ({
      ...prev,
      [feedId]: !prev[feedId],
    }));
  };

  const toggleExpanded = (id) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleImageClick = (src) => {
    setImageModal(src);
  };

  const handleAvatarClick = () => {
    toast("This post was made by Gainovia Admin 👑");
  };

  const handleShare = () => {
    toast.success("Copied post link!");
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  return (
    <div className="app-feed-interface">
      <div className="app-feed-main">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <div className="app-feed-card app-feed-skeleton" key={i}>
                  <div className="app-feed-skel-header" />
                  <div className="app-feed-skel-line short" />
                  <div className="app-feed-skel-line long" />
                  <div className="app-feed-skel-img" />
                </div>
              ))
          : feeds.map((feed) => {
              const isLiked = likedLocal[feed.id] || false;
              const dummyLikes = formatNumber(likeMap[feed.id] || 0);
              const dummyShares = formatNumber(shareMap[feed.id] || 0);
              const expanded = expandedPosts[feed.id];
              const formattedDate =
                feed.date && typeof feed.date.toDate === "function"
                  ? feed.date.toDate().toLocaleString()
                  : "Just now";

              return (
                <div className="app-feed-card" key={feed.id}>
                  <div className="app-feed-header">
                    <img
                      src={logo}
                      alt="Admin"
                      onClick={handleAvatarClick}
                      style={{ cursor: "pointer" }}
                    />
                    <div>
                      <h4>Gainovia</h4>
                      <p>{formattedDate}</p>
                    </div>
                  </div>

                  <div className="app-feed-content">
                    <p>
                      {expanded || feed.content.length <= 200
                        ? feed.content
                        : `${feed.content.slice(0, 200)}... `}
                      {feed.content.length > 200 && (
                        <span
                          className="app-feed-read-more"
                          onClick={() => toggleExpanded(feed.id)}
                        >
                          {expanded ? "Show less" : "Read more"}
                        </span>
                      )}
                    </p>
                    {feed.media && (
                      <img
                        src={feed.media}
                        alt="Feed visual"
                        className="app-feed-image"
                        onClick={() => handleImageClick(feed.media)}
                      />
                    )}
                  </div>

                  <div className="app-feed-actions">
                    <button
                      className={`app-feed-like-btn ${isLiked ? "liked" : ""}`}
                      onClick={() => handleLike(feed.id)}
                    >
                      <span className="app-feed-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={isLiked ? "#B374FF" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </span>
                      {dummyLikes} Likes
                    </button>

                    <button
                      className="app-feed-share-btn"
                      onClick={handleShare}
                    >
                      <span className="app-feed-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                      </span>
                      {dummyShares} Shares
                    </button>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="app-feed-notice">
              <Transactions/>
        <GeoHeatMap />
      </div>

      {imageModal && (
        <div className="app-feed-modal" onClick={() => setImageModal(null)}>
          <img src={imageModal} alt="Expanded" />
        </div>
      )}
    </div>
  );
};

export default Feed;
