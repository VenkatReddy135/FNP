/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Grid, Typography } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import { Button, useTranslate } from "react-admin";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIconOutlined from "@material-ui/icons/DeleteOutlined";
import SimpleGrid from "../../../../../components/SimpleGrid";
import useStyles from "../../../../../assets/theme/common";
import CustomFilters from "../../../../../components/CustomFiltersForGrid";
import CommonDelete from "../../../../../components/CommonDelete";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import { isStringNumber } from "../../../../../utils/validationFunction";

/**
 * Component for FC Component Price Master  List contains a simple grid with configurations for List of FCS
 *
 * @param {object} props all the props needed for FC Component Price Master List
 * @returns {React.ReactElement} returns a FC Component Price Master List component
 */
const FCComponentPriceMasterList = (props) => {
  const classes = useStyles();
  const { push, location } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);
  const [id, setId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  /**
   * Edit handler to edit the FC Group
   *
   * @function editHandler
   */
  const editHandler = () => {};

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected FC Group id to delete
   */
  const deleteHandler = (rowId) => {
    setId(rowId);
    setOpenDialog(true);
  };

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a FC Group id
   * @param {object} response is passed to the function
   */
  const handleContactPurposes = (response) => {
    const contactPurposeValue = [];
    response?.data?.data?.forEach((data) => {
      contactPurposeValue.push({ id: data.id, name: data.description });
    });
    setContactPurposes(contactPurposeValue);
  };
  const resourceForContactPurpose = `${window.REACT_APP_PARTY_SERVICE}/contact-purposes`;
  useCustomQueryWithStore("getData", resourceForContactPurpose, handleContactPurposes);

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
      onClick: editHandler,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteIconOutlined />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];

  /**
   * @function replaceHyphen This function will remove hyphen from contact phone
   * @param {string} str value of filter params
   * @returns {object} response is passed to the function
   */
  const replaceHyphen = (str) => {
    const filterParams = JSON.parse(str);
    if ("contactPhoneNumber" in filterParams) {
      filterParams.contactPhoneNumber = filterParams.contactPhoneNumber.replace("-", "");
    }
    if ("loginId" in filterParams) {
      const checkLoginId = isStringNumber(filterParams.loginId.replace("-", ""));
      if (checkLoginId) {
        filterParams.loginId = filterParams.loginId.replace("-", "");
      }
    }
    return filterParams;
  };

  const query = location.search ? new URLSearchParams(location.search).get("filter") : "";
  const filterData = query ? replaceHyphen(query) : {};

  const configurationForFCComponentPriceMasterGrid = [
    {
      source: "categoryName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("fcComponentPriceMaster.fc_group_name"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "id", type: "TextField", label: translate("fcComponentPriceMaster.fc_group_id") },
    { source: "categoryType", type: "TextField", label: translate("fcComponentPriceMaster.fulfillment_geo") },
    { source: "categoryName", type: "TextField", label: translate("fcComponentPriceMaster.component_name") },
    { source: "categoryType", type: "TextField", label: translate("price") },
    { source: "categoryName", type: "TextField", label: translate("currency") },
    { source: "id", type: "TextField", label: translate("status") },
    { source: "fromDate", type: "CustomDateField", label: translate("from_date") },
    { source: "thruDate", type: "CustomDateField", label: translate("to_date") },
    { source: "updatedBy", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedBy", type: "TextField", label: translate("updated_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("fcComponentPriceMaster.last_modified_date") },
  ];

  /**
   * @function newFcComponent to redirect FC Group Form
   */
  const newFcComponent = () => {
    push({
      pathname: `/nifty/v1/price-master-details/fc-component-price-master/create`,
    });
  };

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("fcComponentPriceMaster.fc_component_price_master_search"),
    },
    {
      type: "TextInput",
      label: translate("domain"),
      source: "loginId",
      alwaysOn: false,
    },
    {
      type: "SelectInput",
      label: translate("geo"),
      source: "contactPurposeId",
      alwaysOn: false,
      choices: contactPurposes,
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

  /**
   *
   * @returns {React.Component} return component
   */
  const DisplayTitle = useMemo(
    () => (
      <>
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Grid item>
            <Typography variant="h5">{translate("fcComponentPriceMaster.fc_component_price_master")}</Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("fcComponentPriceMaster.new_fc_component_mapping")}
              variant="outlined"
              onClick={newFcComponent}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.textInputField}>
          <Link
            to={{ pathname: `/nifty/v1/price-master-details/fc-component-price-master/search` }}
            className={classes.refineSearch}
          >
            <ChevronLeftIcon />
            <span className={classes.refineSearchBackIcon}>{translate("fcComponentPriceMaster.refine_search")}</span>
          </Link>
        </Grid>
      </>
    ),
    [],
  );

  return (
    <>
      {DisplayTitle}
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForFCComponentPriceMasterGrid}
        actionButtonsForGrid={[]}
        gridTitle=""
        searchLabel=""
        sortField={{ field: "categoryName", order: "DESC" }}
        filter={filterData}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
      />

      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}`}
        redirectPath={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        params={{}}
        close={toggle}
        open={openDialog}
        list
        deleteText={`${translate("delete_confirmation_message")} FC component mapping?`}
      />
    </>
  );
};

export default React.memo(FCComponentPriceMasterList);
