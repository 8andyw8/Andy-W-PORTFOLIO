import { supabase } from "../supabase";

export default function ImageUploader({ caseId, onUpload }) {
  const uploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedImages = [];

    for (let file of files) {
      try {
        const filePath = `${caseId}/${Date.now()}-${file.name}`;

        // 🔥 Upload
        const { error: uploadError } = await supabase.storage
          .from("cases")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 🔥 Get URL
        const { data } = supabase.storage
          .from("cases")
          .getPublicUrl(filePath);

        const finalUrl = `${data.publicUrl}?t=${Date.now()}`;

        // 🔥 Insert DB
        const { data: inserted, error: insertError } = await supabase
          .from("case_images")
          .insert([
            {
              case_id: caseId,
              image_url: finalUrl,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        uploadedImages.push(inserted);
      } catch (err) {
        console.error("UPLOAD FLOW ERROR:", err.message);
      }
    }

    // 🔥 SAFE UPDATE
    if (uploadedImages.length > 0 && onUpload) {
      onUpload(uploadedImages);
    }

    // reset input biar bisa upload file sama lagi
    e.target.value = "";

    alert("Upload selesai");
  };

  return (
    <input
      type="file"
      multiple
      onChange={uploadImages}
      className="border p-2 rounded"
    />
  );
}