import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CaseDetail from "./Pages/CaseDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case/:slug" element={<CaseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}