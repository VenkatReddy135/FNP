/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useTranslate, useMutation, useRefresh, useNotify } from "react-admin";
import { useDispatch } from "react-redux";
import SimpleGrid from "../../../../components/SimpleGrid";
import SimpleModel from "../../../../components/CreateModal";
import { setOccasionData } from "../../../../actions/freemessagecard";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import formatDateValue from "../../../../utils/formatDateTime";

/**
 * Component for Occasions List contains a simple grid with configurations for Occasions
 *
 * @param {object} props all the props needed for Occasions List
 * @returns {React.ReactElement} returns a Occasions List component
 */
const OccasionList = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const configurationForKebabMenu = [];
  const dispatch = useDispatch();

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
          message={`${translate("update_message")} ${translate("configuration")}${translate("question_mark")}`}
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
   * To close confirm dialog.
   *
   * @function closeDialogHandler
   */
  const closeDialogHandler = () => {
    setIsOpen(false);
  };

  /**
   * To send record object across message listing and other pages.
   *
   * @function clickHandler
   * @param {object} _event onClick event object
   * @param {object} record object containing selected occasion
   */
  const clickHandler = (_event, record) => {
    dispatch(setOccasionData({ selectedOccasion: record }));
  };

  /**
   *
   * @function handleSuccess to handle success of the API
   * @param {object} res response object containing status and response data
   */
  const handleSuccess = (res) => {
    if (res.status === "success" && res.data) refresh();
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
        resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/occasion/${selectedRecord.id}`,
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

  const configurationForOccasionGrid = [
    { source: "occasionName", type: "TextField", label: translate("category_occ") },
    {
      source: "enabled",
      type: "SwitchComp",
      compareKey: "enabled",
      label: translate("status"),
      disable: false,
      onChange: handleStatusChange,
    },
    {
      source: "occasionId",
      type: "KebabMenuWithLink",
      label: translate("messages"),
      tabPath: "/view",
      isLink: true,
      configurationForKebabMenu,
      isAnchorLink: true,
      displayText: translate("Manage"),
      onLinkClick: clickHandler,
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

  const occasionGridTitle = translate("free_message_config");
  const occasionSearchLabel = translate("search");
  // dispatch(setOccasionData({ selectedOccasion: {} }));

  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages`}
        configurationForGrid={configurationForOccasionGrid}
        actionButtonsForGrid={[]}
        actionButtonsForEmptyGrid={[]}
        gridTitle={occasionGridTitle}
        searchLabel={occasionSearchLabel}
        sortField={{ field: "occasionName", order: "ASC" }}
        isSmallerSearch
      />
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={closeDialogHandler}
        handleAction={updateHandler}
      />
    </>
  );
};

export default React.memo(OccasionList);
