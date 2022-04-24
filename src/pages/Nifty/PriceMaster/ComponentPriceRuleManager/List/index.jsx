/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Button, useTranslate } from "react-admin";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../../components/SimpleGrid";
import useStyles from "../../../../../assets/theme/common";
import CustomFilters from "../../../../../components/CustomFiltersForGrid";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import { isStringNumber } from "../../../../../utils/validationFunction";

/**
 * Component for Component Price Rule Manger  List contains a simple grid with configurations for List of FCS
 *
 * @param {object} props all the props needed for Component Price Rule Manger List
 * @returns {React.ReactElement} returns a Component Price Rule Manger List component
 */
const ComponentPriceRuleManagerList = (props) => {
  const classes = useStyles();
  const { push, location } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);

  /**
   * Edit handler to edit the Component Price Rule
   *
   * @function editHandler
   */
  const editHandler = () => {};

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a Price Rule
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

  const configurationForComponentPriceRuleManagerGrid = [
    {
      source: "categoryName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("componentPriceRuleManager.rule_name"),
      tabPath: "/show",
      isLink: true,
    },
    { source: "categoryType", type: "TextField", label: translate("componentPriceRuleManager.fulfillment_geo") },
    { source: "categoryName", type: "TextField", label: translate("componentPriceRuleManager.fc_group_id") },
    { source: "categoryType", type: "TextField", label: translate("componentPriceRuleManager.rule_applied_on") },
    { source: "categoryName", type: "TextField", label: translate("componentPriceRuleManager.component_names_groups") },
    { source: "fromDate", type: "CustomDateField", label: translate("from_date") },
    { source: "thruDate", type: "CustomDateField", label: translate("to_date") },
    { source: "categoryName", type: "TextField", label: translate("componentPriceRuleManager.override_type") },
    { source: "categoryName", type: "TextField", label: translate("componentPriceRuleManager.flat_percent_override") },
    { source: "categoryType", type: "TextField", label: translate("currency") },
    { source: "categoryType", type: "TextField", label: translate("state") },
    { source: "updatedBy", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
  ];

  /**
   * @function newRule to redirect new Rule Form
   */
  const newRule = () => {
    push({
      pathname: `/nifty/v1/price-master-details/component-price-rule-manager/create`,
    });
  };

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("componentPriceRuleManager.component_price_rule_search"),
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
   *
   * @returns {React.Component} return component
   */
  const DisplayTitle = useMemo(
    () => (
      <>
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Grid item>
            <Typography variant="h5">{translate("componentPriceRuleManager.price_rule_title")}</Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("componentPriceRuleManager.new_price_rule")}
              variant="outlined"
              onClick={newRule}
            />
          </Grid>
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
        configurationForGrid={configurationForComponentPriceRuleManagerGrid}
        actionButtonsForGrid={[]}
        gridTitle=""
        searchLabel=""
        sortField={{ field: "categoryName", order: "DESC" }}
        filter={filterData}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
      />
    </>
  );
};

export default React.memo(ComponentPriceRuleManagerList);
