import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CaseDetail from "./pages/CaseDetail";

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