/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Grid, Typography, Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button, useTranslate } from "react-admin";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import useStyles from "../../../../assets/theme/common";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Price Rule Management  List contains a simple grid with configurations for List of Price Rules
 *
 * @param {object} props all the props needed for Price Rule Management List List
 * @returns {React.ReactElement} returns a Price Rule Management List component
 */
const PriceRuleManagementList = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const breadcrumbs = [
    {
      displayName: translate("priceRuleManagement.price_rule_management"),
    },
  ];
  /**
   * Edit handler to edit the Price Rule
   *
   * @function editHandler
   */
  const editHandler = () => {};

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
  ];

  const configurationForpriceRuleManagementGrid = [
    {
      source: "ppCalculationMethod",
      type: "KebabMenuWithLink",
      label: translate("priceRuleManagement.price_rule_name"),
      configurationForKebabMenu,
      tabPath: "/show",
      isLink: true,
    },
    {
      source: "isDcInWp",
      type: "TextField",
      label: translate("priceRuleManagement.price_rule_criteria"),
    },
    {
      source: "ppCalculationMethod",
      type: "TextField",
      label: translate("priceRuleManagement.price_rule_action"),
    },
    {
      source: "isDcInWp",
      type: "TextField",
      label: translate("priceRuleManagement.exception_on"),
    },

    { source: "createdByName", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedByName", type: "TextField", label: translate("modified_by") },
    { source: "updatedAt", type: "CustomDateField", label: translate("modified_date") },

    {
      source: "isEnabled",
      type: "SwitchComp",
      label: translate("status"),
      disable: true,
      record: false,
    },
  ];

  /**
   * @function newCarrierShippingPriceMaster to redirect Price Rule Management create Form
   */
  const newCarrierShippingPriceMaster = () => {};

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
              {translate("priceRuleManagement.price_rule_management")}
            </Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("priceRuleManagement.new_price_rule")}
              variant="outlined"
              onClick={newCarrierShippingPriceMaster}
            />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
        <Grid item className={classes.textInputField}>
          <Link to={{ pathname: `/nifty/v1/price-rule-management/search` }} className={classes.refineSearch}>
            <ChevronLeftIcon />
            <span className={classes.refineSearchBackIcon}>
              {translate("priceRuleManagement.price_rule_management_refine_search")}
            </span>
          </Link>
        </Grid>
      </>
    ),
    [],
  );

  const priceRuleSearchLabel = translate("priceRuleManagement.price_rule_search");

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {DisplayTitle}
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_NIFTY_SERVICE}/base-price-model`}
        configurationForGrid={configurationForpriceRuleManagementGrid}
        actionButtonsForGrid={[]}
        gridTitle=""
        searchLabel={priceRuleSearchLabel}
        sortField={{ field: "id", order: "DESC" }}
      />
    </>
  );
};

export default React.memo(PriceRuleManagementList);
