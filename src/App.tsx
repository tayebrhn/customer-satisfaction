import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { generateRoutes } from "./utils/helpers";
import SurveyApp from "./SurveyApp";
import { useSurveyExport } from "./hooks/useSurveyExport";
import type { SurveyExport } from "./types/survey";

export default function App() {
  const { data: surveyData, loading, error } = useSurveyExport();

  const routes = generateRoutes(surveyData as SurveyExport[])


  if (loading) return <p>Loading surveys...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!surveyData) return <p>No data found</p>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dynamic Navigation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {Object.entries(routes).map(([key, url]) => (
            <div key={key} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-indigo-600 mb-4 capitalize">
                {key} Links
              </h2>
              <ul className="space-y-2">
                <li key={url}>
                    <Link
                      to={url}
                      className="block px-4 py-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                    >
                      {url}
                    </Link>
                  </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 w-full max-w-3xl">
          <Routes>
            {/* Dynamically generate routes */}
            {Object.keys(surveyData).map((key) => (
              <Route
                key={key}
                path={`/${key}`}
                element={<SurveyApp prefix={key} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
