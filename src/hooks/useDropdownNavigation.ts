import { useState, useEffect } from "react";
import { findPathToOption, parseOption } from "../utils/helpers";


export interface HistoryItem {
  options: any[];
  label?: string;
}

interface UseDropdownNavigationProps {
  availableOptions: any[];
  allFlatOptions: any[];
  existingValue: any;
  existingOther?: any;
  inputText: string;
  setInputText: (text: string) => void;
  onSelectCallback: (value: string, otherValue: string) => void;
}

export const useDropdownNavigation = ({
  availableOptions,
  allFlatOptions,
  existingValue,
  existingOther,
  inputText,
  setInputText,
  onSelectCallback,
}: UseDropdownNavigationProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentNavOptions, setCurrentNavOptions] = useState(availableOptions);
  const [filteredOptions, setFilteredOptions] = useState(availableOptions);

  // Reset state when available options change (e.g. parent dependency changes)
  useEffect(() => {
    setCurrentNavOptions(availableOptions);
    setFilteredOptions(availableOptions);
    setHistory([]);
  }, [availableOptions]);

  // Handle Search vs Navigation filtering
  useEffect(() => {
    if (inputText) {
      const isBreadcrumb = inputText.includes(" / ");
      if (!isBreadcrumb) {
        // Search Mode
        const searchResults = allFlatOptions.filter((opt: any) =>
          parseOption(opt)
            .optionLabel.toLowerCase()
            .includes(inputText.toLowerCase())
        );
        setFilteredOptions(searchResults);
      }
    } else {
      // Navigation Mode
      setFilteredOptions(currentNavOptions);
    }
  }, [inputText, currentNavOptions, allFlatOptions]);

  const handleBack = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setCurrentNavOptions(previousState.options);
    setHistory((prev) => prev.slice(0, -1));
    setInputText("");
  };

  const selectOption = (option: any) => {
    const { optionValue, optionLabel, optionId, isOther, subOptions } = parseOption(option);
    const hasChildren = subOptions && subOptions.length > 0;

    // 1. Drill-down Logic
    if (hasChildren) {
      setHistory((prev) => [
        ...prev,
        { options: currentNavOptions, label: optionLabel },
      ]);
      setCurrentNavOptions(subOptions);
      setInputText(""); 
      // Return true to indicate we are staying open
      return { keepOpen: true };
    }

    // 2. Selection Logic
    let displayLabel = "";

    if (isOther) {
      onSelectCallback(String(optionId), inputText);
      displayLabel = inputText || "Other";
    } else {
      if (history.length > 0) {
        // Normal drill-down path
        const breadcrumbs = history.map((h) => h.label).filter(Boolean);
        displayLabel = [...breadcrumbs, optionLabel].join(" / ");
      } else {
        // Search result path
        const fullPath = findPathToOption(availableOptions, optionId);
        displayLabel = fullPath ? fullPath.join(" / ") : optionLabel;
      }
      onSelectCallback(String(optionValue), "");
    }

    setInputText(displayLabel);
    setHistory([]);
    setCurrentNavOptions(availableOptions);
    return { keepOpen: false };
  };

  // Initialize display text from existing form value
  useEffect(() => {
    if (existingValue && !inputText) {
      const flatMatch = allFlatOptions.find(
        (o: any) => String(parseOption(o).optionId) === String(existingValue)
      );
      if (flatMatch && parseOption(flatMatch).isOther) {
        setInputText(existingOther || "Other");
      } else {
        const path = findPathToOption(availableOptions, existingValue);
        if (path) setInputText(path.join(" / "));
      }
    }
  }, [existingValue, availableOptions, allFlatOptions, existingOther]);

  return {
    history,
    filteredOptions,
    currentNavOptions,
    handleBack,
    selectOption,
    setHistory,
    setCurrentNavOptions,
  };
};