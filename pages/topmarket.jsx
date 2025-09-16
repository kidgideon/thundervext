import "../styles/tradingHome.css";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import SlideStocks from "../components/slidestock";
import SmartProfile from "../components/profiles";
import Etf from "../components/etf";
import InvestedAssets from "../components/investedassets";

import topMarketImageOne from "../icons/icon-i.jpg";
import topMarketImageTwo from "../icons/icon-j.jpg";
import topMarketImageThree from "../icons/icon-k.jpg";
import topMarketImageFour from "../icons/icon-l.jpg";

const TopMarket = () => {
  return (
    <div className="tradeHomeInterface">
      <NavBar />

      <div className="tradeHomeInterfaceSlideStock">
        <SlideStocks />
      </div>

      {/* MARKET SECTIONS */}
      <div className="sections-container">

        {/* SECTION 1: Global Market Overview */}
        <div className="standard-div-alignment-port section-row">
          <img src={topMarketImageOne} alt="Global Market Overview" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Global Market Overview</h2>
            <p className="section-text">
              The global financial market encompasses stocks, bonds, commodities, 
              currencies, and derivatives across the world. It operates 24/7 
              through interconnected exchanges and trading platforms.
            </p>
            <p className="section-text">
              Market trends are influenced by economic indicators, government policies, 
              geopolitical events, and investor sentiment. Understanding these forces 
              helps traders and investors make informed decisions.
            </p>
          </div>
        </div>

        {/* SECTION 2: Stock Market Insights */}
        <div className="standard-div-alignment-port section-row">
          <img src={topMarketImageTwo} alt="Stock Market Insights" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Stock Market Insights</h2>
            <p className="section-text">
              Stock markets are central to the global economy, allowing companies to raise 
              capital while giving investors opportunities for growth. Prices fluctuate 
              based on supply and demand, earnings reports, and broader economic conditions.
            </p>
            <p className="section-text">
              Tracking market indices and sectors helps traders understand trends, identify 
              opportunities, and manage risks effectively.
            </p>
          </div>
        </div>

        {/* SECTION 3: Forex & Commodities */}
        <div className="standard-div-alignment-port section-row">
          <img src={topMarketImageThree} alt="Forex & Commodities" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Forex & Commodities</h2>
            <p className="section-text">
              Forex trading involves the buying and selling of currency pairs, influenced 
              by global economic events and central bank policies. Commodities like gold, 
              oil, and agricultural products are traded worldwide, often serving as 
              hedges or speculative opportunities.
            </p>
            <p className="section-text">
              Understanding these markets requires knowledge of supply-demand dynamics, 
              geopolitical risks, and macroeconomic trends.
            </p>
          </div>
        </div>

        {/* SECTION 4: Market Trends & Analysis */}
        <div className="standard-div-alignment-port section-row">
          <img src={topMarketImageFour} alt="Market Trends & Analysis" className="section-image" />
          <div className="section-text-container">
            <h2 className="section-title">Market Trends & Analysis</h2>
            <p className="section-text">
              Traders use both fundamental and technical analysis to understand market 
              movements. Fundamental analysis evaluates economic data, company performance, 
              and industry outlook, while technical analysis studies historical price patterns.
            </p>
            <p className="section-text">
              Combining these approaches helps investors predict trends, identify 
              entry/exit points, and manage portfolio risk effectively.
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

export default TopMarket;
