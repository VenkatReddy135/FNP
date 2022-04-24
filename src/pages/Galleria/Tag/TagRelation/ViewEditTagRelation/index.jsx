/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import SimpleModel from "../../../../../components/CreateModal";
import CommonDelete from "../../../../../components/CommonDelete";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import ViewEditTagRelationsUI from "./ViewEditTagRelationsUI";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../utils/CustomHooks";
import LoaderComponent from "../../../../../components/LoaderComponent";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component to render the View/Edit Page of Tag Relation
 *
 * @param {*} props all the props required by the Tag Relation  - View/Edit
 * @returns {React.ReactElement} returns the View/Edit Page of Tag Relation
 */
const ViewEditTagRelation = (props) => {
  const { isEditable, history, match } = props;
  const { id, tagId } = match.params;
  const translate = useTranslate();
  const [mutate] = useMutation();

  const initialEditRelationObj = {
    isEnabled: false,
    relationTypeId: "",
    targetTagId: {},
    sequence: null,
  };
  const [relationTypes, setRelationTypes] = useState([]);
  const [editRelationObj, setEditRelationObj] = useState(initialEditRelationObj);
  const [responseData, setResponseData] = useState({});
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [flag, setFlag] = useState({
    isOpen: false,
    deleteModal: false,
    errorMsg: false,
  });
  const redirect = useRedirect();
  const notify = useNotify();

  const { isOpen, errorMsg, deleteModal } = flag;
  const { isEnabled, relationTypeId, targetTagId, sequence } = editRelationObj;

  const baseURL = `${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/show/relations`;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: id, navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/show` },
    {
      displayName: translate("tag_relations_and_associations"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/show/relations`,
    },
    { displayName: tagId },
  ];

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const relationType = res?.data?.data?.map(({ id: tagRelationId, name }) => {
      return { id: tagRelationId, name };
    });
    setRelationTypes(relationType);
  };

  const resource = `${window.REACT_APP_GALLERIA_SERVICE}/tags/relation-types`;
  const { loading } = useCustomQueryWithStore("getData", resource, handleSetDataSuccess);

  /**
   * @function handleSuccess This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    setResponseData(res?.data);
    const { sequence: tagSequence, isEnabled: isTagEnabled } = res?.data;
    setEditRelationObj({
      sequence: tagSequence,
      isEnabled: isTagEnabled,
      relationTypeId: res?.data?.tagRelationType?.id,
      targetTagId: { id: res?.data?.toTag?.tagId, name: res?.data?.toTag?.tagName },
    });
  };

  const tagIdResource = `${window.REACT_APP_GALLERIA_SERVICE}/tags/relations/${tagId}`;
  useCustomQueryWithStore("getData", tagIdResource, handleSuccess);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response object to get the response status
   */
  const handleUpdateSuccess = (response) => {
    notify(response?.data?.message, "info", TIMEOUT);
    setFlag((prev) => {
      return { ...prev, isOpen: false };
    });
    redirect(`/${baseURL}`);
  };

  /**
   * @function updateTagRelation function called when button click for update
   */
  const updateTagRelation = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/relations`,
        payload: {
          data: {
            id: tagId,
            isEnabled,
            relationTypeId,
            sequence,
            targetTagId: targetTagId.id || targetTagId,
          },
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
   * @function showPopup function renders a confirmation pop-up with action buttons
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    if (targetTagId === null || Object.keys(targetTagId).length === 0) {
      setFlag((prev) => {
        return { ...prev, errorMsg: true };
      });
      return;
    }
    const message = translate("update_tag_relation_confirmation_message");
    const dialogObject = {
      dialogContent: <CommonDialogContent message={message} />,
      showButtons: true,
      closeText: translate("cancel"),
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setFlag((prev) => {
      return { ...prev, isOpen: true };
    });
  };

  /**
   * Function to toggle Custom Delete dialogs
   *
   * @function deleteToggleOpen
   */
  const deleteToggleOpen = useCallback(() => {
    setFlag((prev) => {
      return { ...prev, deleteModal: true };
    });
  }, []);

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   */
  const cancelTagHandler = useCallback(() => {
    redirect(`/${baseURL}`);
  }, [redirect, baseURL]);

  /**
   *@function switchToEdit function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/relations/${tagId}/edit`);
  }, [tagId, history, id]);

  /**
   *@function handleIsEnabledChange function called on change of isEnabled in edit relation page
   *@param {*} switchVal event called on change of isEnabled switch
   */
  const handleIsEnabledChange = useCallback(
    (switchVal) => {
      setEditRelationObj({
        ...editRelationObj,
        isEnabled: switchVal,
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
      sequence: editData.sequence,
      relationTypeId: editData?.tagRelationType?.id,
    };
    setEditRelationObj({ ...editRelationObj, ...editObj });
  };

  useEffect(() => {
    const checkValueFlag = Boolean(targetTagId === null || Object.keys(targetTagId).length === 0);
    setFlag((prev) => {
      return { ...prev, errorMsg: checkValueFlag };
    });
  }, [targetTagId]);

  /**
   * @function handleAutocompleteChange function that updates the changed value of Tag name dropdown
   * @param {string} e value of selected Tag name
   * @param {string} newValue value key
   */
  const handleAutocompleteChange = (e, newValue) => {
    const newVal = newValue === null ? {} : newValue;
    setEditRelationObj({ ...editRelationObj, targetTagId: newVal });
    setFlag((prev) => {
      return { ...prev, errorMsg: false };
    });
  };

  /**
   * @function handleModelClose function that updates the changed value of Tag name dropdown
   */
  const handleModelClose = useCallback(() => {
    setFlag((prev) => {
      return { ...prev, isOpen: false };
    });
  }, [setFlag]);

  /**
   * @function handleDeleteModel function that updates the changed value of Tag name dropdown
   */
  const handleDeleteModel = useCallback(() => {
    setFlag((prev) => {
      return { ...prev, deleteModal: false };
    });
  }, [setFlag]);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <ViewEditTagRelationsUI
            responseData={responseData}
            isEditable={isEditable}
            id={id}
            relationTypes={relationTypes}
            showPopup={showPopup}
            cancelTagHandler={cancelTagHandler}
            deleteToggleOpen={deleteToggleOpen}
            switchToEditHandler={switchToEditHandler}
            handleIsEnabledChange={handleIsEnabledChange}
            editRelationObj={editRelationObj}
            handleUpdatedObj={updatedObjHandler}
            handleAutocompleteChange={handleAutocompleteChange}
            errorMsg={errorMsg}
          />
          <SimpleModel
            {...confirmDialogObj}
            openModal={isOpen}
            handleClose={handleModelClose}
            handleAction={updateTagRelation}
          />

          <CommonDelete
            resource={`${window.REACT_APP_GALLERIA_SERVICE}/tags/relations/${tagId}`}
            deleteText={translate("delete_tag_relation_confirmation_message")}
            redirectPath={`/${baseURL}`}
            close={handleDeleteModel}
            open={deleteModal}
            list={false}
          />
        </>
      )}
    </>
  );
};

ViewEditTagRelation.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  history: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

ViewEditTagRelation.defaultProps = {
  history: {},
};

export default ViewEditTagRelation;
