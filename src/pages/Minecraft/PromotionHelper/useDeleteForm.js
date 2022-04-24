import { useDelete, useNotify, useRedirect, useTranslate } from "react-admin";

/**
 * @function useDeleteForm custom hook to delete the promotion.
 * @param {string} deleteId coupon id to be deleted.
 * @param {string} redirectUrl url to be redirected after deletetion.
 * @returns {Array<Function>} an array with single function to handle deletion.
 */
const useDeleteForm = (deleteId, redirectUrl) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();

  const currentItemUrl = `${window.REACT_APP_MINECRAFT_SERVICE}/promotions/${deleteId}/`;

  const [deleteHandler] = useDelete(currentItemUrl, {}, null, {
    onSuccess: (res) => {
      if (res.data) {
        redirect(redirectUrl);
        notify(res.data.message || translate("delete_success_message"));
      } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
        notify(
          res.data.errors[0].field
            ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
            : `${res.data.errors[0].message}`,
        );
      }
    },
    onFailure: (error) => {
      notify(`Error: ${error.message}`, "warning");
    },
  });

  return [deleteHandler];
};

export default useDeleteForm;
