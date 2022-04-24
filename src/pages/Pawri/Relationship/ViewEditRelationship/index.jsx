/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import SimpleModel from "../../../../components/CreateModal";
import ViewEditRelationshipUI from "./viewEditRelationUI";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import useRelationsShip from "../useRelationShip";
import filterRoles from "../PartyRelationCommon";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import CommonDialogContent from "../../../../components/CommonDialogContent";
/**
 * @param {object} props props of view /edit relation page
 * @returns {React.createElement} renders view edit relationship component
 */
const ViewEditRelationship = (props) => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const { push } = useHistory();
  const [dialogObj, setConfirmDialog] = useState({});
  const [open, toggleModal] = useState(false);
  const { isEditable } = props;
  const { id, partyId } = useParams();
  const [responseData, setResponseData] = useState({});
  const [editRelationObj, setEditRelationObj] = useState({});
  const [partyToRoles, setPartyToRoles] = useState({ primary: {}, other: [], toRole: [] });
  const [fromPartyRoles, setFromPartyRoles] = useState({
    primary: { roleId: "", roleName: "", primary: true },
    other: [],
    fromRole: [],
  });
  const [relationTypes, setRelationTypes] = useState([]);
  const notify = useNotify();
  const [mutate] = useMutation();
  const deleteRelationship = useRelationsShip();
  /**
   * @param {Event} event object passed to the function
   * @function cancelHandler function called on click of cancel button of edit Relationship Page
   */
  const cancelHandler = (event) => {
    event.preventDefault();
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/relations`);
  };
  /**
   * @function filterData This function will filter roles
   * @param {object} res is passed to the function
   * @returns {object} object of object and array
   */
  const filterData = (res) => {
    const filteredRoles = filterRoles(res.data);
    const rolesVal = [];
    res.data.forEach((data) => {
      rolesVal.push({ id: data.roleId, name: data.roleName });
    });
    return { filteredRoles, rolesVal };
  };
  /**
   * @function handleSuccess This function will handle success of the mutation
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    const { filteredRoles, rolesVal } = filterData(res?.data);
    setFromPartyRoles((prevState) => ({
      ...prevState,
      primary: filteredRoles.primary,
      other: [...filteredRoles.other],
      fromRole: [...rolesVal],
    }));
  };
  /**
   * @function getRoles
   * @param {string} fromPartyId partyId passed to the function
   */
  const getRoles = (fromPartyId) => {
    const resource = `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${fromPartyId}`;
    mutate(
      {
        type: "getData",
        resource,
        payload: {},
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };
  /**
   * @function handleToRolesData This function will setToRoles data
   * @param {object} res is passed to the function
   */
  const handleToRolesData = (res) => {
    const { filteredRoles, rolesVal } = filterData(res?.data);
    setPartyToRoles({
      ...partyToRoles,
      primary: filteredRoles.primary,
      other: [...filteredRoles.other],
      toRole: [...rolesVal],
    });
  };

  const resourceForToRoles = `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${partyId}`;
  useCustomQueryWithStore("getData", resourceForToRoles, handleToRolesData);

  /**
   * @function handleRelationTypeData This function will setData for relation type
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleRelationTypeData = (res) => setRelationTypes([...res?.data?.data]);

  const resourceForRelationType = `${window.REACT_APP_PARTY_SERVICE}/relation-types`;
  useCustomQueryWithStore("getData", resourceForRelationType, handleRelationTypeData);
  /**
   * @function handleInitialData This function will set initial roles data
   * @param {object} res is passed to the function
   * @returns {object} object
   */
  const handleInitialData = (res) => {
    const { fromDate, fromThePartyId, inTheRoleOfFromPartyId, inTheRolePartyId, isAId, toDate } = res?.data;
    setEditRelationObj({
      fromDate,
      fromThePartyId,
      inTheRoleOfFromTheParty: inTheRoleOfFromPartyId,
      inTheRoleOfPartyTo: inTheRolePartyId,
      isA: isAId,
      toDate,
    });
    getRoles(fromThePartyId);
    return setResponseData(res.data);
  };
  const resourceForInitialData = `${window.REACT_APP_PARTY_SERVICE}/party-relations/${id}`;
  const { loading } = useCustomQueryWithStore("getOne", resourceForInitialData, handleInitialData);
  /**
   * @function handleUpdateSuccess This function will handle success of the mutation
   * @param {object} res is passed to the function
   */
  const handleUpdateSuccess = (res) => {
    notify(res?.data?.message || translate("updateSuccessMessage"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/relations`);
  };
  const { fromDate, fromThePartyId, inTheRoleOfFromTheParty, inTheRoleOfPartyTo, isA, toDate } = editRelationObj;
  /**
   * @function updateRelationship function called on click of Continue
   */
  const updateRelationship = () => {
    toggleModal(false);
    const resource = `${window.REACT_APP_PARTY_SERVICE}/party-relations/${id}`;
    mutate(
      {
        type: "put",
        resource,
        payload: {
          id: null,
          data: {
            fromDate,
            fromThePartyId,
            inTheRoleOfFromTheParty,
            inTheRoleOfPartyTo,
            isA,
            toDate,
          },
        },
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };
  /**
   * @function deleteHandler Function to delete relation
   * @param {Event} event object passed on delete button click
   */
  const deleteHandler = (event) => {
    event.preventDefault();
    deleteRelationship(id, true, partyId);
    toggleModal(false);
  };
  /**
   * @function dialogContent function renders the Pup-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => <CommonDialogContent message={message} />;
  /**
   *@function switchToEditHandler function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = () => {
    push(`/${window.REACT_APP_PARTY_SERVICE}/parties/relations/${id}/partyId=${partyId}`);
  };
  /**
   * @function handleFromPartyChange function to update fromTheParty field
   * @param {object} partyObj selected fromTheParty object
   */
  const handlePartyChange = (partyObj) => {
    setFromPartyRoles((prevState) => ({ ...prevState, primary: {}, other: [], fromRole: [] }));
    if (partyObj) {
      setEditRelationObj((prevState) => ({
        ...prevState,
        fromThePartyId: partyObj.id,
        inTheRoleOfFromTheParty: "",
      }));
      getRoles(partyObj.id);
    } else {
      setEditRelationObj((prevState) => ({
        ...prevState,
        fromThePartyId: "",
        inTheRoleOfFromTheParty: "",
      }));
    }
  };
  /**
   * @function handleDate function called on onChange of Date field
   * @param {Event} event event contains data for Date state
   */
  const handleDate = (event) => {
    const { value, name } = event.target;
    const date = value || null;
    setEditRelationObj((prevState) => ({ ...prevState, [name]: date }));
  };
  /**
   * @function showPopup function called on click of update button on edit Page and delete button on view page
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    const message =
      action === translate("continue")
        ? translate("update_existing_relationship_confirmation")
        : translate("delete_relationship_confirmation");
    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: translate("cancel"),
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    toggleModal(true);
  };
  /**
   *@function formUpdateData used to update the data
   * @param {object} createObj contains from data
   */
  const formUpdateData = (createObj) => {
    const updatedCreateObj = createObj;
    updatedCreateObj.fromDate = fromDate;
    updatedCreateObj.toDate = toDate;
    setEditRelationObj((prevState) => ({ ...prevState, ...updatedCreateObj }));
    showPopup("Continue");
  };
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <ViewEditRelationshipUI
          isEditable={isEditable}
          cancelHandler={cancelHandler}
          partyToRoles={partyToRoles}
          relationTypes={relationTypes}
          fromPartyRoles={fromPartyRoles}
          responseData={responseData}
          showPopup={showPopup}
          formUpdateData={formUpdateData}
          switchToEditHandler={switchToEditHandler}
          handlePartyChange={handlePartyChange}
          handleDate={handleDate}
          editRelationObj={editRelationObj}
        />
      )}
      <SimpleModel
        {...dialogObj}
        openModal={open}
        handleClose={() => toggleModal(false)}
        handleAction={dialogObj.actionText === translate("continue") ? updateRelationship : deleteHandler}
      />
    </>
  );
};

ViewEditRelationship.propTypes = {
  isEditable: PropTypes.bool.isRequired,
};

export default ViewEditRelationship;
