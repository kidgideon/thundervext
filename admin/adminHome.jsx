import AdminNavbar from "../components/adminNavbar"
import Feed from "../components/feed";
import SlideStocks from "../components/slidestock";
import "../styles/admin_home.css"
import logo from "../images/logo.jpg"
const AdminHome = () => {
    return(
        <div className="admin-container">
   <AdminNavbar/>
   <SlideStocks/>
   <div className="area">
    <div className="admin-post-area">
  <div className="post-area-top">
    <div className="img-logo">
   <img src={logo} alt="" /> 
    </div>
    <div className="top-input-admin">
 <input placeholder="whats on your mind?" type="text" />
    </div>
  </div>
  <div className="bottom-admin">
<i class="fa-solid fa-image"></i> upload
  </div>
  <div className="upload-button-admin">
    <button>post</button>
  </div>
    </div>
    <Feed/>
   </div>
        </div>
    )
}

export default AdminHome;