import { useMutation, useNotify, useRedirect, useTranslate, useRefresh } from "react-admin";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../utils/CustomHooks/HelperFunctions";

/**
 *  party relation hook created for delete relation
 *
 * @returns {string} delete message returned from api
 */
const useRelationShip = () => {
  const notify = useNotify();
  const [mutate] = useMutation();
  const translate = useTranslate();
  const redirect = useRedirect();
  const refresh = useRefresh();
  /**
   * @function deleteHandler Function to delete relation
   * @param {string} id relation id value passed
   * @param {boolean} isRedirect flag to redirect after delete
   * @param {string} partyId party id value passed
   */
  const deleteHandler = (id, isRedirect, partyId) => {
    /**
     * @function handleSuccess This function will handle success of the mutation
     * @param {object} res is passed to the function
     */
    const handleSuccess = (res) => {
      notify(res.data.message || translate("delete_success_message"), "info", TIMEOUT);
      if (isRedirect) {
        redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/relations`);
      } else {
        refresh();
      }
    };
    const resource = `${window.REACT_APP_PARTY_SERVICE}/party-relations/${id}`;
    mutate(
      {
        type: "update",
        resource,
        payload: {},
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };
  return deleteHandler;
};

export default useRelationShip;
