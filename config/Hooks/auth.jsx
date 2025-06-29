import { useState, useEffect } from "react";
import { auth, db } from "../config";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Signup with verification code
  const signup = async ({ email, password, firstName, lastName, username }) => {
    setLoading(true);

    try {
      // Check uniqueness
      const usersRef = collection(db, "users");
      const [emailSnap, usernameSnap] = await Promise.all([
        getDocs(query(usersRef, where("email", "==", email))),
        getDocs(query(usersRef, where("username", "==", username))),
      ]);

      if (!emailSnap.empty) {
        toast.error("🚫 Email is already registered.");
        return { success: false };
      }

      if (!usernameSnap.empty) {
        toast.error("🚫 Username is already taken.");
        return { success: false };
      }

      // Send code
      const res = await fetch("https://code-send.onrender.com/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send verification code.");
        return { success: false };
      }

      setVerificationCode(data.code);
      toast.success("✅ Verification code sent!");
      return { success: true, codeSent: true };
    } catch (err) {
      toast.error("❌ Signup failed.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Verify code and create user
  const verifyCode = async (inputCode, userInfo) => {
    const { email, password, firstName, lastName, username } = userInfo;

    if (inputCode !== verificationCode) {
      toast.error("Incorrect verification code.");
      return { success: false };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", cred.user.uid);

      await setDoc(userRef, {
        uid: cred.user.uid,
        email,
        username,
        firstName,
        lastName,
        createdAt: Date.now(),
      });

      toast.success("🎉 Account created successfully!");
      return { success: true, uid: cred.user.uid };
    } catch (err) {
      toast.error(err.message || "❌ Account creation failed.");
      return { success: false };
    }
  };

  // ✅ Email/password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Logged in successfully!");
      return { success: true, user: result.user };
    } catch (err) {
      toast.error(err.message || "❌ Login failed.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

const loginWithGoogle = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const { uid, email, displayName, photoURL } = result.user;

    toast.success("✅ Google login successful!");

    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Parse name into first/last
      let [firstName, ...rest] = displayName.split(" ");
      let lastName = rest.join(" ") || "User";

      // Generate unique username (e.g. john123)
      const baseUsername = firstName.toLowerCase().replace(/[^a-z0-9]/gi, "");
      let username = baseUsername;
      let usernameTaken = true;
      let attempts = 0;

      const usersRef = collection(db, "users");

      while (usernameTaken && attempts < 5) {
        const q = query(usersRef, where("username", "==", username));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          usernameTaken = false;
        } else {
          const randNum = Math.floor(Math.random() * 10000);
          username = `${baseUsername}${randNum}`;
          attempts++;
        }
      }

      // Fallback if all usernames are somehow taken
      if (usernameTaken) username = `${baseUsername}${Date.now()}`;

      // Save to Firestore
      await setDoc(userRef, {
        uid,
        email,
        firstName,
        lastName,
        username,
        provider: "google",
        picture: photoURL,
        createdAt: Date.now(),
      });

      toast.success(`🎉 Welcome, ${firstName}!`);
    } else {
      toast("👋 Welcome back!");
    }

    return { success: true, user: result.user };
  } catch (err) {
    toast.error("❌ Google login failed.");
    return { success: false };
  } finally {
    setLoading(false);
  }
};
  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out.");
  };

  // ✅ All exports
  return {
    user,
    loading,
    signup,
    verifyCode,
    login,
    loginWithGoogle,
    logout,
  };
};

export default useAuth;
