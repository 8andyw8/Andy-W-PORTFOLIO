import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const getBadgeColor = (level) => {
  if (level === "Beginner") return "text-green-500";
  if (level === "Intermediate") return "text-yellow-500";
  return "text-red-500";
};

const data = [
  {
    category: "WM",
    title: "LT06 becomes LT04 after Save",
    difficulty: "Advanced",
    impact: "Prevent warehouse process inconsistency & incorrect transaction flow",
    metrics: {
      riskReduction: "High",
      manualEffortReduced: "Yes",
      incidentsPrevented: "Recurring issue eliminated",
    },
    story: `Saat proses warehouse, user melaporkan transaksi berubah dari LT06 ke LT04 setelah save. Ini berisiko mengganggu flow operasional. Saya analisa flow SAP standard dan menemukan perubahan tcode terjadi setelah TO creation. Solusi: simpan context awal dan validasi via enhancement. Hasil: flow kembali stabil tanpa intervensi manual.`,
    before: "sy-tcode berubah otomatis ke LT04",
    after: "Original tcode berhasil dipertahankan",
    content: `IF sy-tcode = 'LT06'.\n  gv_tcode = sy-tcode.\nENDIF.`,
  },
  {
    category: "ALV",
    title: "ALV Not Refresh After Data Change",
    difficulty: "Intermediate",
    impact: "Ensure real-time data visibility for users",
    metrics: {
      performanceGain: "Real-time update",
      userEfficiency: "Improved",
    },
    story: `User bingung karena data ALV tidak berubah setelah update. Root cause: tidak ada refresh method dipanggil. Setelah implement refresh_table_display, user langsung lihat perubahan tanpa reload program.`,
    before: "Data tidak update",
    after: "ALV refresh otomatis",
    content: `CALL METHOD gr_alv->refresh_table_display.`,
  },
  {
    category: "BAPI",
    title: "BAPI Not Commit Data",
    difficulty: "Intermediate",
    impact: "Prevent data inconsistency in database",
    metrics: {
      dataIntegrity: "Secured",
      failureRate: "Reduced to 0%",
    },
    story: `BAPI berhasil dipanggil tapi data tidak tersimpan. Setelah tracing, ternyata tidak ada COMMIT. Dengan menambahkan BAPI_TRANSACTION_COMMIT, data tersimpan konsisten.`,
    before: "Data tidak tersimpan",
    after: "Data berhasil commit",
    content: `CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = 'X'.`,
  },
  {
    category: "Performance",
    title: "SELECT inside LOOP Issue",
    difficulty: "Advanced",
    impact: "Reduce runtime drastically (minutes → seconds)",
    metrics: {
      runtimeImprovement: "~90% faster",
      scalability: "Improved",
    },
    story: `Program report berjalan sangat lambat. Ditemukan SELECT di dalam LOOP. Saya refactor menggunakan JOIN/FOR ALL ENTRIES. Hasilnya runtime turun drastis.`,
    before: "Program sangat lambat",
    after: "Query optimal dengan JOIN/FAE",
    content: `Gunakan FOR ALL ENTRIES atau JOIN`,
  },
  {
    category: "IDoc",
    title: "IDoc Stuck in Status 51",
    difficulty: "Advanced",
    impact: "Restore failed integration & prevent business disruption",
    metrics: {
      incidentsResolved: "Critical",
      automation: "Restored",
    },
    story: `IDoc gagal (status 51) menyebabkan integrasi terhenti. Saya cek WE02, debug FM inbound, dan perbaiki mapping. Setelah fix, IDoc kembali auto process tanpa manual re-run.`,
    before: "IDoc error manual reprocess",
    after: "Auto processing normal",
    content: `Check WE02 + debug FM inbound`,
  },
];

// Metrics Summary
const totalCases = data.length;
const advancedCases = data.filter(d => d.difficulty === "Advanced").length;
const categories = [...new Set(data.map(d => d.category))];
const categoryCount = data.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

export default function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const categoryColor = {
    WM: "bg-blue-400",
    ALV: "bg-green-400",
    BAPI: "bg-yellow-400",
    Performance: "bg-purple-400",
    IDoc: "bg-pink-400",
  };
  const categoryStyle = {
    WM: "border-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    ALV: "border-green-400 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    BAPI: "border-yellow-400 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    Performance: "border-purple-400 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    IDoc: "border-pink-400 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  };


  const filtered = data.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory ? item.category === activeCategory : true;
  
    return matchSearch && matchCategory;
  });

  if (selected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white">
        <Button onClick={() => setSelected(null)}>⬅ Back</Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold mt-4">{selected.title}</h1>

          <p className={`mt-2 font-semibold ${getBadgeColor(selected.difficulty)}`}>
            {selected.difficulty}
          </p>

          <div className="mt-4 bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow">
            <h3 className="font-bold">💼 Business Impact</h3>
            <p>{selected.impact}</p>
          </div>

          <div className="mt-4 bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow">
            <h3 className="font-bold">📊 Impact Metrics</h3>
            <ul className="list-disc ml-6">
              {Object.entries(selected.metrics || {}).map(([k, v], i) => (
                <li key={i}><strong>{k}:</strong> {v}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 bg-gray-800 border border-blue-500/30 p-4 rounded-xl">
            <h3 className="font-bold">🧠 Story</h3>
            <p>{selected.story}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-xl">
              <h3 className="font-bold">❌ Before</h3>
              <p>{selected.before}</p>
            </div>

            <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-xl">
              <h3 className="font-bold">✅ After</h3>
              <p>{selected.after}</p>
            </div>
          </div>

          <pre className="bg-gray-900 text-green-400 p-4 mt-6 rounded-xl">
            {selected.content}
          </pre>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
      >
        SAP ABAP Experience Hub
      </motion.h1>

      <p className="mb-6 text-gray-300">
        Real-world SAP troubleshooting portfolio with measurable impact
      </p>

      <p className="mb-6 text-blue-300 text-lg">
        🚀 Delivered measurable impact: performance ↑90%, critical issues resolved, automation restored
      </p>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="rounded-2xl bg-gray-800 text-white border border-gray-700 shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <h3 className="text-sm">Total Cases</h3>
            <p className="text-2xl font-bold">{totalCases}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gray-800 text-white border border-gray-700 shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <h3 className="text-sm">Advanced Cases</h3>
            <p className="text-2xl font-bold">{advancedCases}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gray-800 text-white border border-gray-700 shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
          <h3 className="text-sm">Case Distribution</h3>
          <p className="text-xs text-gray-400 mt-1 mb-2">
          Hands-on experience across SAP WM, ALV, BAPI & integration scenarios
</p>

<div className="space-y-3 mt-4 hover:scale-[1.02]" >
  {Object.entries(categoryCount).map(([cat, count]) => {
  const isActive = activeCategory === cat;

  return (
    <div
      key={cat}
      onClick={() => setActiveCategory(isActive ? null : cat)}
      className={`flex justify-between cursor-pointer transition-all duration-200 hover:text-blue-400 ${
        isActive ? "text-blue-400 font-semibold" : "text-gray-300"
      }`}
    >
      <span className="flex items-center gap-2">
      <span
  className={`w-2 h-2 rounded-full ${
    activeCategory === cat
      ? categoryColor[cat]
      : "bg-gray-500"
  }`}
/>
  {cat}
</span>
      <span className="text-sm">
        {cat === "WM" && "Deep troubleshooting"}
        {cat === "ALV" && "UI optimization"}
        {cat === "BAPI" && "Transaction integrity"}
        {cat === "Performance" && "Runtime optimization"}
        {cat === "IDoc" && "Integration recovery"}
      </span>
    </div>
  );
})}
</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-gray-800 border border-gray-700 p-5 rounded-2xl shadow-lg">
    <p className="text-sm text-gray-400">Performance Improved</p>
    <p className="text-2xl font-bold text-green-400">~90%</p>
  </div>

  <div className="bg-gray-800 border border-gray-700 p-5 rounded-2xl shadow-lg">
    <p className="text-sm text-gray-400">Critical Issues Fixed</p>
    <p className="text-2xl font-bold text-red-400">3+</p>
  </div>

  <div className="bg-gray-800 border border-gray-700 p-5 rounded-2xl shadow-lg">
    <p className="text-sm text-gray-400">Automation Restored</p>
    <p className="text-2xl font-bold text-blue-400">IDoc / BAPI</p>
  </div>
</div>

{activeCategory && (
  <div className="mb-4 flex items-center gap-3">
    <span className="text-sm text-gray-400">
      Filtering by:
      <span className="text-blue-400 ml-1 font-semibold">
        {activeCategory}
      </span>
    </span>

    <button
  onClick={() => {
    setActiveCategory(null);
    setSearch("");
  }}
  className="ml-3 px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
>
  Clear Filter
</button>
  </div>
)}

      <Input
        placeholder="Search issues..."
        className="mb-6 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

<div className="mb-6 flex gap-3 flex-wrap">
  {Object.entries(categoryCount).map(([cat, count]) => {
    const isActive = activeCategory === cat;

    return (
      <span
        key={cat}
        onClick={() =>
          setActiveCategory(isActive ? null : cat)
        }
        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all
          ${
            isActive
              ? `${categoryColor[cat]} text-white border border-white/20 shadow-lg`
              : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
          }
        `}
      >
        <span className="flex items-center gap-2">
  <span
    className={`w-2 h-2 rounded-full ${
      categoryColor[cat] || "bg-gray-500"
    }`}
  />
  <span>{cat}</span>
  <span className="opacity-60">({count})</span>
</span>
      </span>
    );
  })}
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((item, index) => {
  const isActive = activeCategory === item.category;

  return (
          <motion.div key={index} whileHover={{ scale: 1.05 }}animate={{
            opacity: !activeCategory || isActive ? 1 : 0.35,
            scale: !activeCategory || isActive ? 1 : 0.97,
          }}
          transition={{ duration: 0.2 }}
        >
            <Card
  className={`
    rounded-2xl text-white transition
    ${isActive
      ? `${categoryStyle[item.category]} shadow-2xl`
      : "bg-gray-800 border border-gray-700 hover:shadow-2xl"}
  `}
>
              <CardContent className="p-4">
              <p className={`text-xs font-medium ${
  isActive ? "text-white" : "text-gray-400"
}`}>
  {item.category}
</p>
                <h2 className="text-lg font-semibold">{item.title}</h2>

                <p className={`text-sm ${getBadgeColor(item.difficulty)}`}>
                  {item.difficulty}
                </p>

                <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setSelected(item)}>
                  View Case
                </Button>
              </CardContent>
            </Card>
          </motion.div>
      )})}
      </div>


{filtered.length === 0 && (
  <div className="text-center mt-10">
    <p className="text-gray-400 text-lg">No cases found</p>
    <p className="text-gray-500 text-sm">Try a different keyword</p>
  </div>
)}
      <div className="mt-12 bg-gray-800 text-white border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-2">About Me</h2>
        <p>
          SAP ABAP Developer focused on solving high-impact business problems with measurable results.
        </p>
      </div>
    </div>
  );
}
