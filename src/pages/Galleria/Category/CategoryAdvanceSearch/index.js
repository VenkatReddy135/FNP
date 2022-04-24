/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useTranslate, useRedirect, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import useStyles from "../../../../assets/theme/common";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import AdvanceSearchCategoryForm from "./SearchForm";
import { processFieldValue } from "../../../../utils/helperFunctions";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Advanced search tool
 *
 * @returns {React.Component} //return component
 */
const AdvanceSearchCategory = () => {
  const classes = useStyles();
  const history = useHistory();
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const [selectedFromDate, updateFromDate] = useState("");
  const [selectedThruDate, updateThruDate] = useState("");
  const [state, setState] = useState({
    values: { domain: "", geography: "", productType: "", occasion: "", city: "", recipient: "", party: "" },
    apiParams: {
      type: "getData",
      url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
      sortParam: "tagName",
    },
    apiPartyParams: {
      type: "getData",
      url: `${window.REACT_APP_PARTY_SERVICE}/publishers`,
      sortParam: "modifiedDate:DESC",
      taxonomyType: "P",
    },
    operatorList: [
      { name: translate("equalTo"), id: "EqualTo" },
      { name: translate("notEqualTo"), id: "NotEqualTo" },
      { name: translate("like"), id: "Like" },
      { name: translate("not_like"), id: "NotLike" },
    ],
    checkboxList: [
      { label: translate("tag_pending_approval"), value: "PENDING" },
      { label: translate("tag_approved"), value: "APPROVED" },
      { label: translate("tag_rejected"), value: "REJECTED" },
    ],
    tagTypes: [],
  });

  const { values } = state;

  const listingUrl = `/${window.REACT_APP_GALLERIA_SERVICE}/categories`;
  const timeFormat = "T00:00:00";
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    { displayName: translate("advance_search") },
  ];

  /**
   * Function cancelHandler to redirect back to listing page
   */
  const cancelHandler = () => {
    redirect(listingUrl);
  };

  /**
   * @function minValue function to validate whether 'To Date' is greater than selected 'From Date'
   * @param {*} min contains the minimum date that can be selected in 'To Date' input
   * @param {string} message error message that gets displayed when selected 'To Date' is less than the 'From Date' value
   * @returns {*} returns the validation result and displays error message
   */
  const minValue = (min, message = translate("to_date_validation_message")) => (value) =>
    new Date(value) && new Date(value) < min ? message : undefined;

  /**
   *@function handleFromDateChange function called on change of From date in Advance search Page
   *@param {*} event event called on change of From date
   */
  const handleFromDateChange = (event) => {
    updateFromDate(event.target.value);
  };

  /**
   *@function handleThruDateChange function called on change of Thru date in Advance search Page
   *@param {*} event event called on change of Thru date
   */
  const handleThruDateChange = (event) => {
    updateThruDate(event.target.value);
  };

  /**
   * Function to store search data in local storage to be used by url redirect listing as filters
   *
   * @param {object} searchData update form data
   */
  const searchTagsHandler = (searchData) => {
    const userInputs = { ...values, ...searchData };

    const advSearchData = [];
    if (userInputs.isEnabled) {
      advSearchData.push({ fieldName: "isEnabled", fieldValue: [searchData.isEnabled], operatorName: "In" });
    }
    if (userInputs.category_name) {
      advSearchData.push({
        fieldName: "categoryName",
        fieldValue: processFieldValue(userInputs?.category_name_operator, userInputs.category_name),
        operatorName: userInputs.category_name_operator || "Like",
      });
    }
    if (userInputs.category_type) {
      advSearchData.push({
        fieldName: "categoryType",
        fieldValue: processFieldValue(userInputs.category_type_operator, userInputs.category_type),
        operatorName: userInputs.category_type_operator || "Like",
      });
    }
    if (userInputs.category_url) {
      advSearchData.push({
        fieldName: "categoryUrl",
        fieldValue: userInputs.category_url,
        operatorName: userInputs.category_url_operator || "Like",
      });
    }
    if (userInputs.category_id) {
      advSearchData.push({
        fieldName: "id",
        fieldValue: userInputs.category_id,
        operatorName: userInputs.category_id_operator || "Like",
      });
    }
    if (userInputs.fromDate) {
      advSearchData.push({
        fieldName: "fromDate",
        fieldValue: [
          userInputs.fromDate ? userInputs.fromDate.concat(timeFormat) : "",
          userInputs.from_date_between ? userInputs.from_date_between.concat(timeFormat) : "",
        ],
        operatorName: "In",
      });
    }
    if (userInputs.thruDate) {
      advSearchData.push({
        fieldName: "thruDate",
        fieldValue: [
          userInputs.thruDate ? userInputs.thruDate.concat(timeFormat) : "",
          userInputs.thru_date_between ? userInputs.thru_date_between.concat(timeFormat) : "",
        ],
        operatorName: "In",
      });
    }
    if (userInputs.categoryClassification) {
      advSearchData.push({
        fieldName: "categoryClassification",
        fieldValue: [searchData.categoryClassification],
        operatorName: "In",
      });
    }
    if (userInputs.city) {
      advSearchData.push({
        fieldName: "city",
        fieldValue: processFieldValue(userInputs.city_operator, userInputs.city.name),
        operatorName: userInputs.city_operator || "Like",
      });
    }
    if (userInputs.domain) {
      advSearchData.push({
        fieldName: "domain",
        fieldValue: processFieldValue(userInputs.domain_operator, userInputs.domain.name),
        operatorName: userInputs.domain_operator || "Like",
      });
    }
    if (userInputs.geography) {
      advSearchData.push({
        fieldName: "geography",
        fieldValue: processFieldValue(userInputs.geography_operator, userInputs.geography.name),
        operatorName: userInputs.geography_operator || "Like",
      });
    }
    if (userInputs.occasion) {
      advSearchData.push({
        fieldName: "occasion",
        fieldValue: processFieldValue(userInputs.occasion_type_operator, userInputs.occasion.name),
        operatorName: userInputs.occasion_type_operator || "Like",
      });
    }
    if (userInputs.productType) {
      advSearchData.push({
        fieldName: "productType",
        fieldValue: processFieldValue(userInputs.product_type_operator, userInputs.productType.name),
        operatorName: userInputs.product_type_operator || "Like",
      });
    }
    if (userInputs.recipient) {
      advSearchData.push({
        fieldName: "recipient",
        fieldValue: processFieldValue(userInputs.recipient_operator, userInputs.recipient.name),
        operatorName: userInputs.recipient_operator || "Like",
      });
    }
    if (userInputs.party) {
      advSearchData.push({
        fieldName: "party",
        fieldValue: processFieldValue(userInputs.party_operator, userInputs.party.id),
        operatorName: userInputs.party_operator || "Like",
      });
    }
    const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "";
    const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "";
    // redirect to listing
    if (advSearchData.length === 0) {
      notify(translate("parameter_to_search"), "error", TIMEOUT);
    } else {
      redirect(`${listingUrl}?advSearchObj=${JSON.stringify(advSearchData)}&sort=${sortVal}&order=${orderVal}`);
    }
  };

  /**
   * @function handleAutocomplete This function will setData
   * @param {object} e event
   * @param {string} newValue is passed to the function
   * @param {string} field state field
   */
  const handleAutocomplete = (e, newValue, field) => {
    const newVal = newValue === null ? {} : newValue;
    setState((prevState) => ({ ...prevState, values: { ...prevState.values, [field]: newVal } }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetDataSuccess = (response) => {
    if (response.data?.data) {
      const tagTypeVal = [];
      response.data.data?.forEach((val) => {
        tagTypeVal.push({ id: val.categoryTypeName, name: val.categoryTypeName });
      });
      setState((prevState) => ({ ...prevState, tagTypes: [...tagTypeVal] }));
    }
  };

  const { loading } = useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_GALLERIA_SERVICE}/category-types`,
    handleSetDataSuccess,
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <Grid item container justify="space-between">
            <Grid className={classes.gridStyle} item>
              <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
                {translate("advance_search")}
              </Typography>
            </Grid>
          </Grid>
          <Divider variant="fullWidth" />
          <AdvanceSearchCategoryForm
            classes={classes}
            handleAutocomplete={handleAutocomplete}
            searchTagsHandler={searchTagsHandler}
            cancelHandler={cancelHandler}
            translate={translate}
            handleFromDateChange={handleFromDateChange}
            handleThruDateChange={handleThruDateChange}
            minValue={minValue}
            selectedFromDate={selectedFromDate}
            selectedThruDate={selectedThruDate}
            {...state}
          />
        </>
      )}
    </>
  );
};

export default AdvanceSearchCategory;
