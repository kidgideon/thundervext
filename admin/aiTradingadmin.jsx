import CreateRobots from "../components/createRobots"
import AdminNavbar from "../components/adminNavbar"
import AdminTradesTable from "../components/adminTableAi"

const AiTradingAdmin = () => {
    return(
        <div className="adminPaymentInterface">
            <AdminNavbar/>
            <div className="area">
  <CreateRobots/>
  <AdminTradesTable/>
            </div>
        </div>
    )
}

export default AiTradingAdmin