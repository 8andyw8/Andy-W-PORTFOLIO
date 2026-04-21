import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import LiveChat from "../components/LiveChat";

export default function Home() {
  const [cases, setCases] = useState([]);
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // FORM STATE
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newCase, setNewCase] = useState({
    title: "",
    category: "",
    impact: ""
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    await fetchUser();
    await fetchRole();
    await fetchData();
    setLoading(false);
  };

  // 👤 GET LOGIN USER
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUserEmail(data.user.email);
    }
  };

  // 🔐 GET ROLE
  const fetchRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    setRole(data?.role || "viewer");
  };

  // 📄 FETCH DATA
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCases(data || []);
  };

  // 🔥 GENERATE SLUG (ANTI DUPLICATE)
  const generateSlug = async (title) => {
    let base = title.toLowerCase().replace(/\s+/g, "-");
    let slug = base;
    let i = 1;

    while (true) {
      const { data } = await supabase
        .from("cases")
        .select("id")
        .eq("slug", slug);

      if (!data || data.length === 0) break;
      slug = `${base}-${i}`;
      i++;
    }

    return slug;
  };

  // 🔥 CREATE CASE
  const handleCreate = async () => {
    if (!newCase.title) return alert("Title wajib diisi");

    setSaving(true);

    try {
      const slug = await generateSlug(newCase.title);

      const { data, error } = await supabase
        .from("cases")
        .insert([{ ...newCase, slug }])
        .select();

      if (error) {
        alert(error.message);
        return;
      }

      // langsung update UI tanpa fetch ulang
      setCases((prev) => [...data, ...prev]);

      handleCancel();
    } finally {
      setSaving(false);
    }
  };

  // ❌ CANCEL FORM
  const handleCancel = () => {
    setShowForm(false);
    setNewCase({ title: "", category: "", impact: "" });
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-40">

      {/* ================= HEADER ================= */}
      {/* ❗ SEKARANG HEADER HANYA UNTUK INFO + LOGOUT */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">
            SAP ABAP Troubleshooting Specialist
          </h1>
          <p className="text-gray-500">
            Fixing critical SAP issues, optimizing performance
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Login as: {userEmail}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Total Cases</p>
          <p className="text-2xl font-bold">{cases.length}</p>
        </div>

        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Advanced Cases</p>
          <p className="text-2xl font-bold">
            {cases.filter(c => c.difficulty === "Advanced").length}
          </p>
        </div>
      </div>

      {/* ================= LIST HEADER ================= */}
      {/* ✅ INI TEMPAT YANG BENAR UNTUK ADD CASE */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cases</h2>

        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Case
          </button>
        )}
      </div>

      {/* ================= FORM ================= */}
      {/* muncul tepat di bawah tombol add case */}
      {showForm && (
        <div className="bg-white border p-5 rounded-xl mb-8 shadow-sm space-y-3">

          <input
            placeholder="Title"
            value={newCase.title}
            onChange={(e) =>
              setNewCase({ ...newCase, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <input
            placeholder="Category"
            value={newCase.category}
            onChange={(e) =>
              setNewCase({ ...newCase, category: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Impact"
            value={newCase.impact}
            onChange={(e) =>
              setNewCase({ ...newCase, impact: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          {/* ACTION BUTTON */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= LIST ================= */}
      {cases.length === 0 ? (
        <p className="text-gray-400">Belum ada case...</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div key={item.id} className="bg-white border p-4 rounded-xl shadow-sm">
              <p className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded inline-block">
                {item.category}
              </p>

              <h2 className="mt-2 font-semibold">{item.title}</h2>

              <p className="text-sm text-gray-500 mt-1">
                {item.impact}
              </p>

              <Link to={`/case/${item.slug}`}>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                  View Case
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

{/* ================= CTA / FOOTER ================= */}
{/* CTA */} 
<div id="contact" className="mt-16 text-center"> 
  <h2 className="text-xl font-bold mb-2"> Need SAP Troubleshooting Support? </h2> 
  <p className="text-gray-400 mb-4"> Open for freelance / consulting opportunities </p> 
  <div className="flex flex-col sm:flex-row justify-center gap-3"> 
    <a href="https://wa.me/6287781507123" target="_blank" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md" > 
    💬 WhatsApp Me </a> 
    
    <a href="https://www.linkedin.com/in/andy-w-a33233a0/" className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800" >
     🔗 LinkedIn </a> 
     
     <a href="mailto:8andyw8@gmail.com" className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800" > 
      💼 Hire Me </a> 
      </div> 
    </div>

    </div>
  );
}