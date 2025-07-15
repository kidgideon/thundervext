import React from "react";

const Footer = () => (
    <footer className="footer-modern fade-in">
        <div className="footer-modern-content">
            <div className="footer-brand">
                <div>
                    <i className="fa-solid fa-bolt icon"></i> Gainovia
                </div>
                <p>Empowering your financial future, one trade at a time.</p>
            </div>
            <div className="footer-links">
                <div>
                    <h4>Products</h4>
                    <a href="#">Stocks & ETFs</a>
                    <a href="#">Crypto</a>
                    <a href="#">Indices</a>
                    <a href="#">Commodities</a>
                </div>
                <div>
                    <h4>Company</h4>
                    <a href="#">About</a>
                    <a href="#">Careers</a>
                    <a href="#">Blog</a>
                </div>
                <div>
                    <h4>Support</h4>
                    <a href="#">Help Center</a>
                    <a href="#">Contact</a>
                    <a href="#">Legal</a>
                </div>
            </div>
            <div className="footer-social">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
            </div>
        </div>
        <div className="footer-modern-bottom">
            <span>&copy; {new Date().getFullYear()} Gainovia. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;