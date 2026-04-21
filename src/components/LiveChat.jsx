import { useEffect } from "react";

export default function LiveChat() {

  useEffect(() => {

    // ❌ kalau sudah ada → jangan inject lagi
    if (document.getElementById("tawk-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;

    // 🔥 PENTING: pakai ID kamu yang asli
    s1.src = "https://embed.tawk.to/69e242fc3f1c4b1c322b456c/1jmdtbb3c";

    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    document.body.appendChild(s1);

    // 🧹 CLEANUP saat logout / unmount
    return () => {
      const existing = document.getElementById("tawk-script");
      if (existing) existing.remove();

      // reset API
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
      }
    };

  }, []);

  return null;
}