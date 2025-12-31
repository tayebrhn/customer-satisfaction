import { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption, flattenOptions } from "../../utils/helpers";
import { GENERIC_ERROR_MSG } from "../../constants/survey";
import { useClearableInput } from "../../hooks/useClearableInput";
import { ClearButton } from "../ClearButton";
import { useDropdownNavigation } from "../../hooks/useDropdownNavigation";
import { DropdownList } from "./parts/DropdownList"; // Import the new UI component

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
  const {
    depends_on,
    sequence_num,
    constraints: { required },
    placeholder,
    options,
  } = question;

  const fieldName = String(sequence_num);
  const parentValue = watch(String(depends_on));
  const existingValue = watch(fieldName);
  const existingOther = watch(`${fieldName}_other`);
  
  const { formState: { errors } } = useFormContext();

  // 1. Dependency Filtering (Logic kept here as it relies on form context)
  const availableOptions = useMemo(() => {
    const originalOptions = options || [];
    if (!depends_on) return originalOptions;
    if (depends_on && !parentValue) return [];
    return originalOptions.filter((opt) => String(opt.dependency_option) === String(parentValue));
  }, [options, depends_on, parentValue]);

  const allFlatOptions = useMemo(
    () => flattenOptions(availableOptions, parseOption),
    [availableOptions]
  );

  // 2. Local UI State
  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. Navigation Logic Hook
  const { 
    history, 
    filteredOptions, 
    handleBack, 
    selectOption, 
    setHistory, 
    setCurrentNavOptions 
  } = useDropdownNavigation({
    availableOptions,
    allFlatOptions,
    existingValue,
    existingOther,
    inputText,
    setInputText,
    onSelectCallback: (val, other) => {
      setValue(fieldName, val);
      setValue(`${fieldName}_other`, other);
    }
  });

  // 4. Cleanup Logic (Ghost values)
  useEffect(() => {
    if (existingValue) {
      const isValid = allFlatOptions.some(
        (o: any) => String(parseOption(o).optionId) === String(existingValue)
      );
      if (!isValid) {
        setInputText("");
        setValue(fieldName, "");
      }
    }
  }, [availableOptions, allFlatOptions, existingValue, setValue, fieldName]);

  // 5. Input Clear Logic
  const { clear } = useClearableInput({
    inputRef,
    onClearValue: () => {
      setInputText("");
      setValue(fieldName, "");
      setValue(`${fieldName}_other`, "");
      setHistory([]);
      setCurrentNavOptions(availableOptions);
    },
  });

  // 6. Interaction Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowOptions(true);
    if (value === "" && history.length === 0) {
      setCurrentNavOptions(availableOptions);
    }
  };

  const onOptionClick = (option: any) => {
    const { keepOpen } = selectOption(option);
    if (keepOpen) {
      inputRef.current?.focus();
    } else {
      setShowOptions(false);
    }
  };

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!options) return null;

  const currentParent = history.length > 0 ? history[history.length - 1].label : null;
  const placeholderText = currentParent
    ? `በ${currentParent} ውስጥ ይምረጡ...`
    : placeholder || "ይምረጡ...";

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
          className={`block w-full pl-3 pr-8 py-2 text-sm border rounded-md shadow focus:outline-none focus:ring-1 transition-colors duration-200 
            ${errors[fieldName] ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-amber-500 bg-amber-50"}`}
        />

        {inputText && (
          <ClearButton
            visible={!!inputText}
            onClear={clear}
            ariaLabel="Clear dropdown selection"
          />
        )}

        {showOptions && (
          <DropdownList
            history={history}
            filteredOptions={filteredOptions}
            inputText={inputText}
            onBack={handleBack}
            onSelect={onOptionClick}
          />
        )}
      </div>

      <input
        {...register(fieldName, { required: required ? GENERIC_ERROR_MSG : false })}
        type="hidden"
      />
      <input {...register(`${fieldName}_other`)} type="hidden" />
    </div>
  );
};