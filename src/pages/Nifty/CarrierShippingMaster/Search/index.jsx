import React, { useState } from "react";
import PropTypes from "prop-types";
import { Divider, Button, Grid, Typography, makeStyles } from "@material-ui/core";
import {
  BooleanInput,
  FormWithRedirect,
  FormDataConsumer,
  SelectInput,
  useTranslate,
  useRedirect,
  useNotify,
} from "react-admin";
import { isEmpty } from "lodash";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import CustomAutoComplete from "../../../../components/CustomAutoComplete";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import {
  DEFAULT_EQUALS_OPERATOR,
  DEFAULT_IN_OPERATOR,
  OPERATOR_LIST,
  SEARCH_STATE_MUTATORS,
  resetFieldBySource,
  isMultiSelection,
} from "../../niftyConfig";
import useCommonStyles from "../../../../assets/theme/common";
import useNiftyStyles from "../../niftyStyle";

const useStyles = makeStyles(() => ({
  root: {
    width: 210,
  },
  basicField: {
    width: "150px",
  },
  autoCompleteRoot: {
    width: 210,
    marginBottom: 25,
  },
}));

/**
 * Operator dropdown component
 *
 * @param {object} props required to render dropdown
 * @returns {React.ReactElement} returns dropdown
 */
const OperatorDropdown = React.memo((props) => {
  const { source, label, testId, onChange } = props;
  const classes = useStyles();
  const niftyClasses = useNiftyStyles();

  return (
    <SelectInput
      label={label}
      source={source}
      choices={OPERATOR_LIST}
      data-test-id={testId}
      variant="standard"
      margin="normal"
      onChange={onChange}
      className={`${classes.basicField} ${niftyClasses.disableBorder}`}
    />
  );
});

OperatorDropdown.propTypes = {
  source: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string,
  onChange: PropTypes.func,
};

OperatorDropdown.defaultProps = {
  testId: "",
  onChange: () => {},
};

const geoApiParams = {
  fieldName: "countryName",
  type: "getData",
  url: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
  sortParam: "countryName",
  fieldId: "countryId",
};

/**
 * Carrier Shipping Master Search component
 *
 * @returns {React.ReactElement} search carrier shipping master
 */
const CarrierShippingMasterSearch = () => {
  const classes = useStyles();
  const niftyClasses = useNiftyStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const commonClasses = useCommonStyles();
  const [filterFields] = useState([
    "carrierName",
    "originGeo",
    "geo",
    "shippingMethodName",
    "shippingRateType",
    "currency",
    "fulfillmentCenterName",
  ]);
  const [searchState] = useState({
    carrierName: "",
    carrierNameOperator: DEFAULT_EQUALS_OPERATOR,
    originGeo: "",
    originGeoOperator: DEFAULT_IN_OPERATOR,
    geo: "",
    geoOperator: DEFAULT_IN_OPERATOR,
    shippingMethodName: "",
    shippingMethodNameOperator: DEFAULT_IN_OPERATOR,
    shippingRateType: "",
    shippingRateTypeOperator: DEFAULT_IN_OPERATOR,
    currency: "",
    currencyOperator: DEFAULT_IN_OPERATOR,
    fulfillmentCenterName: "",
    fulfillmentCenterNameOperator: DEFAULT_IN_OPERATOR,
    isEnabled: true,
  });

  const breadcrumbs = [
    {
      displayName: translate("carrierShippingPriceMaster.carrier_shipping_price_master"),
    },
  ];

  /**
   * Function to handle search apply action and redirect with query param to list page
   *
   * @function searchSubmitHandler handler function for search submit
   * @param {object} searchData update form data
   */
  const searchSubmitHandler = (searchData) => {
    const userInputs = { ...searchData };
    const searchFilter = filterFields.filter((field) => {
      if (!isEmpty(userInputs[field])) {
        return field;
      }
      return undefined;
    });
    if (!searchFilter.length) {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    } else {
      redirect(`/nifty/v1/customer-delivery-charges?search=${encodeURIComponent(JSON.stringify(userInputs))}`);
    }
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid item className={commonClasses.gridStyle}>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {translate("carrierShippingPriceMaster.carrier_shipping_price_master")}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" style={{ marginBottom: 20 }} />
      <FormWithRedirect
        initialValues={searchState}
        save={searchSubmitHandler}
        mutators={SEARCH_STATE_MUTATORS}
        render={({ handleSubmitWithRedirect, form }) => (
          <form>
            <FormDataConsumer>
              {({ formData }) => (
                <>
                  <Grid container spacing={2} wrap="nowrap" direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <OperatorDropdown
                        testId="carrierNameOperator"
                        source="carrierNameOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("carrierName", "carrierNameOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.carrierNameOperator)}
                        label={translate("carrierShippingPriceMaster.carrier_name")}
                        source="carrierName"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        testId="originGeoOperator"
                        source="originGeoOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("originGeo", "originGeoOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.originGeoOperator)}
                        label={translate("carrierShippingPriceMaster.origin_geo")}
                        source="originGeo"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        testId="geoOperator"
                        source="geoOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("geo", "geoOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.geoOperator)}
                        label={translate("geo")}
                        source="geo"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} wrap="nowrap" direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <OperatorDropdown
                        testId="shippingMethodNameOperator"
                        source="shippingMethodNameOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("shippingMethodName", "shippingMethodNameOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.shippingMethodNameOperator)}
                        label={translate("carrierShippingPriceMaster.shipping_method_name")}
                        source="shippingMethodName"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        testId="shippingRateTypeOperator"
                        source="shippingRateTypeOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("shippingRateType", "shippingRateTypeOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.shippingRateTypeOperator)}
                        label={translate("carrierShippingPriceMaster.shipping_rate_type")}
                        source="shippingRateType"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        testId="currencyOperator"
                        source="currencyOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("currency", "currencyOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.currencyOperator)}
                        label={translate("currency")}
                        source="currency"
                        apiParams={{
                          fieldName: "uomId",
                          type: "getData",
                          url: `${window.REACT_APP_TIFFANY_SERVICE}/uoms?uomType=CURRENCY`,
                          fieldId: "uomId",
                        }}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} wrap="nowrap" direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <OperatorDropdown
                        testId="fulfillmentCenterNameOperator"
                        source="fulfillmentCenterNameOperator"
                        label={translate("operator")}
                        onChange={() => {
                          resetFieldBySource("fulfillmentCenterName", "fulfillmentCenterNameOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.fulfillmentCenterNameOperator)}
                        label={translate("carrierShippingPriceMaster.fulfillment_center_name")}
                        source="fulfillmentCenterName"
                        apiParams={geoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <BooleanInput
                        data-test-id="isEnabled"
                        label={translate("carrierShippingPriceMaster.is_enabled")}
                        source="isEnabled"
                        className={niftyClasses.configSwitch}
                        variant="standard"
                        margin="normal"
                      />
                    </Grid>
                  </Grid>

                  <Grid>
                    <Button variant="outlined" color="default">
                      {translate("cancel")}
                    </Button>
                    <Button variant="contained" color="default" onClick={handleSubmitWithRedirect}>
                      {translate("apply")}
                    </Button>
                  </Grid>
                </>
              )}
            </FormDataConsumer>
          </form>
        )}
      />
    </>
  );
};

export default React.memo(CarrierShippingMasterSearch);
