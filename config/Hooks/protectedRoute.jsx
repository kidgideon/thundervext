import { useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const toastId = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Delay loader to prevent flicker
    timeoutRef.current = setTimeout(() => {
      if (user === undefined && loading) {
        toastId.current = toast.loading("Verifying access...");
      }
    }, 300); // adjust delay to control loader sensitivity

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Cleanup loader and timeout
      clearTimeout(timeoutRef.current);
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      if (currentUser) {
        toast.success("Access verified ✅");
      }

      setUser(currentUser || null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutRef.current);
      if (toastId.current) toast.dismiss(toastId.current);
      unsubscribe();
    };
  }, []);

  if (loading || user === undefined) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
