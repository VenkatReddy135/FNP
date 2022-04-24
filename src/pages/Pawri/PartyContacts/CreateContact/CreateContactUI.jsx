/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  SimpleForm,
  SelectInput,
  TextInput,
  NumberInput,
  AutocompleteInput,
  required,
} from "react-admin";
import { Grid, TextField, Typography } from "@material-ui/core";
import {
  maxLength,
  validateLetter,
  handleInvalidCharsInNumberInput,
  phoneNoValidation,
  validateEmail,
} from "../../../../utils/validationFunction";
import useStyles from "../../../../assets/theme/common";
import { fetchDateString } from "../../../../utils/formatDateTime";
import { EMAIL_ADDRESS, PHONE_NUMBER, POSTAL_ADDRESS, IS_EMPTY, COUNTRY_INDIA } from "../PartyContactsConstants";
import CustomToolbar from "../../../../components/CustomToolbar";
import DateTimeInput from "../../../../components/CustomDateTimeV2";

/**
 * Component to render the UI for Create Contact Information Page
 *
 * @param {object} props props for Create Contact Information
 * @returns {React.ReactElement} Create Contact Information
 */
const CreateContactUI = (props) => {
  const {
    selectedContactTypeName,
    contactTypesList,
    contactPurposeList,
    cities,
    states,
    countries,
    isPincodeInvalid,
    countryCodes,
    handlePincodeChange,
    handleContactTypeChange,
    cancelHandler,
    createContact,
    handleDate,
    handleCityStateCountryChange,
    createObj,
    setCreateObj,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const contactTypePostalAddress = selectedContactTypeName && selectedContactTypeName === POSTAL_ADDRESS;
  const contactTypePhoneNumber = selectedContactTypeName && selectedContactTypeName === PHONE_NUMBER;
  const contactTypeEmailAddress = selectedContactTypeName && selectedContactTypeName === EMAIL_ADDRESS;
  const invalidPincodeMessage = isPincodeInvalid ? translate("pincode_validation") : IS_EMPTY;
  const pincodeValidationMessageText = !createObj.pincode ? translate("pincode_required") : invalidPincodeMessage;
  const { countryCodeId } = createObj;

  const validateToName = [
    required(translate("nameValidation")),
    maxLength(50, translate("nameValidationMax")),
    validateLetter(translate("ToName_validation_message")),
  ];

  const attentionNameValidation = [
    maxLength(50, translate("nameValidationMax")),
    validateLetter(translate("attention_validation_message")),
  ];

  const emailValidation = [
    required(translate("email_validation_required")),
    validateEmail(translate("invalid_email_validation_message")),
  ];

  /**
   *@function toDateValidation to validate the toDate field
   * @param {Date} value date value to be validated
   * @returns {(string | undefined)} returns string or undefined
   */
  const toDateValidation = (value) => {
    return value && fetchDateString(new Date(value)) <= fetchDateString(new Date(createObj.fromDate))
      ? translate("to_date_validation_message")
      : undefined;
  };
  /**
   * @function handleChange this function is used to set state
   * @param {string} name passed to the function
   * @param {string} value passed to the function
   */
  const handleChange = (name, value) => {
    setCreateObj((prevState) => ({ ...prevState, [name]: value }));
  };
  const phoneValidation = [
    phoneNoValidation(countryCodeId, translate("phone_number_error")),
    required(translate("phone_validation_required")),
  ];
  /**
   * @returns {React.Component} return component
   */
  const RenderPhoneOrEmail = useMemo(
    () => (
      <>
        {contactTypePhoneNumber ? (
          <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <AutocompleteInput
                label="Code"
                source="countryCodeId"
                choices={countryCodes}
                className={classes.autoCompleteCode}
                onChange={(e) => handleChange("countryCodeId", e)}
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <NumberInput
                source="phone"
                label={translate("contact_phone_number")}
                className={classes.numberInputField}
                onKeyDown={handleInvalidCharsInNumberInput}
                onChange={(e) => handleChange("phone", e.target.value)}
                validate={phoneValidation}
              />
            </Grid>
          </Grid>
        ) : null}
        {contactTypeEmailAddress ? (
          <TextInput
            source="email"
            label={translate("contact_email")}
            type="email"
            className={classes.textInputField}
            validate={emailValidation}
          />
        ) : null}
      </>
    ),
    [contactTypeEmailAddress, contactTypePhoneNumber, countryCodes, countryCodeId],
  );
  return (
    <SimpleForm
      initialValues={createObj}
      save={createContact}
      toolbar={
        selectedContactTypeName ? (
          <CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("create")} />
        ) : null
      }
    >
      <Grid container direction="row" spacing={8} className={classes.gridContainer}>
        <Grid item>
          <SelectInput
            source="contactType"
            choices={contactTypesList}
            label={translate("contact_type")}
            optionText="name"
            optionValue="name"
            className={classes.autoCompleteItem}
            onChange={handleContactTypeChange}
            disabled={createObj.contactTypeId !== IS_EMPTY}
          />
        </Grid>
        {selectedContactTypeName ? (
          <Grid item>
            <SelectInput
              source="contactPurposeId"
              choices={contactPurposeList}
              label={translate("contact_purpose")}
              validate={required(translate("contact_purpose_required"))}
              className={classes.autoCompleteItem}
            />
          </Grid>
        ) : null}
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          {!contactTypePostalAddress ? RenderPhoneOrEmail : null}
        </Grid>
      </Grid>
      {contactTypePostalAddress ? (
        <>
          <Grid container direction="row" spacing={6} className={classes.gridContainer}>
            <Grid item>
              <TextInput
                source="toName"
                label={translate("to_name")}
                className={classes.textInputField}
                validate={validateToName}
              />
            </Grid>
            <Grid item>
              <TextInput
                source="attentionName"
                label={translate("attention_name")}
                className={classes.textInputField}
                validate={attentionNameValidation}
              />
            </Grid>
            <Grid item>
              <NumberInput
                source="doorbell"
                label={translate("doorbell")}
                className={classes.numberInputField}
                onKeyDown={handleInvalidCharsInNumberInput}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" className={classes.gridContainer}>
            <TextInput
              source="address1"
              label={translate("address_line_1")}
              className={classes.addressInputField}
              validate={required(translate("address1_validation_required"))}
            />
          </Grid>
          <Grid container direction="row" className={classes.gridContainer}>
            <TextInput source="address2" label={translate("address_line_2")} className={classes.addressInputField} />
          </Grid>
          <Grid container direction="row" spacing={6}>
            <Grid item>
              <AutocompleteInput
                source="countryId"
                choices={countries}
                validate={required(translate("country_required"))}
                className={classes.autoCompleteItem}
                onChange={(e) => handleCityStateCountryChange("countryId", e)}
              />
            </Grid>
            {createObj.countryId && states.length === 0 ? (
              <Grid item md={2} className={classes.disabledText}>
                <Typography variant="caption">{translate("state")}</Typography>
                <Typography variant="subtitle2">{translate("not_available")}</Typography>
              </Grid>
            ) : (
              <Grid item>
                <AutocompleteInput
                  source="stateId"
                  choices={states}
                  validate={states.length !== 0 && required(translate("state_required"))}
                  className={classes.autoCompleteItem}
                  onChange={(e) => handleCityStateCountryChange("stateId", e)}
                  disabled={states.length === 0}
                />
              </Grid>
            )}
            <Grid item>
              {cities.length > 0 ? (
                <AutocompleteInput
                  source="cityId"
                  choices={cities}
                  validate={required(translate("city_required"))}
                  className={classes.textInputField}
                  onChange={(e) => handleCityStateCountryChange("cityId", e)}
                  disabled={!createObj.countryId}
                  shouldRenderSuggestions={(val) => {
                    return val && val.trim().length > 1;
                  }}
                />
              ) : (
                <TextInput
                  label={translate("city")}
                  source="cityId"
                  className={[classes.disabledText, classes.autoCompleteStyle]}
                  onChange={(e) => handleCityStateCountryChange("cityId", e.target.value)}
                  validate={required(translate("city_required"))}
                  disabled={!createObj.countryId}
                />
              )}
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={6} className={classes.gridContainer}>
            <Grid item>
              <TextField
                label={translate("pincode")}
                name="pincode"
                className={classes.autoCompleteStyle}
                onChange={handlePincodeChange}
                value={createObj.pincode}
                disabled={!createObj.countryId}
                required={createObj.countryId === COUNTRY_INDIA}
                helperText={createObj.countryId === COUNTRY_INDIA && pincodeValidationMessageText}
                error={createObj.countryId === COUNTRY_INDIA && (isPincodeInvalid || !createObj.pincode)}
              />
            </Grid>
          </Grid>
        </>
      ) : null}
      {selectedContactTypeName ? (
        <Grid container direction="row" spacing={5} className={classes.gridContainer}>
          <Grid item className={classes.gridMarginStyle} md={3}>
            <DateTimeInput
              source="fromDate"
              label={translate("from_date")}
              className={classes.customDateTimeInput}
              validate={required(translate("from_date_required"))}
              onChange={handleDate}
            />
          </Grid>
          <Grid item md={3}>
            <DateTimeInput
              source="throughDate"
              label={translate("through_date")}
              className={classes.customDateTimeInput}
              validate={toDateValidation}
              onChange={handleDate}
            />
          </Grid>
        </Grid>
      ) : null}
    </SimpleForm>
  );
};

CreateContactUI.propTypes = {
  selectedContactTypeName: PropTypes.string,
  contactTypesList: PropTypes.arrayOf(PropTypes.any).isRequired,
  contactPurposeList: PropTypes.arrayOf(PropTypes.any).isRequired,
  cities: PropTypes.arrayOf(PropTypes.any).isRequired,
  states: PropTypes.arrayOf(PropTypes.any).isRequired,
  countries: PropTypes.arrayOf(PropTypes.any).isRequired,
  isPincodeInvalid: PropTypes.bool.isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.any).isRequired,
  handlePincodeChange: PropTypes.func.isRequired,
  handleContactTypeChange: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  handleCityStateCountryChange: PropTypes.func.isRequired,
  createObj: PropTypes.objectOf(PropTypes.any).isRequired,
  handleDate: PropTypes.func.isRequired,
  setCreateObj: PropTypes.func.isRequired,
};

CreateContactUI.defaultProps = {
  selectedContactTypeName: null,
};

export default React.memo(CreateContactUI);
