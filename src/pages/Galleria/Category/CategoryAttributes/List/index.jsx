import React, { useState } from "react";
import { useTranslate } from "react-admin";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import SimpleGrid from "../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import CommonImport from "../../../../../components/CommonImport";
import CommonExport from "../../../../../components/CommonExport";
import useStyles from "../../../../../assets/theme/common";

/**
 * Component for CategoryAttributes List, contains a simple grid
 *
 * @param {object} props all the props needed for Category Attributes List
 * @returns {React.ReactElement} returns a Category Attributes List component
 */
const CategoryAttributesList = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const classes = useStyles();
  const [filterVal, setFilterVal] = useState("");
  const [state, setState] = useState({
    open: false,
    rowId: "",
    flag: false,
    isExport: false,
  });
  const { open, rowId, flag, isExport } = state;
  const { id } = props;

  /**
   * @param {object} event data for create button
   * @function createHandler
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/attributes/create`,
    });
  };

  /**
   * @function deleteHandler function called on click of delete icon of Kebab Menu
   * @param {string} record gives the id on which action has to be performed.
   */
  const deleteHandler = (record) => {
    setState((prevState) => ({ ...prevState, rowId: record, open: true }));
  };

  /**
   * @function fetchUrl to fetch pre-signed url
   */
  const fetchUrl = () => {
    setState((prevState) => ({ ...prevState, flag: true }));
  };

  /**
   * @function exportHandler to handle export
   */
  const exportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: true }));
  };

  /**
   * @function resetImportHandler to reset import
   */
  const resetImportHandler = () => {
    setState((prevState) => ({ ...prevState, flag: false }));
  };

  /**
   * @function resetExportHandler to reset export
   */
  const resetExportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: false }));
  };

  /**
   *@function getFilterValue
   * @param {string} val value set in search filter
   */
  const getFilterValue = (val) => {
    setFilterVal(val);
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
      routeType: `/edit`,
      isEditable: true,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      isEditable: false,
      onClick: deleteHandler,
    },
  ];

  const configurationForGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("attribute_id"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "attributeName", type: "TextField", label: translate("attribute_type") },
    { source: "attributeValue", type: "TextField", label: translate("value") },
    { source: "createdByName", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedByName", type: "TextField", label: translate("modified_by") },
    { source: "updatedAt", type: "CustomDateField", label: translate("modified_date") },
  ];

  const actionButtonsForAttributesGrid = [
    {
      type: "CreateButton",
      label: translate("new_attribute"),
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

  const actionButtonsForEmptyAttributesGrid = [
    {
      type: "CreateButton",
      label: translate("new_attribute"),
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

  const importConfig = {
    fileType: "csv",
    specName: "CategoryAttributeImportJobSpec",
  };
  const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "DESC";
  const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "id";

  const exportConfig = {
    exportFileFormat: "csv",
    simpleSearchValue: "" || filterVal,
    sortParam: `${sortVal}:${orderVal}`,
  };

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        configurationForGrid={configurationForGrid}
        actionButtonsForGrid={actionButtonsForAttributesGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyAttributesGrid}
        gridTitle={translate("attribute_management")}
        searchLabel={translate("search_placeholder_category_attributes")}
        getFilter={getFilterValue}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/attributes`}
        syncWithLocation
      />
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/attributes/${rowId}`}
        deleteText={translate("attribute_deletion_confirmation")}
        close={() => setState((prevState) => ({ ...prevState, open: false }))}
        open={open}
        list
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
          resourceVal={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/attributes/export`}
          payload={exportConfig}
          resetVal={resetExportHandler}
        />
      )}
    </div>
  );
};

CategoryAttributesList.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CategoryAttributesList;
