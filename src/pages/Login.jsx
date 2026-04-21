import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔒 CHECK USER (TANPA LOOP)
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      navigate("/", { replace: true }); // ✅ pakai navigate, bukan window.location
    }

    setLoading(false);
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    navigate("/", { replace: true });
  };

  // 🆕 REGISTER
  const handleRegister = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // ✅ insert role viewer
    if (data.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: "viewer"
        }
      ]);
    }

    alert("Register success! Silakan login.");

    setIsLogin(true);
    setLoading(false);
  };

  if (loading) return null; // ❗ penting: cegah flicker & loop

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-lg">

        <h2 className="text-white text-xl mb-4 font-semibold">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-200"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-200"
        />

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading
            ? "Loading..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 ml-2 cursor-pointer"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}