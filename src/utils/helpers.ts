import type { AppRoutes, SurveyExport } from "../types/survey";

// Utility function for parsing different option formats
// utils/helpers.ts
export const parseOption = (option: string, index?: number) => {
  const trimmed = option.trim();
  const isOther =
    trimmed.toLowerCase() === "other" ||
    trimmed.toLowerCase().startsWith("other:");

  return {
    optionLabel: trimmed,
    optionId: index ?? trimmed, // fallback to string label
    isOther,
  };
};


export function generateRoutes(data: SurveyExport[] | null): AppRoutes {
  if (!data) return {}; // return empty when null
  const routes: AppRoutes = {};
  data.map(
    (element) =>
      (routes[element.metadata.title] = `/${element.id}`)
  );
  return routes;
}
