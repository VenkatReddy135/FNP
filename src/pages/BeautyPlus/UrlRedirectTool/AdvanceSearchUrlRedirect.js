/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import {
  useTranslate,
  SimpleForm,
  useRedirect,
  Toolbar,
  Button,
  SaveButton,
  RadioButtonGroupInput,
  useNotify,
} from "react-admin";
import CustomTextInput from "../../../components/TextInput";
import Dropdown from "../../../components/Dropdown";
import Breadcrumbs from "../../../components/Breadcrumbs";
import useStyles from "../../../assets/theme/common";
import { TIMEOUT } from "../../../config/GlobalConfig";

/**
 * Advanced search tool
 *
 * @returns {React.Component} //return component
 */
const AdvanceSearchUrlRedirect = () => {
  const classes = useStyles();
  const notify = useNotify();
  const { gridStyleNew, gridStyle, titleLineHeight } = classes;
  const redirect = useRedirect();
  const translate = useTranslate();
  const listingUrl = `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`;
  const [breadcrumbsList] = useState([
    {
      displayName: translate("url_redirect_tool"),
      navigateTo: listingUrl,
    },
    {
      displayName: translate("advance_search"),
    },
  ]);
  /**
   * Function cancelhandler to redirect back to listing page
   *
   */
  const cancelHandler = () => {
    redirect(listingUrl);
  };

  /**
   * Function to store search data in local storage to be used by url redirect listing as filters
   *
   * @param {object} searchData update form data
   * @param {string} searchData.entityType category of url redirect
   * @param {string} searchData.redirectType 301/302 of url redirect
   * @param {string} searchData.sourceUrl source url redirect
   * @param {string} searchData.targetUrl target url redirect
   * @param {string} searchData.isEnabled enabled yes/no/all
   */
  const searchUrlRedirectHandler = (searchData) => {
    const { entityType, redirectType, sourceUrl, targetUrl, isEnabled } = searchData;
    const filterArray = [];
    if (entityType) {
      filterArray.push({
        fieldName: "entityType",
        fieldValue: entityType,
        operatorName: "EqualTo",
      });
    }
    if (sourceUrl) {
      filterArray.push({
        fieldName: "sourceUrl",
        fieldValue: sourceUrl,
        operatorName: "Like",
      });
    }
    if (redirectType) {
      filterArray.push({
        fieldName: "redirectType",
        fieldValue: redirectType,
        operatorName: "EqualTo",
      });
    }
    if (targetUrl) {
      filterArray.push({
        fieldName: "targetUrl",
        fieldValue: targetUrl,
        operatorName: "Like",
      });
    }
    if (isEnabled) {
      let isEnabledValue = [];
      if (isEnabled === "all") {
        isEnabledValue = ["all"];
      } else {
        isEnabledValue = isEnabled === "yes" ? ["true"] : ["false"];
      }
      filterArray.push({
        fieldName: "isEnabled",
        fieldValue: isEnabledValue,
        operatorName: "In",
      });
    }
    // converting array to Base64 encoding as simple grid is unable to identify uri encoded array
    const temp = { filter: btoa(JSON.stringify(filterArray)) };
    // adding query params in filter enables url sharing & no query param extraction code required
    if (filterArray.length) {
      redirect(`${listingUrl}?filter=${JSON.stringify(temp)}`);
    } else {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    }
  };

  /**
   * Custom toolbar create component
   *
   * @param {object} props all the props required custom toolbar
   * @returns {React.ReactElement} returns a React component
   */
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <Button type="button" label={translate("cancel")} variant="outlined" onClick={cancelHandler} />
      <SaveButton label={translate("apply")} icon={<></>} />
    </Toolbar>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid item container justify="space-between">
        <Grid className={gridStyle} item>
          <Typography variant="h5" color="inherit" className={titleLineHeight}>
            {translate("advance_search")}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <SimpleForm save={searchUrlRedirectHandler} toolbar={<CustomToolbar />}>
        <Grid container spacing={5} xl={12}>
          <CustomTextInput label="sourceUrl" type="url" edit />
        </Grid>
        <Grid container spacing={5} xl={12}>
          <CustomTextInput label="targetUrl" type="url" edit />
        </Grid>
        <Grid className={gridStyleNew} container spacing={5} item md={6}>
          <Dropdown
            label="entityType"
            data={[
              { id: translate("product"), name: translate("product") },
              { id: translate("category"), name: translate("category") },
              { id: translate("cms"), name: translate("cms") },
              { id: translate("others"), name: translate("others") },
            ]}
            edit
          />
          <Dropdown
            label="redirectType"
            data={[
              { id: "301", name: "301" },
              { id: "302", name: "302" },
            ]}
            edit
          />
        </Grid>
        <Grid container xl={12}>
          <RadioButtonGroupInput
            label={translate("isEnabled")}
            source="isEnabled"
            choices={[
              { id: "all", name: "All" },
              { id: "yes", name: "Yes" },
              { id: "no", name: "No" },
            ]}
          />
        </Grid>
      </SimpleForm>
    </>
  );
};

export default AdvanceSearchUrlRedirect;
