// components/questions/DropDownQuestion.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption, flattenOptions } from "../../utils/helpers"; // Import the new helper
import { GENERIC_ERROR_MSG } from "../../constants/survey";

interface DropDownQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const DropDownQuestion = ({
  question,
  register,
  setValue,
  watch,
}: DropDownQuestionProps) => {
  const fieldName = String(question.sequence_num);
  
  // 1. Setup Data Sources
  // The root level options (for navigation)
  const initialOptions = question.options || [];

  // The flattened list of ALL options (for global search)
  // We use useMemo so we don't recalculate this on every render
  const allFlatOptions = useMemo(() => {
    return flattenOptions(initialOptions, parseOption);
  }, [initialOptions]);

  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  
  // Navigation State
  const [currentNavOptions, setCurrentNavOptions] = useState(initialOptions);
  const [history, setHistory] = useState<any[]>([]); // Tracks depth
  
  // Display State
  const [filteredOptions, setFilteredOptions] = useState(initialOptions);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { formState: { errors } } = useFormContext();

  if (!question.options) return null;

  // 2. Logic: Switch between "Search Mode" and "Navigation Mode"
  useEffect(() => {
    if (inputText) {
      // --- SEARCH MODE ---
      // Filter against the FLATTENED list of all options
      const searchResults = allFlatOptions.filter((opt) => {
        const { optionLabel } = parseOption(opt);
        return optionLabel.toLowerCase().includes(inputText.toLowerCase());
      });
      setFilteredOptions(searchResults);
    } else {
      // --- NAVIGATION MODE ---
      // Show the options for the current level of depth
      setFilteredOptions(currentNavOptions);
    }
  }, [inputText, currentNavOptions, allFlatOptions]);

  // 3. Logic: Handling Selection
  const handleOptionSelect = (option: any) => {
    const { optionValue, optionLabel, optionId, isOther, subOptions } = parseOption(option);
    const hasChildren = subOptions && subOptions.length > 0;

    // SCENARIO A: Search Mode Active
    // If user is searching, clicking a result usually selects it directly.
    // However, if the result is a category (has children), we might want to drill into it.
    if (inputText) {
       if (hasChildren) {
          // If searching and clicking a parent, clear search and show its children
          setHistory((prev) => [...prev, { options: currentNavOptions }]); // Save where we were (or root)
          setCurrentNavOptions(subOptions);
          setInputText(""); // Clear text to enter Navigation Mode
          inputRef.current?.focus();
          return;
       }
       // If it's a leaf node (sub-option), fall through to Selection Logic below
    } 
    // SCENARIO B: Navigation Mode Active (Drilling Down)
    else if (hasChildren) {
        setHistory((prev) => [...prev, { options: currentNavOptions }]);
        setCurrentNavOptions(subOptions);
        inputRef.current?.focus();
        return;
    }

    // --- FINAL SELECTION LOGIC ---
    if (isOther) {
      setValue(fieldName, optionId);
      setValue(`${fieldName}_other`, inputText);
    } else {
      setInputText(optionLabel);
      setValue(fieldName, optionValue);
      setValue(`${fieldName}_other`, "");
    }

    setShowOptions(false);
    
    // Reset navigation to top level after selection (optional, but good UX)
    setHistory([]);
    setCurrentNavOptions(initialOptions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowOptions(true);
    
    // While typing, clear the actual form value until they select something
    if (value === "") {
        // If they clear the input, ensure we reset navigation to top if they weren't deep in hierarchy
        if (history.length === 0) setCurrentNavOptions(initialOptions);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setCurrentNavOptions(previousState.options);
    setHistory((prev) => prev.slice(0, -1));
    setInputText("");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { required } = question.constraints;

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          placeholder={history.length > 0 ? "..." : question.placeholder}
          className={`block w-full px-3 py-2 text-sm border rounded-md shadow focus:outline-none focus:ring-1 transition-colors duration-200 
            ${errors[fieldName] ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-amber-500 bg-amber-50"}`}
        />

        {showOptions && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            
            {/* Back Button - Only show if traversing history AND not currently searching */}
            {history.length > 0 && !inputText && (
              <div 
                onClick={handleBack}
                className="sticky top-0 bg-gray-100 p-2 border-b border-gray-200 cursor-pointer flex items-center text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                <span className="mr-2">←</span> ተመለስ
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const { optionLabel, optionId, isOther, subOptions } = parseOption(option);
                const hasChildren = subOptions && subOptions.length > 0;
                
                // Show arrow if it's a parent node
                const showArrow = hasChildren;

                return (
                  <div
                    key={optionId}
                    onClick={() => handleOptionSelect(option)}
                    className="flex justify-between items-center p-3 bg-white hover:bg-amber-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span>
                      {isOther ? `Other: ${inputText || "..."}` : optionLabel}
                      {/* Optional: Add a label to show parent name if in global search mode */}
                      {inputText && hasChildren && <span className="text-gray-400 text-xs ml-2">(Category)</span>}
                    </span>
                    
                    {showArrow && (
                       <span className="text-gray-400 text-xs">►</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-gray-500 text-sm text-center">
                No results found.
              </div>
            )}
          </div>
        )}
      </div>

      <input {...register(fieldName, { required: required ? GENERIC_ERROR_MSG : false })} type="hidden" />
      <input {...register(`${fieldName}_other`)} type="hidden" />
    </div>
  );
};