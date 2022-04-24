/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from "react";
import { useTranslate, useNotify, useRedirect, useMutation } from "react-admin";
import { useParams } from "react-router-dom";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import LoaderComponent from "../../../../components/LoaderComponent";
import SimpleModel from "../../../../components/CreateModal";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import PartyPersonalEditView from "./PartyPersonalEditView";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import { INDIVIDUAL } from "../../PartyCreate/CreatePartyConstants";

/**
 * Component for Party Personal information edit
 *
 * @returns {React.ReactElement} returns edit layout for personal Info
 */
const PartyPersonalInfoEdit = () => {
  const { id, partyType } = useParams();
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const [editPersonalObj, setPersonalEditObj] = useState({
    dateOfAnniversary: null,
    dateOfBirth: null,
    gender: "",
    name: "",
    contactPersonName: "",
    designation: "",
    faxNumber: "",
    taxNumber: "",
    organizationName: "",
  });
  const [dialogObj, setConfirmDialog] = useState({});
  const [open, toggleModal] = useState(false);
  const translate = useTranslate();

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res API response
   */
  const handleSetDataSuccess = (res) => {
    setPersonalEditObj(res.data);
  };

  const resource =
    partyType === INDIVIDUAL
      ? `${window.REACT_APP_PARTY_SERVICE}/party-individuals/${id}`
      : `${window.REACT_APP_PARTY_SERVICE}/party-organizations/${id}`;

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);
  /**
   * @function cancelHandler function called on click of cancel button of Personal edit page
   * @param {Event} event event called on click of cancel
   */
  const cancelHandler = useCallback(
    (event) => {
      event.preventDefault();
      redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show`);
    },
    [id],
  );

  /**
   * @function dialogContent function renders the Pup-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => <CommonDialogContent message={message} />;

  /**
   * @function showPopup function renders a confirmation pop-up with action buttons
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    const message = translate("updateConfirmationMessage");
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
   * @param {object} response response from API
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = (response) => {
    notify(response.data.message || translate("updateSuccessMessage"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show`);
  };

  /**
   * @function continueHandler function called on click of continue button from confirmation modal
   * @param {Event} event called on click of cancel
   */
  const continueHandler = (event) => {
    toggleModal(false);
    event.preventDefault();
    const { dateOfAnniversary, dateOfBirth, name, contactPersonName, designation, organizationName } = editPersonalObj;
    const postObject = {
      ...editPersonalObj,
      name: name.trim(),
      contactPersonName: contactPersonName.trim(),
      designation: designation.trim(),
      organizationName: organizationName.trim(),
      dateOfAnniversary: dateOfAnniversary ? new Date(dateOfAnniversary).toISOString().replace(".000Z", "") : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().replace(".000Z", "") : null,
    };
    mutate(
      {
        type: "put",
        resource,
        payload: {
          data: postObject,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @param {object} editData edit data of personal info
   * @function onUpdateHandler function called on click of update button
   */
  const onUpdateHandler = useCallback((editData) => {
    setPersonalEditObj({ ...editPersonalObj, ...editData });
    showPopup("Continue");
  }, []);

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <PartyPersonalEditView
          partyType={partyType}
          editPersonalObj={editPersonalObj}
          onUpdateHandler={onUpdateHandler}
          cancelHandler={cancelHandler}
        />
      )}
      <SimpleModel
        {...dialogObj}
        openModal={open}
        handleClose={() => toggleModal(false)}
        handleAction={continueHandler}
      />
    </>
  );
};

export default PartyPersonalInfoEdit;
