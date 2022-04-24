/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useTranslate, SimpleForm, useRedirect, RadioButtonGroupInput, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import Dropdown from "../../../../../components/Dropdown";
import AutoComplete from "../../../../../components/AutoComplete";
import useStyles from "../../../../../assets/theme/common";
import CustomToolbar from "../../../../../components/CustomToolbar";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import { processFieldValue } from "../../../../../utils/helperFunctions";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Advanced search tool
 *
 * @returns {React.Component} //return component
 */
const AdvanceSearchTags = () => {
  const classes = useStyles();
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();

  const [state, setState] = useState({
    tagId: "",
    tagName: "",
    apiParams: {
      type: "getData",
      url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
      sortParam: "tagId",
    },
    operatorList: [
      { name: translate("equalTo"), id: "EqualTo" },
      { name: translate("notEqualTo"), id: "NotEqualTo" },
      { name: translate("like"), id: "Like" },
      { name: translate("not_like"), id: "NotLike" },
    ],
    tagTypes: [],
  });

  const { tagId, tagName, apiParams, operatorList } = state;

  const listingUrl = `/${window.REACT_APP_GALLERIA_SERVICE}/tags`;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: translate("advance_search") },
  ];

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
   */
  const searchTagsHandler = (searchData) => {
    const userInputs = { tagId, tagName, ...searchData };

    const advSearchData = [];
    if (userInputs.isEnabled) {
      advSearchData.push({ fieldName: "isEnabled", fieldValue: [searchData.isEnabled], operatorName: "In" });
    }
    if (userInputs.tag_type) {
      advSearchData.push({ fieldName: "tagTypeId", fieldValue: userInputs.tag_type, operatorName: "EqualTo" });
    }
    if (userInputs.tagName) {
      advSearchData.push({
        fieldName: "tagName",
        fieldValue: processFieldValue(userInputs?.tag_name_operator, userInputs.tagName.name),
        operatorName: userInputs.tag_name_operator || "Like",
      });
    }
    if (userInputs.tagId) {
      advSearchData.push({
        fieldName: "tagId",
        fieldValue: processFieldValue(userInputs?.tag_id_operator, userInputs.tagId.id),
        operatorName: userInputs.tag_id_operator || "Like",
      });
    }

    const sortVal = history.location.search ? new URLSearchParams(history.location.search).get("sort") : "";
    const orderVal = history.location.search ? new URLSearchParams(history.location.search).get("order") : "";

    // redirect to listing
    if (advSearchData.length) {
      redirect(`${listingUrl}?advSearchObj=${JSON.stringify(advSearchData)}&sort=${sortVal}&order=${orderVal}`);
    } else {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    }
  };

  /**
   * @function handleAutocompleteId This function will setData
   * @param {object} e event
   * @param {string} newValue is passed to the function
   */
  const handleAutocompleteId = (e, newValue) => {
    const newVal = newValue === null ? {} : newValue;
    setState((prevState) => ({ ...prevState, tagId: newVal }));
  };

  /**
   * @function handleAutocompleteId This function will setData
   * @param {object} e event
   * @param {string} newValue is passed to the function
   */
  const handleAutocompleteName = (e, newValue) => {
    const newVal = newValue === null ? {} : newValue;
    setState((prevState) => ({ ...prevState, tagName: newVal }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetDataSuccess = (response) => {
    if (response?.data?.data) {
      const tagTypeVal = [];
      response.data.data.forEach((val) => {
        tagTypeVal.push({ id: val.tagTypeId, name: val.tagTypeName });
      });
      setState((prevState) => ({ ...prevState, tagTypes: [...tagTypeVal] }));
    }
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GALLERIA_SERVICE}/tag-types`, handleSetDataSuccess);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid className={classes.gridStyle} item>
          <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
            {translate("advance_search")}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <SimpleForm
        save={searchTagsHandler}
        toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("apply")} />}
      >
        <Grid container spacing={2} className={classes.gridStyleNew}>
          <Grid item xs={12} className={classes.flexParent}>
            <Dropdown className={classes.dropdownStyle} label="tag_id_operator" data={operatorList} edit />
            <div className={classes.tagPickerDropdown}>
              <AutoComplete
                name="tagId"
                label={translate("tag_id")}
                dataId="tagId"
                apiParams={{ ...apiParams, fieldName: "tagId", fieldId: "tagId" }}
                onOpen
                value={tagId}
                onChange={handleAutocompleteId}
                required
                fullWidth
              />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.flexParent}>
            <Dropdown className={classes.dropdownStyle} label="tag_name_operator" data={operatorList} edit />
            <div className={classes.tagPickerDropdown}>
              <AutoComplete
                label={translate("tag_name")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={tagName}
                onChange={handleAutocompleteName}
                required
                fullWidth
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Dropdown label="tag_type" data={state.tagTypes} edit />
          </Grid>
          <Grid item xs={12}>
            <RadioButtonGroupInput
              label={translate("isEnabled")}
              source="isEnabled"
              choices={[
                { id: "All", name: "All" },
                { id: "true", name: "Yes" },
                { id: "false", name: "No" },
              ]}
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  );
};

export default AdvanceSearchTags;
