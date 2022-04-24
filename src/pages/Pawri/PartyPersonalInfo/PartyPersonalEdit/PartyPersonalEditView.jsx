import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useTranslate, SelectInput, SimpleForm, DateInput, TextInput, SimpleShowLayout } from "react-admin";
import {
  requiredValidation,
  maxLength,
  dateValidation,
  validateLetter,
  validateAlphanumeric,
  validateNumber,
  validateOrgName,
} from "../../../../utils/validationFunction";
import useStyles from "../../../../assets/theme/common";
import CustomToolbar from "../../../../components/CustomToolbar";
import { INDIVIDUAL, ORGANIZATION } from "../../PartyCreate/CreatePartyConstants";
import LoaderComponent from "../../../../components/LoaderComponent";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";

/**
 * Component for Party Personal information Edit
 *
 * @param {object} props props of edit form field
 * @returns {React.ReactElement} returns PartyPersonal Edit view
 */
const PartyPersonalEditView = (props) => {
  const { id } = useParams();
  const { partyType, editPersonalObj, cancelHandler, onUpdateHandler } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const [genderOptions, setGenderOptions] = useState([]);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show`,
    },
    { displayName: partyType === INDIVIDUAL ? translate("personalInfo") : translate("orgInfo") },
  ];
  /**
   * @function handleSetGender This function will setData for Gender options
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetGenderOption = (res) => setGenderOptions(res?.data?.data);

  const resourceForGender = `${window.REACT_APP_PARTY_SERVICE}/genders`;
  const { loading: genderLoading } = useCustomQueryWithStore("getData", resourceForGender, handleSetGenderOption);
  const validateFirstName = [
    requiredValidation(translate("nameValidation")),
    maxLength(50, translate("nameValidationMax")),
    validateLetter(translate("partyname_error_message")),
  ];
  const validateOrganizationName = [
    requiredValidation(translate("required")),
    validateOrgName(translate("org_name_validation_message")),
  ];

  if (genderLoading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
        <Typography variant="h5" className={classes.gridStyle}>
          {partyType === INDIVIDUAL ? translate("personalInfo") : translate("orgInfo")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <SimpleShowLayout component="div">
        <SimpleForm
          initialValues={editPersonalObj}
          save={onUpdateHandler}
          toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("Update")} />}
        >
          {partyType === INDIVIDUAL && (
            <>
              <Grid item container direction="row">
                <Grid item container direction="column" md={3}>
                  <TextInput
                    source="name"
                    label={translate("personalInfo_name")}
                    className={classes.autoCompleteItem}
                    validate={validateFirstName}
                  />
                </Grid>
                <Grid item container direction="column" md={3}>
                  <SelectInput
                    source="gender"
                    optionText="genderType"
                    optionValue="genderType"
                    choices={genderOptions}
                    label={translate("gender")}
                    className={classes.autoCompleteItem}
                  />
                </Grid>
              </Grid>
              <Grid item container direction="row" className={classes.customMargin}>
                <Grid item container direction="column" md={3}>
                  <DateInput
                    source="dateOfBirth"
                    label={translate("date_of_birth")}
                    className={classes.dateField}
                    validate={dateValidation(translate("dateValidation"))}
                  />
                </Grid>
                <Grid item container direction="column" md={3}>
                  <DateInput
                    source="dateOfAnniversary"
                    label={translate("date_of_anniversary")}
                    className={classes.dateField}
                    validate={dateValidation(translate("dateValidation"))}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {partyType === ORGANIZATION && (
            <>
              <Grid item container direction="row">
                <Grid item container direction="column" md={3}>
                  <TextInput
                    source="contactPersonName"
                    label={translate("contactPerson")}
                    className={classes.autoCompleteItem}
                    validate={validateFirstName}
                  />
                </Grid>
                <Grid item container direction="column" md={3}>
                  <TextInput
                    source="designation"
                    label={translate("designation")}
                    className={classes.textInputField}
                    validate={validateLetter(translate("designation_validation_message"))}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Typography variant="subtitle1">{translate("business_information")}</Typography>
              </Grid>
              <Grid item container direction="row" className={classes.customMargin}>
                <Grid item container direction="column" md={3}>
                  <TextInput
                    source="organizationName"
                    validate={validateOrganizationName}
                    label={translate("orgName")}
                    className={classes.textInputField}
                  />
                </Grid>
                <Grid item container direction="column" md={3}>
                  <TextInput
                    source="taxNumber"
                    label={translate("tax_vat_number")}
                    className={classes.textInputField}
                    validate={validateAlphanumeric(translate("tax_validation_message"))}
                  />
                </Grid>
                <Grid item container direction="column" md={3}>
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
        </SimpleForm>
      </SimpleShowLayout>
    </>
  );
};

PartyPersonalEditView.propTypes = {
  partyType: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  editPersonalObj: PropTypes.shape({
    dateOfAnniversary: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    contactPersonName: PropTypes.string,
    designation: PropTypes.string,
    faxNumber: PropTypes.number,
    taxNumber: PropTypes.string,
    partyName: PropTypes.string,
  }).isRequired,
};

export default React.memo(PartyPersonalEditView);
