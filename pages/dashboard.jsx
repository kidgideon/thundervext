import "../styles/dashboard.css"
import DasboardNav from "../components/dashboardNav";
import Feed from "../components/feed";
import SlideStocks from "../components/slidestock";

const Dashboard = () => {
    return(<div className="userDashboard">
        <DasboardNav/>
                <SlideStocks/>
         <div className="area">
 <Feed/>
        </div>
    </div>)
}

export default Dashboard;