import { useEffect, useState } from "react";
import { db, storage } from "../config/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "sonner";
import "../styles/create-robot.css";

const CreateRobots = () => {
  const [robots, setRobots] = useState([]);
  const [newRobot, setNewRobot] = useState({
    name: "",
    tradePrice: "",
    profit: "",
    loss: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editRobot, setEditRobot] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchRobots = async () => {
    const snapshot = await getDocs(collection(db, "robots"));
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setRobots(list);
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setNewRobot({ ...newRobot, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setNewRobot({ ...newRobot, [name]: value });
    }
  };

  const addRobot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (newRobot.image) {
        const storageRef = ref(storage, `robots/${Date.now()}-${newRobot.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newRobot.image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, "robots"), {
        name: newRobot.name,
        tradePrice: newRobot.tradePrice,
        profit: newRobot.profit,
        loss: newRobot.loss,
        imageUrl,
      });

      toast.success("Robot created successfully!");
      setNewRobot({ name: "", tradePrice: "", profit: "", loss: "", image: null });
      setImagePreview(null);
      fetchRobots();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create robot.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRobot = async (id) => {
    if (window.confirm("Are you sure you want to delete this robot?")) {
      await deleteDoc(doc(db, "robots", id));
      toast.success("Robot deleted.");
      fetchRobots();
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setEditRobot({ ...editRobot, image: file });
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setEditRobot({ ...editRobot, [name]: value });
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);

    try {
      let imageUrl = editRobot.imageUrl;

      // If a new image is chosen
      if (editRobot.image instanceof File) {
        const storageRef = ref(storage, `robots/${Date.now()}-${editRobot.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, editRobot.image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await updateDoc(doc(db, "robots", editRobot.id), {
        name: editRobot.name,
        tradePrice: editRobot.tradePrice,
        profit: editRobot.profit,
        loss: editRobot.loss,
        imageUrl,
      });

      toast.success("Robot updated successfully!");
      setEditRobot(null);
      setEditImagePreview(null);
      fetchRobots();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update robot.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="create-robot-admin-mx90">
      <h2>Create Ai</h2>

      {/* Create Form */}
      <form onSubmit={addRobot} className="robot-form-mx90">
        {/* Image circle input */}
        <label htmlFor="robotImage" className="image-circle-mx90">
          {imagePreview ? (
            <img src={imagePreview} alt="preview" />
          ) : (
            <span>+</span>
          )}
        </label>
        <input
          type="file"
          id="robotImage"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        <input
          type="text"
          name="name"
          placeholder="Robot Name"
          value={newRobot.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tradePrice"
          placeholder="Trade Price"
          value={newRobot.tradePrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="profit"
          placeholder="Profit %"
          value={newRobot.profit}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="loss"
          placeholder="Loss %"
          value={newRobot.loss}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add AI"}
        </button>
      </form>

      {/* Robots List */}
      <div className="robot-list-mx90">
        {robots.map((robot) => (
          <div key={robot.id} className="robot-card-mx90">
            <img src={robot.imageUrl} alt={robot.name} />
            <h3>{robot.name}</h3>
            <p>Price: ${robot.tradePrice}</p>
            <p>Profit: {robot.profit}%</p>
            <p>Loss: {robot.loss}%</p>
            <div className="robot-actions-mx90">
              <button onClick={() => setEditRobot(robot)}>Edit</button>
              <button onClick={() => deleteRobot(robot.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editRobot && (
        <div className="edit-modal-mx90">
          <div className="edit-form-mx90">
            <h3>Edit Robot</h3>
            <form onSubmit={saveEdit}>
              <label htmlFor="editImage" className="image-circle-mx90">
                {editImagePreview ? (
                  <img src={editImagePreview} alt="preview" />
                ) : (
                  <img src={editRobot.imageUrl} alt="robot" />
                )}
              </label>
              <input
                type="file"
                id="editImage"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
                style={{ display: "none" }}
              />

              <input
                type="text"
                name="name"
                value={editRobot.name}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="tradePrice"
                value={editRobot.tradePrice}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="profit"
                value={editRobot.profit}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="loss"
                value={editRobot.loss}
                onChange={handleEditChange}
                required
              />

              <div className="edit-actions-mx90">
                <button type="submit" disabled={savingEdit}>
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn-mx90"
                  onClick={() => setEditRobot(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRobots;
