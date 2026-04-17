import data from "../Data.js";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 pb-28">
      <div className="mb-10">
  <h1 className="text-3xl md:text-5xl font-bold leading-tight">
  SAP ABAP Troubleshooting Specialist
</h1>

<p className="text-base md:text-lg text-gray-400">
  Fixing critical SAP issues, optimizing performance, and restoring business operations
</p>

<p className="mt-2 text-blue-400 font-medium">
  Real-world SAP issue resolution with measurable impact
</p>

{/* ✅ TAMBAHAN BARU (CTA BUTTON) */}
<div className="mt-4 flex gap-3">
  <button
  onClick={() => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  }}
  className="bg-blue-600 px-5 py-3 text-base md:text-lg rounded-lg hover:bg-blue-500 transition"
>
  Contact Me
</button>

</div>

</div>

<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 text-sm text-gray-400">
  <span>✔ 5+ Real SAP Cases</span>
  <span>✔ Performance Optimization Expert</span>
  <span>✔ WM / ALV / BAPI Specialist</span>
</div>

{/* IMPACT SUMMARY */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <p className="text-gray-400 text-sm">Total Cases</p>
    <p className="text-3xl font-bold">5</p>
  </div>

  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <p className="text-yellow-400">Advanced Cases</p>
    <p className="text-2xl font-bold text-yellow-400">3</p>
  </div>

  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <p className="text-green-400">Performance Improved</p>
    <p className="text-2xl font-bold text-green-400">~90%</p>
  </div>

  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <p className="text-red-400">Issues Fixed</p>
    <p className="text-2xl font-bold text-red-400">3+</p>
  </div>
</div>

{/* EXPERTISE */}
<div className="mb-10">
  <h2 className="text-xl font-bold mb-4">Core Expertise</h2>

  <div className="flex flex-wrap gap-3">
    {["SAP WM", "ALV", "BAPI", "IDoc", "Performance Tuning"].map((skill) => (
      <span
        key={skill}
        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
      >
        {skill}
      </span>
    ))}
  </div>
</div>

      {/* LIST CASE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((item) => (
          <div
            key={item.slug}
            className={`bg-gray-800 border rounded-2xl p-5
  ${item.slug === "lt06-lt04-issue"
    ? "border-blue-500 ring-2 ring-blue-500/20"
    : "border-gray-700"}
  hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10
  transition duration-300`}
          >
            <p className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">{item.category}</p>

            <div className="mt-2">
  <h2 className="font-semibold text-lg">
    {item.title}
  </h2>

  <p className="text-sm text-gray-400 mt-1">
    {item.impact}
  </p>

  {item.difficulty && (
    <span
      className={`inline-block mt-2 text-xs px-2 py-1 rounded-md ${
        item.difficulty === "Advanced"
          ? "bg-red-500/20 text-red-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      {item.difficulty}
    </span>
  )}
</div>
            
            <Link to={`/case/${item.slug}`}>
              <button className="mt-4 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded-md transition">
                View Case
              </button>
            </Link>

            

          </div>
        ))}
      </div>


    {/* CTA */}
<div id="contact" className="mt-10 text-center">
<div className="mt-16 text-center">
  <h2 className="text-xl font-bold mb-2">
    Need SAP Troubleshooting Support?
  </h2>

  <p className="text-gray-400 mb-4">
    Open for freelance / consulting opportunities
  </p>

  <div className="flex flex-col sm:flex-row justify-center gap-3">
    <a
  href="https://wa.me/6287781507123"
  target="_blank"
  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md"
>
  💬 WhatsApp Me
</a>

    <a
      href="https://www.linkedin.com/in/andy-w-a33233a0/"
      className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800"
    >
      🔗 LinkedIn
    </a>

    <a
      href="mailto:8andyw8@gmail.com"
      className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800"
    >
      💼 Hire Me
    </a>

  </div>
</div>
</div>


    </div>

  );
}