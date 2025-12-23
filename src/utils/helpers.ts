import type { FieldErrors } from "react-hook-form";
import type { AppRoutes, QuestionOption, SurveyExport } from "../types/survey";

// Utility function for parsing different option formats
// utils/helpers.ts
export const parseOption = (option: QuestionOption) => {
  return {
    optionValue: option.sequence,
    optionLabel: option.label ?? option.text,
    optionId: option.sequence,
    isOther: option.is_other,
    // Add this line to grab children
    subOptions: option.sub_options || [], 
  };
};


export const flattenOptions = (options: any[], parser: typeof parseOption) => {
  let flatList: any[] = [];

  const traverse = (opts: any[]) => {
    opts.forEach((opt) => {
      const { subOptions } = parser(opt);
      // Add current option to list
      flatList.push(opt);
      
      // If it has children, recursively add them too
      if (subOptions && subOptions.length > 0) {
        traverse(subOptions);
      }
    });
  };

  traverse(options);
  return flatList;
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

export const scrollToFirstError = (formErrors: FieldErrors) => {
  const firstErrorKey = Object.keys(formErrors)[0];
  if (!firstErrorKey) return false;

  // Best selector for RHF + React apps
  const element = document.querySelector(
    `[name="${CSS.escape(firstErrorKey)}"]`
  ) as HTMLElement | null;
  console.log("Scroll:", element);

  if (element) {
    // Find a visible partner (label or wrapper)
    const visibleTarget =
      element.closest("label") || element.parentElement || element;

    visibleTarget.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    // Delay focus for better UX
    setTimeout(() => element.focus(), 100);
  }
  return true;
};

export const scrollToField = (fieldName: string) => {
  const el = document.querySelector(
    `[name="${CSS.escape(fieldName)}"]`
  ) as HTMLElement | null;

  if (!el) return;
  
  // Find a visible partner (label or wrapper)
  const visibleTarget = el.closest("label") || el.parentElement || el;

  visibleTarget.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // delay helps in React render cycles
  setTimeout(() => el.focus?.(), 100);
};
