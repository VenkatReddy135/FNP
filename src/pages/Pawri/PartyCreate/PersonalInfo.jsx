import React from "react";
import { SelectInput, useTranslate, AutocompleteInput, TextInput, DateInput, NumberInput, required } from "react-admin";
import PropTypes from "prop-types";
import { Grid, Typography, Checkbox } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
import partyStyles from "./PartyCreateStyle";
import { nameTitles, INDIVIDUAL, ORGANIZATION, EMPLOYEE } from "./CreatePartyConstants";
import {
  dateValidation,
  validateLetter,
  validateAlphanumeric,
  validateNumber,
  validateEmail,
  maxLength,
  handleInvalidCharsInNumberInput,
  phoneNoValidation,
  validateOrgName,
} from "../../../utils/validationFunction";

/**
 * @param {object} props contains party related info
 * @returns {React.ReactElement} returns a Personal Info form
 */
const PersonalInfo = (props) => {
  const classes = useStyles();
  const partyClasses = partyStyles();
  const translate = useTranslate();

  const { partyObj, updatePartyObj, partyType, countryCodes, handleChange, genderOptions, partyRole } = props;

  const isIndividual = partyType && partyType.name === INDIVIDUAL;
  const isOrganization = partyType && partyType.name === ORGANIZATION;
  const individualNameLabel = translate("individual_name");
  const organizationNameLabel = translate("contact_person_name");

  const usernameValidate = [
    required(translate("required")),
    maxLength(10, translate("error_message_username_length")),
    validateAlphanumeric(translate("error_message_username_special_character_space")),
  ];

  const nameValidate = [
    required(translate("required")),
    maxLength(50, translate("error_message_nameValidation_length")),
    validateLetter(translate("partyname_error_message")),
  ];
  const phoneValidation = [phoneNoValidation(partyObj.loginCountryCodeId, translate("phone_number_error"))];
  const contactValidation = [phoneNoValidation(partyObj.contactCountryCodeId, translate("phone_number_error"))];
  /**
   * @function handleCountryCode This function handles country code value
   * @param {string} name is passed to the function
   * @param {string} value is passed to the function
   */
  const handleCountryCode = (name, value) => {
    updatePartyObj((prevState) => ({ ...prevState, [name]: value }));
  };

  /**
   * @function handleNotAvailable for Create Party
   * @param {Event} event is passed
   */
  const handleNotAvailable = (event) => {
    const { name, checked } = event.target;
    updatePartyObj((prevState) => ({
      ...prevState,
      [name]: checked,
      loginPhoneNumber: "",
      loginEmailId: "",
    }));
  };

  return (
    <>
      <Grid item className={partyClasses.gridContainer}>
        {isIndividual ? (
          <Typography variant="subtitle1">{translate("personal_info")}</Typography>
        ) : (
          <Typography variant="subtitle1">{translate("organization_user_information")}</Typography>
        )}
      </Grid>
      <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
        <Grid item>
          <AutocompleteInput source="title" choices={nameTitles} className={classes.autoCompleteCode} />
        </Grid>
        <Grid item>
          <TextInput
            source="name"
            label={isIndividual ? individualNameLabel : organizationNameLabel}
            className={classes.textInputField}
            validate={nameValidate}
          />
        </Grid>
        <Grid item>
          {isIndividual ? (
            <SelectInput
              source="gender"
              label={translate("gender")}
              choices={genderOptions}
              optionValue="genderType"
              optionText="genderType"
              className={classes.autoCompleteItem}
            />
          ) : (
            <TextInput
              source="designation"
              label={translate("designation")}
              className={classes.textInputField}
              validate={validateLetter(translate("designation_validation_message"))}
            />
          )}
        </Grid>
        {isIndividual && (
          <Grid item>
            <DateInput
              source="dateOfBirth"
              label={translate("date_of_birth")}
              className={classes.dateField}
              validate={dateValidation(translate("personalInfo_dateValidation"))}
            />
          </Grid>
        )}
      </Grid>
      <Grid
        item
        direction="row"
        alignItems="flex-start"
        justify="space-between"
        container
        md={6}
        className={partyClasses.gridContainer}
      >
        {isIndividual && (
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <DateInput
              source="dateOfAnniversary"
              label={translate("date_of_anniversary")}
              className={classes.dateField}
              validate={dateValidation(translate("personalInfo_dateValidation"))}
            />
          </Grid>
        )}
      </Grid>
      <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
        <Grid item>
          <AutocompleteInput
            label=""
            source="loginCountryCodeId"
            choices={countryCodes}
            className={classes.autoCompleteCode}
            disabled={partyObj.notAvailable}
            onChange={(value) => handleCountryCode("loginCountryCodeId", value)}
          />
        </Grid>
        <Grid item>
          <TextInput
            source="loginPhoneNumber"
            type="number"
            label={translate("login_phone_number")}
            onKeyDown={handleInvalidCharsInNumberInput}
            className={classes.numberInputField}
            disabled={partyObj.notAvailable}
            onChange={handleChange}
            validate={phoneValidation}
          />
        </Grid>
        <Grid item>
          <TextInput
            source="loginEmailId"
            label={translate("login_email_id")}
            type="email"
            validate={validateEmail(translate("invalid_email_validation_message"))}
            className={classes.textInputField}
            disabled={partyObj.notAvailable}
            onChange={handleChange}
          />
        </Grid>
        {isIndividual && (
          <Grid item>
            <Checkbox
              name="notAvailable"
              checked={partyObj.notAvailable}
              onChange={handleNotAvailable}
              disabled={!partyObj?.role || partyRole?.name?.toLowerCase() !== EMPLOYEE}
            />
            <span>{translate("not_available_checkbox")}</span>
          </Grid>
        )}
      </Grid>
      {partyObj?.notAvailable && partyRole?.name?.toLowerCase() === EMPLOYEE && isIndividual ? (
        <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
          <Grid item>
            <TextInput
              source="username"
              label={translate("party_username")}
              className={classes.textInputField}
              validate={usernameValidate}
            />
          </Grid>
        </Grid>
      ) : null}
      {isOrganization && (
        <>
          <Grid item className={partyClasses.gridContainer}>
            <Typography variant="subtitle1">{translate("business_information")}</Typography>
          </Grid>
          <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
            <Grid item>
              <TextInput
                source="franchiseName"
                label={translate("franchise_name")}
                className={classes.textInputField}
                validate={[required(translate("required")), validateOrgName(translate("org_name_validation_message"))]}
              />
            </Grid>
            <Grid item>
              <TextInput
                source="taxNumber"
                label={translate("tax_vat_number")}
                className={classes.textInputField}
                validate={validateAlphanumeric(translate("tax_validation_message"))}
              />
            </Grid>
            <Grid item>
              <TextInput
                source="faxNumber"
                label={translate("fax_number")}
                className={classes.textInputField}
                validate={validateNumber(translate("fax_validation_message"))}
              />
            </Grid>
          </Grid>
        </>
      )}
      <Grid item className={partyClasses.gridContainer}>
        <Typography variant="subtitle1">{translate("contact_information")}</Typography>
      </Grid>
      <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
        <Grid item>
          <AutocompleteInput
            label=""
            source="contactCountryCodeId"
            choices={countryCodes}
            className={classes.autoCompleteCode}
            onChange={(value) => handleCountryCode("contactCountryCodeId", value)}
          />
        </Grid>
        <Grid item>
          <NumberInput
            source="contactPhone"
            label={translate("contact_phone_number")}
            onKeyDown={handleInvalidCharsInNumberInput}
            className={classes.numberInputField}
            onChange={handleChange}
            validate={contactValidation}
          />
        </Grid>
        <Grid item>
          <TextInput
            source="contactEmail"
            label={translate("contact_email_id")}
            type="email"
            validate={validateEmail(translate("invalid_email_validation_message"))}
            className={classes.textInputField}
          />
        </Grid>
      </Grid>
    </>
  );
};

PersonalInfo.propTypes = {
  partyObj: PropTypes.objectOf(PropTypes.any).isRequired,
  updatePartyObj: PropTypes.func.isRequired,
  partyType: PropTypes.objectOf(PropTypes.any).isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleChange: PropTypes.func.isRequired,
  genderOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  partyRole: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(PersonalInfo);
