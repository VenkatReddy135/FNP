/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  SimpleForm,
  SimpleShowLayout,
  TextInput,
  NumberInput,
  BooleanInput,
  AutocompleteInput,
  required,
} from "react-admin";
import { useParams } from "react-router-dom";
import { Grid, Typography, Divider, IconButton, TextField } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../../assets/theme/common";
import {
  maxLength,
  validateLetter,
  handleInvalidCharsInNumberInput,
  phoneNoValidation,
  validateEmail,
} from "../../../../utils/validationFunction";
import formatDateValue, { fetchDateString } from "../../../../utils/formatDateTime";
import { EMAIL_ADDRESS, PHONE_NUMBER, POSTAL_ADDRESS, IS_EMPTY, COUNTRY_INDIA } from "../PartyContactsConstants";
import { renderContactInfoFields } from "../HelperFunctions";
import CustomToolbar from "../../../../components/CustomToolbar";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component to render the View/Edit Page of Party Contacts
 *
 * @param {object} props needed for view and edit
 * @returns {React.ReactElement} all the props required by the Party Contacts - View/Edit
 */
const PartyContactsViewEditUI = (props) => {
  const translate = useTranslate();
  const { partyId } = useParams();
  const classes = useStyles();
  const {
    responseData,
    isPincodeInvalid,
    isEditable,
    switchToEditHandler,
    contactPurposes,
    cancelHandler,
    updateContact,
    handleChange,
    countryList,
    stateList,
    citiesList,
    countryCodes,
    handleCityStateCountryChange,
    handleDate,
    handlePhoneChange,
  } = props;
  const contactTypeEmail = responseData && responseData?.contactType === EMAIL_ADDRESS;
  const contactTypePhone = responseData && responseData?.contactType === PHONE_NUMBER;
  const contactTypePostal = responseData && responseData?.contactType === POSTAL_ADDRESS;
  const { fromDate, createdBy, createdAt, updatedBy, updatedAt, primary, status } = responseData;
  const gridTitle = responseData?.contactType;
  const invalidPincodeMessage = isPincodeInvalid ? translate("pincode_validation") : IS_EMPTY;
  const pincodeValidationMessageText = !responseData.pincode ? translate("pincode_required") : invalidPincodeMessage;

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${partyId}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/contact-info`,
    },
    { displayName: `${gridTitle}` },
  ];
  const emailValidation = [
    required(translate("email_validation_required")),
    validateEmail(translate("invalid_email_validation_message")),
  ];
  const validateToName = [
    required(translate("nameValidation")),
    maxLength(50, translate("nameValidationMax")),
    validateLetter(translate("ToName_validation_message")),
  ];
  const attentionNameValidation = [
    maxLength(50, translate("nameValidationMax")),
    validateLetter(translate("attention_validation_message")),
  ];
  const phoneValidation = [
    phoneNoValidation(responseData.countryCodeId, translate("phone_number_error")),
    required(translate("phone_validation_required")),
  ];
  /**
   *@function toDateValidation to validate the toDate field
   * @param {Date} value date value to be validated
   * @returns {(string | undefined)} returns string or undefined
   */
  const toDateValidation = (value) => {
    return value && fetchDateString(new Date(value)) <= fetchDateString(new Date(responseData.fromDate))
      ? translate("to_date_validation_message")
      : undefined;
  };
  /**
   * @returns {React.Component} return component
   */
  const RenderTitle = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Typography variant="h5" className={classes.gridStyle}>
            {gridTitle}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [gridTitle],
  );
  /**
   * @returns {React.Component} return component
   */
  const RenderFromAndThroughDate = useMemo(
    () => (
      <>
        <Grid direction="row" container md={12} spacing={10} className={classes.plusButton}>
          <Grid item className={classes.gridMarginStyle}>
            <DateTimeInput source="fromDate" label={translate("from_date")} className={classes.dateField} disabled />
          </Grid>
          <Grid item className={classes.textFieldItem}>
            <DateTimeInput
              source="throughDate"
              label={translate("through_date")}
              className={classes.customDateTimeInput}
              onChange={handleDate}
              validate={toDateValidation}
              disabled={!isEditable}
            />
          </Grid>
        </Grid>
      </>
    ),
    [fromDate, isEditable],
  );
  /**
   * @returns {React.Component} return component
   */
  const RenderPostalAddress = useMemo(
    () => (
      <>
        <Grid item container direction="row" spacing={7}>
          <Grid item>
            <TextInput
              source="toName"
              label={translate("to_name")}
              className={classes.textInputField}
              disabled={!isEditable}
              validate={validateToName}
            />
          </Grid>
          <Grid item className={classes.customMargin}>
            <TextInput
              source="attentionName"
              label={translate("attention_name")}
              className={classes.textInputField}
              disabled={!isEditable}
              validate={attentionNameValidation}
            />
          </Grid>
          <Grid item>
            <NumberInput
              source="doorbell"
              label={translate("doorbell")}
              className={classes.numberInputField}
              disabled={!isEditable}
              onKeyDown={handleInvalidCharsInNumberInput}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.customMargin}>
          <TextInput
            source="addressLine1"
            label={translate("address_line_1")}
            className={classes.addressInputField}
            disabled={!isEditable}
            validate={required(translate("address1_validation_required"))}
          />
        </Grid>
        <Grid item className={classes.customMargin}>
          <TextInput
            source="addressLine2"
            label={translate("address_line_2")}
            className={classes.addressInputField}
            disabled={!isEditable}
          />
        </Grid>
        <Grid item container direction="row" spacing={7} className={classes.customMargin}>
          <Grid item>
            <AutocompleteInput
              source="countryId"
              choices={countryList}
              className={classes.textInputField}
              onChange={(e) => handleCityStateCountryChange("countryId", e)}
              validate={required(translate("country_required"))}
              disabled={!isEditable}
            />
          </Grid>
          {stateList.length === 0 ? (
            <Grid item md={2} className={classes.disabledText}>
              <Typography variant="caption">{translate("state")}</Typography>
              <Typography variant="subtitle2">{translate("not_available")}</Typography>
            </Grid>
          ) : (
            <Grid item>
              <AutocompleteInput
                source="stateId"
                choices={stateList}
                className={classes.textInputField}
                disabled={!isEditable}
                onChange={(e) => handleCityStateCountryChange("stateId", e)}
                validate={stateList.length !== 0 && required(translate("state_required"))}
              />
            </Grid>
          )}
          <Grid item md={2}>
            {citiesList?.length > 0 ? (
              <AutocompleteInput
                source="cityId"
                choices={citiesList}
                validate={required(translate("city_required"))}
                className={classes.textInputField}
                onChange={(e) => handleCityStateCountryChange("cityId", e)}
                disabled={!isEditable || !responseData.countryId}
                shouldRenderSuggestions={(val) => {
                  return val && val.trim().length > 1;
                }}
              />
            ) : (
              <TextInput
                source="cityId"
                label={translate("city")}
                className={[classes.autoCompleteStyle, classes.disabledText]}
                validate={required(translate("city_required"))}
                onChange={(e) => handleCityStateCountryChange("cityId", e.target.value)}
                disabled={!isEditable || !responseData.countryId}
              />
            )}
          </Grid>
        </Grid>
        {isEditable ? (
          <Grid item className={classes.customMargin}>
            <TextField
              name="pincode"
              label={translate("pincode")}
              className={classes.autoCompleteStyle}
              onChange={handleChange}
              value={responseData.pincode}
              required={responseData.countryId === COUNTRY_INDIA}
              helperText={responseData.countryId === COUNTRY_INDIA && pincodeValidationMessageText}
              error={responseData.countryId === COUNTRY_INDIA && (isPincodeInvalid || !responseData.pincode)}
            />
          </Grid>
        ) : (
          <Grid item className={classes.gridMarginStyle}>
            <Typography variant="caption">{translate("pincode")}</Typography>
            <Typography variant="subtitle2">{responseData.pincode}</Typography>
          </Grid>
        )}
      </>
    ),
    [citiesList, countryList, isEditable, responseData.pincode, stateList, pincodeValidationMessageText],
  );
  return (
    <>
      {RenderTitle}
      <SimpleShowLayout component="div">
        <SimpleForm
          initialValues={responseData}
          save={updateContact}
          toolbar={
            isEditable ? <CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("update")} /> : null
          }
        >
          <Grid item container direction="row" spacing={7} mb={1}>
            <Grid item>
              <TextInput
                source="contactType"
                label={translate("contact_type")}
                disabled
                className={classes.textInputField}
              />
            </Grid>
            <Grid item>
              <AutocompleteInput
                source="contactPurposeId"
                choices={contactPurposes}
                label={translate("contact_purpose")}
                value=""
                className={classes.autoCompleteItem}
                disabled={!isEditable}
              />
            </Grid>
            {contactTypeEmail && (
              <Grid item>
                <TextInput
                  source="email"
                  label={translate("contact_email_address")}
                  type="email"
                  className={classes.textInputField}
                  disabled={!isEditable}
                  validate={emailValidation}
                />
              </Grid>
            )}
            {contactTypePhone && (
              <>
                <Grid item>
                  <AutocompleteInput
                    label={translate("code")}
                    source="countryCodeId"
                    choices={countryCodes}
                    disabled={!isEditable}
                    className={classes.autoCompleteCode}
                    onChange={(e) => handlePhoneChange("countryCodeId", e)}
                  />
                </Grid>
                <Grid item>
                  <NumberInput
                    source="phone"
                    label={translate("contact_phone_number")}
                    className={classes.numberInputField}
                    disabled={!isEditable}
                    validate={phoneValidation}
                    onKeyDown={handleInvalidCharsInNumberInput}
                    onChange={(e) => handlePhoneChange("phone", e.target.value)}
                  />
                </Grid>
              </>
            )}
            {!isEditable && (
              <Grid item className={classes.label}>
                <Typography variant="caption">{translate("status")}</Typography>
                <Typography variant="subtitle2">{status ? translate("active") : translate("expired")}</Typography>
              </Grid>
            )}
            {isEditable ? null : (
              <Grid item className={classes.buttonAlignment}>
                <IconButton onClick={switchToEditHandler}>
                  <EditOutlinedIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
          {!contactTypePostal &&
            (isEditable ? (
              <Grid item className={classes.gridMarginStyle}>
                <BooleanInput label={translate("primary")} source="primary" />
              </Grid>
            ) : (
              <Grid item className={classes.gridMarginStyle}>
                <Typography variant="caption">{translate("primary")}</Typography>
                <Typography variant="subtitle2">{primary?.toString()}</Typography>
              </Grid>
            ))}
          {contactTypePostal && RenderPostalAddress}
          {RenderFromAndThroughDate}
          {!isEditable &&
            renderContactInfoFields(
              classes,
              translate("created_by"),
              createdBy,
              translate("created_on"),
              formatDateValue(createdAt),
            )}
          {!isEditable &&
            renderContactInfoFields(
              classes,
              translate("modified_by"),
              updatedBy,
              translate("modified_date"),
              formatDateValue(updatedAt),
            )}
        </SimpleForm>
      </SimpleShowLayout>
    </>
  );
};
PartyContactsViewEditUI.propTypes = {
  responseData: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool.isRequired,
  isPincodeInvalid: PropTypes.bool.isRequired,
  switchToEditHandler: PropTypes.func.isRequired,
  contactPurposes: PropTypes.arrayOf(PropTypes.any).isRequired,
  countryList: PropTypes.arrayOf(PropTypes.any).isRequired,
  stateList: PropTypes.arrayOf(PropTypes.any).isRequired,
  citiesList: PropTypes.arrayOf(PropTypes.any).isRequired,
  cancelHandler: PropTypes.func.isRequired,
  updateContact: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCityStateCountryChange: PropTypes.func.isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleDate: PropTypes.func.isRequired,
  handlePhoneChange: PropTypes.func.isRequired,
};
export default React.memo(PartyContactsViewEditUI);
