import React, { useState, useRef, useEffect } from "react";
import usFlag from "../images/us.png";

const NAV_LINKS = [
    { label: "Trading", href: "#" },
    { label: "Investment", href: "#" },
    { label: "Top markets", href: "#" },
    { label: "Company", href: "#" },
];

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

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
                <div className="iconSection">
                    <i style={{ marginLeft: "30px" }} className="fa-solid fa-bolt icon"></i>
                    <h3 className="iconText">THUNDERVEXT</h3>
                </div>
            </div>

            <div className="navServiceLinks desktopOnly">
                {NAV_LINKS.map((link) => (
                    <p key={link.label}><a href={link.href}>{link.label}</a></p>
                ))}
            </div>

            <div className="navEnd">
                <img className="usFlag desktopOnly" src={usFlag} alt="US Flag" />
               
                <button style={{marginRight: "10px"}} className="standardBtn desktopOnly">Join now</button>

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
                            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                                {link.label}
                            </a>
                        ))}
                        <a href="#">Sign in</a>
                        <button className="standardBtn">Join now</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
