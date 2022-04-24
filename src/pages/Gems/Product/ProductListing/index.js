/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTranslate, useRedirect } from "react-admin";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CommonImport from "../../../../components/CommonImport";
import SimpleGrid from "../../../../components/SimpleGrid";
import RefineSearchButton from "../../../../components/RefineSearchButton";
import useStyles from "../../../../assets/theme/common";

/**
 * Component for Product Management List contains a simple grid with configurations for Product
 *
 * @param {*} props all the props needed for Product Management List
 * @returns {React.ReactElement} returns a Product Management List component
 */
const ProductListing = (props) => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const classes = useStyles();
  const [state, setState] = useState({
    searchByName: false,
    importConfig: {
      fileType: "csv",
      specName: "ProductImportJobSpec",
    },
    showImport: false,
  });

  const { searchByName, importConfig, showImport } = state;
  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setState((prevState) => ({ ...prevState, showImport: true }));
  };

  /**
   * @function  refineSearchHandler to redirect Product Search Form
   */
  const refineSearchHandler = () => {
    redirect(`/${window.REACT_APP_GEMS_SERVICE}productsearch`);
  };

  /**
   * @function createHandler to redirect Create page
   * @param {object} event onClick event object
   */
  const createHandler = (event) => {
    event.preventDefault();
    redirect(`/${window.REACT_APP_GEMS_SERVICE}products/create`);
  };

  /**
   * @function checkboxHandler to redirect Create page
   * @param {object} e onClick event object
   */
  const checkboxHandler = (e) => {
    setState((prevState) => ({ ...prevState, searchByName: e.target.checked }));
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
      routeType: "/edit",
      isEditable: true,
    },
  ];
  const configurationForProductGrid = [
    {
      source: "skuCode",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("sku_code"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "id", type: "TextField", label: translate("product_id") },
    { source: "name", type: "TextField", label: translate("product_name") },
    { source: "state.name", type: "TextField", label: translate("state") },
    { source: "type.name", type: "TextField", label: translate("product_type") },
    { source: "subType.name", type: "TextField", label: translate("product_sub_type") },
    { source: "classification.name", type: "TextField", label: translate("Classification") },
    { source: "countryOfOrigin", type: "TextField", label: translate("product_country") },
    { source: "brandName", type: "TextField", label: translate("product_manufacturer") },
    { source: "isEnabled", type: "SwitchComp", label: translate("isEnabled"), disable: true, record: false },
    { source: "createdBy", type: "TextField", label: translate("createdBy") },
    { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
    { source: "updatedBy", type: "TextField", label: translate("lastModifiedBy") },
    { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
  ];
  const actionButtonsForProductGrid = [
    {
      type: "CreateButton",
      label: translate("new_product"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
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
      onClick: () => {},
    },
  ];
  const actionButtonsForProductEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("new_product"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
    {
      type: "Button",
      label: translate("import"),
      icon: <></>,
      variant: "contained",
      onClick: () => fetchUrl(),
    },
  ];
  const productGridTitle = translate("product_management");
  const productFilterLabel = translate("product_searchby_name");
  const productManagementSearchLabel = translate("product_simplesearch_label");
  const searchCheckBox = (
    <FormControlLabel
      key="searchCheckBox"
      className={classes.checkBoxClass}
      control={<Checkbox onChange={checkboxHandler} checked={searchByName} />}
      label={productFilterLabel}
    />
  );

  return (
    <div className={classes.categoryMarginTop}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForProductGrid}
        actionButtonsForGrid={actionButtonsForProductGrid}
        actionButtonsForEmptyGrid={actionButtonsForProductEmptyGrid}
        gridTitle={productGridTitle}
        searchLabel={productManagementSearchLabel}
        filterLabel={productFilterLabel}
        isSmallerSearch
        filter={{ isSearchInName: searchByName }}
        filterGridItems={[searchCheckBox]}
        refineSearch={<RefineSearchButton refineSearchHandler={refineSearchHandler} />}
      />
      {showImport && (
        <CommonImport resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`} payload={importConfig} />
      )}
    </div>
  );
};

export default React.memo(ProductListing);
