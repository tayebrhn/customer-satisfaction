// components/questions/DropDownQuestion.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useFormContext,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption, flattenOptions } from "../../utils/helpers";
import { GENERIC_ERROR_MSG } from "../../constants/survey";
import { useClearableInput } from "../../hooks/useClearableInput";
import { ClearButton } from "../ClearButton";

interface DropDownQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

interface HistoryItem {
  options: any[];
  label?: string;
}

const findPathToOption = (
  options: any[],
  targetId: string | number
): string[] | null => {
  for (const option of options) {
    const { optionId, optionLabel, subOptions } = parseOption(option);
    if (String(optionId) === String(targetId)) return [optionLabel];
    if (subOptions && subOptions.length > 0) {
      const childPath = findPathToOption(subOptions, targetId);
      if (childPath) return [optionLabel, ...childPath];
    }
  }
  return null;
};

export const DropDownQuestion = ({
  question,
  register,
  setValue,
  watch,
}: DropDownQuestionProps) => {
  const fieldName = String(question.sequence_num);

  const initialOptions = question.options || [];
  const allFlatOptions = useMemo(
    () => flattenOptions(initialOptions, parseOption),
    [initialOptions]
  );

  const existingValue = watch(fieldName);
  const existingOther = watch(`${fieldName}_other`);

  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentNavOptions, setCurrentNavOptions] = useState(initialOptions);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredOptions, setFilteredOptions] = useState(initialOptions);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { clear } = useClearableInput({
    inputRef,
    onClearValue: () => {
      setInputText("");
      setValue(fieldName, "");
      setValue(`${fieldName}_other`, "");
      setHistory([]);
      setCurrentNavOptions(initialOptions);
    },
  });

  const {
    formState: { errors },
  } = useFormContext();

  if (!question.options) return null;

  // --- Initialize Input from Existing Value ---
  useEffect(() => {
    if (existingValue && !inputText) {
      const flatMatch = allFlatOptions.find(
        (o: any) => String(parseOption(o).optionId) === String(existingValue)
      );
      if (flatMatch && parseOption(flatMatch).isOther) {
        setInputText(existingOther || "Other");
      } else {
        const path = findPathToOption(initialOptions, existingValue);
        if (path) setInputText(path.join(" / "));
      }
    }
  }, [existingValue, initialOptions, allFlatOptions, existingOther]);

  // --- Filtering Logic ---
  useEffect(() => {
    if (inputText) {
      const isBreadcrumb = inputText.includes(" / ");
      if (!isBreadcrumb) {
        const searchResults = allFlatOptions.filter((opt: any) =>
          parseOption(opt)
            .optionLabel.toLowerCase()
            .includes(inputText.toLowerCase())
        );
        setFilteredOptions(searchResults);
      }
    } else {
      setFilteredOptions(currentNavOptions);
    }
  }, [inputText, currentNavOptions, allFlatOptions]);

  const handleOptionSelect = (option: any) => {
    const { optionValue, optionLabel, optionId, isOther, subOptions } =
      parseOption(option);
    const hasChildren = subOptions && subOptions.length > 0;

    // 1. Navigation Logic (Drill-down)
    // If the user selects a parent, move into its sub-options
    if (hasChildren) {
      setHistory((prev) => [
        ...prev,
        { options: currentNavOptions, label: optionLabel },
      ]);
      setCurrentNavOptions(subOptions);
      setInputText(""); // Clear search text to show sub-options
      inputRef.current?.focus();
      return;
    }

    // 2. Leaf Selection Logic
    let displayLabel = "";

    if (isOther) {
      setValue(fieldName, optionId);
      setValue(`${fieldName}_other`, inputText);
      displayLabel = inputText || "Other";
    } else {
      // --- LOGIC CHANGE START ---
      // If we have history, we are drilling down normally
      if (history.length > 0) {
        const breadcrumbs = history.map((h) => h.label).filter(Boolean);
        displayLabel = [...breadcrumbs, optionLabel].join(" / ");
      } else {
        // If history is empty, the user likely found this via Search.
        // We find the full path from the root to this specific option.
        const fullPath = findPathToOption(initialOptions, optionId);
        displayLabel = fullPath ? fullPath.join(" / ") : optionLabel;
      }
      // --- LOGIC CHANGE END ---

      setInputText(displayLabel);
      setValue(fieldName, optionValue);
      setValue(`${fieldName}_other`, "");
    }

    setShowOptions(false);
    setHistory([]);
    setCurrentNavOptions(initialOptions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowOptions(true);

    // Only reset navigation if the user completely clears the input
    // and they weren't already deep in a folder
    if (value === "" && history.length === 0) {
      setCurrentNavOptions(initialOptions);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setCurrentNavOptions(previousState.options);
    setHistory((prev) => prev.slice(0, -1));
    setInputText("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { required } = question.constraints;
  const currentParent =
    history.length > 0 ? history[history.length - 1].label : null;
  const placeholderText = currentParent
    ? `በ${currentParent} ውስጥ ይምረጡ...`
    : question.placeholder || "Select an option...";

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          placeholder={placeholderText}
          // Added 'pr-8' (padding-right) so text doesn't go under the X button
          className={`block w-full pl-3 pr-8 py-2 text-sm border rounded-md shadow focus:outline-none focus:ring-1 transition-colors duration-200 
            ${
              errors[fieldName]
                ? "border-red-500 ring-red-500"
                : "border-gray-300 focus:ring-amber-500 bg-amber-50"
            }`}
        />

        {/* --- NEW: Clear Button (Only shows when there is text) --- */}
        {inputText && (
          <ClearButton
            visible={!!inputText}
            onClear={clear}
            ariaLabel="Clear dropdown selection"
          />
        )}

        {showOptions && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            {history.length > 0 && !inputText && (
              <div
                onClick={handleBack}
                className="sticky top-0 bg-gray-50 p-2 border-b border-gray-200 cursor-pointer flex items-center text-sm font-medium text-amber-700 hover:bg-gray-100"
              >
                <span className="mr-2">←</span>ተመለስ{" "}
                {/* {history.length > 1 ? history[history.length - 2].label : "Top"} */}
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: any) => {
                const { optionLabel, optionId, isOther, subOptions } =
                  parseOption(option);
                const hasChildren = subOptions && subOptions.length > 0;

                return (
                  <div
                    key={optionId}
                    onClick={() => handleOptionSelect(option)}
                    className="flex justify-between items-center p-3 bg-white hover:bg-amber-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700">
                      {isOther ? `Other: ${inputText || "..."}` : optionLabel}
                      {inputText &&
                        hasChildren &&
                        !inputText.includes(" / ") && (
                          <span className="text-gray-400 text-xs ml-2">
                            (ንዑስ አማራጮችን ይዟል)
                          </span>
                        )}
                    </span>
                    {hasChildren && (
                      <span className="text-gray-400 text-xs">►</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-gray-500 text-sm text-center">
                ምንም ውጤት አልተገኘም።
              </div>
            )}
          </div>
        )}
      </div>

      <input
        {...register(fieldName, {
          required: required ? GENERIC_ERROR_MSG : false,
        })}
        type="hidden"
      />
      <input {...register(`${fieldName}_other`)} type="hidden" />
    </div>
  );
};
