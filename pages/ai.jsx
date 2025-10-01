import "../styles/aitrading.css"
import DashboardNav from "../components/dashboardNav";
import Aistats from "../components/aiStats";
import Aichart from "../components/aichart";
import Robot from "../components/robot";
import Ais from "../components/ais";
import UserTradesTable from "../components/tradeTable";

const AiTrading = () => {
    return(
        <div className="userDashboard">
            <DashboardNav/>
   <div className="area">
 <Aistats/>
 <UserTradesTable/>
 <Aichart/>
   <Ais/>
 <Robot/>
   </div>
        </div>
    )
}

export default AiTrading;