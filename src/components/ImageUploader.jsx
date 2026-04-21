import { useState } from "react";
import { supabase } from "../supabase";

export default function ImageUploader({ caseId, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let file of files) {
        const fileName = `${Date.now()}-${file.name}`;

        // 1. Upload ke storage
        const { error: uploadError } = await supabase.storage
          .from("cases")
          .upload(fileName, file);

        if (uploadError) {
          console.error("UPLOAD ERROR:", uploadError.message);
          continue;
        }

        // 2. Ambil public URL
        const { data: publicUrlData } = supabase.storage
          .from("cases")
          .getPublicUrl(fileName);

        // 3. Simpan ke DB
        const { error: insertError } = await supabase
          .from("case_images")
          .insert([
            {
              case_id: caseId,
              image_url: publicUrlData.publicUrl,
            },
          ]);

        if (insertError) {
          console.error("INSERT ERROR:", insertError.message);
          continue;
        }
      }

      // 🔥 PENTING: panggil SEKALI setelah semua upload selesai
      if (onUpload) {
        await onUpload();
      }

      alert("Upload selesai");
    } catch (err) {
      console.error("UNEXPECTED ERROR:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={uploadImages}
        disabled={uploading}
        className="border p-2 rounded"
      />

      {uploading && (
        <p className="text-sm text-gray-500 mt-2">Uploading...</p>
      )}
    </div>
  );
}