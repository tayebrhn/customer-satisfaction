// hooks/useSkipLogic.ts
import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import type {
  GroupedQuestion,
  SkipLogicRule,
  SurveyQuestion,
} from "../types/survey";

interface UseSkipLogicProps {
  currentCategory: GroupedQuestion | null;
  allQuestions: SurveyQuestion[];
  skipLogic?: SkipLogicRule[];
  onQuestionVisibilityChange?: (visibleQuestions: Set<number>) => void;
}

export function useSkipLogic({
  currentCategory,
  allQuestions,
  onQuestionVisibilityChange,
  skipLogic,
}: UseSkipLogicProps) {
  const { watch, setValue, getValues, trigger } = useFormContext();

  // 🔥 FIX 1: Use STATE for visibility to trigger re-renders
  const [visibleQuestions, setVisibleQuestions] = useState<Set<number>>(
    new Set()
  );

  // We keep the Ref ONLY for internal comparison to avoid loops
  const visibleQuestionsRef = useRef<Set<number>>(new Set());
  const initialCalculationDone = useRef(false);

  // Watch all form values
  const allFormValues = watch();
  // Build a map once: questionSequenceNum -> rules affecting it
  const rulesMap = useMemo(() => {
    if (!skipLogic) return {};
    return skipLogic.reduce<Record<number, SkipLogicRule[]>>((acc, rule) => {
      rule.target_questions_sn.forEach((sn) => {
        if (!acc[sn]) acc[sn] = [];
        acc[sn].push(rule);
      });
      return acc;
    }, {});
  }, [skipLogic]);
  const normalizeIds = (value: any): number[] => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v)).filter((v) => !Number.isNaN(v));
    }
    if (value !== null && value !== undefined && value !== "") {
      const n = Number(value);
      return Number.isNaN(n) ? [] : [n];
    }
    return [];
  };
  // Evaluate a single logic rule
  const evaluateRule = useCallback(
    (rule: SkipLogicRule, formValues: Record<string, any>) => {
      const triggerAnswer = formValues[String(rule.trigger_question_sn)];

      // Handle empty values
      if (
        triggerAnswer === undefined ||
        triggerAnswer === null ||
        triggerAnswer === ""
      ) {
        return false;
      }

      const comparisonValue = rule.trigger_options;

      // Normalize to array
      const actualIds = normalizeIds(triggerAnswer);
      const expectedIds = normalizeIds(comparisonValue);

      // IN → any match
      if (rule.operator === "IN") {
        console.log("Evaluate: ", actualIds, "||", expectedIds);
        return expectedIds.some((id) => actualIds.includes(id));
      }

      // CONTAINS → all required
      if (rule.operator === "CONTAINS") {
        return expectedIds.every((id) => actualIds.includes(id));
      }

      const actualSet = new Set(actualIds);
      const expectedSet = new Set(expectedIds);

      // EQUALS → exact same values
      if (rule.operator === "EQUALS") {
        if (actualSet.size !== expectedSet.size) return false;
        return [...actualSet].every((id) => expectedSet.has(id));
      }

      // NOT_EQUALS → anything different
      if (rule.operator === "NOT_EQUALS") {
        if (actualSet.size !== expectedSet.size) return true;
        return [...actualSet].some((id) => !expectedSet.has(id));
      }

      return false;
    },
    []
  );

  // Check if a question should be visible
  const isQuestionVisible = useCallback(
    (question: SurveyQuestion, formValues: Record<string, any>) => {
      const rulesForQuestion = rulesMap[question.sequence_num] ?? [];

      // Grab rules from the provided skipLogic param
      // const rulesForQuestion = skipLogic?.filter((rule) =>
      //   rule.target_questions_sn.includes(question.sequence_num)
      // );

      if (!rulesForQuestion || rulesForQuestion.length === 0) {
        return true; // No rules → visible by default
      }

      let hasShowRule = false;
      let hasHideRule = false;

      for (const rule of rulesForQuestion) {
        const conditionMet = evaluateRule(rule, formValues);

        if (rule.action === "SHOW") {
          hasShowRule = true;
          if (!conditionMet) return false;
        } else if (rule.action === "HIDE") {
          hasHideRule = true;
          if (conditionMet) return false;
        }
      }

      if (hasShowRule && !hasHideRule) return true;
      if (hasHideRule && !hasShowRule) return true;
      return hasShowRule && !hasHideRule;
    },
    [evaluateRule]
  );

  // Recalculate all visible questions
  const recalculateVisibility = useCallback(
    (valuesOverride?: Record<string, any>) => {
      // Use override values (predictive) if provided, otherwise get current from hook form
      const currentAnswers = valuesOverride || getValues();
      const newVisibleSet = new Set<number>();
      const prevVisibleSet = visibleQuestionsRef.current; // Compare against REF

      // 1. Calculate New Visibility
      allQuestions.forEach((question) => {
        if (isQuestionVisible(question, currentAnswers)) {
          newVisibleSet.add(question.sequence_num);
        }
      });

      // 2. Check for changes
      const hasChanged =
        prevVisibleSet.size !== newVisibleSet.size ||
        [...prevVisibleSet].some((num) => !newVisibleSet.has(num));

      if (hasChanged) {
        // Update Ref (for logic)
        visibleQuestionsRef.current = newVisibleSet;

        // 🔥 FIX 2: Update STATE (to trigger UI update)
        setVisibleQuestions(new Set(newVisibleSet));

        // Notify Parent
        onQuestionVisibilityChange?.(newVisibleSet);

        // 3. Cleanup Hidden Fields
        prevVisibleSet.forEach((questionNum) => {
          if (!newVisibleSet.has(questionNum)) {
            const fieldName = String(questionNum);
            setValue(fieldName, null, {
              shouldValidate: false,
              shouldDirty: false,
            });

            const otherField = `${fieldName}_other`;
            if (currentAnswers[otherField] !== undefined) {
              setValue(otherField, "", {
                shouldValidate: false,
                shouldDirty: false,
              });
            }
          }
        });
      }

      return newVisibleSet;
    },
    [
      allQuestions,
      isQuestionVisible,
      getValues,
      setValue,
      onQuestionVisibilityChange,
    ]
  );

  // Handle answer changes - PREDICTIVE
  const handleAnswerChangeWithLogic = useCallback(
    async (questionNumber: number, value: any, shouldValidate = false) => {
      const fieldKey = String(questionNumber);

      // 1. Update React Hook Form
      setValue(fieldKey, value, { shouldValidate: false, shouldDirty: true });

      // 2. PREDICTIVE UPDATE: Manually construct the next state
      // We do NOT wait for 'watch' to trigger. We calculate immediately.
      const currentValues = getValues();
      const predictiveValues = {
        ...currentValues,
        [fieldKey]: value,
      };

      // 3. Run Logic immediately with the future state
      recalculateVisibility(predictiveValues);

      // 4. Handle Validation
      if (shouldValidate) {
        const question = allQuestions.find(
          (q) => q.sequence_num === questionNumber
        );
        // Only trigger validation if strictly required or if dependencies exist
        // (You can expand this logic if needed)
        if (question?.constraints?.required) {
          setTimeout(() => trigger(fieldKey), 10);
        }
      }
    },
    [setValue, recalculateVisibility, getValues, allQuestions, trigger]
  );

  // Initial Load
  useEffect(() => {
    if (allQuestions.length > 0 && !initialCalculationDone.current) {
      recalculateVisibility(getValues());
      initialCalculationDone.current = true;
    }
  }, [allQuestions, recalculateVisibility, getValues]);

  // Sync with Watch (Debounced) - Catches external updates
  useEffect(() => {
    if (!initialCalculationDone.current) return;

    const timeout = setTimeout(() => {
      recalculateVisibility();
    }, 50); // Small debounce

    return () => clearTimeout(timeout);
  }, [allFormValues, recalculateVisibility]);

  // 🔥 FIX 3: Memoize based on visibleQuestions STATE
  const visibleCategoryQuestions = useMemo(() => {
    if (!currentCategory?.questions) return [];
    // Dependency on `visibleQuestions` guarantees this updates when logic runs
    return currentCategory.questions.filter((q) =>
      visibleQuestions.has(q.sequence_num)
    );
  }, [currentCategory, visibleQuestions]);

  return {
    visibleQuestions, // Return the STATE
    visibleCategoryQuestions,
    visibleCategoryCount: visibleCategoryQuestions.length,
    totalCategoryQuestions: currentCategory?.questions?.length || 0,
    isQuestionVisible: (q: SurveyQuestion) =>
      visibleQuestions.has(q.sequence_num),
    handleAnswerChangeWithLogic,
    recalculateVisibility,
  };
}
