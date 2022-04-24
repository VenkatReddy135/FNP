/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import { Button, useTranslate } from "react-admin";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIconOutlined from "@material-ui/icons/DeleteOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import useStyles from "../../../../assets/theme/common";
import CustomFilters from "../../../../components/CustomFiltersForGrid";
import CommonDelete from "../../../../components/CommonDelete";
import CommonExport from "../../../../components/CommonExport";
import CommonImport from "../../../../components/CommonImport";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import { isStringNumber } from "../../../../utils/validationFunction";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Customer Delivery Charges List contains a simple grid with configurations for List of Customers
 *
 * @param {object} props all the props needed for Customer Delivery Charges List
 * @returns {React.ReactElement} returns a Customer Delivery Charges List component
 */
const CustomerDeliveryChargesList = (props) => {
  const classes = useStyles();
  const { push, location } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);
  const [id, setId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [urlFlag, setUrlFlag] = useState(false);
  const [state, setState] = useState({
    isExport: false,
  });
  const importConfig = {
    fileType: "csv",
    specName: "CategoryImportJobSpec",
  };

  const breadcrumbs = [
    {
      displayName: translate("customerDeliveryCharges.customer_delivery_charges"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges`,
    },
  ];

  const orderVal = location.search ? new URLSearchParams(location.search).get("order") : "DESC";
  const sortVal = location.search ? new URLSearchParams(location.search).get("sort") : "createdAt";
  const exportConfig = {
    exportFileFormat: "csv",
    sortParam: `${sortVal}:${orderVal}`,
  };

  /**
   * Edit handler to edit the customer
   *
   * @function editHandler
   */
  const editHandler = () => {};

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected customer id to delete
   */
  const deleteHandler = (rowId) => {
    setId(rowId);
    setOpenDialog(true);
  };

  /**
   * Export handler to export the customer
   *
   * @function exportHandler
   */
  const exportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: true }));
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
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setUrlFlag(false);
  };

  /**
   * To reset the export the customer
   *
   * @function resetExportHandler
   */
  const resetExportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: false }));
  };

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a customer id
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

  const configurationForCustomerDeliveryChargesGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("customerDeliveryCharges.configuration_code"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "categoryUrl", type: "TextField", label: translate("domain") },
    { source: "categoryName", type: "TextField", label: translate("geo") },
    { source: "categoryType", type: "TextField", label: translate("customerDeliveryCharges.delivery_area") },
    { source: "categoryType", type: "TextField", label: translate("customerDeliveryCharges.shipping_method_name") },
    { source: "fromDate", type: "CustomDateField", label: translate("customerDeliveryCharges.time_slot") },
    { source: "baseCategory", type: "TextField", label: translate("customerDeliveryCharges.product_type") },
    { source: "createdBy", type: "TextField", label: translate("customerDeliveryCharges.customer_delivery_charges") },
    { source: "id", type: "TextField", label: translate("created_date") },
    { source: "thruDate", type: "CustomDateField", label: translate("created_by") },
    { source: "updatedBy", type: "TextField", label: translate("modified_date") },
    { source: "createdAt", type: "CustomDateField", label: translate("modified_by") },
    {
      source: "isEnabled",
      type: "SwitchComp",
      label: translate("customerDeliveryCharges.is_enabled"),
      disable: true,
      record: false,
    },
  ];

  /**
   * @function newCustomerDeliveryCharge to redirect Customer Delivery Charges create Form
   */
  const newCustomerDeliveryCharge = () => {
    push({
      pathname: `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/create`,
    });
  };

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("customerDeliveryCharges.customer_delivery_charges_search"),
    },
    {
      type: "TextInput",
      label: translate("domain"),
      source: "domain",
      alwaysOn: false,
    },
    {
      type: "SelectInput",
      label: translate("geo"),
      source: "geo",
      alwaysOn: false,
      choices: contactPurposes,
    },
    {
      type: "TextInput",
      label: translate("geo_group"),
      source: "geoGroup",
      alwaysOn: false,
    },
    {
      type: "TextInput",
      label: translate("customerDeliveryCharges.shipping_method_name"),
      source: "shippingMethod",
      alwaysOn: false,
    },
    {
      type: "TextInput",
      label: translate("customerDeliveryCharges.time_slot"),
      source: "timeSlot",
      alwaysOn: false,
    },
    {
      type: "TextInput",
      label: translate("customerDeliveryCharges.product_type"),
      source: "productType",
      alwaysOn: false,
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

  /**
   *
   * @returns {React.Component} return component
   */
  const DisplayTitle = useMemo(
    () => (
      <>
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Grid item>
            <Typography variant="h5" className={classes.gridStyle}>
              {translate("customerDeliveryCharges.customer_delivery_charges")}
            </Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("customerDeliveryCharges.new_customer_delivery_charges")}
              variant="outlined"
              onClick={newCustomerDeliveryCharge}
            />
            <Button label={translate("importTitle")} variant="contained" onClick={fetchUrl} />
            <Button label={translate("exportTitle")} variant="outlined" onClick={exportHandler} />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
        <Grid item className={classes.textInputField}>
          <Link
            to={{ pathname: `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/search` }}
            className={classes.refineSearch}
          >
            <ChevronLeftIcon />
            <span className={classes.refineSearchBackIcon}>
              {translate("customerDeliveryCharges.customer_delivery_charges_refine_search")}
            </span>
          </Link>
        </Grid>
      </>
    ),
    [],
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {DisplayTitle}
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForCustomerDeliveryChargesGrid}
        actionButtonsForGrid={[]}
        gridTitle=""
        searchLabel=""
        sortField={{ field: "id", order: "DESC" }}
        filter={filterData}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
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
        deleteText={`${translate("delete_confirmation_message")} Customer Delivery Charges?`}
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

export default React.memo(CustomerDeliveryChargesList);
