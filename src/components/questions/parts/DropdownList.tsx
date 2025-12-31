import type { HistoryItem } from "../../../hooks/useDropdownNavigation";
import { parseOption } from "../../../utils/helpers";

interface DropdownListProps {
  history: HistoryItem[];
  filteredOptions: any[];
  inputText: string;
  onBack: () => void;
  onSelect: (option: any) => void;
}

export const DropdownList = ({
  history,
  filteredOptions,
  inputText,
  onBack,
  onSelect,
}: DropdownListProps) => {
  const showBackButton = history.length > 0 && !inputText;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
      {showBackButton && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing
            onBack();
          }}
          className="sticky top-0 bg-gray-50 p-2 border-b border-gray-200 cursor-pointer flex items-center text-sm font-medium text-amber-700 hover:bg-gray-100"
        >
          <span className="mr-2">←</span>ተመለስ
        </div>
      )}

      {filteredOptions.length > 0 ? (
        filteredOptions.map((option: any) => {
          const { optionLabel, optionId, isOther, subOptions } = parseOption(option);
          const hasChildren = subOptions && subOptions.length > 0;

          return (
            <div
              key={optionId}
              onClick={() => onSelect(option)}
              className="flex justify-between items-center p-3 bg-white hover:bg-amber-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-700">
                {isOther ? `Other: ${inputText || "..."}` : optionLabel}
                {inputText && hasChildren && !inputText.includes(" / ") && (
                  <span className="text-gray-400 text-xs ml-2">
                    (ንዑስ አማራጮችን ይዟል)
                  </span>
                )}
              </span>
              {hasChildren && <span className="text-gray-400 text-xs">►</span>}
            </div>
          );
        })
      ) : (
        <div className="p-3 text-gray-500 text-sm text-center">
          ምንም ውጤት አልተገኘም።
        </div>
      )}
    </div>
  );
};