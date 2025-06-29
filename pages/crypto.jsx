import "../styles/crypto.css";
import DashboardNav from "../components/dashboardNav";
import CopyTraders from "../components/copyTraders";
import InvestedAssets from "../components/investedassets";
import GeoHeatMap from "../components/heatmap";
import SmartProfile from "../components/profiles";

const Crypto = () => {
    return (
        <div className="user-market-page">
             <DashboardNav />
            <div className="market">
                <p className="market-p">Crypto Opportunities</p>
                <h1 className="explpore-m">Explore Cryptocurrencies</h1>
                <div className="market-items">
                    <div className="scrollables">

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #ff0080, #7928ca)", // intense pink/purple
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>PEPE</h1>
                            <div className="boldItemsMrkt">
                                <p>Pepe Coin</p>
                                <p>$0.0000012</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>Meme Token</p>
                                <p>+18.20%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #ff5f6d, #ffc371)", // fiery red to gold
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>PEPExM</h1>
                            <div className="boldItemsMrkt">
                                <p>PEPE Max</p>
                                <p>$0.00000009</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>Experimental</p>
                                <p>+9.83%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #00c6ff, #0072ff)", // electric blue
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>NEAR</h1>
                            <div className="boldItemsMrkt">
                                <p>NEAR Protocol</p>
                                <p>$5.21</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>Layer 1</p>
                                <p>-1.45%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #f7971e, #ffd200)", // orange to neon yellow
                                color: "black",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>ETC</h1>
                            <div className="boldItemsMrkt">
                                <p>Ethereum Classic</p>
                                <p>$24.62</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>Fork of ETH</p>
                                <p>+2.34%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #fc466b, #3f5efb)", // rose red to electric blue
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>SOL</h1>
                            <div className="boldItemsMrkt">
                                <p>Solana</p>
                                <p>$143.90</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>High Speed</p>
                                <p>+4.76%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #ff4b1f, #1fddff)", // lava orange to icy cyan
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>ARB</h1>
                            <div className="boldItemsMrkt">
                                <p>Arbitrum</p>
                                <p>$1.13</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>Layer 2</p>
                                <p>+0.88%</p>
                            </div>
                        </div>

                    </div>
                </div>
                 <CopyTraders />
                <SmartProfile />
                <InvestedAssets />
            </div>
        </div>
    );
};

export default Crypto;
