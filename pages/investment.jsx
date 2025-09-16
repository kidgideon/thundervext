import "../styles/tradingHome.css";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import SlideStocks from "../components/slidestock";
import SmartProfile from "../components/profiles";
import Etf from "../components/etf";
import InvestedAssets from "../components/investedassets";

import investmentImageOne from "../icons/icon-l.jpg";
import investmentImageTwo from "../icons/icon-m.jpg";
import investmentImageThree from "../icons/icon-n.jpg";
import investmentImageFour from "../icons/icon-o.jpg";

const Investment = () => {
  return (
    <div className="tradeHomeInterface">
      <NavBar />

      <div className="tradeHomeInterfaceSlideStock">
        <SlideStocks />
      </div>

      {/* INVESTMENT SECTIONS */}
      <div className="sections-container">

        {/* SECTION 1: Introduction to Investment */}
        <div className="standard-div-alignment-port section-row">
          <img src={investmentImageOne} alt="Introduction to Investment" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Introduction to Investment</h2>
            <p className="section-text">
              Investment is the process of allocating resources, usually money, 
              with the expectation of generating income or profit over time. 
              Unlike trading, which often focuses on short-term gains, investment 
              emphasizes long-term growth and wealth building.
            </p>
            <p className="section-text">
              Through careful planning, research, and diversification, investors 
              can maximize returns while managing risk.
            </p>
          </div>
        </div>

        {/* SECTION 2: Types of Investments */}
        <div className="standard-div-alignment-port section-row">
          <img src={investmentImageTwo} alt="Types of Investments" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Types of Investments</h2>
            <p className="section-text">
              Investments come in many forms. Stocks offer ownership in companies 
              and potential dividend income. Bonds provide regular interest payments 
              and are generally lower risk. Real estate, mutual funds, ETFs, and 
              commodities offer additional diversification and opportunities.
            </p>
            <p className="section-text">
              Each investment type has its own risk and return profile, so understanding 
              them is essential for building a balanced portfolio.
            </p>
          </div>
        </div>

        {/* SECTION 3: Investment Strategies */}
        <div className="standard-div-alignment-port section-row">
          <img src={investmentImageThree} alt="Investment Strategies" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Investment Strategies</h2>
            <p className="section-text">
              Successful investors use strategies such as diversification, 
              dollar-cost averaging, and asset allocation to reduce risk 
              and improve returns. Long-term strategies focus on growth, 
              income, or a combination of both.
            </p>
            <p className="section-text">
              Regularly reviewing portfolios and adapting to market conditions 
              ensures that investments remain aligned with financial goals.
            </p>
          </div>
        </div>

        {/* SECTION 4: Risks and Rewards */}
        <div className="standard-div-alignment-port section-row">
          <img src={investmentImageFour} alt="Investment Risks and Rewards" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Risks and Rewards</h2>
            <p className="section-text">
              All investments carry risk, including the potential loss of principal. 
              Market volatility, economic downturns, and unforeseen events can affect 
              performance. Understanding these risks and planning accordingly is essential.
            </p>
            <p className="section-text">
              By diversifying investments, staying informed, and taking a disciplined 
              approach, investors can achieve consistent growth and reach their 
              financial objectives over time.
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

export default Investment;
