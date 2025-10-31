import { useState, useRef, useEffect, useMemo } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

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

  // --- Normalize options to string[] safely ---
  const normalizedOptions: string[] = useMemo(() => {
    const opts = question?.options;
    if (Array.isArray(opts)) {
      return opts.map((o) => (o == null ? "" : String(o))).filter(Boolean);
    }
    if (typeof opts === "string") {
      return opts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (opts && typeof opts === "object") {
      try {
        return Object.values(opts)
          .map((v) => (v == null ? "" : String(v)))
          .filter(Boolean);
      } catch {
        return [];
      }
    }
    return [];
  }, [question?.options]);

  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] =
    useState<string[]>(normalizedOptions);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // bail out if no normalized options
  if (!normalizedOptions || normalizedOptions.length === 0) return null;

  const hasOtherOption = normalizedOptions.some(
    (opt) => opt.trim().toLowerCase() === "other"
  );

  // Filter options based on input
  useEffect(() => {
    if (inputText) {
      const filtered = normalizedOptions.filter((opt) =>
        opt.toLowerCase().includes(inputText.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(normalizedOptions);
    }
  }, [inputText, normalizedOptions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowOptions(true);

    // If there's an "Other" option and user is typing custom text
    if (hasOtherOption && value && !normalizedOptions.includes(value)) {
      setValue(fieldName, "Other");
      setValue(`${fieldName}_other`, value);
    } else if (!value) {
      setValue(fieldName, "");
      setValue(`${fieldName}_other`, "");
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (option.trim().toLowerCase() === "other") {
      setValue(fieldName, "Other");
      setValue(`${fieldName}_other`, inputText);
    } else {
      setInputText(option);
      setValue(fieldName, option);
      setValue(`${fieldName}_other`, "");
    }
    setShowOptions(false);
  };

  // Close dropdown on outside click
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
      if (String(selectedValue) === "Other") {
        const otherText = watch(`${fieldName}_other`);
        setInputText(otherText || "");
      } else {
        setInputText(String(selectedValue));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const { required, min, max } = question.constraints || {};

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          placeholder="Type to search or select..."
          className="border p-2 rounded w-full"
        />

        {showOptions && filteredOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                {option.trim().toLowerCase() === "other"
                  ? `Other: ${inputText || "Enter custom text"}`
                  : option}
              </div>
            ))}
          </div>
        )}

        {showOptions && filteredOptions.length === 0 && inputText && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 p-2 text-gray-500">
            No options found
          </div>
        )}
      </div>

      {/* Hidden inputs for form registration */}
      <input
        {...register(fieldName, {
          required: required ? `This field is required` : false,
        })}
        type="hidden"
      />
      <input
        {...register(`${fieldName}_other`, {
          maxLength: max || undefined,
          minLength: min || undefined,
        })}
        type="hidden"
      />
    </div>
  );
};
