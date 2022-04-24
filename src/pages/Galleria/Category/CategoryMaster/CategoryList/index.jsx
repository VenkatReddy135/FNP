/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import DeleteIconOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CommonImport from "../../../../../components/CommonImport";
import SimpleGrid from "../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import CommonExport from "../../../../../components/CommonExport";
import AdvanceSearchLink from "../../../../../components/AdvanceSearchLink";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component for Category management List contains a simple grid with configurations for Categories
 *
 * @param {*} props all the props needed for Category Management List
 * @returns {React.ReactElement} returns a Category Management List component
 */
const CategoryList = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const [urlFlag, setUrlFlag] = useState(false);
  const [id, setId] = useState("");
  const importConfig = {
    fileType: "csv",
    specName: "CategoryImportJobSpec",
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [state, setState] = useState({
    isExport: false,
    advanceSearchFilter: null,
  });
  const { advanceSearchFilter } = state;

  if (localStorage.getItem("selectedCategoryId")) {
    localStorage.setItem("selectedCategoryId", "");
  }

  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setUrlFlag(true);
  };
  /**
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setUrlFlag(false);
  };

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
   * Edit handler to edit the category
   *
   * @function editHandler
   */
  const editHandler = () => {};

  /**
   * Export handler to export the category
   *
   * @function exportHandler
   */
  const exportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: true }));
  };

  /**
   * To reset the export  the category
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

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/show",
      isEditable: false,
    },
    {
      id: "3",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "/edit",
      onClick: editHandler,
    },
    {
      id: "2",
      type: "Delete",
      leftIcon: <DeleteIconOutlined />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];

  const configurationForCategoryMasterGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("category_id"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "categoryUrl", type: "TextField", label: translate("category_url") },
    { source: "categoryName", type: "TextField", label: translate("category_name") },
    { source: "categoryType", type: "TextField", label: translate("category_type") },
    { source: "categoryClassification", type: "TextField", label: translate("category_classification") },
    { source: "baseCategory", type: "TextField", label: translate("parent_category_name") },
    { source: "isEnabled", type: "SwitchComp", label: translate("is_enabled"), disable: true, record: false },
    { source: "fromDate", type: "CustomDateField", label: translate("from_date") },
    { source: "thruDate", type: "CustomDateField", label: translate("to_date") },
    { source: "createdByName", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedByName", type: "TextField", label: translate("modified_by") },
    {
      source: "updatedAt",
      type: "CustomDateField",
      label: translate("last_modified_date"),
      sortBy: "updatedAt",
    },
  ];
  const actionButtonsForCategoryMasterGrid = [
    {
      type: "CreateButton",
      label: translate("new_category"),
      icon: <></>,
      variant: "outlined",
    },
    {
      type: "Button",
      label: translate("import"),
      icon: <></>,
      variant: "contained",
      onClick: () => fetchUrl(),
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
      label: translate("new_category"),
      icon: <></>,
      variant: "outlined",
    },
    {
      type: "Button",
      label: translate("import"),
      icon: <></>,
      variant: "contained",
      onClick: () => fetchUrl(),
    },
  ];
  const categoryGridTitle = translate("category_management");
  const categoryManagementSearchLabel = translate("category_search_label");
  const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "DESC";
  const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "createdAt";
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
    },
  ];

  /**
   * toggle to close the delete dialog
   *
   * @function toggle
   */
  const toggle = () => {
    setOpenDialog(false);
  };
  const { isExport } = state;

  const AdvanceSearch = (
    <AdvanceSearchLink
      isFilterSet={advanceSearchFilter}
      listingPagePath={`/${window.REACT_APP_GALLERIA_SERVICE}/categories`}
      clearFilter={clearFilter}
      clearLabel={translate("clear")}
      advanceSearchPagePath={`/${window.REACT_APP_GALLERIA_SERVICE}/categories/advancesearch?sort=${sortVal}&order=${orderVal}`}
      advanceSearchLabel={translate("advance_search")}
    />
  );

  useEffect(() => {
    const queryTemp = history.location.search ? new URLSearchParams(history.location.search).get("advSearchObj") : "";
    if (queryTemp) {
      setState((prevState) => ({
        ...prevState,
        advanceSearchFilter: queryTemp,
        exportFilterValue: JSON.parse(queryTemp),
      }));
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
        additionalLink={AdvanceSearch}
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForCategoryMasterGrid}
        actionButtonsForGrid={actionButtonsForCategoryMasterGrid}
        actionButtonsForEmptyGrid={actionButtonsForCategoryMasterEmptyGrid}
        gridTitle={categoryGridTitle}
        searchLabel={categoryManagementSearchLabel}
        sortField={{ field: "createdAt", order: "DESC" }}
        filter={
          advanceSearchFilter
            ? {
                filter: encodeURIComponent(advanceSearchFilter).replace(/'/g, "%27").replace(/"/g, "%22"),
              }
            : {}
        }
      />
      {urlFlag ? (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
          acceptFileType=".csv"
        />
      ) : null}

      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}`}
        redirectPath={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        params={{}}
        close={toggle}
        open={openDialog}
        list
        deleteText={`${translate("delete_confirmation_message")} category?`}
      />
      {isExport && (
        <CommonExport
          resourceVal={`${window.REACT_APP_GALLERIA_SERVICE}/categories/export`}
          payload={exportConfig}
          resetVal={resetExportHandler}
        />
      )}
    </>
  );
};

export default React.memo(CategoryList);
