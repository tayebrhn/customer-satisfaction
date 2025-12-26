import type { RefObject } from "react";

interface UseClearableInputParams {
  onClearValue: () => void;
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const useClearableInput = ({
  onClearValue,
  inputRef,
}: UseClearableInputParams) => {
  const clear = () => {
    onClearValue();
    inputRef?.current?.focus();
  };

  return { clear };
};
