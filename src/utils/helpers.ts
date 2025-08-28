import type { AppRoutes, QuestionOption, SurveyExport } from "../types/survey";

// Utility function for parsing different option formats
export const parseOption = (option: QuestionOption) => {
  return {
    optionValue: option.id,
    optionLabel: option.text,
    optionId: option.id,
    isOther: option.is_other,
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
