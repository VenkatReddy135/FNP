/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect, useNotify, useQueryWithStore, useUpdate } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import SimpleModel from "../../../../../components/CreateModal";
import CommonDelete from "../../../../../components/CommonDelete";
import { initialEditRelationObj } from "./ViewEditCategoryRelationConstants";
import ViewEditCategoryRelationsUI from "./ViewEditCategoryRelationsUI";
import { getFormattedTimeValue } from "../../../../../utils/formatDateTime";
import LoaderComponent from "../../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component to render the View/Edit Page of Category Relation Management
 *
 * @param {*} props all the props required by the Category Relation Management - View/Edit
 * @returns {React.ReactElement} returns the View/Edit Page of Category Relation Management
 */
const ViewEditCategoryRelation = (props) => {
  const { isEditable, history, match } = props;
  const catId = localStorage.getItem("selectedCategoryId");
  const { id } = match.params;
  const translate = useTranslate();
  const [relationTypes, setRelationTypes] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editRelationObj, setEditRelationObj] = useState(initialEditRelationObj);
  const [responseData, setResponseData] = useState({});
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const redirect = useRedirect();
  const notify = useNotify();
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: catId,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${catId}/show`,
    },
    {
      displayName: translate("category_relation"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${catId}/show/relationship`,
    },
    { displayName: id },
  ];

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/association-types`,
      payload: {},
    },
    {
      onSuccess: (res) => {
        const relationTypeValue = [];
        if (res.data && res.status === "success") {
          res.data.data.forEach((data) => {
            relationTypeValue.push({ id: data.id, name: data.associationTypeName });
          });
          setRelationTypes(relationTypeValue);
        } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          notify(
            res.data.errors[0].field
              ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
              : `${res.data.errors[0].message}`,
            "error",
            TIMEOUT,
          );
        }
      },
      onFailure: (error) => {
        notify(`Error: ${error.message}`, "error", TIMEOUT);
      },
    },
  );

  const { loading } = useQueryWithStore(
    {
      type: "getOne",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/associations/association`,
      payload: { associationId: id, categoryId: catId },
    },
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          setResponseData(res.data);
          localStorage.setItem("selectedAssociationId", res.data.id);
          setEditRelationObj({
            isPrimary: res.data.isPrimary,
            sequence: res.data.sequence,
            associationType: res.data.associationTypeId,
            targetCategoryId: { id: res.data.targetCategoryId, name: res.data.targetCategoryName },
            fromDate: res.data.fromDate,
            thruDate: res.data.thruDate,
            comment: res.data.comment,
            isEnabled: res.data.isEnabled,
          });
        } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          notify(
            res.data.errors[0].field
              ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
              : `${res.data.errors[0].message}`,
            "error",
            TIMEOUT,
          );
        }
      },
      onFailure: (error) => {
        notify(`Error: ${error.message}`, "error", TIMEOUT);
      },
    },
  );

  const [updateCategoryRelation] = useUpdate(
    `${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`,
    { associationId: id, categoryId: catId },
    { ...editRelationObj, targetCategoryId: editRelationObj?.targetCategoryId?.id },
    null,
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          notify(res.data.message || translate("update_association_success_message"));
          redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${catId}/show/relationship`);
        } else if (res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          setIsOpen(false);
          notify(res.data.errors[0].message || translate("update_association_error_message"), "error", TIMEOUT);
        } else {
          setIsOpen(false);
          notify(res.data.message);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );

  /**
   * @function dialogContent function renders the Pup-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function showPopup function renders a confirmation pop-up with action buttons
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    if (editRelationObj.targetCategoryId === null || Object.keys(editRelationObj.targetCategoryId).length === 0) {
      setErrorMsg(true);
      return;
    }
    const message = `${translate("update_message")} ${translate("relation")}`;
    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: translate("cancel"),
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setIsOpen(true);
  };

  /**
   * Function to toggle Custom Delete dialogs
   *
   * @function deleteToggleOpen
   */
  const deleteToggleOpen = useCallback(() => {
    setDeleteModal(true);
  }, []);

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   */
  const cancelTagHandler = useCallback(() => {
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${catId}/show/relationship`);
  }, [catId, redirect]);

  /**
   *@function switchToEdit function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/associations/${id}`);
  }, [history, id]);

  /**
   * @function handleCategoryNameChange function called on change of Category Name in edit relation page
   * @param {*} event event called on change of Category Name
   * @param {*} newValue value key
   */
  const handleCategoryNameChange = useCallback(
    (event, newValue) => {
      setEditRelationObj({
        ...editRelationObj,
        targetCategoryId: newValue,
      });
      setErrorMsg(false);
    },
    [editRelationObj],
  );

  /**
   *@function handleIsEnabledChange function called on change of isEnabled in edit relation page
   *@param {*} event event called on change of isEnabled switch
   */
  const handleIsEnabledChange = useCallback(
    (event) => {
      setEditRelationObj({
        ...editRelationObj,
        isEnabled: event,
      });
    },
    [editRelationObj],
  );

  /**
   *@function updatedObjHandler function called on save button
   *@param {object} editData event called on change of isEnabled switch
   */
  const updatedObjHandler = (editData) => {
    showPopup("Continue");
    const editObj = {
      associationType: editData.associationTypeId,
      fromDate: editRelationObj.fromDate,
      thruDate: editRelationObj.thruDate,
      isPrimary: editData.isPrimary,
      sequence: editData.sequence,
    };
    setEditRelationObj({ ...editRelationObj, ...editObj });
  };

  /**
   *@function handleFromDateChange function called on change of From date in edit relation page
   *@param {*} event event called on change of From date
   */
  const handleFromDateChange = useCallback(
    (event) => {
      const updatedFromDateWithTime = event.target.value.concat("T", getFormattedTimeValue());
      setEditRelationObj({ ...editRelationObj, fromDate: updatedFromDateWithTime });
    },
    [editRelationObj],
  );

  /**
   *@function handleToDateChange function called on change of To date in edit relation page
   *@param {*} event event called on change of To date
   */
  const handleToDateChange = useCallback(
    (event) => {
      const updatedToDateWithTime = event.target.value.concat("T", getFormattedTimeValue());
      setEditRelationObj({ ...editRelationObj, thruDate: updatedToDateWithTime });
    },
    [editRelationObj],
  );
  useEffect(() => {
    if (editRelationObj.targetCategoryId === null || Object.keys(editRelationObj.targetCategoryId).length === 0) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [editRelationObj.targetCategoryId]);
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {loading ? (
        <LoaderComponent />
      ) : (
        <ViewEditCategoryRelationsUI
          responseData={responseData}
          isEditable={isEditable}
          selectedCategoryId={catId}
          relationTypes={relationTypes}
          showPopup={showPopup}
          cancelTagHandler={cancelTagHandler}
          handleFromDateChange={handleFromDateChange}
          handleToDateChange={handleToDateChange}
          handleCategoryNameChange={handleCategoryNameChange}
          deleteToggleOpen={deleteToggleOpen}
          switchToEditHandler={switchToEditHandler}
          handleIsEnabledChange={handleIsEnabledChange}
          isEnabled={editRelationObj.isEnabled}
          categoryNameVal={editRelationObj.targetCategoryId}
          loading={loading}
          handleUpdatedObj={updatedObjHandler}
          fromDate={editRelationObj.fromDate}
          errorMsg={errorMsg}
        />
      )}
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={updateCategoryRelation}
      />

      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`}
        deleteText={`${translate("delete_confirmation_message")} ${translate("association")}?`}
        redirectPath={`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${catId}/show/relationship`}
        params={{ associationId: id, categoryId: catId }}
        close={() => setDeleteModal(false)}
        open={deleteModal}
        list={false}
      />
    </>
  );
};

ViewEditCategoryRelation.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  history: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

ViewEditCategoryRelation.defaultProps = {
  history: {},
};

export default ViewEditCategoryRelation;
