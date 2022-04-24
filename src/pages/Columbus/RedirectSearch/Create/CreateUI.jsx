/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, required, TextInput, SelectInput } from "react-admin";
import { Grid, Box, TextField, Chip } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import { getFormattedTimeValue, getFormattedDate } from "../../../../utils/formatDateTime";
import { validateDomainField, validateToDateField } from "../../../../utils/validationFunction";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
/**
 * Component to create a campaignUI
 *
 *  @param {object} props all the props required by Redirect Campaign Create component
 * @returns {React.ReactElement} returns Create Redirect Campaign Create component
 */
const RedirectSearchCreateUI = (props) => {
  const {
    domain,
    formData,
    validateName,
    geoOptions,
    newKeyword,
    campaignDate,
    setFormData,
    setNewKeyword,
    setCampaignDate,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const { campaignName, geoId, keyword, targetUrl } = formData;

  /**
   * @name handleChipDelete for selected chip
   * @param {object} chip Selected chip pass to Create campaign component
   */
  const handleChipDelete = (chip) => {
    const remainingKeyword = keyword.filter((key) => key !== chip);
    setFormData({ ...formData, keyword: remainingKeyword });
  };

  /**
   * @name enterNewKeyword for selected chip
   * @param {object} e event data for current input
   */
  const enterNewKeyword = (e) => {
    if (e.key === "Enter" && newKeyword) {
      const selectedKeyword = newKeyword.split(",");
      const keywordList = [...keyword, ...selectedKeyword];
      // Remove duplicate and blanks
      const uniqueKeywords = keywordList.filter(
        (data, index) => data.trim() !== "" && keywordList.indexOf(data) === index,
      );
      setFormData({ ...formData, keyword: uniqueKeywords });
      setNewKeyword("");
    }
  };

  /**
   * @name handleNewKeyword for selected chip
   * @param {object} e event data for current input
   */
  const handleNewKeyword = (e) => {
    setNewKeyword(e.target.value);
  };

  /**
   * @function handleDateChange function to update the local state of date
   * @param {object} event event data for current input
   */
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const dateValue = getFormattedDate(value);
    const timeValue = getFormattedTimeValue(new Date(value));
    setCampaignDate({
      ...campaignDate,
      [name]: `${dateValue}T${timeValue}`,
    });
  };

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("redirect_campaign.to_date_error_message"));
  };

  /**
   * @function validateDomain function to validate domain name present in the URL
   * @param {string} value value in the domain field
   * @returns {string}  returns the validation result and displays error message
   */
  const validateDomain = (value) => {
    return validateDomainField(
      value,
      domain,
      translate("redirect_campaign.invalid_URL"),
      translate("redirect_campaign.domain_not_present"),
    );
  };

  return (
    <Box maxWidth="59%">
      <Grid container alignItems="center" justify="space-between">
        <Grid item xs={5}>
          <TextInput
            source="campaignName"
            label={translate("redirect_campaign.campaign_name")}
            validate={validateName}
            className={classes.formInputWidth}
            value={campaignName}
          />
        </Grid>
        <Grid item xs={5}>
          <SelectInput
            source="geoId"
            label={translate("redirect_campaign.geo")}
            choices={geoOptions}
            value={geoId}
            className={classes.formInputWidth}
            validate={[required()]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            source="newKeyword"
            label={translate("redirect_campaign.create_keyword")}
            className={classes.formInputWidth}
            onChange={handleNewKeyword}
            value={newKeyword}
            onKeyDown={enterNewKeyword}
            helperText={translate("redirect_campaign.keyword_helper")}
            variant="filled"
            FormHelperTextProps={{
              className: classes.formHelperText,
            }}
          />
          <div className={classes.keywordChip}>
            {keyword.map((keywordValue) => (
              <Chip
                key={keywordValue}
                className={classes.chipInputInner}
                label={keywordValue}
                onDelete={() => handleChipDelete(keywordValue)}
              />
            ))}
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextInput
            source="targetUrl"
            label={translate("url")}
            validate={[required(), validateDomain]}
            className={classes.formInputWidth}
            value={targetUrl}
          />
        </Grid>
        <Grid item xs={5}>
          <DateTimeInput
            source="fromDate"
            label={translate("redirect_campaign.from_date")}
            className={classes.formInputWidth}
            onChange={handleDateChange}
            validate={[required()]}
          />
        </Grid>
        <Grid item xs={5}>
          <DateTimeInput
            source="thruDate"
            label={translate("redirect_campaign.through_date")}
            className={classes.formInputWidth}
            onChange={handleDateChange}
            validate={[required(), validateToDate(campaignDate.fromDate)]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

RedirectSearchCreateUI.propTypes = {
  domain: PropTypes.string.isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormData: PropTypes.objectOf(PropTypes.any).isRequired,
  validateName: PropTypes.string.isRequired,
  setNewKeyword: PropTypes.string.isRequired,
  geoOptions: PropTypes.string.isRequired,
  newKeyword: PropTypes.string.isRequired,
  campaignDate: PropTypes.objectOf(PropTypes.any).isRequired,
  setCampaignDate: PropTypes.string.isRequired,
};

export default RedirectSearchCreateUI;
