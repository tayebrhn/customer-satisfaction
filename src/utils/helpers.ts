import type { AppRoutes, SurveyExport } from "../types/survey";

// Utility function for parsing different option formats
export const parseOption = (option: string) => {
  return {
    optionValue: option,
    optionLabel: option,
    optionId: option,
    isOther: option
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
