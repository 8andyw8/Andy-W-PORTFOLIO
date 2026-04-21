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
    if (!data.user) window.location.href = "/";
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
      setCaseData({ ...caseData, ...safeData });
      setIsEditingCase(false);
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete image?")) return;

    await supabase.from("case_images").delete().eq("id", id);

    setImages((prev) => prev.filter((img) => img.id !== id));
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

        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Home
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{caseData.title}</h1>
            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
              {caseData.category}
            </span>
          </div>

          {role === "admin" && (
            <button
              onClick={() => setIsEditingCase(!isEditingCase)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {isEditingCase ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {/* CODE */}
        <div className="mt-6 bg-white p-4 rounded">
          <div className="flex justify-between">
            <h3>Code Snippet</h3>
            <button onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {isEditingCase ? (
            <textarea
              value={form.codeSnippet || ""}
              onChange={(e) =>
                setForm({ ...form, codeSnippet: e.target.value })
              }
              className="w-full border p-2 mt-2 font-mono"
            />
          ) : (
            <pre className="bg-gray-100 p-2 mt-2">
              {caseData.codeSnippet}
            </pre>
          )}
        </div>

        {/* UPLOAD */}
        {role === "admin" && (
          <ImageUploader
            caseId={caseData.id}
            onUpload={(newImages) =>
              setImages((prev) => [...prev, ...newImages])
            }
          />
        )}

        {/* IMAGES */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white p-2 rounded">
              <img
                src={img.image_url}
                className="rounded w-full"
                onClick={() => setSelectedImage(img.image_url)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Image+Error";
                }}
              />

              <button
                onClick={() => handleDelete(img.id)}
                className="text-red-500 text-xs mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center"
          >
            <img src={selectedImage} className="max-h-[90%]" />
          </div>
        )}
      </div>
    </div>
  );
}