import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CaseDetail from "./pages/CaseDetail";
import LiveChat from "./components/LiveChat"; // ✅ NEW

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  return (
    <BrowserRouter>

      {/* ✅ CHAT hanya muncul kalau SUDAH LOGIN */}
      {user && <LiveChat />}

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED */}
        <Route path="/" element={user ? <Home /> : <Login />} />

        <Route
          path="/case/:slug"
          element={user ? <CaseDetail /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}