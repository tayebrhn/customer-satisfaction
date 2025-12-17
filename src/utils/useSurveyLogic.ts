// useSurveyLogic.ts

import { useCallback, useMemo } from 'react';
import { useSurveyContext } from './SurveyContext ';
import type { SurveyQuestion } from '../types/survey';
// Assuming the following types and hook are exported from SurveyContext.tsx
// import { 
//   useSurvey, 
//   Question, 
//   SurveyState, 
//   Action, 
//   useSurveyContext // Use the dedicated hook that returns both state and dispatch
// } from './'; 

// --- 1. Type Definitions for Logic Rules ---

/** Operators for comparing the trigger answer to the trigger value. */
type LogicOperator = 
  | 'EQUALS' 
  | 'NOT_EQUALS' 
  | 'IN' 
  | 'GREATER_THAN' 
  | 'LESS_THAN' 
  | 'CONTAINS';

/** Actions to take when a rule is met. */
type LogicAction = 
  | 'SHOW' 
  | 'HIDE' 
  | 'JUMP_TO'; 

/** Defines a single dependency/logic rule for a question. */
interface SurveyRule {
  trigger_question_sn: string;
  operator: LogicOperator;
  trigger_options: any;
  action: LogicAction;
  target_question_id?: string; // Required for JUMP_TO
}

// Extend the base Question type if it wasn't already done in SurveyContext
// to include the logic dependencies.
// Note: In a real app, you would import the Question type from the context file
// and define the Dependencies type here, then merge them if necessary.
// For simplicity, we assume the imported Question type already has dependencies:
/*
interface Question {
  id: string;
  // ... other properties
  dependencies?: SurveyRule[];
  is_required?: boolean;
  question_type?: 'number' | 'text' | 'radio' | 'checkbox'; // etc.
  order: number; // For sorting
}
*/


// --- 2. Main Logic Hook ---

export function useSurveyLogic() {
  // Use the destructuring method based on the structure of the useSurvey hook
  const { state, dispatch } = useSurveyContext(); 

  // --- Core Utility: Rule Evaluation ---
  
  /**
   * Evaluates a single logic rule against the current set of answers.
   */
  const evaluateRule = useCallback((rule: SurveyRule, answers: Record<string, any>): boolean => {
    const userAnswer = answers[rule.trigger_question_sn];
    
    // Safety check for null/undefined answers
    if (userAnswer === undefined || userAnswer === null) {
      return false;
    }
    
    // Type casting for comparison safety
    const strUserAnswer = String(userAnswer);
    const numUserAnswer = Number(userAnswer);
    const numTriggerValue = Number(rule.trigger_options);

    switch(rule.operator) {
      case 'EQUALS':
        return userAnswer === rule.trigger_options;
        
      case 'NOT_EQUALS':
        return userAnswer !== rule.trigger_options;
        
      case 'IN':
        // Check if the trigger_options is an array and if it includes the user's answer
        return Array.isArray(rule.trigger_options) &&
               rule.trigger_options.includes(userAnswer);
        
      case 'GREATER_THAN':
        // Ensure both are valid numbers before comparison
        return !isNaN(numUserAnswer) && !isNaN(numTriggerValue) && numUserAnswer > numTriggerValue;
        
      case 'LESS_THAN':
        // Ensure both are valid numbers before comparison
        return !isNaN(numUserAnswer) && !isNaN(numTriggerValue) && numUserAnswer < numTriggerValue;
        
      case 'CONTAINS':
        // Check if the string representation of the answer includes the string representation of the trigger value
        return strUserAnswer.includes(String(rule.trigger_options));
        
      default:
        console.warn(`Unknown operator: ${rule.operator}`);
        return false;
    }
  }, []);
  
  // --- Visibility Check ---

  /**
   * Checks if a specific question should be visible based on its dependencies and current answers.
   * @param questionId - The ID of the question to check.
   * @param customAnswers - Optional set of answers to test (for predictive logic).
   */
  const isQuestionVisible = useCallback((questionSn: string, customAnswers: Record<string, any> | null = null): boolean => {
    const answers = customAnswers || state.answers;
    const question = state.questions.find(q => q.sequence_num.toString() === questionSn);
    
    if (!question || !question.dependencies || question.dependencies.length === 0) {
      return true; // No dependencies means it's always visible
    }
    
    // Evaluate all dependencies
    for (const rule of question.dependencies) {
      const conditionMet = evaluateRule(rule, answers);
      
      // 1. Logic for SHOW/HIDE
      if (rule.action === 'SHOW' && !conditionMet) {
        return false; // Requires condition to SHOW, but it wasn't met.
      }
      
      if (rule.action === 'HIDE' && conditionMet) {
        return false; // Condition met, so we HIDE it.
      }
      
      // 2. Logic for JUMP_TO (triggers state change immediately)
      if (rule.action === 'JUMP_TO' && conditionMet && rule.target_question_id) {
        const targetIndex = state.questions.findIndex(q => q.id === rule.target_question_id);
        if (targetIndex !== -1) {
          // Note: This side effect inside a check function is common in survey logic
          // but should be used carefully.
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: targetIndex });
          return false; // If we jump, the current question might be implicitly skipped/hidden.
        }
      }
    }
    
    return true; // All rules passed the visibility check
  }, [state.questions, state.answers, evaluateRule, dispatch]);
  
  // --- Recalculate Visibility ---

  /**
   * Recalculates visibility for ALL questions and updates the visibleQuestions state.
   */
  const recalculateVisibility = useCallback(() => {
    const visibleIds = state.questions
      .filter(q => isQuestionVisible(q.sequence_num.toString()))
      .map(q => q.sequence_num);
    
    // Dispatch the updated list of visible question IDs
    dispatch({ type: 'SET_VISIBLE_QUESTIONS', payload: visibleIds });
  }, [state.questions, isQuestionVisible, dispatch]);
  
  // --- Handle Answer Change & Cleanup ---

  /**
   * Main handler for user input, updating answer, clearing validation, and cleaning up hidden answers.
   */
  const handleAnswerChange = useCallback((questionId: string, value: any) => {
    // 1. Update the answer
    dispatch({ type: 'SET_ANSWER', payload: { questionId, value } });
    
    // 2. Find questions that depend on this answer (for cleanup)
    const dependentQuestions = state.questions.filter(q =>
      q.dependencies?.some(rule => rule.trigger_question_sn === questionId)
    );
    
    // Use the *potential new answers* to check visibility immediately for cleanup
    const nextAnswers = { ...state.answers, [questionId]: value };

    // 3. Clean up answers for questions that are now hidden
    dependentQuestions.forEach(q => {
      // Check visibility against the *new* answer set
      if (!isQuestionVisible(q.id, nextAnswers)) {
        dispatch({ type: 'CLEAR_ANSWER', payload: q.id });
      }
    });
    
    // 4. Recalculate global visibility after the state update has processed
    // Using setTimeout(..., 0) ensures this runs *after* the initial SET_ANSWER dispatch.
    // In many cases, relying on an `useEffect` hook listening to `state.answers` might be cleaner.
    setTimeout(() => {
      recalculateVisibility();
    }, 0); 
  }, [state.questions, state.answers, isQuestionVisible, recalculateVisibility, dispatch]);
  
  // --- Validation ---

  /**
   * Validates a single question based on required status and type-specific rules.
   */
  const validateQuestion = useCallback((question: Question): boolean => {
    const answer = state.answers[question.id];
    
    // 1. Required field check
    if (question.is_required && (answer === undefined || answer === null || answer === '')) {
      dispatch({
        type: 'SET_VALIDATION_ERROR',
        payload: { questionId: question.id, message: 'This question is required' }
      });
      return false;
    }
    
    // 2. Type-specific checks (e.g., number validation)
    if (question.question_type === 'number' && answer !== undefined && answer !== '') {
      if (isNaN(Number(answer))) {
        dispatch({
          type: 'SET_VALIDATION_ERROR',
          payload: { questionId: question.id, message: 'Please enter a valid number' }
        });
        return false;
      }
    }
    
    // Clear error if validation passes
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: question.id });
    return true;
  }, [state.answers, dispatch]);
  
  /**
   * Validates all currently visible questions.
   */
  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const visibleQuestionsToValidate = state.questions.filter(q =>
      state.visibleQuestions.has(q.id)
    );
    
    // Use `forEach` instead of `map` so `isValid` can be updated
    visibleQuestionsToValidate.forEach(question => {
      // We must check if the question is visible again *inside* the loop
      // to handle complex dependencies where validation might cause jumps/hides.
      // However, for simple use, checking the set is enough.
      if (!validateQuestion(question)) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [state.questions, state.visibleQuestions, validateQuestion]);
  
  // --- Memoized Derived State ---

  /**
   * Calculates the survey completion progress percentage.
   */
  const progress = useMemo((): number => {
    const visibleQuestionsCount = state.questions.filter(q =>
      state.visibleQuestions.has(q.sequence_num.toString())
    ).length;
    
    const answeredQuestionsCount = state.questions.filter(q =>
      state.visibleQuestions.has(q.sequence_num.toString()) &&
      state.answers[q.sequence_num] !== undefined &&
      state.answers[q.sequence_num] !== null &&
      state.answers[q.sequence_num] !== ''
    ).length;
    
    return visibleQuestionsCount > 0
      ? Math.round((answeredQuestionsCount / visibleQuestionsCount) * 100)
      : 0;
  }, [state.questions, state.visibleQuestions, state.answers]);
  
  /**
   * Gets the list of currently visible questions, sorted by their order property.
   */
  const visibleQuestions = useMemo((): SurveyQuestion[] => {
    return state.questions
      .filter(q => state.visibleQuestions.has(q.sequence_num.toString()))
      .sort((a, b) => a.sequence_num - b.sequence_num); // Assumes Question interface has an 'order' property
  }, [state.questions, state.visibleQuestions]);
  
  // --- Navigation ---

  const goToNextQuestion = useCallback(() => {
    const currentQuestionId = state.questions[state.currentQuestionIndex]?.id;
    const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentVisibleIndex < visibleQuestions.length - 1) {
      const nextQuestion = visibleQuestions[currentVisibleIndex + 1];
      // We need the index *in the full state.questions array* for SET_CURRENT_QUESTION
      const nextIndex = state.questions.findIndex(q => q.id === nextQuestion.id);
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: nextIndex });
    }
  }, [state.questions, state.currentQuestionIndex, visibleQuestions, dispatch]);
  
  const goToPreviousQuestion = useCallback(() => {
    const currentQuestionId = state.questions[state.currentQuestionIndex]?.id;
    const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentVisibleIndex > 0) {
      const prevQuestion = visibleQuestions[currentVisibleIndex - 1];
      // We need the index *in the full state.questions array* for SET_CURRENT_QUESTION
      const prevIndex = state.questions.findIndex(q => q.id === prevQuestion.id);
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: prevIndex });
    }
  }, [state.questions, state.currentQuestionIndex, visibleQuestions, dispatch]);
  
  // --- Return Value ---

  return {
    state,
    dispatch,
    evaluateRule,
    isQuestionVisible,
    recalculateVisibility,
    handleAnswerChange,
    validateQuestion,
    validateAll,
    progress,
    visibleQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
  };
}