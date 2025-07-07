import { useState } from "react";
import { db } from "../config/config";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminNavbar from "../components/adminNavbar";
import CopyTraders from "../components/copyTraders";
import "../styles/payment.css";
import { toast } from "sonner";

const AdminTraders = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    profit: "",
    loss: "",
    picture: null,
    copyPrice: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (file && !allowedTypes.includes(file.type)) {
        toast.error("Unsupported image type");
        return;
      }
      setInputs((prev) => ({ ...prev, picture: file }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTrader = async () => {
    const { firstName, lastName, username, profit, loss, picture, copyPrice } = inputs;

    if (!firstName || !lastName || !username || !profit || !loss || !copyPrice) {
      toast.error("Fill all fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Uploading trader...");

    let pictureUrl = "";
    try {
      if (picture) {
        const storage = getStorage();
        const imageRef = ref(storage, `traders/${Date.now()}_${picture.name.replace(/\s+/g, "_")}`);
        await uploadBytes(imageRef, picture);
        pictureUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "traders"), {
        firstName,
        lastName,
        username,
        copyPrice: Number(copyPrice),
        profit: Number(profit),
        loss: Number(loss),
        picture: pictureUrl,
      });

      toast.success("Trader added", { id: toastId });

      setInputs({
        firstName: "",
        lastName: "",
        username: "",
        profit: "",
        loss: "",
        picture: null,
        copyPrice: "",
      });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to add trader", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="area">
        <div className="add-payment-channels">
          <div className="payment-channel-form">
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={inputs.username}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="profit"
            placeholder="Profit %"
            value={inputs.profit}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="loss"
            placeholder="Loss %"
            value={inputs.loss}
            onChange={handleInputChange}
          />
           <input
            type="number"
            name="copyPrice"
            placeholder="copy price"
            value={inputs.copyPrice}
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
          <button
            className="buttonAdmin"
            onClick={handleAddTrader}
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Trader"}
          </button>
        </div>
        <CopyTraders />
      </div>
    </div>
  );
};

export default AdminTraders;
