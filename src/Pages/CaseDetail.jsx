import { useParams } from "react-router-dom";
import data from "../Data.js";

export default function CaseDetail() {
  const { slug } = useParams();

  const selected = data.find((item) => item.slug === slug);

  if (!selected) return <div className="p-6">Case not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-200">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">{selected.title}</h1>

      <p className="mt-2 inline-block text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md">
  {selected.category}
</p>

      {/* IMPACT */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
<h2 className="font-bold text-lg">📈 Impact</h2>
<p className="text-gray-300 mt-2">{selected.impact}</p>
      </div>

    {/* PROBLEM */}
<div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
  <h2 className="font-bold text-lg">🚨 Problem</h2>
  <p className="text-gray-300">{selected.problem}</p>
</div>

{/* SOLUTION */}
<div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
  <h2 className="font-bold text-lg">🛠 Solution</h2>
  <p className="text-gray-300">{selected.solution}</p>
</div>

      {/* ROOT CAUSE */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
<h2 className="font-bold text-lg">🧠 Root Cause</h2>
<p className="text-gray-300">{selected.rootCause}</p>
      </div>

      {/* BEFORE AFTER */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-red-900/40 border border-red-700 p-4 rounded-xl">
          <h3 className="font-bold text-red-400">Before</h3>
          <p className="text-gray-200 mt-2">{selected.before}</p>
        </div>

        <div className="bg-green-900/40 border border-green-700 p-4 rounded-xl">
          <h3 className="font-bold text-green-400">After</h3>
          <p className="text-gray-200 mt-2">{selected.after}</p>
        </div>
      </div>

      {/* IMAGES */}
      {selected.images && (
        <div className="mt-8">
    <h2 className="font-bold text-lg mb-3">Debug / Flow</h2>

    <div className="grid md:grid-cols-2 gap-4">
            {selected.images.map((img, index) => (
              <div key={index}>
                <img
                  src={img.src}
                  alt={`debug-${index}`}
                  onClick={() => window.open(img.src, "_blank")}
                  className="rounded-xl border border-gray-700"
                />

                {img.note && (
                  <p className="text-sm text-gray-400 mt-1">
                    {img.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CODE */}
      <div className="mt-6">
        <h2 className="font-bold">Code Snippet</h2>

        <pre className="bg-black p-4 rounded text-green-400 overflow-auto">
          {selected.codeSnippet}
        </pre>
      </div>
    </div>
  );
}