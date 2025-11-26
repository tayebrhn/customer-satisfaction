import type { FieldErrors } from "react-hook-form";
import type { AppRoutes, QuestionOption, SurveyExport } from "../types/survey";

// Utility function for parsing different option formats
export const parseOption = (option: QuestionOption) => {
  return {
    optionValue: option.id,
    optionLabel: option.label,
    optionId: option.id,
    isOther: option.is_other,
  };
};

export function generateRoutes(data: SurveyExport[] | null): AppRoutes {
  if (!data) return {}; // return empty when null
  const routes: AppRoutes = {};
  data.map((element) => (routes[element.metadata.title] = `/${element.id}`));
  return routes;
}

export async function n(fields: any[]) {
  console.log(JSON.stringify({ fields }));
  const res = await fetch("/api/survey/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  return await res.json();
}

export const scrollToFirstError = (errors: FieldErrors) => {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return false;

  const element = document.querySelector<HTMLInputElement>(
    `[name="${firstErrorKey}"]`
  );

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof element.focus === "function") element.focus();
  }

  return true;
};
