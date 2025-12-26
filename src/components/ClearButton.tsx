interface ClearButtonProps {
  onClear: () => void;
  visible: boolean;
  ariaLabel?: string;
}

export const ClearButton = ({
  onClear,
  visible,
  ariaLabel = "Clear input",
}: ClearButtonProps) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      className="
        absolute right-2 top-1/2 -translate-y-1/2
        text-gray-400 hover:text-gray-600
        p-1 rounded-full
        hover:bg-gray-100
        transition-colors
      "
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};
