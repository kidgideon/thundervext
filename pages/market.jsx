import "../styles/market.css"
import DashboardNav from "../components/dashboardNav";
import bitcoin from "../images/bitcoin_logo.png"
import amazon from "../images/amazon_logo.png"
import cardano from "../images/cardano_logo.png"
import etherum from "../images/etherum_logo.png"
import CopyTraders from "../components/copyTraders";
const Market = () => {
return(
   <div className="user-market-page">
        <DashboardNav/>
   <div className="market">
    <p className="market-p">Investment Opportunities</p>
    <h1   className="explpore-m">Explore Markets</h1>
    <div className="market-items">
        <div className="scrollables">
  <div className="marketItem bitcoin-card">
            <img src={bitcoin} alt="" />
            <div  className="boldItemsMrkt ">
                <p>BTC</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>Bitcoin</p>
               <p>-0.13%</p>
            </div>
        </div>

         <div className="marketItem amazon-card">
            <img src={amazon} alt="" />
            <div className="boldItemsMrkt">
                <p>AMZN</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>Amazon.com</p>
               <p>-0.13%</p>
            </div>
        </div>

         <div className="marketItem cardano-card">
            <img src={cardano} alt="" />
            <div className="boldItemsMrkt">
                <p>AdA</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>Cardano</p>
               <p>-0.13%</p>
            </div>
        </div>

         <div className="marketItem etherum-card">
            <img style={{width: "70px"}}  src={etherum} alt="" />
            <div className="boldItemsMrkt">
                <p>ETH</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>ETH</p>
               <p>-0.13%</p>
            </div>
        </div>

         <div className="marketItem testla-card">
             <h1>Tesla</h1>
            <div className="boldItemsMrkt">
                <p>TSL</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>Tesla</p>
               <p>-0.13%</p>
            </div>
        </div>

         <div className="marketItem ishares-card">
            <h1>Ishare</h1>
            <div className="boldItemsMrkt">
                <p>ISH</p>
                <p>106,051.27</p>
            </div>
            <div className="lightItemsMrkt">
               <p>Ishare</p>
               <p>-0.13%</p>
            </div>
        </div>
        </div>
    </div>
  <CopyTraders/>
   </div>

    </div>
)
}

export default Market;