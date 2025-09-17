import { useState, useEffect } from "react";
import { db } from "../config/config";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminNavbar from "../components/adminNavbar";
import "../styles/payment.css";
import { toast } from "sonner";
import AdminCopyTrade from "../components/adminCopyTrade";

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
  const [traders, setTraders] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingTraderId, setEditingTraderId] = useState(null);

  // Fetch traders in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "traders"), (snapshot) => {
      const traderData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTraders(traderData);
    });

    return () => unsubscribe();
  }, []);

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

  const handleAddOrUpdateTrader = async () => {
    const { firstName, lastName, username, profit, loss, picture, copyPrice } = inputs;
    if (!firstName || !lastName || !username || !profit || !loss || !copyPrice) {
      toast.error("Fill all fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(editingTraderId ? "Updating trader..." : "Uploading trader...");

    try {
      let pictureUrl = inputs.picture instanceof File ? "" : inputs.picture;

      // Upload image if a new one was selected
      if (inputs.picture instanceof File) {
        const storage = getStorage();
        const imageRef = ref(storage, `traders/${Date.now()}_${inputs.picture.name.replace(/\s+/g, "_")}`);
        await uploadBytes(imageRef, inputs.picture);
        pictureUrl = await getDownloadURL(imageRef);
      }

      if (editingTraderId) {
        // Update existing trader
        const traderRef = doc(db, "traders", editingTraderId);
        await updateDoc(traderRef, {
          firstName,
          lastName,
          username,
          profit: Number(profit),
          loss: Number(loss),
          copyPrice: Number(copyPrice),
          picture: pictureUrl,
        });
        toast.success("Trader updated", { id: toastId });
      } else {
        // Add new trader
        await addDoc(collection(db, "traders"), {
          firstName,
          lastName,
          username,
          profit: Number(profit),
          loss: Number(loss),
          copyPrice: Number(copyPrice),
          picture: pictureUrl,
        });
        toast.success("Trader added", { id: toastId });
      }

      // Reset form
      setInputs({ firstName: "", lastName: "", username: "", profit: "", loss: "", picture: null, copyPrice: "" });
      setEditingTraderId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save trader", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (trader) => {
    setEditingTraderId(trader.id);
    setInputs({
      firstName: trader.firstName,
      lastName: trader.lastName,
      username: trader.username,
      profit: trader.profit,
      loss: trader.loss,
      copyPrice: trader.copyPrice,
      picture: trader.picture || null,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this trader?")) {
      try {
        await deleteDoc(doc(db, "traders", id));
        toast.success("Trader deleted");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete trader");
      }
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

          <input type="text" name="firstName" placeholder="First Name" value={inputs.firstName} onChange={handleInputChange} />
          <input type="text" name="lastName" placeholder="Last Name" value={inputs.lastName} onChange={handleInputChange} />
          <input type="text" name="username" placeholder="Username" value={inputs.username} onChange={handleInputChange} />
          <input type="number" name="profit" placeholder="Profit %" value={inputs.profit} onChange={handleInputChange} />
          <input type="number" name="loss" placeholder="Loss %" value={inputs.loss} onChange={handleInputChange} />
          <input type="number" name="copyPrice" placeholder="Copy Price" value={inputs.copyPrice} onChange={handleInputChange} />
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} />

          <button className="buttonAdmin" onClick={handleAddOrUpdateTrader} disabled={submitting}>
            {submitting ? (editingTraderId ? "Updating..." : "Adding...") : editingTraderId ? "Update Trader" : "Add Trader"}
          </button>
        </div>

  <AdminCopyTrade/>
  
        {/* Display traders */}
        <div className="trader-list">
          {traders.length === 0 ? (
            <p>No traders yet.</p>
          ) : (
            traders.map((trader) => (
              <div className="trader-card" key={trader.id}>
                <img src={trader.picture || "/default-avatar.png"} alt={trader.username} className="trader-image" />
                <div className="trader-info">
                  <p><strong>{trader.firstName} {trader.lastName}</strong> (@{trader.username})</p>
                  <p>Profit: {trader.profit}% | Loss: {trader.loss}% | Copy Price: ${trader.copyPrice}</p>
                </div>
                <div className="trader-actions">
                  <span className="action-icon" onClick={() => handleEdit(trader)} title="Edit"><i className="fa-solid fa-user-pen"></i></span>
                  <span  className="action-icon" onClick={() => handleDelete(trader.id)} title="Delete"><i className="fa-solid fa-trash"></i></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTraders;
