export interface QuestionCategory {
  id: number;
  cat_number: number;
  name: string;
}

export interface CurrentCategory{
    questions: SurveyQuestion[];
    id: number;
    cat_number: number;
    name: string;
}

export interface Configs {
  placeholder?:string
  scale?:string
} 
// export type QuestionOption = string[];

export interface SurveyQuestion {
  id: number;
  type:
    | "multi_select"
    | "single_choice"
    | "number"
    | "rating"
    | "drop_down"
    | "text_area"
    | "text";
  label: string;
  description:string;
  category: number;
  configs:Configs
  options: string[];
  constraints: {
    required: boolean;
    min: number | null;
    max: number | null;
  };
}

export interface SurveyExport {
  id: string;
  metadata: {
    title: string;
    instructions: string;
    version: string;
    created: string; // ISO date string, e.g., "2025-08-12"
    language: string;
  };
  questions: SurveyQuestion[];
  question_categories?: QuestionCategory[];
}

export type AppRoutes = Record<string, string>;

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

// export type FormValues = {
//   [key: string]: any;
// };

export type Answer =
  | {
      // single_choice, drop_down
      selected_option_id: number | null;
      text_value: string | null;
      is_other?: boolean;
      selected_option_ids?: undefined;
      number_value?: undefined;
      rating_value?: undefined;
    }
  | {
      // multi_select
      selected_option_ids: number[];
      text_value: string | null;
      selected_option_id?: undefined;
      number_value?: undefined;
      rating_value?: undefined;
    }
  | {
      // text, text_area
      selected_option_id: null;
      text_value: string;
      selected_option_ids?: undefined;
      number_value?: undefined;
      rating_value?: undefined;
    }
  | {
      // number
      selected_option_id: null;
      number_value: number | null;
      selected_option_ids?: undefined;
      text_value?: undefined;
      rating_value?: undefined;
    }
  | {
      // rating
      selected_option_id: null;
      rating_value: number | null;
      selected_option_ids?: undefined;
      text_value?: undefined;
      number_value?: undefined;
    };

export interface Response {
  question_id: number;
  question_type:
    | "single_choice"
    | "drop_down"
    | "multi_select"
    | "text"
    | "text_area"
    | "number"
    | "rating";
  answer: Answer;
}

export interface SurveyResponse {
  survey_id: string;
  respondent_info: {
    ip_address?: string;
    user_agent?: string;
    session_id?: string;
  };
  responses: any;
}
