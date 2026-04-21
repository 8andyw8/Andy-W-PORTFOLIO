import { supabase } from "../supabase";

export default function ImageUploader({ caseId, onUpload }) {
  const uploadImages = async (e) => {
    const files = e.target.files;

    for (let file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      console.log("UPLOAD FILE:", fileName);

      // 1. Upload ke storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cases")
        .upload(fileName, file);

      console.log("UPLOAD RESULT:", uploadData);
      console.log("UPLOAD ERROR:", uploadError);

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError.message);
        continue;
      }

      // 2. Ambil public URL
      const { data: publicUrlData } = supabase.storage
        .from("cases")
        .getPublicUrl(fileName);

      console.log("PUBLIC URL:", publicUrlData.publicUrl);

      // 3. Test fetch langsung (SUPER PENTING)
      try {
        const test = await fetch(publicUrlData.publicUrl);
        console.log("FETCH STATUS:", test.status);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }

      // 4. Simpan ke DB
      const { data: insertedData, error: insertError } = await supabase
        .from("case_images")
        .insert([
          {
            case_id: caseId,
            image_url: publicUrlData.publicUrl,
          },
        ])
        .select()
        .single();

      console.log("INSERT DATA:", insertedData);
      console.log("INSERT ERROR:", insertError);

      if (insertError) {
        console.error("INSERT ERROR:", insertError.message);
        continue;
      }

      if (onUpload) {
        onUpload();
      }
    }

    alert("Upload selesai");
  };

  return (
    <input
      type="file"
      multiple
      onChange={uploadImages}
      className="border p-2"
    />
  );
}