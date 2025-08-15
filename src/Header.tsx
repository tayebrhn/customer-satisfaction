import surveyData from "./prototype_amharic_only.json";

export default function Header() {
  return (
    <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-green-500">
            {surveyData.survey.title}
        </h1>
        <p className="mb-4 text-yellow-300">{surveyData.survey.instructions}</p>
      </div>
    </header>
  );
}
