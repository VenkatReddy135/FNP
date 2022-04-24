export const SAVE_FORM_DATA = "SAVE_FORM_DATA";

/**
 * Action type to add form values in the state
 *
 * @name saveFormData
 * @param {object} payload contains form values
 * @returns {object} Form values.
 *
 */
export function saveFormData(payload) {
  return { type: SAVE_FORM_DATA, payload };
}
