export type ValueLabelOption = {
  value: string;
  label: string;
};

export type ChoiceOption = {
  id: number;
  text: string;
  is_other?: boolean;
};

export type ValueLabelQuestion = {
  id: number;
  type: string;
  question: string;
  category: number;
  options: ValueLabelOption[];
  placeholder?: undefined;
  scale?: undefined;
};

export type StringArrayQuestion = {
  id: number;
  type: string;
  question: string;
  category: number;
  options: string[];
  placeholder?: undefined;
  scale?: undefined;
};

export type TextQuestion = {
  id: number;
  question: string;
  type: string;
  placeholder: string;
  category: number;
  options?: undefined;
  scale?: undefined;
};

export type ObjectOptionsQuestion = {
  id: number;
  question: string;
  type: string;
  options: QuestionOption[];
  category: number;
  placeholder?: undefined;
  scale?: undefined;
};

export type RatingQuestion = {
  id: number;
  question: string;
  type: string; // e.g. "rating"
  scale: string; // e.g. "1-5"
  category: number;
  options?: undefined;
  placeholder?: undefined;
};

export type Question =
  | ValueLabelQuestion
  | StringArrayQuestion
  | TextQuestion
  | ObjectOptionsQuestion
  | RatingQuestion;


export interface SurveyExport {
  survey: {
    title: string;
    instructions: string;
    version: string;
    metadata: {
      created: string; // ISO date string, e.g., "2025-08-12"
      language: string;
    };
  };
  questions: Question[];
  question_categories: QuestionCategory[];
}

export interface QuestionCategory {
  id: number;
  name: string;
}

export interface SurveyQuestion {
  id: number;
  type: "multi_select" | "single_choice" | "number" | "rating" | string;
  question: string;
  category: string | null; // category name
  placeholder?: string;
  scale?: string;
  options?: (QuestionOption | string)[];
}

export interface QuestionOption {
  value?: string;
  label?: string;
  text?: string;
  is_other?: boolean;
}


// export type QuestionsArray = Question[];

// // ---------- Type Guards ----------
// export const isValueLabelQuestion = (q: Question): q is ValueLabelQuestion =>
//   Array.isArray(q.options) &&
//   q.options.length > 0 &&
//   typeof q.options[0] === "object" &&
//   "value" in q.options[0];

// export const isStringArrayQuestion = (q: Question): q is StringArrayQuestion =>
//   Array.isArray(q.options) && typeof q.options[0] === "string";

// export const isTextQuestion = (q: Question): q is TextQuestion =>
//   "placeholder" in q && typeof q.placeholder === "string";

// export const isObjectOptionsQuestion = (
//   q: Question
// ): q is ObjectOptionsQuestion =>
//   Array.isArray(q.options) &&
//   typeof q.options[0] === "object" &&
//   "text" in q.options[0];

// export const isRatingQuestion = (q: Question): q is RatingQuestion =>
//   "scale" in q && typeof q.scale === "string";

export type FormValues = {
  [key: string]: any;
};