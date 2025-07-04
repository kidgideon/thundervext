import AdminNavbar from "../components/adminNavbar";
import AdminFunding from "../components/adminFunding";
import AllUsers from "../components/allUsers";

const Activites = () => {
    return(<div className="admin-container">
 <AdminNavbar/>
<div className="area">
 <AdminFunding/>
 <AllUsers/>
</div>
    </div>)
}

export default Activites;