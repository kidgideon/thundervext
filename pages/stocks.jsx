import "../styles/stocks.css";
import DashboardNav from "../components/dashboardNav";
import CopyTraders from "../components/copyTraders";
import InvestedAssets from "../components/investedassets";
import GeoHeatMap from "../components/heatmap";
import SmartProfile from "../components/profiles";

const Stocks = () => {
    return (
        <div className="user-market-page">
            <DashboardNav />
            <div className="market">
                <p className="market-p">Investment Opportunities</p>
                <h1 className="explpore-m">Explore Stocks</h1>
                <div className="market-items">
                    <div className="scrollables">

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #1f4037, #99f2c8)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>BABA</h1>
                            <div className="boldItemsMrkt">
                                <p>Alibaba Group</p>
                                <p>$82.45</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NYSE</p>
                                <p>+1.22%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #000428, #004e92)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>NIO</h1>
                            <div className="boldItemsMrkt">
                                <p>NIO Inc.</p>
                                <p>$5.87</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NYSE</p>
                                <p>-0.43%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #614385, #516395)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>PYPL</h1>
                            <div className="boldItemsMrkt">
                                <p>PayPal</p>
                                <p>$61.23</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NASDAQ</p>
                                <p>+0.88%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #396afc, #2948ff)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>MSFT</h1>
                            <div className="boldItemsMrkt">
                                <p>Microsoft</p>
                                <p>$447.23</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NASDAQ</p>
                                <p>+0.34%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #e53935, #e35d5b)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>TSLA</h1>
                            <div className="boldItemsMrkt">
                                <p>Tesla</p>
                                <p>$178.90</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NASDAQ</p>
                                <p>-1.12%</p>
                            </div>
                        </div>

                        <div
                            className="marketItem"
                            style={{
                                background: "linear-gradient(135deg, #0f2027, #2c5364)",
                                color: "white",
                                borderRadius: "15px",
                                padding: "20px",
                                width: "250px",
                                marginRight: "20px"
                            }}
                        >
                            <h1>AAPL</h1>
                            <div className="boldItemsMrkt">
                                <p>Apple Inc.</p>
                                <p>$212.54</p>
                            </div>
                            <div className="lightItemsMrkt">
                                <p>NASDAQ</p>
                                <p>+0.75%</p>
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

export default Stocks;
