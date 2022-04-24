/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useTranslate, Button } from "react-admin";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { startCase } from "lodash";
import SimpleGrid from "../../../components/SimpleGrid";
import useStyles from "../../../assets/theme/common";
import CustomFilters from "../../../components/CustomFiltersForGrid";
import Breadcrumbs from "../../../components/Breadcrumbs";
import RefineSearchButton from "../../../components/RefineSearchButton";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import { isStringNumber } from "../../../utils/validationFunction";

/**
 * Component for Party Management List contains a simple grid with configurations for List of parties
 *
 * @param {object} props all the props needed for Party Management List
 * @returns {React.ReactElement} returns a Party Management List component
 */
const PartyList = (props) => {
  const classes = useStyles();
  const { push, location } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    { displayName: translate("party_list") },
  ];

  /**
   * @param {string} filterParam passed to function
   * @returns {string} returns formatted string
   */
  const stringFormatter = (filterParam) => {
    const json = JSON.parse(filterParam);
    const keys = Object.keys(json);
    const temp = {};
    keys.forEach((data) => {
      const key = startCase(data).replace(/ /g, " ");
      temp[key] = json[data];
    });
    return JSON.stringify(temp)
      .replace(/[{}"]/g, " ")
      .replace(/, Q/g, `, ${translate("simple_search")}`);
  };

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a party id
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
      type: translate("view_orders"),
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/#",
      isEditable: false,
    },
    {
      id: "2",
      type: translate("create_orders"),
      leftIcon: <AddOutlinedIcon />,
      path: "",
      routeType: "/#",
      isEditable: true,
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

  const configurationForPartyGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("party_id"),
      tabPath: "/show",
      sortable: true,
      isLink: true,
    },
    {
      source: "name",
      type: "TextField",
      label: translate("party_name"),
    },
    {
      source: "loginIds",
      type: "CustomSourceData",
      label: translate("login_id"),
      sortable: false,
    },
    {
      source: "email",
      type: "CustomSourceData",
      field: "contacts",
      label: translate("contact_email_id"),
      sortable: false,
    },
    {
      source: "phone",
      type: "CustomSourceData",
      field: "contacts",
      label: translate("contact_phone_number"),
      sortable: false,
    },
    {
      source: "contactPurpose",
      type: "CustomSourceData",
      field: "contacts",
      label: translate("contact_purpose"),
      sortable: false,
    },
    {
      source: "createdBy",
      type: "TextField",
      label: translate("created_by"),
    },
    {
      source: "createdDate",
      type: "DateField",
      label: translate("created_date"),
    },
    {
      source: "modifiedBy",
      type: "TextField",
      label: translate("modified_by"),
    },
    {
      source: "modifiedDate",
      type: "DateField",
      label: translate("modified_date"),
    },
    {
      source: "status",
      type: "StatusField",
      label: translate("status"),
      displayStatusText: {
        trueText: translate("active"),
        falseText: translate("inactive"),
      },
    },
  ];

  /**
   * @function newPartyHandler to redirect Party create Form
   */
  const newPartyHandler = () => {
    push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/create`,
    });
  };

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("search"),
    },
    {
      type: "TextInput",
      label: translate("login_id"),
      source: "loginId",
      alwaysOn: false,
    },
    {
      type: "SelectInput",
      label: translate("contact_purpose"),
      source: "contactPurposeId",
      alwaysOn: false,
      choices: contactPurposes,
    },
    {
      type: "SelectInput",
      label: translate("status"),
      source: "status",
      alwaysOn: false,
      choices: [
        { id: true, name: translate("active") },
        { id: false, name: translate("inactive") },
      ],
    },
  ];

  /**
   * @function  refineSearchHandler to redirect
   */
  const refineSearchHandler = () => {
    push(`/parties/search?data=${encodeURIComponent(query)}`);
  };

  /**
   *
   * @returns {React.Component} return component
   */
  const DisplayTitle = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Grid item>
            <Typography variant="h5" className={classes.gridStyle}>
              {translate("party_management")}
            </Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button label={translate("new_party")} variant="outlined" onClick={newPartyHandler} />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
        <Grid item className={classes.textInputField}>
          <RefineSearchButton refineSearchHandler={refineSearchHandler} />
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
        resource={`${window.REACT_APP_PARTY_SERVICE}/parties/search`}
        configurationForGrid={configurationForPartyGrid}
        actionButtonsForGrid={[]}
        gridTitle=""
        searchLabel=""
        sortField={{ field: "id", order: "DESC" }}
        filter={filterData}
        limit={`${translate("no_search_param")} ${stringFormatter(JSON.stringify(filterData))}`}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
      />
    </>
  );
};

export default PartyList;
