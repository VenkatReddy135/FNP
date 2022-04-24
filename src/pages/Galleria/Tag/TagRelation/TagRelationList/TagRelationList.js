/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import AccountTreeIconOutlined from "@material-ui/icons/AccountTreeOutlined";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import useStyles from "../../../../../assets/theme/common";
import CommonImport from "../../../../../components/CommonImport";
import CommonExport from "../../../../../components/CommonExport";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";

/**
 * Component for Tag Relation List contains a simple grid with configurations for Categories
 *
 * @param {*} props all the props needed for Tag Relation List
 * @returns {React.ReactElement} returns a Tag Relation List component
 */
const TagRelationList = (props) => {
  const { id, enableVal } = props;
  const translate = useTranslate();
  const history = useHistory();

  const [associationId, setAssociationId] = useState();
  const [filterVal, setFilterVal] = useState("");
  const [flag, setFlag] = useState({
    isExport: false,
    isImport: false,
    openDialog: false,
    currentItemUrl: `${window.REACT_APP_GALLERIA_SERVICE}/tags/tag?tagId=${id}`,
  });
  const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "DESC";
  const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "sequence";
  const { isExport, isImport, openDialog, currentItemUrl } = flag;
  const fileType = ".csv";
  const exportConfig = {
    exportFileFormat: "csv",
    simpleSearchValue: filterVal,
    sortParam: `${sortVal}:${orderVal}`,
  };
  const importConfig = { fileType: "csv", specName: "TagRelationImportJobSpec" };

  const baseURL = `${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/relations`;

  /**
   * @function createHandler
   *
   * @param {*} event event
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${baseURL}/create`,
    });
  };

  /**
   * @function graphViewHandler
   *
   * @param {*} event event
   */
  const graphViewHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${id}/show/graph`,
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
    setFlag((prevState) => ({ ...prevState, openDialog: true }));
  };
  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setFlag((prevState) => ({ ...prevState, isImport: true }));
  };
  /**
   * @function exportHandler
   *
   */
  const exportHandler = () => {
    setFlag((prevState) => ({ ...prevState, isExport: true }));
  };
  /**
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setFlag((prevState) => ({ ...prevState, isImport: false }));
  };
  /**
   *Function to handle toggle flag to close dialog
   *
   * @function resetExportHandler
   */
  const resetExportHandler = () => {
    setFlag((prevState) => ({ ...prevState, isExport: false }));
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
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "/edit",
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
  const configurationForTagRelationsGrid = [
    {
      source: "tagRelationType",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("relation_type"),
    },
    { source: "toTag", type: "TextField", label: translate("relation_type_value") },
    { source: "sequence", type: "TextField", label: translate("sequence") },
    {
      source: "isEnabled",
      type: "SwitchComp",
      label: translate("is_enabled"),
      disable: true,
      record: false,
    },
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

  const actionButtonsForTagRelationsGrid = [
    {
      type: "CreateButton",
      label: "",
      icon: <AccountTreeIconOutlined />,
      variant: "text",
      onClick: graphViewHandler,
    },
    {
      type: "CreateButton",
      label: translate("new_tag_relation"),
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
      label: "",
      icon: <AccountTreeIconOutlined />,
      variant: "text",
      onClick: graphViewHandler,
    },
    {
      type: "CreateButton",
      label: translate("new_tag_relation"),
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

  const tagGridTitle = translate("tag_relations_and_associations");
  const tagRelationSearchLabel = translate("search_by_tag_relation");
  const classes = useStyles();
  /**
   *@function getFilterValue
   * @param {string} val value set in search filter
   */
  const getFilterValue = (val) => {
    setFilterVal(val);
  };

  /**
   * @function handleDialogClose function that updates the changed value of Tag name dropdown
   */
  const handleDialogClose = () => {
    setFlag((prevState) => ({ ...prevState, openDialog: false }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (!res?.data?.message) {
      enableVal(res.data.isEnabled);
    }
  };
  useCustomQueryWithStore("getData", currentItemUrl, handleSetDataSuccess);

  return (
    <div data-testid="tag-relation" className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForTagRelationsGrid}
        actionButtonsForGrid={actionButtonsForTagRelationsGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyRelationsGrid}
        gridTitle={tagGridTitle}
        searchLabel={tagRelationSearchLabel}
        resource={baseURL}
        filter={{ tagId: id }}
        getFilter={getFilterValue}
        sortField={{ field: "sequence", order: "DESC" }}
        syncWithLocation
      />
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/tags/relations/${associationId}`}
        deleteText={translate("delete_tag_relation_confirmation_message")}
        close={handleDialogClose}
        open={openDialog}
        list
      />
      {isExport && (
        <CommonExport resourceVal={`${baseURL}/export`} payload={exportConfig} resetVal={resetExportHandler} />
      )}
      {isImport && (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
          acceptFileType={fileType}
        />
      )}
    </div>
  );
};

TagRelationList.propTypes = {
  id: PropTypes.string.isRequired,
  enableVal: PropTypes.func,
};

TagRelationList.defaultProps = {
  enableVal: () => {},
};

export default TagRelationList;
