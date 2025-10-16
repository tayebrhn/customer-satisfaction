import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SurveyApp from "./SurveyApp";
import { useSurveyFetch } from "./hooks/useSurveyFetch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";

export default function App() {
  const { data: surveyData, loading, error } = useSurveyFetch();

  if (loading) return <p>Loading surveys...</p>;
  if (error) return <p className="text-red-600">App::Error Loading Survey List: {error}</p>;
  if (!surveyData || !Array.isArray(surveyData)||surveyData.length==0) return <p>No data found</p>;
    return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                EEU Survey Navigation
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {surveyData.map((survey) => (
                  <div
                    key={survey.id}
                    className="bg-white shadow rounded-lg p-6"
                  >
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to={`survey/${survey.id}`}
                          className="block px-4 py-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div>{survey.metadata.title}</div>
                          {survey.metadata.instructions}
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          }
        ></Route>
        <Route path="/survey/:id" element={<SurveyApp />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <App />
  </StrictMode>
);
