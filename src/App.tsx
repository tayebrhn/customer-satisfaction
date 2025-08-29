import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SurveyApp from "./SurveyApp";
import { useSurveyFetch } from "./hooks/useSurveyFetch";

export default function App() {
  const { data: surveyData, loading, error } = useSurveyFetch();

  if (loading) return <p>Loading surveys...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!surveyData) return <p>No data found</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dynamic Navigation
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
                          to={`survey/${survey.metadata.language}/${survey.id}`}
                          className="block px-4 py-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {survey.metadata.title}
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          }
        ></Route>
        <Route path="/survey/:lang/:id" element={<SurveyApp />} />
      </Routes>
    </Router>
  );
}
