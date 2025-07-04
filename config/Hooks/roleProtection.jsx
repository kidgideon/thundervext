import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config";
import { toast } from "sonner";

const RoleProtectedRoute = ({ children }) => {
  const [verified, setVerified] = useState(undefined);
  const toastId = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (verified === undefined) {
        toastId.current = toast.loading("Checking admin access...");
      }
    }, 300);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(timeoutRef.current);

      if (!currentUser) {
        if (toastId.current) toast.dismiss(toastId.current);
        toast.error("You're not logged in");
        setVerified(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          if (toastId.current) toast.dismiss(toastId.current);
          toast.error("User record not found");
          setVerified(false);
          return;
        }

        const userData = userDocSnap.data();
        const role = userData.role;

        if (toastId.current) toast.dismiss(toastId.current);

        if (role === "admin") {
          toast.success("✅ Admin access verified");
          setVerified(true);
        } else {
          toast.error("🚫 You are not authorized as an admin");
          setVerified(false);
        }
      } catch (err) {
        console.error(err);
        if (toastId.current) toast.dismiss(toastId.current);
        toast.error("Failed to verify admin role");
        setVerified(false);
      }
    });

    return () => {
      clearTimeout(timeoutRef.current);
      if (toastId.current) toast.dismiss(toastId.current);
      unsubscribe();
    };
  }, []);

  if (verified === undefined) return null;

  if (verified === false) return <Navigate to="/home" replace />;

  return children;
};

export default RoleProtectedRoute;
