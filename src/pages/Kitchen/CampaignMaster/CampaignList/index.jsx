/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, memo } from "react";
import { useTranslate, useRedirect, useMutation, useNotify, useRefresh } from "react-admin";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import HistoryIcon from "@material-ui/icons/History";
import get from "lodash/get";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import SimpleGrid from "../../../../components/SimpleGrid";
import CommonDelete from "../../../../components/CommonDelete";
import SimpleModel from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const STATUS_MAPPING = {
  ACTIVE: true,
  INACTIVE: false,
};

/**
 * Component for Campaign Management List contains a simple grid with configurations for Campaigns
 *
 * @param {object} props all the props needed for Campaign Management Management List
 * @returns {React.ReactElement} returns a Campaign Management List component
 */
const CampaignList = (props) => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const [toggleModal, setToggleModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [data, setData] = useState([]);
  const textAreaRef = useRef(null);
  const [record, setRecord] = useState("");
  const [model, setModel] = useState("");

  /**
   *
   * @function handleSuccess This function will handle the success scenario
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    const response = res?.data?.data;
    if (response) {
      const exportTypeValue = [];
      response.forEach((item) => {
        exportTypeValue.push({ id: item, name: item });
      });
      setData(exportTypeValue);
    }
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/exportformat`, handleSuccess);

  /**
   * @function handleSuccessForExport to handle success of the API
   */
  const handleSuccessForExport = () => {
    notify(translate("export_success_message"), "info", TIMEOUT);
  };

  /**
   *
   * @function exportFormat to Export
   */
  const exportFormat = () => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/refresher/${campaignId}`,
        payload: { format: selectValue },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleSuccessForExport });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected campaign id to delete
   */
  const deleteHandler = (rowId) => {
    setCampaignId(rowId);
    setOpenDeleteDialog(true);
  };

  /**
   * @function handleSuccessForRefresh to handle success of the API
   */
  const handleSuccessForRefresh = () => {
    notify(translate("success_message"), "info", TIMEOUT);
    refresh();
  };

  /**
   * @function refreshHandlerDialog to refresh campaign
   */
  const refreshHandlerDialog = () => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/refresher/${campaignId}`,
        payload: { format: "XML" },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleSuccessForRefresh });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    setToggleModal(false);
  };

  /**
   * RefreshHandler to toggle the refresh dialog
   *
   * @function refreshHandler to toggle between refresh dialog
   * @param {string} idBase selected campaign id to refresh
   */
  const refreshHandler = (idBase) => {
    setModel("refresh");
    setCampaignId(idBase);
    setToggleModal(true);
  };

  /**
   * toggle to close the delete dialog
   *
   * @function toggle toggle to close the delete dialog
   */
  const toggle = () => {
    setOpenDeleteDialog(false);
  };

  /**
   * redirect to view change history page
   *
   * @function showViewChangeHistory redirect to history
   */
  const showViewChangeHistory = () => {
    redirect("campaigns/history");
  };

  /**
   *Function to handle toggle flag to action
   *
   * @function updateExportHandlerDialog
   */
  const updateExportHandlerDialog = () => {
    setToggleModal(false);
    exportFormat();
  };

  /**
   * to copy Link url
   *
   * @function handleLinkCopy
   * @param {object} details holds particular campaign record
   */
  const handleLinkCopy = (details) => {
    textAreaRef.current = get(details, "campaign.link");
    navigator.clipboard.writeText(textAreaRef.current);
    notify(translate("xml_url_copied_to_clipboard"), "info", TIMEOUT);
  };

  /**
   * to select option
   *
   * @param {object} source particular campaign
   * @param {object} event  DOM event
   * @function onClickExport
   */
  const onClickExport = (source, event) => {
    setCampaignId(source.id);
    setSelectValue(event.target.value);
    if (event.target.value) {
      setToggleModal(true);
      setModel("export");
    }
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on status update
   */
  const handleUpdateSuccess = () => {
    if (record.status === "ACTIVE") {
      notify(translate("success_message_for_enabled"), "info", TIMEOUT);
    } else {
      notify(translate("success_message_for_disabled"), "info", TIMEOUT);
    }
    refresh();
  };

  /**
   * @function updateHandlerDialog enable or disable status
   */
  const updateHandlerDialog = () => {
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/statuses/${record.id}`,
        payload: {
          data: {
            campaign: {
              status: record.status,
            },
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
    setToggleModal(false);
  };

  /**
   * @function updateHandler
   * @param {boolean} isChecked boolean value for checked
   * @param {object} selectedRecord selected campaign details to enable and disable
   */
  const updateHandler = (isChecked, selectedRecord) => {
    const updatedStatus = Object.keys(STATUS_MAPPING).find((key) => STATUS_MAPPING[key] === isChecked);
    const updatedRecord = { ...selectedRecord, status: updatedStatus };
    setToggleModal(true);
    setModel("status");
    setRecord(updatedRecord);
  };

  /**
   * @function handleClose to close the modal
   */
  const handleClose = () => {
    setToggleModal(false);
    setTimeout(() => {
      setRecord("");
      setModel("");
    }, 500);
  };

  /**
   * @function modelMessage to show the modal message
   * @returns {string} return string to display
   */
  const modelMessage = () => {
    if (model === "export") {
      return `${translate("export_campaign_to")} ${selectValue}?`;
    }
    if (model === "status") {
      return record.status === "ACTIVE" ? translate("enable_feed") : translate("disable_feed");
    }
    return translate("campaign_refresh_text");
  };

  /**
   * @function modelAction to show the model action
   */
  const modelAction = () => {
    if (model === "export") {
      updateExportHandlerDialog();
    } else if (model === "status") {
      updateHandlerDialog();
    } else {
      refreshHandlerDialog();
    }
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "Edit",
      leftIcon: <EditIcon />,
      path: "edit",
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
    {
      id: "3",
      type: "Refresh",
      leftIcon: <RefreshIcon />,
      path: "",
      routeType: "",
      onClick: refreshHandler,
      noRedirect: true,
    },
    {
      id: "4",
      type: "Change History",
      leftIcon: <HistoryIcon />,
      path: "",
      routeType: "/history",
      isEditable: false,
    },
  ];

  const configurationForCampaignMasterGrid = [
    {
      source: "campaign.name",
      type: "KebabMenuWithLink",
      label: translate("campaign_name"),
      configurationForKebabMenu,
      tabPath: "",
    },
    { source: "publisherName", type: "TextField", label: translate("publisher") },
    { source: "campaign.campaignDomainId", type: "TextField", label: translate("domain") },
    { source: "campaign.geoId", type: "TextField", label: translate("geo") },
    {
      source: "campaign.status",
      type: "SwitchComp",
      label: translate("status"),
      trueValue: "ACTIVE",
      compareKey: "campaign.status",
      onChange: updateHandler,
    },
    { source: "campaign.createdAt", type: "DateField", label: translate("date_created") },
    { source: "campaign.createdBy", type: "TextField", label: translate("created_by") },
    { source: "campaign.updatedAt", type: "CustomDateField", label: translate("last_updated_stamp") },
    { source: "campaign.updatedBy", type: "TextField", label: translate("last_updated_by") },
    { source: "campaign.frequency", type: "TextField", label: translate("frequency") },
    { source: "campaign.repeat", type: "TextField", label: translate("repeat") },
    { source: "campaign.time", type: "TextField", label: translate("time") },
    {
      source: "campaign.link",
      type: "LinkButton",
      label: translate("link"),
      onClick: handleLinkCopy,
      link: translate("copy_xml_url"),
      compareKey: "campaign.status",
      compareValue: "ACTIVE",
    },
    {
      source: "",
      type: "ExportDropdown",
      label: translate("exportTitle"),
      onChange: onClickExport,
      data: { data },
      compareKey: "campaign.status",
      compareValue: "ACTIVE",
    },
  ];

  const actionButtonsForCampaignMasterGrid = [
    {
      type: "Button",
      label: translate("view_change_history"),
      icon: <></>,
      variant: "outlined",
      onClick: showViewChangeHistory,
    },
    {
      type: "CreateButton",
      label: translate("create_campaign"),
      icon: <></>,
      variant: "contained",
    },
  ];

  const actionButtonsForEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("create_campaign"),
      icon: <></>,
      variant: "contained",
    },
  ];

  /**
   * @function rowStyleHandler to apply row style in the grid
   * @param {object} recordData each record in the list
   * @returns {object} style object
   */
  const rowStyleHandler = (recordData) => ({
    opacity: recordData?.campaign?.status !== "ACTIVE" ? "0.5" : null,
  });

  const campaignGridTitle = translate("campaign_manager");
  const campaignManagementSearchLabel = translate("campaign_search");
  const breadcrumbs = [{ displayName: campaignGridTitle }];

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns`}
        configurationForGrid={configurationForCampaignMasterGrid}
        actionButtonsForGrid={actionButtonsForCampaignMasterGrid}
        sortField={{ field: "campaign.updatedAt", order: "DESC" }}
        gridTitle={campaignGridTitle}
        searchLabel={campaignManagementSearchLabel}
        filter={{ columnId: "campaign.id" }}
        actionButtonsForEmptyGrid={actionButtonsForEmptyGrid}
        rowStyleFunc={rowStyleHandler}
      />

      <SimpleModel
        dialogContent={<CommonDialogContent message={modelMessage()} />}
        showButtons
        closeText={translate("no_button_label")}
        actionText={translate("yes_button_label")}
        openModal={toggleModal}
        handleClose={handleClose}
        handleAction={modelAction}
      />
      <CommonDelete
        resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns/${campaignId}`}
        close={toggle}
        open={openDeleteDialog}
        list
        deleteText={translate("campaign_delete_text")}
      />
    </div>
  );
};

export default memo(CampaignList);
