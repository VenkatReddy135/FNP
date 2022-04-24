/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from "react";
import { useTranslate, useMutation, useNotify, useRefresh } from "react-admin";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIconOutlined from "@material-ui/icons/DeleteOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import useStyles from "../../../../assets/theme/common";
import SimpleModel from "../../../../components/CreateModal";
import LoaderComponent from "../../../../components/LoaderComponent";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import pollingService from "../../../../utils/pollingService";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Publisher Management List contains a simple grid with configurations for Publishers
 *
 * @param {object} props all the props needed for Publisher Management List
 * @returns {React.ReactElement} returns a Publisher Management List component
 */
const PublisherList = (props) => {
  const translate = useTranslate();
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState("");
  const [publisherDeleted, setPublisherDeleted] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const breadcrumbs = [{ displayName: translate("publisher_manager") }];

  /**
   * handle on polling success
   *
   * @function onPollingSuccess to handle polling success
   */
  const onPollingSuccess = () => {
    refresh();
  };

  const { handlePollingSuccess } = pollingService({
    notify,
    mutate,
    translate,
    url: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/request-status`,
    successMessage: translate("publisher_delete_success_message"),
    setLoader: setPublisherDeleted,
    onPollingSuccess,
  });

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected publisher id to delete
   */
  const deleteHandler = (rowId) => {
    setId(rowId);
    setOpenDialog(true);
  };

  /**
   * toggle to close the delete dialog
   *
   * @function toggle
   */
  const toggle = () => {
    setOpenDialog(false);
  };

  /**
   * @function createHandler
   * @param {object} event contains event related data
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `publishers/create`,
    });
  };

  /**
   * @param {object} response response from API
   * @function to handle errors for response other than success
   */
  const handleBadDeleteRequest = (response) => {
    setPublisherDeleted(false);
    notify(response.message ? response.message : translate("error_message_party_create"), "error", TIMEOUT);
  };

  /**
   * @function handleSuccessForCreate to handle success on create publisher
   * @param {object} response from API
   */
  const handleSuccessForDelete = (response) => {
    handlePollingSuccess(response.data.requestId);
  };

  /**
   * @function modelAction to show the model action
   */
  const modelAction = () => {
    setOpenDialog(false);
    mutate(
      {
        type: "delete",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/${id}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleSuccessForDelete,
            handleBadRequest: handleBadDeleteRequest,
          });
        },
        onFailure: (error) => {
          setPublisherDeleted(false);
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "Edit",
      leftIcon: <EditIcon />,
      path: "",
      routeType: "",
      isEditable: false,
    },
    {
      id: "2",
      type: "Delete",
      leftIcon: <DeleteIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];

  const configurationForPublisherMasterGrid = [
    {
      source: "name",
      type: "KebabMenuWithLink",
      label: translate("publisher_name"),
      configurationForKebabMenu,
      tabPath: "",
    },
    { source: "createdDate", type: "DateField", label: translate("date_created") },
    { source: "createdBy", type: "TextField", label: translate("created_by") },
    { source: "modifiedDate", type: "CustomDateField", label: translate("last_updated_stamp") },
    { source: "modifiedBy", type: "TextField", label: translate("last_updated_by") },
  ];
  const actionButtonsForPublisherMasterGrid = [
    {
      type: "CreateButton",
      label: translate("add_new_publisher"),
      variant: "contained",
      icon: <></>,
      onClick: createHandler,
    },
  ];
  const actionButtonsForEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("add_new_publisher"),
      variant: "contained",
      icon: <></>,
      onClick: createHandler,
    },
  ];

  const publisherGridTitle = translate("publisher_manager");
  const publisherManagementSearchLabel = translate("search_by_publisher_name");

  /**
   * @function getDeleteModalContent get delete modal content
   * @returns {React.ReactElement} returns content dom
   */
  const getDeleteModalContent = () => {
    return (
      <div className={classes.contentStyle}>
        <DeleteIconOutlined />
        <span style={{ display: "block" }} className={classes.dialogContentStyle}>
          {translate("publisher_delete_text")}
        </span>
      </div>
    );
  };

  return (
    <>
      {publisherDeleted ? (
        <LoaderComponent />
      ) : (
        <div>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <SimpleGrid
            {...props}
            resource={`${window.REACT_APP_PARTY_SERVICE}/publishers`}
            configurationForGrid={configurationForPublisherMasterGrid}
            actionButtonsForGrid={actionButtonsForPublisherMasterGrid}
            sortField={{ field: "modifiedDate", order: "DESC" }}
            gridTitle={publisherGridTitle}
            searchLabel={publisherManagementSearchLabel}
            actionButtonsForEmptyGrid={actionButtonsForEmptyGrid}
          />
        </div>
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={getDeleteModalContent()} />}
        showButtons
        closeText={translate("commondelete_cancel")}
        actionText={translate("commondelete_delete")}
        openModal={openDialog}
        handleClose={toggle}
        handleAction={modelAction}
      />
    </>
  );
};

export default memo(PublisherList);
