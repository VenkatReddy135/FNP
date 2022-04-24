import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { POSTAL_ADDRESS, COUNTRY_INDIA } from "./PartyContactsConstants";

/**
 * Function renderContactInfoFields returns a re-usable Grid component that is being rendered at multiple places
 *
 * @param {classes} classes css styles for typography
 * @param {firstFieldTitle} firstFieldTitle first Paramter Title of the Grid component
 * @param {firstFieldValue} firstFieldValue first Paramter Value of the Grid component
 * @param {secondFieldTitle} secondFieldTitle second Paramter Title of the Grid component
 * @param {secondFieldValue} secondFieldValue second Paramter Value of the Grid component
 * @returns {React.ReactElement} returns a re-usable Grid component
 */
export const renderContactInfoFields = (
  classes,
  firstFieldTitle,
  firstFieldValue,
  secondFieldTitle,
  secondFieldValue,
) => {
  return (
    <Grid container md={5} direction="row" spacing={3} className={classes.tabStyle}>
      <Grid item xs className={classes.gridMarginStyle}>
        <Typography variant="caption">{firstFieldTitle}</Typography>
        <Typography variant="subtitle2">{firstFieldValue}</Typography>
      </Grid>
      <Grid item xs className={classes.helperTextAlign}>
        <Typography variant="caption">{secondFieldTitle}</Typography>
        <Typography variant="subtitle2">{secondFieldValue}</Typography>
      </Grid>
    </Grid>
  );
};

/**
 * @function isInvalidPincode function that checks if a pincode is invalid
 * @param {object} pincodeData city, state and country name corresponding to the entered pincode number
 * @param {object} validateObject the current create contact object having the city, state and country id entered through each corresponding dropdowns
 * @returns {boolean} returns true if pincode is invalid
 */
export const isInvalidPincode = (pincodeData, validateObject) =>
  pincodeData?.countryId !== validateObject?.countryId || pincodeData?.cityId !== validateObject?.cityId;

/**
 * @function validatePincode validate pincode on submit event
 * @param {object} validateObj create or edit contact object that has the saved data for the Create/Edit Contact page
 * @param {string} selectedContactTypeName the selected contact type name value
 * @param {object} pincodeData city, state and country name corresponding to the entered pincode number
 * @param {string} countryId the selected country name
 * @returns {boolean} validation errors for form fields
 */
export const validatePincode = (validateObj, selectedContactTypeName, pincodeData, countryId) => {
  const { pincode } = validateObj;
  if (
    selectedContactTypeName === POSTAL_ADDRESS &&
    countryId === COUNTRY_INDIA &&
    (!pincode || isInvalidPincode(pincodeData, validateObj))
  ) {
    return false;
  }

  return true;
};
