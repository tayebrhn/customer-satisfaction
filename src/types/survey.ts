// export type ValueLabelOption = {
//   value: string;
//   label: string;
// };

// export type ChoiceOption = {
//   id: number;
//   text: string;
//   is_other?: boolean;
// };

// export type ValueLabelQuestion = {
//   id: number;
//   type: string;
//   question: string;
//   category: number;
//   options: ValueLabelOption[];
//   placeholder?: undefined;
//   scale?: undefined;
// };

// export type StringArrayQuestion = {
//   id: number;
//   type: string;
//   question: string;
//   category: number;
//   options: string[];
//   placeholder?: undefined;
//   scale?: undefined;
// };

// export type TextQuestion = {
//   id: number;
//   question: string;
//   type: string;
//   placeholder: string;
//   category: number;
//   options?: undefined;
//   scale?: undefined;
// };

// export type ObjectOptionsQuestion = {
//   id: number;
//   question: string;
//   type: string;
//   options: QuestionOption[];
//   category: number;
//   placeholder?: undefined;
//   scale?: undefined;
// };

// export type RatingQuestion = {
//   id: number;
//   question: string;
//   type: string; // e.g. "rating"
//   scale: string; // e.g. "1-5"
//   category: number;
//   options?: undefined;
//   placeholder?: undefined;
// };

// export type Question =
//   | ValueLabelQuestion
//   | StringArrayQuestion
//   | TextQuestion
//   | ObjectOptionsQuestion
//   | RatingQuestion;

export interface QuestionCategory {
  id: number;
  cat_number: number;
  name: string;
}

// export interface CurrentCategory {
//   questions: SurveyQuestion[];
//   id: number;
//   cat_number: number;
//   name: string;
// }

export interface QuestionOption {
  id: number;
  sub_options: QuestionOption[] | [];
  text: string;
  label: string;
  is_other: boolean;
}

export interface KeyChoice {
  key: string;
  description: string;
}

export interface SurveyQuestion {
  sequence_num: number;
  type:
    | "multi_select"
    | "single_choice"
    | "number"
    | "rating"
    | "drop_down"
    | "text_area"
    | "text";
  question: string;
  category: number; // category name
  placeholder?: string;
  scale?: string;
  options: QuestionOption[];
  constraints: {
    verifiable: boolean;
    required: boolean;
    min_length: number | null;
    max_length: number | null;
  };
  skip_logic?: LogicRule[]; // Rules where this question is the TARGET
}

export interface LogicRule {
  trigger_question_sn: number; // Which question triggers the rule
  trigger_options: number[]; // Value(s) that trigger the rule
  operator:
    | "EQUALS"
    | "NOT_EQUALS"
    | "IN"
    | "GREATER_THAN"
    | "LESS_THAN"
    | "CONTAINS";
  action: Action;
  target_question_sn?: number; // Only for JUMP_TO Action
}
export type Action = "SHOW" | "HIDE" | "JUMP_TO" | "ENABLE" | "REQUIRE";

export interface SurveyExport {
  id: string;
  metadata: {
    title: string;
    description: string;
    instructions: string;
    version: string;
    created: string; // ISO date string, e.g., "2025-08-12"
    language: string;
  };
  questions: SurveyQuestion[];
  question_categories?: QuestionCategory[];
  key_choice: KeyChoice[];
  skip_logic?: LogicRule[]; // Rules where this question is the TARGET
}

export type AppRoutes = Record<string, string>;

export interface GroupedQuestion {
  questions: SurveyQuestion[];
  id: number;
  cat_number: number;
  name: string;
}

// types/surveyResponses.ts

export interface SurveySubmitResponse {
  success: true;
  response_id: string | number;
  award_assigned: boolean;
  message: string;
  response: Response;
}

export interface ValidationError {
  question_sn: number;
  error: string;
}

export interface SurveySubmitError {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export type SurveySubmitResult = SurveySubmitResponse | SurveySubmitError;

export interface VerifyPayload {
  [key: string]: any;
}

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

export interface SurveyResponse {
  question_sn: number;
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

// export interface SurveyResponse {
//   survey_id: string;
//   respondent_info: {
//     ip_address?: string;
//     user_agent?: string;
//     session_id?: string;
//   };
//   responses: any;
// }
