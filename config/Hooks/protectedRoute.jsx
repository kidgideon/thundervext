import { useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const toastId = useRef(null);

  useEffect(() => {
   

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (toastId.current) toast.dismiss(toastId.current);

      if (currentUser) {
        toast.success("Access verified ✅");
      }

      setUser(currentUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || user === undefined) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
