// components/questions/DropDownQuestion.tsx
import { useState, useRef, useEffect } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption } from "../../utils/helpers";

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
  const fieldName = String(question.id);
  const selectedValue = watch(fieldName);

  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(
    question.options || []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!question.options) return null;

  // Check if there's an "Other" option
  const otherOption = question.options.find((option) => {
    const { isOther } = parseOption(option);
    return isOther;
  });

  // Filter options based on input text
  useEffect(() => {
    if (inputText) {
      const filtered = question.options!.filter((option) => {
        const { optionLabel } = parseOption(option);
        return optionLabel.toLowerCase().includes(inputText.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(question.options!);
    }
  }, [inputText, question.options]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowOptions(true);

    // If there's an "Other" option and user is typing, set the value to "Other" option ID
    if (otherOption && value) {
      const { optionId } = parseOption(otherOption);
      setValue(fieldName, optionId);
      setValue(`${fieldName}_other`, value);
    } else if (!value) {
      // Clear values if input is empty
      setValue(fieldName, "");
      setValue(`${fieldName}_other`, "");
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: any) => {
    const { optionValue, optionLabel, optionId, isOther } = parseOption(option);

    if (isOther) {
      // If "Other" is selected, keep the current input text
      setValue(fieldName, optionId);
      setValue(`${fieldName}_other`, inputText);
    } else {
      // If regular option is selected, use the option label as input text
      setInputText(optionLabel);
      setValue(fieldName, optionValue);
      setValue(`${fieldName}_other`, "");
    }

    setShowOptions(false);
  };

  // Handle click outside to close dropdown
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

  // Initialize input text with selected value
  useEffect(() => {
    if (selectedValue) {
      const selectedOption = question.options!.find((option) => {
        const { optionValue, optionId } = parseOption(option);
        return optionValue === selectedValue || optionId === selectedValue;
      });

      if (selectedOption) {
        const { optionLabel, isOther } = parseOption(selectedOption);
        if (isOther) {
          const otherText = watch(`${fieldName}_other`);
          setInputText(otherText || "");
        } else {
          setInputText(optionLabel);
        }
      }
    }
  }, [selectedValue, question.options, fieldName, watch]);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          placeholder="Type to search or select an option..."
          className="border p-2 rounded w-full"
        />

        {showOptions && filteredOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => {
              const { optionValue, optionLabel, optionId, isOther } =
                parseOption(option);
              return (
                <div
                  key={optionId}
                  onClick={() => handleOptionSelect(option)}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {isOther
                    ? `Other: ${inputText || "Enter custom text"}`
                    : optionLabel}
                </div>
              );
            })}
          </div>
        )}
        {showOptions && filteredOptions.length === 0 && inputText && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 p-2 text-gray-500">
            ...{" "}
          </div>
        )}
      </div>

      {/* Hidden inputs for form registration */}
      <input
        {...register(fieldName, {
          required: question.required
            ? `${question.question} is required`
            : false,
        })}
        type="hidden"
      />
      <input
        {...register(`${fieldName}_other`, {
          required: question.required ? `Please specify` : false,
        })}
        type="hidden"
      />
    </div>
  );
};
