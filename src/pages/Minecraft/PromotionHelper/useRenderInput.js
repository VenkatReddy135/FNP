import { useState } from "react";

/**
 * @function useRenderInput custom hook to rerender the input fields.
 * @returns {Array<Function>} an array with with state and function to handle reMounting.
 */
const useRenderInput = () => {
  const [renderInput, setRenderInput] = useState(true);

  /**
   * @function reMount rerender input to avoid retaining of cleared values.
   */
  const reMount = () => {
    setRenderInput(false);
    setTimeout(() => {
      setRenderInput(true);
    }, 0);
  };

  return [renderInput, reMount];
};

export default useRenderInput;
