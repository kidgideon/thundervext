import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #1f0b3a 60%, #a23cf4 100%)",
        color: "#fff",
        padding: "20px 0px",
        boxShadow: "0 -2px 24px 0 rgba(162,60,244,0.08)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "40px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            flex: "1 1 220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
            <i className="fa-solid fa-bolt" style={{ marginRight: "6px" }}></i>
            Gainovia
          </div>
          <p style={{ textAlign: "center", maxWidth: "250px" }}>
            Empowering your financial future, one trade at a time.
          </p>
        </div>

        {/* Links */}
        <div
          style={{
            flex: "2 1 400px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ marginBottom: "8px" }}>Products</h4>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Stocks & ETFs</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Crypto</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Indices</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Commodities</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ marginBottom: "8px" }}>Company</h4>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Careers</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Blog</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ marginBottom: "8px" }}>Support</h4>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Help Center</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Contact</a>
            <a href="#" style={{ color: "#e0d7f7", textDecoration: "none" }}>Legal</a>
          </div>
        </div>

        {/* Social */}
        <div
          style={{
            flex: "1 1 120px",
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <a href="#" style={{ color: "#fff", fontSize: "1.3rem" }}><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.3rem" }}><i className="fa-brands fa-twitter"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.3rem" }}><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.3rem" }}><i className="fa-brands fa-instagram"></i></a>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: "30px",
          fontSize: "0.95rem",
          color: "#e0d7f7",
          opacity: 0.7,
        }}
      >
        &copy; {currentYear} Gainovia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
