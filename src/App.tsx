import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SurveyApp from "./SurveyApp";
import { useSurveyFetch } from "./hooks/useSurveyFetch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import SurveyCompletion from "./SurveyCompletion";
import { StatusMessage } from "./components/StatusMessage";
import { messages, type Lang } from "./utils/messages";
// import { FormProvider, useForm } from "react-hook-form";

export default function App() {
  const { data: surveyData, loading, error } = useSurveyFetch();
  const lang: Lang = "am"; // or from context / settings
  if (loading)
    return (
      <StatusMessage
        type="loading"
        title={messages.loading[lang].title}
        description={messages.loading[lang].description}
        imageSrc="/Processing-bro.svg"
      />
    );
  if (error)
    return (
      <StatusMessage
        type="error"
        title={messages.error[lang].title}
        description={messages.error[lang].description}
        actionLabel={messages.error[lang].action}
        onAction={() => window.location.reload()}
        imageSrc="/Bug fixing-bro.svg"
      />
    );
  if (!surveyData || !Array.isArray(surveyData) || surveyData.length == 0)
    return (
      <StatusMessage
        type="empty"
        title={messages.empty[lang].title}
        description={messages.empty[lang].description}
        imageSrc="/Empty street-bro.svg"
      />
    );
  return (
    <Router>
      <Routes>
        {/* Homepage: list of available surveys */}
        <Route
          path="/"
          element={
            <div className="bg-brandGreen-200 min-h-screen flex flex-col items-center p-6 relative">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/bg.png')" }}
              />

              {/* <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-8 z-10 relative text-center">
                የሚገኙ የዳሰሳ ጥናቶች
              </h1> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl z-10 relative">
                {surveyData.length === 0 && (
                  <p className="text-white text-xl font-semibold col-span-full text-center">
                    ምንም የዳሰሳ ጥናት አልተገኘም
                  </p>
                )}

                {surveyData.map((survey) => (
                  <div
                    key={survey.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
                  >
                    {/* Logo */}
                    <img
                      src="/eeu_logo.png"
                      alt="EEU Logo"
                      className="h-16 md:h-20 mb-4 object-contain"
                    />

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-700 mb-3">
                      {survey.metadata?.title || "የዳሰሳ ጥናት"}
                    </h2>

                    {/* Short description / instructions */}
                    <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">
                      {survey.metadata?.instructions ||
                        "ይህ የዳሰሳ ጥናት በEEU ተሰጥቷል። መጀመር ከፈቃድዎ በኋላ ይቻላል።"}
                    </p>

                    {/* Start Survey Button */}
                    <Link
                      to={`/${survey.id}`}
                      className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md w-full transition-colors"
                    >
                      ይጀምሩ
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* Survey page */}
        <Route path="/:id" element={<SurveyApp />} />

        {/* Completion page */}
        <Route path="/completion" element={<SurveyCompletion />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
