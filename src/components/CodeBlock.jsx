import { useState } from "react";

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative bg-gray-900 text-green-300 rounded-xl p-4 overflow-auto">
      
      {/* COPY BUTTON */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="text-sm whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}