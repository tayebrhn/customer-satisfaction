type TextQuestion = {
  id: number;
  text: string;
  type: string; // could be "text"
  placeholder: string;
  category: string;
  options?: undefined;
  scale?: undefined;
};

type Option = {
  id: number;
  text: string;
  is_other?: boolean;
};

type SingleChoiceQuestion = {
  id: number;
  text: string;
  type: string;
  options: Option[];
  category: string;
  placeholder?: undefined;
  scale?: undefined;
};

type RatingQuestion = {
  id: number;
  text: string;
  type: string;
  scale: string;
  category: string;
  placeholder?: undefined;
  options?: undefined;
};

export type Question = TextQuestion | SingleChoiceQuestion | RatingQuestion;

export type FormValues = {
  [key: string]: any;
};