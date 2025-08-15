import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import SurveyForm from "./SurveyForm.tsx";
import Header from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-full">
      <Header />
      <SurveyForm />
    </div>
  </StrictMode>
);
