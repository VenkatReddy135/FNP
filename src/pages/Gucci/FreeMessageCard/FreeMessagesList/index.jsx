/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from "react";
import { useTranslate, useMutation, useRefresh, useNotify } from "react-admin";
import PropTypes from "prop-types";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../components/SimpleGrid";
import SimpleModel from "../../../../components/CreateModal";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import formatDateValue from "../../../../utils/formatDateTime";

/**
 * Component for Message list functionality which lists the messages under specific occasions
 *
 * @param {object} props all the props needed for Message List
 * @returns {React.ReactElement} returns a Message list component
 */
const FreeMessagesList = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const messageSearchLabel = translate("search");
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const {
    occasionData: { selectedOccasion },
  } = useSelector((state) => state.messagecard);
  const occasionID = selectedOccasion?.id;
  const occasionName = selectedOccasion?.occasionName;

  /**
   * @param {object} event data for create button
   * @function createHandler
   */
  const handleNewMessageChange = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/occasion/create`,
    });
  };

  /**
   * To change the value for status enabled/disable
   *
   * @param {boolean} _event enable/disable value for selected record
   * @param {object} record selected record object
   * @function handleStatusChange
   */
  const handleStatusChange = (_event, record) => {
    const dialogObject = {
      dialogContent: (
        <CommonDialogContent
          message={`${translate("update_message")} ${translate("message")}${translate("question_mark")}`}
        />
      ),
      showButtons: true,
      closeText: translate("cancel"),
      actionText: translate("update"),
    };
    setConfirmDialog(dialogObject);
    setSelectedRecord(record);
    setIsOpen(true);
  };

  /**
   * To send record object across message listing and other pages.
   *
   * @function handleSuccess to handle success of the API
   * @param {object} response response object containing status and response data
   */
  const handleSuccess = (response) => {
    if (response.status === "success" && response.data) refresh();
  };

  /**
   * To update status for a selected record
   *
   * @function updateHandler
   */
  const updateHandler = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${selectedRecord.id}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    setIsOpen(false);
  };

  /**
   *Function to handle rendering for function field.
   *
   * @function customRenderHandler
   * @param {object} record individual record from list
   * @returns {Function} formatDateValue returns formatted date/time value
   */
  const customRenderHandler = (record) => {
    return record.updatedAt ? `${formatDateValue(record.updatedAt)}` : `${formatDateValue(record.createdAt)}`;
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: `/edit`,
      isEditable: true,
    },
  ];

  const configurationForMessageGrid = [
    {
      source: "text",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("message_on_card"),
      tabPath: "",
      isLink: false,
    },
    {
      source: "enabled",
      type: "SwitchComp",
      label: translate("status"),
      disable: false,
      onChange: handleStatusChange,
    },
    { source: "createdBy", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedBy", type: "TextField", label: translate("modified_by") },
    {
      source: "updatedAt",
      type: "FunctionField",
      label: translate("last_modified_date"),
      sortBy: "updatedAt",
      render: customRenderHandler,
    },
  ];
  const actionButtonsForMessageListGrid = [
    {
      type: "CreateButton",
      label: translate("new_message"),
      icon: <></>,
      onClick: handleNewMessageChange,
      variant: "outlined",
    },
  ];
  const actionButtonsForMessageEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("new_message"),
      icon: <></>,
      onClick: handleNewMessageChange,
      variant: "outlined",
    },
  ];
  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/occasion`}
        configurationForGrid={configurationForMessageGrid}
        actionButtonsForGrid={actionButtonsForMessageListGrid}
        actionButtonsForEmptyGrid={actionButtonsForMessageEmptyGrid}
        searchLabel={messageSearchLabel}
        gridTitle={occasionName}
        filter={{ occasionId: occasionID }}
        sortField={{ field: "createdAt", order: "DESC" }}
        isSmallerSearch
      />

      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={updateHandler}
      />
    </>
  );
};
FreeMessagesList.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default FreeMessagesList;
