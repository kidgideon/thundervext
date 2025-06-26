import "../styles/home.css"
import { useEffect, useRef, useState } from "react";
import usFlag from "../images/us.png"
import tradeChart from "../images/tradeimage.webp"
import airbnb from "../images/airbnb.svg"
import apple from "../images/apple-colored.svg"
import bitcoin from "../images/bitcoin.svg"
import ishares from "../images/ishares-colored.svg"
import etherum from "../images/ethereum.svg"
import netflix from "../images/netflix.svg"
import spdr from "../images/spdr-colored.svg"
import crypto from "../images/crypto2x.jpg"
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Home = () => {
    const animationRef = useRef();
    const [fanOut, setFanOut] = useState(true);
    const lastScroll = useRef(window.scrollY);

    useEffect(() => {
        const handleScroll = () => {
            if (!animationRef.current) return;
            const rect = animationRef.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            const imgs = animationRef.current.querySelectorAll('.animated-img');
            imgs.forEach(img => {
                if (inView) {
                    img.classList.remove('outside');
                } else {
                    img.classList.add('outside');
                }
            });

            // Detect scroll direction for animation
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll.current) {
                setFanOut(true); // Scroll down: fan out
            } else if (currentScroll < lastScroll.current) {
                setFanOut(false); // Scroll up: stack
            }
            lastScroll.current = currentScroll;
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fade-in logic for sections
    useEffect(() => {
        const sections = document.querySelectorAll('.fade-in');
        sections.forEach((section, i) => {
            section.style.animationDelay = `${i * 0.2 + 0.2}s`;
        });
    }, []);

    return (
        <div className="homepageInterface">

            <NavBar/>
           
            <div className="homePageFirstSection fade-in">
                <h1>
                    YEP, <span style={{ color: "#a23cf4" }}>IT'S ALL IN ONE</span>
                </h1>
                <h3>Join 35M users worldwide and invest in 7,000+ instruments with advanced trading tools </h3>
                <button className="standardButton">Join Thundervext</button>
                <img src={tradeChart} alt="" />
                
            </div>

            <div className="homePageSecondSection fade-in">
                  <div className="discoveryArea">
                    <h1>Diversify your porfolio</h1>
                    <p>
                        Invest in a variety of asset classes — including 20 global stock exchanges and 100 cryptocurrencies — while managing all of your holdings in one place
                    </p>
                    <button className="paleButtonBig">Explore top Markets</button>
                </div>
                <div
                    className={`animationPoint${fanOut ? " fan-out" : " stacked"}`}
                    ref={animationRef}
                >
                    <div className="animated-img img-netflix"><img src={netflix} alt="Netflix" /></div>
                    <div className="animated-img img-ishares"><img src={ishares} alt="iShares" /></div>
                    <div className="animated-img img-apple"><img src={apple} alt="Apple" /></div>
                    <div className="animated-img img-airbnb"><img src={airbnb} alt="Airbnb" /></div>
                    <div className="animated-img img-spdr"><img src={spdr} alt="SPDR" /></div>
                </div>
              
            </div>

            <div className="homrPageThirdSection fade-in">
                <div className="imageSectionThird">
           <img src={crypto} alt="" />
                </div>
                <div className="textSectionThird">
                    <h1>Crypto trading at its best</h1>
                    <p>
                        Trade and manage 70+ cryptoassets on a trusted global platform that offers top-tier security, powerful tools, user-friendly features, and fixed transparent fees. Eligible eToro Club members can also sell their crypto for GBP or EUR, unlocking even more flexibility to trade, invest, or explore new opportunities.*Other fees apply
                    </p>
                    <button className="paleButtonBig">Invest in crypto</button>

                    <p>Crypto assets are unregulated & highly speculative. No consumer protection. Capital at risk. </p>
                </div>
            </div>

            <div className="homePageFourthSection fade-in">
                <h1>Trusted World wide</h1>
                <h3>Discover why thousands of investors from over 100 countries joined Thundervext</h3>

                <div className="boxesDirection">
                    <div className="boxes">
                         <i class="fa-solid fa-person"></i>
                        <h2>Social</h2>
                        <p>More than 35 million users globally</p>
                    </div>

                     <div className="boxes">
         <i class="fa-solid fa-file-contract"></i>
                        <h2>Reliable</h2>
                        <p>A leader in the fintech space since 2007</p>
                    </div>

                     <div className="boxes">
                         <i class="fa-solid fa-file-shield"></i>
                        <h2>Secured</h2>
                        <p>Utilising best security practices for client money and assets safety</p>
                    </div>

                     <div className="boxes">
<i class="fa-solid fa-earth-americas"></i>
                        <h2>Global</h2>
                        <p>Providing services around the world</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;