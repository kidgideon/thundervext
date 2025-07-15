import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import usFlag from "../images/us.png";

const NAV_LINKS = [
    { label: "Trading", href: "/signup" },
    { label: "Investment", href: "/signup" },
    { label: "Top markets", href: "/signup" },
    { label: "Company", href: "/signup" },
];

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    return (
        <nav className="homePageNav fade-in">
            <div className="navStart">
                <div className="iconSection" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                    <i style={{ marginLeft: "30px" }} className="fa-solid fa-bolt icon"></i>
                    <h3 className="iconText">Gainovia</h3>
                </div>
            </div>

            <div className="navServiceLinks desktopOnly">
                {NAV_LINKS.map((link) => (
                    <p key={link.label}>
                        <Link to={link.href}>{link.label}</Link>
                    </p>
                ))}
            </div>

            <div className="navEnd">
                <img className="usFlag desktopOnly" src={usFlag} alt="US Flag" />
                <button
                    style={{ marginRight: "10px" }}
                    className="standardBtn desktopOnly"
                    onClick={() => navigate("/signup")}
                >
                    Join now
                </button>

                {/* Hamburger for mobile */}
                <button
                    className="hamburgerBtn"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="mobileMenu" ref={menuRef}>
                    <div className="mobileMenuLinks">
                        <button
                            className="closeMenuBtn"
                            aria-label="Close menu"
                            onClick={() => setMenuOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                            Sign in
                        </Link>
                        <button
                            className="standardBtn"
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/signup");
                            }}
                        >
                            Join now
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
