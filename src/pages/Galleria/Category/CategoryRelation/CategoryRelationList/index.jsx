/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import SimpleGrid from "../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import useStyles from "../../../../../assets/theme/common";
import CommonImport from "../../../../../components/CommonImport";
import CommonExport from "../../../../../components/CommonExport";

/**
 * Component for Category Relation List contains a simple grid with configurations for Categories
 *
 * @param {*} props all the props needed for Category Relation List
 * @returns {React.ReactElement} returns a Category Relation List component
 */
const CategoryRelationList = (props) => {
  const { id } = props;
  const translate = useTranslate();
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const [associationId, setAssociationId] = useState();
  const [filterVal, setFilterVal] = useState("");
  const [isExport, setIsExport] = useState(false);
  const [urlFlag, setUrlFlag] = useState(false);
  const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "DESC";
  const sortVal = history.location.search
    ? new URLSearchParams(history.location.search).get("sort")
    : "targetCategoryId";
  const importConfig = { fileType: "csv", specName: "CategoryAssociationImportJobSpec" };
  const exportConfig = {
    exportFileFormat: "csv",
    categoryId: id,
    simpleSearchValue: "" || filterVal,
    sortParam: `${sortVal}:${orderVal}`,
  };

  if (localStorage.getItem("selectedAssociationId")) {
    localStorage.setItem("selectedAssociationId", "");
  }
  /**
   * @function createHandler
   *
   * @param {*} event event
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/associations/${id}/create`,
      state: { categoryId: id },
    });
  };

  /**
   * DeleteHandler to set association id and toggle the dialog
   *
   * @function deleteHandler
   * @param {string} record id
   */
  const deleteHandler = (record) => {
    setAssociationId(record);
    setOpenDialog(true);
  };
  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setUrlFlag(true);
  };
  /**
   * @function exportHandler
   *
   */
  const exportHandler = () => {
    setIsExport(true);
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
   *Function to handle toggle flag to close dialog
   *
   * @function resetExportHandler
   */
  const resetExportHandler = () => {
    setIsExport(false);
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: `/show`,
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "",
      isEditable: true,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationForCategoryRelationsGrid = [
    {
      source: "targetCategoryId",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("category_id"),
      tabPath: `/show`,
      isLink: true,
    },
    { source: "targetCategoryName", type: "TextField", label: translate("relation_category_name") },
    { source: "associationType", type: "TextField", label: translate("relation_type") },
    { source: "isPrimary", type: "SwitchComp", label: translate("primary"), disable: true, compareKey: "isPrimary" },
    { source: "sequence", type: "TextField", label: translate("sequence") },
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

  const actionButtonsForCategoryRelationsGrid = [
    {
      type: "CreateButton",
      label: translate("new_relationship"),
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
  const actionButtonsForEmptyRelationsGrid = [
    {
      type: "CreateButton",
      label: translate("new_relationship"),
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

  const categoryGridTitle = translate("category_relationship_management");
  const categoryManagementSearchLabel = translate("relation_search_label");
  const classes = useStyles();
  /**
   *@function getFilterValue
   * @param {string} val value set in search filter
   */
  const getFilterValue = (val) => {
    setFilterVal(val);
  };
  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForCategoryRelationsGrid}
        actionButtonsForGrid={actionButtonsForCategoryRelationsGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyRelationsGrid}
        gridTitle={categoryGridTitle}
        searchLabel={categoryManagementSearchLabel}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`}
        filter={{ categoryId: id }}
        getFilter={getFilterValue}
        sortField={{ field: "targetCategoryId", order: "asc" }}
        syncWithLocation
      />
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`}
        deleteText={`${translate("delete_confirmation_message")} ${translate("association")}?`}
        redirectPath={`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/show/relationship`}
        params={{ associationId, categoryId: id }}
        close={() => setOpenDialog(false)}
        open={openDialog}
        list
      />
      {isExport ? (
        <CommonExport
          resourceVal={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations/export`}
          payload={exportConfig}
          resetVal={resetExportHandler}
        />
      ) : null}
      {urlFlag ? (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
          acceptFileType=".csv"
        />
      ) : null}
    </div>
  );
};

CategoryRelationList.propTypes = {
  id: PropTypes.string.isRequired,
};

export default React.memo(CategoryRelationList);
