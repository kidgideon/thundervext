import { useState, useEffect } from "react";
import { auth, db } from "../config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { toast } from "sonner";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signup = async ({ email, password, firstName, lastName, username }) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const usersRef = collection(db, "users");

      const [emailSnap, usernameSnap] = await Promise.all([
        getDocs(query(usersRef, where("email", "==", email))),
        getDocs(query(usersRef, where("username", "==", username))),
      ]);

      if (!emailSnap.empty) {
        toast.dismiss(toastId);
        toast.error("🚫 Email is already registered.");
        return { success: false };
      }

      if (!usernameSnap.empty) {
        toast.dismiss(toastId);
        toast.error("🚫 Username is already taken.");
        return { success: false };
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", cred.user.uid);

      await setDoc(userRef, {
        uid: cred.user.uid,
        email,
        username,
        firstName,
        lastName,
        notifications: [],
        role: "client",
        createdAt: Date.now(),
        walletBalance: 0,
        transactions: [],
        assets: [],
        bio: "joined Gainovia",
        location: "US",
        followers: 0,
        following: 0,
        accountLevel: "basic",
        isActivated: false,
      });

      toast.success("🎉 Account created successfully!", { id: toastId });
      return { success: true, uid: cred.user.uid };
    } catch (err) {
      toast.error(err.message || "❌ Account creation failed.", { id: toastId });
      return { success: false };
    }
  };

  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Logged in successfully!", { id: toastId });
      return { success: true, user: result.user };
    } catch (err) {
      toast.error(err.message || "❌ Login failed.", { id: toastId });
      return { success: false };
    }
  };

  const loginWithGoogle = async () => {
    const toastId = toast.loading("Signing in with Google...");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName, photoURL } = result.user;

      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        let [firstName, ...rest] = displayName.split(" ");
        let lastName = rest.join(" ") || "User";

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

        if (usernameTaken) {
          username = `${baseUsername}${Date.now()}`;
        }

        await setDoc(userRef, {
          uid,
          email,
          firstName,
          lastName,
          username,
          provider: "google",
          picture: photoURL,
          createdAt: Date.now(),
          notifications: [],
          role: "client",
          walletBalance: 0,
          transactions: [],
          assets: [],
          bio: "joined Gainovia",
          location: "US",
          followers: 0,
          following: 0,
          accountLevel: "basic",
          isActivated: false,
        });

        toast.success(`🎉 Welcome, ${firstName}!`, { id: toastId });
      } else {
        toast.success("👋 Welcome back!", { id: toastId });
      }

      return { success: true, user: result.user };
    } catch (err) {
      toast.error("❌ Google login failed.", { id: toastId });
      return { success: false };
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out.");
  };

  return {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
  };
};

export default useAuth;
