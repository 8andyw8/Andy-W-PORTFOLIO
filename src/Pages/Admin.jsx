import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ImageUploader from "../components/ImageUploader";

export default function Admin() {
  const [cases, setCases] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const { data } = await supabase.from("cases").select("*");
    setCases(data);
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from("cases")
        .update({ title, description })
        .eq("id", editingId);
    } else {
      await supabase.from("cases").insert([{ title, description }]);
    }

    setTitle("");
    setDescription("");
    setEditingId(null);
    fetchCases();
  };

  const handleEdit = (c) => {
    setTitle(c.title);
    setDescription(c.description);
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    await supabase.from("cases").delete().eq("id", id);
    fetchCases();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Panel</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mr-2"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 mr-2"
        />

        <button className="bg-green-500 text-white p-2">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* LIST */}
      {cases.map((c) => (
        <div key={c.id} className="border p-4 mb-4">
          <h2 className="text-lg">{c.title}</h2>
          <p>{c.description}</p>

          <div className="mt-2 space-x-2">
            <button
              onClick={() => handleEdit(c)}
              className="bg-yellow-500 text-white px-2"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(c.id)}
              className="bg-red-500 text-white px-2"
            >
              Delete
            </button>
          </div>

          {/* ✅ Upload Multiple Images */}
          <div className="mt-4">
            <ImageUploader caseId={c.id} />
          </div>
        </div>
      ))}
    </div>
  );
}