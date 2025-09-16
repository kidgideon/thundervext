import "../styles/tradingHome.css";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import SlideStocks from "../components/slidestock";
import SmartProfile from "../components/profiles";
import Etf from "../components/etf";
import InvestedAssets from "../components/investedassets";

import tradeImageOne from "../icons/icon-a.jpg";
import tradeImageTwo from "../icons/icon-b.jpg";
import tradeImageThree from "../icons/icon-c.jpg";
import tradeImageFour from "../icons/icon-d.jpg";

const Trading = () => {
  return (
    <div className="tradeHomeInterface">
      <NavBar />

      <div className="tradeHomeInterfaceSlideStock">
        <SlideStocks />
      </div>

      {/* SECTIONS CONTAINER WITH PURPLE GLASS BACKGROUND */}
      <div className="sections-container">

        {/* SECTION 1: INTRODUCTION */}
        <div className="standard-div-alignment-port section-row">
          <img src={tradeImageOne} alt="Trading Overview" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Introduction to Trading</h2>
            <p className="section-text">
              Trading is the act of buying and selling financial assets with the
              goal of making a profit. It has evolved over centuries, from simple
              bartering to sophisticated digital platforms today. Modern trading
              allows individuals to access markets worldwide, from stocks and
              bonds to currencies and commodities.
            </p>
            <p className="section-text">
              At its core, trading requires understanding market dynamics,
              recognizing opportunities, and managing risks. While potentially
              rewarding, trading also comes with uncertainties that every trader
              must navigate with care.
            </p>
          </div>
        </div>

        {/* SECTION 2: TYPES OF TRADING */}
        <div className="standard-div-alignment-port section-row">
          <img src={tradeImageTwo} alt="Types of Trading" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Types of Trading</h2>
            <p className="section-text">
              Trading can take many forms. Stock trading involves buying shares of
              companies to profit from price movements or dividends. Forex trading
              deals with currency pairs and global exchange rate fluctuations.
              Commodity trading focuses on raw materials like gold, oil, and
              agricultural products. ETFs and index funds allow diversification
              with lower risk, while derivatives provide leverage and hedging
              opportunities.
            </p>
            <p className="section-text">
              Each trading type has its strategies, tools, and risk profiles.
              Successful traders often specialize in one or two areas to gain
              expertise and maximize returns.
            </p>
          </div>
        </div>

        {/* SECTION 3: HOW TRADING WORKS */}
        <div className="standard-div-alignment-port section-row">
          <img src={tradeImageThree} alt="How Trading Works" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">How Trading Works</h2>
            <p className="section-text">
              Trading involves buying low and selling high, but the mechanics are
              more complex. Traders analyze market data, study price charts, and
              use technical and fundamental analysis to make decisions.
            </p>
            <p className="section-text">
              Orders are placed on exchanges where prices fluctuate continuously.
              Traders must understand bid and ask prices, liquidity, and market
              trends. Risk management techniques such as stop-loss orders are
              essential to protect investments.
            </p>
          </div>
        </div>

        {/* SECTION 4: RISKS & REWARDS */}
        <div className="standard-div-alignment-port section-row">
          <img src={tradeImageFour} alt="Trading Risks" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Risks and Rewards</h2>
            <p className="section-text">
              Trading offers the potential for high returns but also carries
              significant risks. Markets can be volatile, and prices can change
              rapidly due to economic events, news, or global crises. Understanding
              your risk tolerance and using disciplined strategies is critical.
            </p>
            <p className="section-text">
              Profitable traders balance their portfolios, diversify assets, and
              avoid emotional decision-making. Education, patience, and strategy
              are key to long-term success in trading.
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

export default Trading;
