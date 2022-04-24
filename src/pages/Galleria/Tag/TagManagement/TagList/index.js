/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import CommonImport from "../../../../../components/CommonImport";
import CommonExport from "../../../../../components/CommonExport";
import AdvanceSearchLink from "../../../../../components/AdvanceSearchLink";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component for tag List contains a simple grid
 *
 * @param {object} props all the props needed for Tag List
 * @returns {React.ReactElement} returns a Tag List component
 */
const TagManagement = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const [state, setState] = useState({
    openDialog: false,
    id: "",
    flag: false,
    isExport: false,
    exportFilterValue: null,
    advanceSearchFilter: null,
    tagtypes: {},
  });
  const { openDialog, flag, isExport, id, tagtypes, advanceSearchFilter } = state;

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected campaign id to delete
   */
  const deleteHandler = (rowId) => {
    setState((prevState) => ({ ...prevState, id: rowId, openDialog: true }));
  };

  const configKebab = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/show",
      isEditable: false,
    },
    { id: "2", type: "Edit", leftIcon: <EditOutlinedIcon />, path: "/update", routeType: "/update", isEditable: true },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const importConfig = {
    fileType: "csv",
    specName: "TagImportJobSpec",
  };

  const configuration = [
    { source: "tagId", type: "KebabMenuWithLink", configurationForKebabMenu: configKebab, label: translate("tag_id") },
    { source: "tagName", type: "TextField", label: translate("tag_name") },
    {
      source: "tagTypeId",
      type: "FunctionField",
      label: translate("tag_type"),
      render: (record) => `${tagtypes[record.tagTypeId]}`,
    },
    { source: "sequence", type: "TextField", label: translate("tag_sequence") },
    { source: "isEnabled", type: "SwitchComp", label: translate("is_enabled"), disable: true, record: false },
    { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
    { source: "createdByName", type: "TextField", label: translate("createdBy") },
    { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
    { source: "updatedByName", type: "TextField", label: translate("lastModifiedBy") },
    { source: "comment", type: "TextField", label: translate("comment") },
  ];
  const gridTitle = translate("tag_management");
  const searchLabel = translate("tag_management_search_label");
  const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "DESC";
  const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "id";
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
    },
  ];

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
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setState((prevState) => ({ ...prevState, flag: false }));
  };

  /**
   * @function createHandler
   * @param {event} event event
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/create`,
    });
  };

  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setState((prevState) => ({ ...prevState, flag: true }));
  };

  /**
   * @function handleClose close modal
   */
  const handleClose = () => {
    setState((prevState) => ({ ...prevState, openDialog: false }));
  };

  /**
   * @function clearFilter clear adv search
   */
  const clearFilter = () => {
    setState((prevState) => ({ ...prevState, advanceSearchFilter: null }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetDataSuccess = (response) => {
    if (response?.data?.data) {
      const tagTypeVal = {};
      response.data.data.forEach((val) => {
        tagTypeVal[val.tagTypeId] = val.tagTypeName;
      });
      setState((prevState) => ({ ...prevState, tagtypes: { ...tagTypeVal } }));
    }
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GALLERIA_SERVICE}/tag-types`, handleSetDataSuccess);

  const actionButtonsForUserGrid = [
    {
      type: "CreateButton",
      label: translate("new_tag"),
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
  ];
  const actionButtonsForCategoryMasterEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("new_tag"),
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
  ];
  const AdvanceSearch = (
    <AdvanceSearchLink
      isFilterSet={advanceSearchFilter}
      listingPagePath={`/${window.REACT_APP_GALLERIA_SERVICE}/tags`}
      clearFilter={clearFilter}
      clearLabel={translate("clear")}
      advanceSearchPagePath={`/${window.REACT_APP_GALLERIA_SERVICE}/tags/advancesearch?sort=${sortVal}&order=${orderVal}`}
      advanceSearchLabel={translate("advance_search")}
    />
  );

  useEffect(() => {
    const queryTemp = history.location.search ? new URLSearchParams(history.location.search).get("advSearchObj") : "";
    if (queryTemp) {
      setState((prevState) => ({ ...prevState, advanceSearchFilter: queryTemp, exportFilterValue: "" }));
    }
  }, []);

  const exportConfig = {
    exportFileFormat: "csv",
    sortParam: `${sortVal}:${orderVal}`,
  };
  const query = history.location.search ? new URLSearchParams(history.location.search).get("filter") : "";
  let queryObj = {};
  if (query) {
    queryObj = { ...JSON.parse(query) };
  }
  if (queryObj?.q) {
    exportConfig.simpleSearchValue = queryObj.q;
  }
  if (advanceSearchFilter) {
    exportConfig.filter = advanceSearchFilter
      ? encodeURIComponent(advanceSearchFilter).replace(/'/g, "%27").replace(/"/g, "%22")
      : {};
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        additionalLink={AdvanceSearch}
        configurationForGrid={configuration}
        actionButtonsForGrid={actionButtonsForUserGrid}
        actionButtonsForEmptyGrid={actionButtonsForCategoryMasterEmptyGrid}
        gridTitle={gridTitle}
        searchLabel={searchLabel}
        sortField={{ field: "id", order: "ASC" }}
        filter={
          advanceSearchFilter
            ? {
                filter: encodeURIComponent(advanceSearchFilter).replace(/'/g, "%27").replace(/"/g, "%22"),
              }
            : {}
        }
      />
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/tags?tagId=${id}`}
        redirectPath=""
        params={{}}
        close={handleClose}
        open={openDialog}
        list
        deleteText={`${translate("delete_confirmation_message")} ${translate("tag")}?`}
      />
      {flag && (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
        />
      )}
      {isExport && (
        <CommonExport
          resourceVal={`${window.REACT_APP_GALLERIA_SERVICE}/tags/export`}
          payload={exportConfig}
          resetVal={resetExportHandler}
        />
      )}
    </>
  );
};

export default TagManagement;
