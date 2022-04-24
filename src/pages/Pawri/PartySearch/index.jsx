/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import {
  SimpleForm,
  AutocompleteInput,
  SimpleShowLayout,
  TextInput,
  NumberInput,
  SelectInput,
  Button,
  useTranslate,
  useNotify,
  useRefresh,
  useRedirect,
} from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TIMEOUT } from "../../../config/GlobalConfig";
import {
  isStringNumber,
  handleInvalidCharsInNumberInput,
  validateEmail,
  validateOrgName,
  specialCharacterCheck,
} from "../../../utils/validationFunction";
import useStyles from "../../../assets/theme/common";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import LoaderComponent from "../../../components/LoaderComponent";
import CustomToolbar from "../../../components/CustomToolbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { DEFAULT_INDIA_COUNTRY_CODE } from "../PartyCreate/CreatePartyConstants";

/**
 * @function filterPostObject will filter the empty and null values from the post object
 * @param {object} postObject is passed to the function
 * @returns {object} returns a new modified object which has no empty keys
 */
export const filterPostObject = (postObject) => {
  const filteredObj = {};
  Object.keys(postObject).forEach((key) => {
    if (postObject[key]) {
      filteredObj[key] = postObject[key];
    }
  });
  return filteredObj;
};
/**
 * @returns {React.ReactElement} returns a Search Party form
 */
const PartySearch = () => {
  const translate = useTranslate();
  const history = useHistory();
  const notify = useNotify();
  const redirect = useRedirect();
  const classes = useStyles();
  const refresh = useRefresh();
  const [partyTypes, setPartyTypes] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const data = history.location.search ? new URLSearchParams(history.location.search).get("data") : "";
  const { partyId, partyName, partyType, loginId, contactEmailId, contactPhoneNumber } =
    (data && JSON.parse(data)) || {};

  const contactNumber = contactPhoneNumber !== undefined ? contactPhoneNumber.split("-") : "";
  const isNum = loginId !== undefined && isStringNumber(loginId.replace("-", ""));
  const [showCountryCodes, setShowCountryCodes] = useState(false || isNum);
  const containsHyphen = loginId !== undefined && loginId.includes("-");
  const initialState = {
    partyTypeId: null || partyType,
    partyId: "" || partyId,
    partyName: "" || partyName,
    loginId: "" || (loginId !== undefined && isNum && containsHyphen) ? loginId.split("-")[1] : loginId,
    contactEmailId: "" || contactEmailId,
    contactMobileNumber: "" || contactNumber[1],
    loginCountryCode:
      loginId !== undefined && isNum && containsHyphen
        ? loginId.split("-")[0].replace(0, "+")
        : DEFAULT_INDIA_COUNTRY_CODE,
    contactCountryCode: contactNumber[0] !== undefined ? contactNumber[0].replace(0, "+") : DEFAULT_INDIA_COUNTRY_CODE,
  };
  const [partyTypeId, setPartyTypeId] = useState(null || partyType);
  const [searchObj, setSearchObj] = useState(initialState);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
    },
  ];

  /**
   * @function handleSetPartyTypes This function will setData for party types
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetPartyTypes = (res) => setPartyTypes(res?.data?.data);

  /**
   * @function handleSetCountryCodes This function will setData for country codes
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetCountryCodes = (res) => setCountryCodes(res?.data?.data);

  const resourceForPartyType = `${window.REACT_APP_PARTY_SERVICE}/partytypes`;
  const resourceForCountryCodes = `${window.REACT_APP_PARTY_SERVICE}/country-codes`;

  const { loading: partyTypeLoading } = useCustomQueryWithStore("getData", resourceForPartyType, handleSetPartyTypes);
  const { loading: countryCodeLoading } = useCustomQueryWithStore(
    "getData",
    resourceForCountryCodes,
    handleSetCountryCodes,
  );

  /**
   * @function handlePartyTypeIdChange function to set the party type id
   * @param {Event} event prop is passed to the function
   */
  const handlePartyTypeIdChange = (event) => {
    setPartyTypeId(event.target.value);
  };

  /**
   * @function handleLoginChange login field is handled here for login if user types number then country code dropdown will come
   * @param {Event} event is passed to the function
   */
  const handleLoginChange = (event) => {
    setShowCountryCodes(isStringNumber(event.target.value));
  };

  /**
   * @function postObject will return tha updated values of Post object
   * @param {object} searchInputData contains form field values
   * @returns {object} updated object
   */
  const postObject = (searchInputData) => {
    const {
      partyId,
      partyName,
      loginCountryCode,
      loginId,
      contactEmailId,
      contactMobileNumber,
      contactCountryCode,
    } = searchInputData;
    const checkLoginId = isStringNumber(loginId);
    return {
      partyId,
      partyName,
      loginId: checkLoginId ? `${loginCountryCode.replace("+", 0)}-${loginId}` : loginId,
      contactEmailId,
      contactPhoneNumber: contactMobileNumber ? `${contactCountryCode.replace("+", 0)}-${contactMobileNumber}` : "",
      partyType: partyTypeId,
    };
  };

  /**
   * @function handleSubmitForm to submit a form on click of apply button
   * @param {object} searchInputData contains form field values
   */
  const handleSubmitForm = (searchInputData) => {
    const postSearchObj = postObject(searchInputData);
    const filteredPostSearchObj = filterPostObject(postSearchObj);
    if (Object.keys(filteredPostSearchObj).length <= 1) {
      notify(translate("error_message"), "error", TIMEOUT);
    } else {
      history.push({
        pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/search`,
        search: `?filter=${encodeURIComponent(JSON.stringify(filteredPostSearchObj))}`,
      });
    }
  };

  /**
   * @function closeSearchForm will close the search form and set it to initial state
   */
  const closeSearchForm = () => {
    setPartyTypeId(null);
    setSearchObj({
      partyTypeId: null,
      partyId: "",
      partyName: "",
      loginId: "",
      contactEmailId: "",
      contactMobileNumber: "",
      loginCountryCode: DEFAULT_INDIA_COUNTRY_CODE,
      contactCountryCode: DEFAULT_INDIA_COUNTRY_CODE,
    });
    setShowCountryCodes(false);
    redirect(`/parties/search`);
    refresh();
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
          <Grid item md={5} xs={3}>
            <Typography variant="h5" className={classes.gridStyle}>
              {translate("party_management")}
            </Typography>
          </Grid>
          <Grid item className={classes.gridStyle}>
            <Button
              label={translate("new_party")}
              variant="outlined"
              onClick={() => {
                history.push(`/${window.REACT_APP_PARTY_SERVICE}/parties/create`);
              }}
            />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );

  /**
   *
   * @returns {React.Component} return component
   */
  const PartySearchForm = useMemo(
    () => (
      <SimpleShowLayout component="div">
        <SimpleForm
          initialValues={searchObj}
          toolbar={
            partyTypeId && partyTypeId !== undefined ? (
              <CustomToolbar onClickCancel={closeSearchForm} saveButtonLabel={translate("apply")} />
            ) : null
          }
          save={handleSubmitForm}
        >
          <SelectInput
            source="partyTypeId"
            choices={partyTypes}
            optionText="name"
            optionValue="name"
            className={classes.autoCompleteItem}
            onChange={handlePartyTypeIdChange}
          />
          {partyTypeId && partyTypeId !== undefined && (
            <>
              <Grid container direction="row" spacing={6}>
                <Grid item>
                  <TextInput
                    source="partyId"
                    label={translate("party_id")}
                    className={classes.textInputField}
                    validate={specialCharacterCheck(translate("partyid_error_message"))}
                  />
                </Grid>
                <Grid item>
                  <TextInput
                    source="partyName"
                    label={translate("party_name")}
                    className={classes.textInputField}
                    validate={validateOrgName(translate("partyname_error_message"))}
                  />
                </Grid>
                {showCountryCodes ? (
                  <Grid item md={1}>
                    <AutocompleteInput
                      source="loginCountryCode"
                      label=""
                      choices={countryCodes}
                      optionText="code"
                      optionValue="code"
                      className={classes.autoCompleteCode}
                    />
                  </Grid>
                ) : null}
                <Grid item>
                  <TextInput
                    source="loginId"
                    label={translate("login_id")}
                    className={classes.textInputField}
                    onChange={handleLoginChange}
                    helperText={translate("username_email_id_phone_number")}
                    validate={specialCharacterCheck(translate("loginid_error_message"))}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={6}>
                <Grid item>
                  <TextInput
                    source="contactEmailId"
                    label={translate("contact_email_id")}
                    type="email"
                    validate={validateEmail(translate("invalid_email_validation_message"))}
                    className={classes.textInputField}
                  />
                </Grid>
                <Grid item md={1} xs={4}>
                  <AutocompleteInput
                    source="contactCountryCode"
                    label=""
                    choices={countryCodes}
                    optionText="code"
                    optionValue="code"
                    className={classes.autoCompleteCode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberInput
                    source="contactMobileNumber"
                    label={translate("contact_phone_number")}
                    onKeyDown={handleInvalidCharsInNumberInput}
                    className={classes.numberInputField}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </SimpleForm>
      </SimpleShowLayout>
    ),
    [countryCodes, partyTypeId, showCountryCodes, partyTypes],
  );

  return (
    <>
      {DisplayTitle}
      {partyTypeLoading || countryCodeLoading ? <LoaderComponent /> : partyTypes && <Grid>{PartySearchForm}</Grid>}
    </>
  );
};

export default PartySearch;
