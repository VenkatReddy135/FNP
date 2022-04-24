/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";

/**
 * @function useFormValidity custom hook to check form validity
 * @param {object.initialForm} initialForm form schema with validation functions
 * @returns {Array<Function>} to check the validity of form schema
 */
const useFormValidity = ({ initialForm }) => {
  const formSchema = initialForm;

  const updateFormValidity = useCallback((formValues) => {
    Object.keys(formSchema).forEach((formName) => {
      const allValidations = formSchema[formName].validations.map((validator) => validator(formValues));
      const validity = allValidations.reduce((acc, curr) => acc && curr, true);

      formSchema[formName].status = validity;
    });

    return Object.keys(formSchema).reduce((acc, cur) => ({ ...acc, [cur]: formSchema[cur].status }), {});
  }, []);

  return [updateFormValidity];
};

export default useFormValidity;
