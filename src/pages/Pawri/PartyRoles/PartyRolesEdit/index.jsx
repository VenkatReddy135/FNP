import React, { useState } from "react";
import { useTranslate, useMutation, useNotify, useRedirect, useCreate } from "react-admin";
import { useParams } from "react-router-dom";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import PartyRolesEditView from "./PartyRolesEditView";
import LoaderComponent from "../../../../components/LoaderComponent";
import FilterRoles from "../PartyRolesCommon";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks/HelperFunctions";
/**
 * @returns {React.ReactElement} returns partyRolesEdit form
 */
const PartyRolesEdit = () => {
  const { id, partyTypeId } = useParams();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const [partyData, setPartyData] = useState({ primary: { roleId: "", roleName: "", primary: true }, other: [] });
  const [roles, setRoles] = useState([]);
  const notify = useNotify();
  /**
   * @function handleRolesData This function will set roles data
   * @param {object} res is passed to the function
   * @returns {Array} object of object and array
   */
  const handleRolesData = (res) => {
    const filteredRoles = FilterRoles(res?.data?.data);
    return setPartyData((prevState) => ({
      ...prevState,
      primary: filteredRoles.primary,
      other: [...filteredRoles.other],
    }));
  };

  const resourceForRolesData = `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${id}`;
  const { loading } = useCustomQueryWithStore("getData", resourceForRolesData, handleRolesData);

  /**
   * @function handleOptionalRolesData This function will set optional roles data
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleOptionalRolesData = (res) => {
    const arr = res?.data?.data?.map((role) => ({ name: role.name, id: role.id }));
    return setRoles([...arr]);
  };

  const resourceForOptionalRolesData = `${window.REACT_APP_SIMSIM_SERVICE}/party-type-roles/${partyTypeId}`;
  const { loading: optionalRolesLoading } = useCustomQueryWithStore(
    "getData",
    resourceForOptionalRolesData,
    handleOptionalRolesData,
  );

  const list = [...partyData.other, partyData.primary];
  const filteredList = list.map((role) => {
    if (role) {
      const { roleName, ...rest } = role;
      return rest;
    }
    return null;
  });
  const dataStringified = JSON.stringify([...filteredList]);
  const formattedData = dataStringified.split(":").join(": ");
  /**
   * @function handleCreateSuccess This function will handle Success on Update
   * @param {object} res contains message
   */
  const handleCreateSuccess = (res) => {
    notify(res.data.message || translate("party_roles_update_success_message"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/roles`);
  };
  /**
   * @function  updateRoles post call to set the updated roles
   */
  const [updateRoles] = useCreate(
    `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${id}`,
    {
      dataObj: formattedData,
      params: {},
    },
    {
      onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess: handleCreateSuccess }),
      onFailure: (error) => onFailure({ error, notify, translate }),
    },
  );
  /**
   * @function handleSuccess This function will handle success
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    notify(res.data.message || translate("party_roles_delete_success_message"), "info", TIMEOUT);
  };

  /**
   * @param {string} roleId Role id of the role to be deleted
   * @function deleteRole delete call to delete the selected role
   */
  const deleteRole = (roleId) => {
    mutate(
      {
        type: "delete",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${id}`,
        payload: { id: { roleId } },
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };

  /**
   * @function cancelTagHandler function called on click of cancel button of roles edit form
   */
  const cancelTagHandler = () => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/roles`);
  };

  /**
   * @function formValidate function called on click of update button of roles edit form
   * Used to check the validation of form on click of update button
   * @param {object} partyRolesObject contains the value to check for validation
   * @param {string} partyRolesObject.primary.roleId primary role id
   * @returns {boolean} returns either true or false depending on the condition
   */
  const formValidate = (partyRolesObject) => {
    if (!partyRolesObject?.primary?.roleId) {
      notify(translate("primary_field_required_message"), "error", TIMEOUT);
      return false;
    }
    return true;
  };

  /**
   *@function handleSubmit to handle submit of user role edit form
   * @param {event} event to handle event of onSubmit
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValidate(partyData)) {
      updateRoles();
    }
  };

  return loading && optionalRolesLoading ? (
    <LoaderComponent />
  ) : (
    <PartyRolesEditView
      partyData={partyData}
      setPartyData={setPartyData}
      handleSubmit={handleSubmit}
      cancelTagHandler={cancelTagHandler}
      deleteRole={deleteRole}
      roles={roles}
    />
  );
};

export default PartyRolesEdit;
