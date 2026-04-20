const data = [
  {
    slug: "lt06-lt04-issue",
    category: "WM",
    title: "LT06 becomes LT04 after Save",
    problem: "User executes LT06 but system redirects to LT04 after saving",
    rootCause: "SY-TCODE overwritten during process, causing incorrect transaction flow",
    solution: "Added condition handling in ZRLVSDR40 to preserve correct transaction",
    difficulty: "Advanced",
    impact: "Warehouse operations restored, no incorrect transaction triggered",
    
    metrics: {
      riskReduction: "High",
      manualEffortReduced: "Yes",
      incidentsPrevented: "Recurring issue eliminated",
    },

    before: "sy-tcode berubah otomatis ke LT04",
    after: "Original tcode berhasil dipertahankan",

    codeSnippet: `IF sy-tcode = 'LT06'.
  gv_tcode = sy-tcode.
ENDIF.`,

    images: [
      {
        src: "/images/RLLB1200.png",
        note: "Enhancement point untuk intercept flow",
      },
      {
        src: "/images/ZRLVSDR40.png",
        note: "Logic custom untuk handle tcode",
      },
      {
        src: "/images/ZRLVSDR40_2.png",
        note: "Validasi setelah save",
      },
      {
        src: "/images/ML02BFFC.png",
        note: "Lokasi final enhancement sy-tcode",
      },
    ],

    rootCause:
      "Standard SAP overwrite sy-tcode setelah TO creation tanpa mempertahankan context awal",

    solutionDetail:
      "Menambahkan enhancement untuk menyimpan nilai sy-tcode sebelum overwrite terjadi",

    seoTitle: "LT06 becomes LT04 after Save - SAP WM Solution",
    seoDescription: "Fix SAP WM issue where LT06 changes to LT04 after save using ABAP enhancement"

  },

  {
  slug: "alv-refresh",
  title: "ALV Not Refresh After Data Change",
  category: "ALV",
},
{
  slug: "bapi-commit",
  title: "BAPI Not Commit Data",
  category: "BAPI",
},

{
  slug: "bapi-commit2",
  title: "BAPI Not Commit Data 2",
  category: "BAPI",
},
{
  slug: "bapi-commit3",
  title: "BAPI Not Commit Data 3",
  category: "BAPI",
},

{
  slug: "bapi-commit4",
  title: "BAPI Not Commit Data 4",
  category: "BAPI",
},

{
  slug: "bapi-commit5",
  title: "BAPI Not Commit Data 5",
  category: "BAPI",
},

{
  slug: "bapi-commit6",
  title: "BAPI Not Commit Data 6",
  category: "BAPI",
}



];

export default data;