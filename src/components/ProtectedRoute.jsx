import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ProtectedRoute({ children, roleRequired }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    // ambil role dari table profiles
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === roleRequired) {
      setAllowed(true);
    } else {
      setAllowed(false);
    }

    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  if (!allowed) return <Navigate to="/login" />;

  return children;
}