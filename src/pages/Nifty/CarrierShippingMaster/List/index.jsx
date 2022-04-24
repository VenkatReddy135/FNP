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
 * Component for Carrier Shipping Price Master  List contains a simple grid with configurations for List of Carriers
 *
 * @param {object} props all the props needed for Carrier Shipping Price Master List List
 * @returns {React.ReactElement} returns a Carrier Shipping Price Master List component
 */
const CarrierShippingMasterList = (props) => {
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
      displayName: translate("carrierShippingPriceMaster.carrier_shipping_price_master"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/carrier-shipping-price-master`,
    },
  ];

  const orderVal = location.search ? new URLSearchParams(location.search).get("order") : "DESC";
  const sortVal = location.search ? new URLSearchParams(location.search).get("sort") : "createdAt";
  const exportConfig = {
    exportFileFormat: "csv",
    sortParam: `${sortVal}:${orderVal}`,
  };

  /**
   * Edit handler to edit the carrier
   *
   * @function editHandler
   */
  const editHandler = () => {};

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected carrier id to delete
   */
  const deleteHandler = (rowId) => {
    setId(rowId);
    setOpenDialog(true);
  };

  /**
   * Export handler to export the carrier
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
   * To reset the export the carrier
   *
   * @function resetExportHandler
   */
  const resetExportHandler = () => {
    setState((prevState) => ({ ...prevState, isExport: false }));
  };

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a carrier id
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

  const configurationForcarrierShippingMasterGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("carrierShippingPriceMaster.carrier_name"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "categoryName", type: "TextField", label: translate("domain") },
    { source: "categoryType", type: "TextField", label: translate("geo") },
    { source: "categoryType", type: "TextField", label: translate("carrierShippingPriceMaster.fulfillment_center") },
    { source: "fromDate", type: "CustomDateField", label: translate("carrierShippingPriceMaster.delivery_area") },
    { source: "baseCategory", type: "TextField", label: translate("carrierShippingPriceMaster.shipping_method_name") },
    { source: "createdBy", type: "TextField", label: translate("carrierShippingPriceMaster.time_slot") },
    { source: "id", type: "TextField", label: translate("currency") },
    { source: "thruDate", type: "CustomDateField", label: translate("carrierShippingPriceMaster.uom_type") },
    { source: "updatedBy", type: "TextField", label: translate("carrierShippingPriceMaster.uom_values") },
    { source: "createdAt", type: "CustomDateField", label: translate("carrierShippingPriceMaster.shipping_rate_type") },
    {
      source: "categoryName",
      type: "UrlComponent",
      label: translate("carrierShippingPriceMaster.shipping_rate_type_configuration"),
    },
  ];

  /**
   * @function newCarrierShippingPriceMaster to redirect Carrier Shipping Price Master create Form
   */
  const newCarrierShippingPriceMaster = () => {
    push({
      pathname: `/nifty/v1/carrier-shipping-price-master/create`,
    });
  };

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("carrierShippingPriceMaster.carrier_shipping_price_master_search"),
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
              {translate("carrierShippingPriceMaster.carrier_shipping_price_master")}
            </Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("carrierShippingPriceMaster.new_shipment_rate")}
              variant="outlined"
              onClick={newCarrierShippingPriceMaster}
            />
            <Button label={translate("importTitle")} variant="contained" onClick={fetchUrl} />
            <Button label={translate("exportTitle")} variant="outlined" onClick={exportHandler} />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
        <Grid item className={classes.textInputField}>
          <Link to={{ pathname: `/nifty/v1/carrier-shipping-price-master/search` }} className={classes.refineSearch}>
            <ChevronLeftIcon />
            <span className={classes.refineSearchBackIcon}>
              {translate("carrierShippingPriceMaster.carrier_shipping_price_master_refine_search")}
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
        configurationForGrid={configurationForcarrierShippingMasterGrid}
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
        deleteText={`${translate("delete_confirmation_message")} Shipping Rate Type Configuration?`}
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

export default React.memo(CarrierShippingMasterList);
