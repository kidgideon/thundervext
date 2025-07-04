import { useState } from "react";
import { toast } from "sonner";
import { db, storage } from "../config/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminNavbar from "../components/adminNavbar";
import Feed from "../components/feed";
import SlideStocks from "../components/slidestock";
import "../styles/admin_home.css";
import logo from "../images/logo.jpg";

const AdminHome = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    toast.error("Invalid file type. Only image files are allowed.");
    return;
  }

  setImage(file);
};


  const handlePost = async () => {
    if (!content.trim() && !image) {
      toast.error("Please add text or upload an image.");
      return;
    }

    const toastId = toast.loading("Posting...");

    try {
      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `feeds/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "feeds"), {
        content: content.trim(),
        date: serverTimestamp(),
        likes: [],
        media: imageUrl,
      });

      toast.success("Post uploaded successfully!", { id: toastId });
      setContent("");
      setImage(null);
    } catch (err) {
      toast.error("Failed to upload post.", { id: toastId });
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <SlideStocks />
      <div className="area">
        <div className="admin-post-area">
          <div className="post-area-top">
            <div className="img-logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="top-input-admin">
              <input
                placeholder="what's on your mind?"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="bottom-admin">
            <label style={{ cursor: "pointer" }}>
              <i className="fa-solid fa-image"></i> Upload
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
            {image && <span style={{ marginLeft: 10 }}>{image.name}</span>}
          </div>

          <div className="upload-button-admin">
            <button className="buttonAdmin" onClick={handlePost}>Post</button>
          </div>
        </div>

        <Feed />
      </div>
    </div>
  );
};

export default AdminHome;
