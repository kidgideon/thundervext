import AdminNavbar from "../components/adminNavbar";
import AllUsers from "../components/allUsers";
import AdminCopyTrade from "../components/adminCopyTrade";

const Activites = () => {
    return(<div className="admin-container">
 <AdminNavbar/>
<div className="area">
<AdminCopyTrade/>
 <AllUsers/>
</div>
    </div>)
}

export default Activites;