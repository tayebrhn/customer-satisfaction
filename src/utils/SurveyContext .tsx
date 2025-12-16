// SurveyContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type { SurveyQuestion } from "../types/survey";

// --- 1. Type Definitions ---

// Define the shape of a Question and the State

interface SurveyState {
  questions: SurveyQuestion[];
  answers: Record<string, any>;
  visibleQuestions: Set<string>; // Use question IDs for visibility
  isLoading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  validationErrors: Record<string, string>; // { questionId: errorMessage }
}

// Define Action types
type Action =
  | { type: "SET_QUESTIONS"; payload: SurveyQuestion[] }
  | { type: "SET_ANSWERS"; payload: Record<string, any> }
  | { type: "SET_ANSWER"; payload: { questionId: string; value: any } }
  | { type: "CLEAR_ANSWER"; payload: string } // questionId
  | { type: "SET_VISIBLE_QUESTIONS"; payload: string[] } // array of question IDs
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_QUESTION"; payload: number }
  | {
      type: "SET_VALIDATION_ERROR";
      payload: { questionId: string; message: string };
    }
  | { type: "CLEAR_VALIDATION_ERROR"; payload: string } // questionId
  | { type: "RESET_SURVEY" };

// Define the Context Value shape
interface SurveyContextValue {
  state: SurveyState;
  dispatch: React.Dispatch<Action>;
}

// --- 2. Initial State & Reducer ---

const initialState: SurveyState = {
  questions: [],
  answers: {},
  visibleQuestions: new Set<string>(),
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  validationErrors: {},
};

function surveyReducer(state: SurveyState, action: Action): SurveyState {
  switch (action.type) {
    case "SET_QUESTIONS":
      // Also set all questions as visible initially, or apply initial visibility logic
      const initialVisibleIds = action.payload
        .map((q) => q.sequence_num)
        .toString();
      return {
        ...state,
        questions: action.payload,
        visibleQuestions: new Set(initialVisibleIds),
      };

    case "SET_ANSWERS":
      return { ...state, answers: action.payload };

    case "SET_ANSWER":
      const newAnswers = {
        ...state.answers,
        [action.payload.questionId]: action.payload.value,
      };
      // Clear validation error when an answer is set
      const { [action.payload.questionId]: removedError, ...restErrors } =
        state.validationErrors;
      return {
        ...state,
        answers: newAnswers,
        validationErrors: restErrors,
      };

    case "CLEAR_ANSWER":
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: removed, ...restAnswers } = state.answers;
      return { ...state, answers: restAnswers };

    case "SET_VISIBLE_QUESTIONS":
      return { ...state, visibleQuestions: new Set(action.payload) };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestionIndex: action.payload };

    case "SET_VALIDATION_ERROR":
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.payload.questionId]: action.payload.message,
        },
      };

    case "CLEAR_VALIDATION_ERROR":
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: removedErrorClean, ...restErrorsClean } =
        state.validationErrors;
      return { ...state, validationErrors: restErrorsClean };

    case "RESET_SURVEY":
      return initialState;

    default:
      // Ensure all possible actions are handled, or throw for safety
      return state;
  }
}

// --- 3. Context Creation ---

const SurveyContext = createContext<SurveyContextValue | undefined>(undefined);

// --- 4. Provider Component ---

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <SurveyContext.Provider value={contextValue}>
      {children}
    </SurveyContext.Provider>
  );
}

// --- 5. Custom Hooks (Recommended Pattern) ---

/**
 * Custom hook to access the entire context value (state and dispatch).
 * You should generally use useSurveyState and useSurveyActions instead.
 */
export function useSurveyContext() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }
  return context;
}

/**
 * Custom hook for components that only need to READ the survey state.
 * This can prevent unnecessary re-renders in components that only use actions.
 */
export function useSurveyState() {
  const { state } = useSurveyContext();
  return state;
}

/**
 * Custom hook for components that need to WRITE to the survey state.
 * It provides action-specific functions, abstracting the dispatch type logic.
 */
export function useSurveyActions() {
  const { dispatch } = useSurveyContext();

  // useCallback is used to memoize these functions, so they don't change
  // on every render and can be safely used in dependency arrays of other hooks.

  const setQuestions = useCallback(
    (questions: SurveyQuestion[]) => {
      dispatch({ type: "SET_QUESTIONS", payload: questions });
    },
    [dispatch]
  );

  const setAnswer = useCallback(
    (questionId: string, value: any) => {
      dispatch({ type: "SET_ANSWER", payload: { questionId, value } });
    },
    [dispatch]
  );

  const clearAnswer = useCallback(
    (questionId: string) => {
      dispatch({ type: "CLEAR_ANSWER", payload: questionId });
    },
    [dispatch]
  );

  const setCurrentQuestion = useCallback(
    (index: number) => {
      dispatch({ type: "SET_CURRENT_QUESTION", payload: index });
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: isLoading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
    },
    [dispatch]
  );

  const setValidationError = useCallback(
    (questionId: string, message: string) => {
      dispatch({
        type: "SET_VALIDATION_ERROR",
        payload: { questionId, message },
      });
    },
    [dispatch]
  );

  const clearValidationError = useCallback(
    (questionId: string) => {
      dispatch({ type: "CLEAR_VALIDATION_ERROR", payload: questionId });
    },
    [dispatch]
  );

  const resetSurvey = useCallback(() => {
    dispatch({ type: "RESET_SURVEY" });
  }, [dispatch]);

  // If you have complex logic (e.g., conditional visibility based on answers),
  // you can create a function here to contain that logic before dispatching.
  const updateVisibleQuestions = useCallback(
    (visibleIds: string[]) => {
      dispatch({ type: "SET_VISIBLE_QUESTIONS", payload: visibleIds });
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      setQuestions,
      setAnswer,
      clearAnswer,
      setCurrentQuestion,
      setLoading,
      setError,
      setValidationError,
      clearValidationError,
      resetSurvey,
      updateVisibleQuestions,
    }),
    [
      setQuestions,
      setAnswer,
      clearAnswer,
      setCurrentQuestion,
      setLoading,
      setError,
      setValidationError,
      clearValidationError,
      resetSurvey,
      updateVisibleQuestions,
    ]
  );
}

// Rename the original export for clarity in this new structure
export { useSurveyContext as useSurvey };
