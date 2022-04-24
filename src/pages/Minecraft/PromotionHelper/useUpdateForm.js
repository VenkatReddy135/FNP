import { useCallback } from "react";

/**
 * @function useUpdateForm custom hook to update the master form values.
 * @param {object} updateMasterForm object which is required dependencies for updateMasterForm Component.
 * @returns {Array} an array with single function to handle changes of the masterform.
 */
const useUpdateForm = (updateMasterForm) => {
  const handleChange = useCallback(
    (value, event, type = "field") => {
      if (type === "generic_radio_group") {
        updateMasterForm({ type: "field", payload: { fieldName: value.fieldName, value: event } });
      } else {
        updateMasterForm({
          type,
          payload: { fieldName: value.fieldName, value: value.fieldValue || event?.target?.value },
        });
      }
    },
    [updateMasterForm],
  );

  return [handleChange];
};

export default useUpdateForm;
