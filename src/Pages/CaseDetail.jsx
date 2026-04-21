import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ImageUploader from "../components/ImageUploader";

export default function CaseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(true);

  const [caseData, setCaseData] = useState(null);
  const [images, setImages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState("");
  const [saving, setSaving] = useState(false);

  const [isEditingCase, setIsEditingCase] = useState(false);
  const [form, setForm] = useState({});

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    init();
  }, [slug]);

  const init = async () => {
    setLoading(true);
    await checkAuth();
    await fetchRole();
    await fetchCase();
    setLoading(false);
  };

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) window.location.href = "/login";
  };

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

  const fetchCase = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      setCaseData(null);
      return;
    }

    setCaseData(data);
    setForm(data);

    const { data: imgData } = await supabase
      .from("case_images")
      .select("*")
      .eq("case_id", data.id)
      .order("created_at", { ascending: true });

    setImages(imgData || []);
  };

  const handleSaveCase = async () => {
    setSaving(true);

    const { slug, id, ...safeData } = form;

    const { error } = await supabase
      .from("cases")
      .update(safeData)
      .eq("id", caseData.id);

    if (!error) {
      await fetchCase();
      setIsEditingCase(false);
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete image?")) return;
    await supabase.from("case_images").delete().eq("id", id);
    await fetchCase();
  };

  const saveNote = async (id) => {
    await supabase
      .from("case_images")
      .update({ note: editingNote })
      .eq("id", id);

    await fetchCase();
    setEditingId(null);
    setEditingNote("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caseData.codeSnippet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!caseData) return <div className="p-6">Case not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto p-6 pb-20">

        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Home
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div className="w-full">
            {isEditingCase ? (
              <input
                value={form.title || ""}
                disabled
                className="text-3xl font-bold bg-white border p-2 rounded w-full"
              />
            ) : (
              <h1 className="text-3xl font-bold">{caseData.title}</h1>
            )}

            <div className="mt-2">
              {isEditingCase ? (
                <input
                  value={form.category || ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="bg-white border p-2 rounded"
                />
              ) : (
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded">
                  {caseData.category}
                </span>
              )}
            </div>
          </div>

          {role === "admin" && (
            <div className="flex gap-2">
              {isEditingCase ? (
                <>
                  <button
                    onClick={handleSaveCase}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditingCase(false)}
                    className="bg-gray-400 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingCase(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-8 space-y-5">

          {[
            { key: "impact", label: "Impact" },
            { key: "problem", label: "Problem" },
            { key: "rootCause", label: "Root Cause" },
            { key: "solution", label: "Solution" },
            { key: "before", label: "Before", color: "red" },
            { key: "after", label: "After", color: "green" }
          ].map((f) => {
            const value = caseData[f.key];
            if (!value && !isEditingCase) return null;

            return (
              <div
                key={f.key}
                className={`p-4 rounded-xl border bg-white ${
                  f.color === "red"
                    ? "border-red-300"
                    : f.color === "green"
                    ? "border-green-300"
                    : "border-gray-200"
                }`}
              >
                <h3 className="font-semibold mb-1">{f.label}</h3>

                {isEditingCase ? (
                  <textarea
                    value={form[f.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {value}
                  </p>
                )}
              </div>
            );
          })}

          {/* CODE SNIPPET */}
          {caseData.codeSnippet && (
            <div className="bg-white border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Code Snippet</h3>
                <button
                  onClick={handleCopy}
                  className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                <code>{caseData.codeSnippet}</code>
              </pre>
            </div>
          )}

        </div>

        {/* UPLOADER */}
        {role === "admin" && (
          <div className="mt-6">
            <ImageUploader caseId={caseData.id} onUpload={fetchCase} />
          </div>
        )}

        {/* IMAGES */}
        {images.length > 0 && (
          <div className="mt-10">
            <h2 className="font-semibold text-lg mb-4">Debug / Flow</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {images.map((img) => (
                <div key={img.id} className="bg-white border p-3 rounded-xl">

                  <img
                    src={img.image_url}
                    onClick={() => setSelectedImage(img.image_url)}
                    className="rounded cursor-pointer"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    {img.note || "-"}
                  </p>

                  {role === "admin" && (
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="text-xs text-red-500 mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          >
            <img
              src={selectedImage}
              className="max-h-[90%] rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}