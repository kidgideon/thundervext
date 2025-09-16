import "../styles/tradingHome.css";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import SlideStocks from "../components/slidestock";
import SmartProfile from "../components/profiles";
import Etf from "../components/etf";
import InvestedAssets from "../components/investedassets";

import companyImageOne from "../icons/icon-e.jpg";
import companyImageTwo from "../icons/icon-f.jpg";
import companyImageThree from "../icons/icon-g.jpg";
import companyImageFour from "../icons/icon-h.jpg";

const Company = () => {
  return (
    <div className="tradeHomeInterface">
      <NavBar />

      <div className="tradeHomeInterfaceSlideStock">
        <SlideStocks />
      </div>

      {/* COMPANY SECTIONS */}
      <div className="sections-container">

        {/* SECTION 1: About Gainovia */}
        <div className="standard-div-alignment-port section-row">
          <img src={companyImageOne} alt="About Gainovia" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">About Gainovia</h2>
            <p className="section-text">
              Gainovia is a forward-thinking fintech company dedicated to making
              trading and investment accessible to everyone. Founded on the principles
              of transparency, innovation, and security, Gainovia aims to provide
              users with powerful tools to navigate global markets confidently.
            </p>
            <p className="section-text">
              Our mission is to empower traders and investors with educational
              resources, intuitive platforms, and insights that help them make
              informed financial decisions.
            </p>
          </div>
        </div>

        {/* SECTION 2: Our Vision & Mission */}
        <div className="standard-div-alignment-port section-row">
          <img src={companyImageTwo} alt="Vision and Mission" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Vision & Mission</h2>
            <p className="section-text">
              Gainovia’s vision is to democratize financial markets, ensuring that
              everyone, regardless of background, can access and benefit from
              investment opportunities. Our mission is to provide innovative
              trading tools, transparent services, and education that simplifies
              investing for all users.
            </p>
            <p className="section-text">
              We aim to build long-term relationships with our clients by fostering
              trust, reliability, and measurable financial growth.
            </p>
          </div>
        </div>

        {/* SECTION 3: Our Team */}
        <div className="standard-div-alignment-port section-row">
          <img src={companyImageThree} alt="Our Team" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Our Team</h2>
            <p className="section-text">
              Our team comprises experienced professionals from finance, technology,
              and business development backgrounds. Together, we design platforms
              that combine innovation, security, and usability for a seamless
              trading experience.
            </p>
            <p className="section-text">
              Collaboration and creativity are at the heart of Gainovia’s culture,
              allowing us to stay ahead in the fast-evolving financial technology
              space.
            </p>
          </div>
        </div>

        {/* SECTION 4: Our Values */}
        <div className="standard-div-alignment-port section-row">
          <img src={companyImageFour} alt="Our Values" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Our Values</h2>
            <p className="section-text">
              Integrity, transparency, and innovation drive every decision at
              Gainovia. We prioritize user security, ethical practices, and
              continuous improvement in all our services.
            </p>
            <p className="section-text">
              By adhering to these values, we aim to create a platform where
              clients feel confident, informed, and empowered to achieve
              their financial goals.
            </p>
          </div>
        </div>

      </div>

      {/* EXTRA COMPONENTS */}
      <div className="standard-control">
        <SmartProfile />
      </div>

      <div className="standard-control">
        <Etf />
      </div>

      <div className="standard-control">
        <InvestedAssets />
      </div>

      <Footer />
    </div>
  );
};

export default Company;
