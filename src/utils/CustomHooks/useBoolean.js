import { useState, useRef } from "react";

/**
 * @function useBoolean
 * @param {boolean} initialValue is initial boolean value.
 * @returns {Array} value and object containing functions to update boolean values.
 */
const useBoolean = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const updateValue = useRef({
    toggle: () => setValue((prevValue) => !prevValue),
    on: () => setValue(true),
    off: () => setValue(false),
  });

  return [value, updateValue.current];
};

export default useBoolean;
