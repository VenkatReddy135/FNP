/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, RadioButtonGroupInput, TextInput } from "react-admin";
import { Grid, Typography, Box, Divider } from "@material-ui/core";
import useStyles from "./PopulateSequenceCategoryStyle";
import headingTittle from "../../../../assets/theme/common";
import CustomToolbar from "../../../../components/CustomToolbar";
import ShippingDistribution from "./ShippingDistribution";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * PopulateCategory component to Populate Category
 *
 *  @param {object} props all the props required by PopulateAndSequenceCategoryUI Create component
 * @returns {React.ReactElement} Populate Category page.
 */
const PopulateAndSequenceCategoryUI = (props) => {
  const classes = useStyles();
  const common = headingTittle();
  const translate = useTranslate();
  const {
    formData,
    formInitialValue,
    updateFormData,
    checkLoopBackType,
    type,
    selectedCategoryId,
    totalValue,
    cancelTagHandler,
    handleDateChange,
    handleChange,
    handleType,
  } = props;
  const { consideration, lookbackperiod, thruDate, fromDate } = formData;
  const shippingLabelData = {
    handDelivery: `${translate("populate_category.hand_delivery")}`,
    courier: `${translate("populate_category.courier")}`,
    digital: `${translate("populate_category.digital")}`,
    international: `${translate("populate_category.international")}`,
  };
  const titleMapping = {
    "auto-sequence": `${translate("populate_category.auto_sequence_title")}`,
    "populate-category": `${translate("populate_category.populate_title")}`,
  };
  /**
   * @function validatePopulateForm function to validate Through date
   * @param {object} values Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validatePopulateForm = (values) => {
    const errors = {};
    const isValid = new Date(values.thruDate) < new Date(values.fromDate);
    if (values.lookBackType === "no_of_days" && values.thruDate !== null && values.fromDate !== null && isValid) {
      errors.thruDate = translate("thru_date_error_message");
    }
    return errors;
  };
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: `${selectedCategoryId}`,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show`,
    },
    {
      displayName: translate("products"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show/products`,
    },
    {
      displayName: `${
        type === "populate-category"
          ? translate("product_list.populate")
          : translate("product_list.auto_sequence_title")
      }`,
    },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h5" className={common.pageTitleHeading}>
        {titleMapping[type]}
        <span className={common.mainTitleHeading}>{`[ID:${selectedCategoryId}]`}</span>
      </Typography>
      <Box pt={2}>
        <Divider variant="fullWidth" />
      </Box>
      <SimpleForm
        save={updateFormData}
        initialValues={formInitialValue}
        toolbar={<CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("apply")} />}
        validate={validatePopulateForm}
      >
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Typography variant="subtitle2">{translate("populate_category.consideration")}</Typography>
          </Grid>
          <Grid item xs={2}>
            <RadioButtonGroupInput
              source="consideration"
              name="consideration"
              helperText=""
              label=""
              defaultValue={consideration}
              value={consideration}
              onClick={handleChange}
              choices={[{ id: "geo", name: translate("geo") }]}
            />
          </Grid>
          <Grid item xs={2}>
            <RadioButtonGroupInput
              source="consideration"
              name="consideration"
              helperText=""
              label=""
              defaultValue={consideration}
              value={consideration}
              onClick={handleChange}
              choices={[{ id: "category", name: translate("category") }]}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Typography variant="subtitle2">{translate("look_back_period")}</Typography>
          </Grid>
          <Grid item xs={2}>
            <RadioButtonGroupInput
              source="lookBackType"
              defaultValue={checkLoopBackType}
              value={checkLoopBackType}
              label=""
              name="lookBackType"
              helperText=""
              onClick={handleType}
              choices={[{ id: "loopBackPeriod", name: translate("number_of_days") }]}
            />
          </Grid>
          <Grid item xs={1}>
            <TextInput
              className={`${checkLoopBackType === "no_of_days" ? classes.disabled : ""} ${classes.formInputWidth} ${
                classes.noDaysAlign
              }`}
              disabled={checkLoopBackType === "no_of_days"}
              defaultValue={lookbackperiod}
              value={lookbackperiod}
              label=""
              type="number"
              onChange={handleChange}
              helperText=""
              variant="outlined"
              source="lookbackperiod"
              max={10}
              min={1}
              InputProps={{
                inputProps: { className: `${classes.textCenter} ${lookbackperiod < 0 ? classes.errorHighlight : ""}` },
              }}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={3} />
          <Grid item xs={2}>
            <RadioButtonGroupInput
              source="lookBackType"
              label=""
              name="lookBackType"
              helperText=""
              defaultValue={checkLoopBackType}
              value={checkLoopBackType}
              onClick={handleType}
              choices={[{ id: "no_of_days", name: translate("date_range") }]}
            />
          </Grid>
          <Grid container md={7} spacing={2} className={checkLoopBackType === "loopBackPeriod" ? classes.disabled : ""}>
            <Grid item xs={6}>
              <DateTimeInput
                source="fromDate"
                label={translate("from_date")}
                className={checkLoopBackType === "loopBackPeriod" ? classes.disabled : ""}
                disabled={checkLoopBackType === "loopBackPeriod" ? classes.disabled : ""}
                defaultValue={fromDate}
                value={fromDate}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimeInput
                source="thruDate"
                label={translate("to_date")}
                className={checkLoopBackType === "loopBackPeriod" ? classes.disabled : ""}
                disabled={checkLoopBackType === "loopBackPeriod" ? classes.disabled : ""}
                value={thruDate}
                defaultValue={thruDate}
                onChange={handleDateChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <ShippingDistribution
          shippingLabelData={shippingLabelData}
          formData={formData}
          totalValue={totalValue}
          handleChange={handleChange}
        />
      </SimpleForm>
    </>
  );
};

PopulateAndSequenceCategoryUI.propTypes = {
  totalValue: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  selectedCategoryId: PropTypes.string.isRequired,
  checkLoopBackType: PropTypes.string.isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  formInitialValue: PropTypes.objectOf(PropTypes.any).isRequired,
  updateFormData: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  handleType: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
};

export default PopulateAndSequenceCategoryUI;
