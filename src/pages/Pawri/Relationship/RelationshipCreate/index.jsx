/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import { useParams } from "react-router-dom";
import SimpleModel from "../../../../components/CreateModal";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import filterRoles from "../PartyRelationCommon";
import LoaderComponent from "../../../../components/LoaderComponent";
import PartyRelationCreateUI from "./PartyRelationCreateUI";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * @function PartyRelationCreate Component to create a relationship
 * @returns {React.ReactElement} returns Create Relationship Create component
 */
const PartyRelationCreate = () => {
  const [mutate] = useMutation();
  const [open, toggleModal] = useState(false);
  const [toRolesData, setToRolesData] = useState({ primary: {}, other: [], toRole: [] });
  const [fromRolesData, setFromRolesData] = useState({
    primary: { roleId: "", roleName: "", primary: true },
    other: [],
    fromRole: [],
  });
  const [relationType, setRelationType] = useState([]);
  const [relationData, setRelationData] = useState({
    fromDate: "",
    fromThePartyId: "",
    inTheRoleOfFromTheParty: "",
    inTheRoleOfPartyTo: "",
    isA: "",
    toDate: null,
  });
  const [disable, setDisable] = useState(false);
  const { fromDate, fromThePartyId, inTheRoleOfFromTheParty, inTheRoleOfPartyTo, isA, toDate } = relationData;
  const translate = useTranslate();
  const { id, partyName } = useParams();
  const redirect = useRedirect();
  const notify = useNotify();
  /**
   * @function filterData This function will filter roles
   * @param {object} res is passed to the function
   * @returns {object} object of object and array
   */
  const filterData = (res) => {
    const filteredRoles = filterRoles(res.data);
    const rolesData = [];
    res.data.forEach((data) => {
      rolesData.push({ id: data.roleId, name: data.roleName });
    });
    return { filteredRoles, rolesData };
  };
  /**
   * @function handleToRolesData This function will setToRoles data
   * @param {object} res is passed to the function
   */
  const handleToRolesData = (res) => {
    const { filteredRoles, rolesData } = filterData(res?.data);
    setToRolesData({
      ...toRolesData,
      primary: filteredRoles.primary,
      other: [...filteredRoles.other],
      toRole: rolesData,
    });
  };

  const resourceForToRoles = `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${id}`;
  const { loading: toRolesLoading } = useCustomQueryWithStore("getData", resourceForToRoles, handleToRolesData);

  /**
   * @function handleRelationTypeData This function will setData for relation type
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleRelationTypeData = (res) => setRelationType([...res?.data?.data]);

  const resourceForRelationType = `${window.REACT_APP_PARTY_SERVICE}/relation-types`;
  const { loading: relationTypeLoading } = useCustomQueryWithStore(
    "getData",
    resourceForRelationType,
    handleRelationTypeData,
  );
  /**
   * @function handleSuccess This function will handle success of the mutation
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    const { filteredRoles, rolesData } = filterData(res?.data);
    setFromRolesData((prevState) => ({
      ...prevState,
      primary: filteredRoles.primary,
      other: [...filteredRoles.other],
      fromRole: rolesData,
    }));
  };

  /**
   *@function getPartyRoles get party roles for the dropdown of inTheRoleOfFromTheParty field
   * @param {string} partyId party id to fetch roles for dropdown
   */
  const getPartyRoles = (partyId) => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${partyId}`,
        payload: {},
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };
  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relationship Page
   * @param {Event} event event called on click of cancel
   */
  const cancelTagHandler = (event) => {
    event.preventDefault();
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/relations`);
  };
  /**
   * @function handleChange function called on onChange of the fromPartyId autocomplete field
   * @param {Event} event event contains data to set autocomplete field data
   * @param {string} newValue contains the value to set
   */
  const handlePartyChange = (event, newValue) => {
    setFromRolesData((prevState) => ({
      ...prevState,
      primary: { roleId: "", roleName: "", primary: true },
      other: [],
      fromRole: [],
    }));
    if (newValue) {
      setRelationData((prevState) => ({ ...prevState, fromThePartyId: newValue?.id, inTheRoleOfFromTheParty: "" }));
      getPartyRoles(newValue.id);
    } else {
      setRelationData((prevState) => ({ ...prevState, fromThePartyId: "", inTheRoleOfFromTheParty: "" }));
    }
  };
  /**
   * @function handleDate function called on onChange of Date field
   * @param {Event} event event contains data for Date state
   */
  const handleDate = (event) => {
    const { value, name } = event.target;
    const date = value || null;
    setRelationData((prevState) => ({ ...prevState, [name]: date }));
  };
  /**
   * @function handleCreateSuccess This function will handle Success on Update
   * @param {object} res contains message
   */
  const handleCreateSuccess = (res) => {
    notify(res.data.data.message || translate("party_relationship_create_success_message"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/relations`);
  };

  const postCreateRelationshipObj = {
    dataObj: {
      fromDate,
      fromThePartyId,
      inTheRoleOfFromTheParty,
      inTheRoleOfPartyTo,
      isA,
      toDate,
    },
  };

  /**
   * @param {object} res response from API
   * @function to handle errors while creating relationship
   */
  const handleBadRequest = (res) => {
    setDisable(false);
    notify(res.data?.errors[0]?.message, "error", TIMEOUT);
  };

  /**
   * @function createRelationship function called on click of Continue
   * This Post call is used to create new Relationship
   */
  const createRelationship = () => {
    toggleModal(false);
    setDisable(true);
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_PARTY_SERVICE}/parties/relations/${id}`,
        payload: {
          data: postCreateRelationshipObj,
        },
      },
      {
        onSuccess: (response) =>
          onSuccess({ response, notify, translate, handleSuccess: handleCreateSuccess, handleBadRequest }),
        onFailure: (error) => {
          setDisable(false);
          onFailure({ error, notify, translate });
        },
      },
    );
  };
  /**
   * @param {object} createObject contains form data
   * @function updateFormData function called on clicking create button
   */
  const updateFormData = (createObject) => {
    const updatedCreateObject = createObject;
    updatedCreateObject.toDate = toDate;
    updatedCreateObject.fromDate = fromDate;
    setRelationData((prevState) => ({ ...prevState, ...updatedCreateObject }));
    toggleModal(true);
  };

  return (
    <>
      {relationTypeLoading && toRolesLoading ? (
        <LoaderComponent />
      ) : (
        <PartyRelationCreateUI
          updateFormData={updateFormData}
          handleDate={handleDate}
          cancelTagHandler={cancelTagHandler}
          toRolesData={toRolesData}
          relationType={relationType}
          partyName={partyName}
          fromRolesData={fromRolesData}
          handlePartyChange={handlePartyChange}
          relationData={relationData}
        />
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("create_new_relationship_confirmation")} />}
        showButtons
        showTitle=""
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        isDisable={disable}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={createRelationship}
      />
    </>
  );
};

export default PartyRelationCreate;
