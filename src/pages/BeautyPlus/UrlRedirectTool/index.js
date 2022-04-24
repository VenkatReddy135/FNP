/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../components/SimpleGrid";
import CommonDelete from "../../../components/CommonDelete";
import CommonImport from "../../../components/CommonImport";
import CommonExport from "../../../components/CommonExport";
import AdvanceSearchLink from "../../../components/AdvanceSearchLink";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { rowsPerPageOptions } from "../../../config/GlobalConfig";

/**
 * makeStyles hook of material-ui to apply style for URL redirect list
 *
 * @function
 * @name useStyles
 */

/**
 * Component for URL redirect list contains a simple grid with configurations for Categories
 *
 * @param {object} props all the props needed for URL redirect list
 * @returns {React.ReactElement} returns a URL redirect list component
 */
const URLRedirectList = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const [state, setState] = useState({
    openDialog: false,
    id: "",
    flag: false,
    isExport: false,
    advanceSearchFilter: null,
    breadcrumbsList: [
      {
        displayName: translate("url_redirect_tool"),
      },
    ],
  });
  const { openDialog, id, flag, isExport, advanceSearchFilter, breadcrumbsList } = state;

  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setState((prevState) => ({ ...prevState, flag: true }));
  };

  /**
   * @function createHandler
   * @param {event} event event
   */
  const createHandler = (event) => {
    // event.preventDefault  is required for redirect to urlredirect create page
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/create`,
    });
  };

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected campaign id to delete
   */
  const deleteHandler = (rowId) => {
    setState((prevState) => ({ ...prevState, id: rowId, openDialog: true }));
  };

  /**
   * @function exportHandler
   *
   */
  const exportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: true }));
  };

  /**
   *Function to handle toggle flag to close dialog
   *
   * @function resetExportHandler
   */
  const resetExportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: false }));
  };

  /**
   * @function clearFilter clear adv search
   */
  const clearFilter = () => {
    setState((prevState) => ({ ...prevState, advanceSearchFilter: null }));
  };

  const configKebab = useRef({
    configurationForKebabMenu: [
      {
        id: "1",
        type: "View",
        leftIcon: <RemoveRedEyeOutlinedIcon />,
        path: "",
        routeType: "/show",
        isEditable: false,
      },
      { id: "2", type: "Edit", leftIcon: <EditOutlinedIcon />, path: "", routeType: "/update", isEditable: true },
      {
        id: "3",
        type: "Delete",
        leftIcon: <DeleteOutlineOutlinedIcon />,
        path: "",
        routeType: "",
        onClick: deleteHandler,
      },
    ],
  });

  const config = useRef({
    configurationForUserGrid: [
      {
        source: "sourceUrl",
        type: "KebabMenuWithLink",
        configurationForKebabMenu: configKebab.current.configurationForKebabMenu,
        label: translate("sourceUrl"),
        tabPath: "",
        isLink: false,
      },
      { source: "targetUrl", type: "TextField", label: translate("targetUrl") },
      { source: "entityType", type: "TextField", label: translate("entityType") },
      { source: "redirectType", type: "TextField", label: translate("redirectType") },
      { source: "isEnabled", type: "SwitchComp", label: translate("isEnabled") },
      { source: "comment", type: "TextField", label: translate("comments") },
      { source: "createdBy", type: "TextField", label: translate("createdBy") },
      { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
      { source: "updatedBy", type: "TextField", label: translate("lastModifiedBy") },
      { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
    ],
    actionButtonsForUserGrid: [
      {
        type: "CreateButton",
        label: translate("addUrl"),
        icon: <></>,
        variant: "outlined",
        onClick: createHandler,
      },
      {
        type: "Button",
        label: translate("import"),
        icon: <></>,
        variant: "contained",
        onClick: fetchUrl,
      },
      {
        type: "Button",
        label: translate("export"),
        icon: <></>,
        variant: "outlined",
        onClick: exportHandler,
      },
    ],
    actionButtonsForUserEmptyGrid: [
      {
        type: "CreateButton",
        label: translate("addUrl"),
        icon: <></>,
        variant: "outlined",
        onClick: createHandler,
      },
      {
        type: "Button",
        label: translate("import"),
        icon: <></>,
        variant: "contained",
        onClick: fetchUrl,
      },
    ],
    contentGridTitle: translate("urlRedirectTool"),
    importConfig: {
      fileType: "csv",
      specName: "UrlImportJobSpec",
    },
    exportConfig: { exportFileFormat: "csv" },
  });

  /**
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setState((prevState) => ({ ...prevState, flag: false }));
  };

  const AdvanceSearch = (
    <AdvanceSearchLink
      isFilterSet={advanceSearchFilter}
      listingPagePath={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`}
      clearFilter={clearFilter}
      clearLabel={translate("clear")}
      advanceSearchPagePath={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/advancesearch`}
      advanceSearchLabel={translate("advance_search")}
    />
  );
  // check for advancesearch filter if present for export
  useEffect(() => {
    const query = history.location.search ? new URLSearchParams(history.location.search).get("filter") : "";
    if (query) {
      const tempObj = JSON.parse(query);
      config.current.exportConfig = { ...config.current.exportConfig, filter: tempObj.filter };
      setState((prevState) => ({ ...prevState, advanceSearchFilter: tempObj.filter }));
    }
  }, []);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <SimpleGrid
        {...props}
        configurationForGrid={config.current.configurationForUserGrid}
        actionButtonsForGrid={config.current.actionButtonsForUserGrid}
        actionButtonsForEmptyGrid={config.current.actionButtonsForUserEmptyGrid}
        gridTitle={config.current.contentGridTitle}
        isParentGrid={false}
        isSearchEnabled={false}
        additionalLink={AdvanceSearch}
        rowsPerPageOptions={rowsPerPageOptions}
        filter={{ filter: advanceSearchFilter }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}`}
        redirectPath=""
        params={{}}
        close={() => setState((prevState) => ({ ...prevState, openDialog: false }))}
        open={openDialog}
        list
        deleteText={`${translate("delete_confirmation_message")} ${translate("redirect")}?`}
      />
      {flag && (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={config.current.importConfig}
          resetImport={resetImportHandler}
        />
      )}
      {isExport && (
        <CommonExport
          resourceVal={`${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/export`}
          payload={config.current.exportConfig}
          resetVal={resetExportHandler}
        />
      )}
    </>
  );
};

export default URLRedirectList;
