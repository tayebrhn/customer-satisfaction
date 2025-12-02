import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SurveyApp from "./SurveyApp";
import { useSurveyFetch } from "./hooks/useSurveyFetch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import SurveyCompletion from "./SurveyCompletion";
import { FormProvider, useForm } from "react-hook-form";

export default function App() {
  const { data: surveyData, loading, error } = useSurveyFetch();

  if (loading) return <p>Loading surveys...</p>;
  if (error)
    return (
      <p className="text-red-600">App::Error Loading Survey List: {error}</p>
    );
  if (!surveyData || !Array.isArray(surveyData) || surveyData.length == 0)
    return <p>No data found</p>;
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-brandGreen-200 min-h-screen flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/bg.png')" }}
              />
              {surveyData.map((survey) => (
                <div
                  key={survey.id}
                  className="bg-white z-10 shadow-md rounded-2xl p-6 md:p-10 border border-gray-100 max-w-3xl w-full"
                >
                  {/* Logo Area */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="eeu_logo.png"
                      alt="EEU Logo"
                      className="h-16 md:h-20 object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700 mb-8 pb-3 border-b border-gray-200 text-center">
                    {survey.metadata.title || "የዳሰሳ ጥናት መግቢያ"}
                  </h1>

                  {/* Instructions */}
                  <div className="text-gray-700 leading-relaxed space-y-5 mb-10">
                    <p className="font-semibold text-lg text-amber-500">
                      አስፈላጊ መረጃ እና ፈቃድ
                    </p>

                    <p>
                      ይህ የዳሰሳ ጥናት የሚቀርበው{" "}
                      <strong className="text-gray-900">
                        በኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU)
                      </strong>
                      ሲሆን፣ ዓላማውም በደንበኞች እርካታ ጥናት ዙሪያ ያለውን መረጃ ለመሰብሰብ ነው።
                    </p>

                    <p>
                      <strong className="text-gray-900">ፈቃድ:</strong> የዳሰሳ ጥናቱን
                      መመለስ መጀመርዎ በፈቃደኝነትዎ መሰረት የሚደረግ ሲሆን፣ ጥናቱን በማንኛውም ጊዜ የማቋረጥ
                      መብት እንዳለዎት ያስገነዝባል።
                    </p>

                    <p className="text-sm font-medium text-red-600 mt-6">
                      እባክዎን ከዚህ በታች ያለውን ማስፈንጠሪያ በመጫን የዳሰሳ ጥናቱን ይጀምሩ።
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`/survey/${survey.id}`}
                    className="block w-full text-center px-8 py-3 rounded-lg font-semibold 
          bg-lime-600 text-white shadow-md hover:bg-lime-700 
          transition-all duration-150 ease-in-out"
                  >
                    የዳሰሳ ጥናቱን ይጀምሩ
                  </Link>
                </div>
              ))}
            </div>
          }
        ></Route>
        <Route path="/survey/:id" element={<SurveyApp />} />
        <Route path="/survey/completion" element={<SurveyCompletion />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
