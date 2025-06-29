import Etf from "../components/etf";
import DashboardNav from "../components/dashboardNav";
import CopyTraders from "../components/copyTraders";
import SmartProfile from "../components/profiles";

const NFT = () => {
    return( <div className="user-market-page">
        <DashboardNav/>
   <div className="market">
    <Etf/>
     <CopyTraders/>
    <SmartProfile/>
   </div>
    </div>)
}

export default NFT;