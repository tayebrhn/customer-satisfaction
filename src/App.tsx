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
    const form = useForm({});
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
            <div className="">
              {surveyData.map((survey) => (
                <div key={survey.id} className="bg-white shadow rounded-lg p-6">
                  <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
                    <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-3xl">
                      {/* የገጹ ርዕስ */}
                      <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-6 border-b pb-3">
                        {survey.metadata.title || "የዳሰሳ ጥናት መግቢያ"}
                      </h1>

                      {/* መመሪያዎች */}
                      <div className="text-gray-700 space-y-4 mb-8">
                        <p className="font-semibold text-lg text-gray-800">
                          አስፈላጊ መረጃ እና ፈቃድ
                        </p>

                        <p>
                          ይህ የዳሰሳ ጥናት የሚቀርበው{" "}
                          <strong>በኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU)</strong>
                          ሲሆን፣ ዓላማውም በደንበኞች እርካታ ጥናት ዙሪያ ያለውን መረጃ ለመሰብሰብ ነው።
                        </p>

                        {/* <p>
            **ምስጢራዊነት (Confidentiality):** የእርስዎ ምላሾች በሙሉ በከፍተኛ ሚስጥር ይጠበቃሉ። የግል መረጃዎ አይጠየቅም ወይም አይታወቅም። ምላሾቹ የሚጠቀሙት ለጥናትና ለሪፖርት ዝግጅት ብቻ ነው።
          </p> */}

                        <p>
                          <strong>ፈቃድ (Consent):</strong> የዳሰሳ ጥናቱን መመለስ መጀመርዎ
                          በፈቃደኝነትዎ መሰረት የሚደረግ ሲሆን፣ ጥናቱን በማንኛውም ጊዜ የማቋረጥ መብት
                          እንዳለዎት ያስገነዝባል።
                        </p>

                        <p className="text-sm font-medium text-red-600">
                          እባክዎን ከዚህ በታች ያለውን ማስፈንጠሪያ በመጫን የዳሰሳ ጥናቱን ይጀምሩ።
                        </p>

                        {/* የመጀመሪያው የዳሰሳ ጥናት መጀመርያ ቁልፍ */}
                        <Link
                          to={`/survey/${survey.id}`}
                          className="mt-6 inline-block w-full text-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out shadow-lg"
                        >
                          ✅ የዳሰሳ ጥናቱን ይጀምሩ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        ></Route>
        <Route path="/survey/:id" element={
          <FormProvider {...form}>

            <SurveyApp />
          </FormProvider>
          } />
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
