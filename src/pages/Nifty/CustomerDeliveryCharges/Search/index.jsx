import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { FormWithRedirect, FormDataConsumer, SelectInput, useTranslate, useRedirect, useNotify } from "react-admin";
import { Divider, Typography, Button, makeStyles } from "@material-ui/core";
import { isEmpty } from "lodash";

import CustomAutoComplete from "../../../../components/CustomAutoComplete";
import SwitchComp from "../../../../components/switch";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import {
  OPERATOR_LIST,
  DEFAULT_IN_OPERATOR,
  filterReducer,
  SEARCH_STATE_MUTATORS,
  resetFieldBySource,
  isMultiSelection,
} from "../../niftyConfig";
import useCommonStyles from "../../../../assets/theme/common";

const useAutoCompleteStyles = makeStyles(() => ({
  root: {
    width: 210,
  },
}));

/**
 * Operator dropdown component
 *
 * @param {object} props search Customer Delivery Charges
 * @returns {React.ReactElement} search Customer Delivery Charges
 */
const OperatorDropdown = React.memo((props) => {
  const { source, label, onChange, testId } = props;
  return (
    <SelectInput
      data-test-id={testId}
      label={label}
      source={source}
      choices={OPERATOR_LIST}
      variant="standard"
      margin="normal"
      onChange={onChange}
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

const additionFilterDomain = [
  {
    fieldName: "TagTypeId",
    operatorName: "Like",
    fieldValue: "D",
  },
];

const domainApiParams = {
  fieldName: "tagId",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
  sortParam: "tagName",
  fieldId: "tagId",
};

const geoApiParams = {
  fieldName: "countryName",
  type: "getData",
  url: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
  sortParam: "countryName",
  fieldId: "countryId",
};

const timeSlotOptions = [
  { id: "8pm-9pm", name: "8pm-9pm" },
  { id: "9pm-10pm", name: "9pm-10pm" },
  { id: "10pm-11pm", name: "10pm-11pm" },
  { id: "11pm-12am", name: "11pm-12am" },
];

/**
 * Customer Delivery Charges search component
 *
 * @returns {React.ReactElement} search Customer Delivery Charges
 */
const CustomerDeliveryChargesSearch = () => {
  const [filterFields] = useState([
    "currency",
    "deliveryArea",
    "domain",
    "geo",
    "productType",
    "shippingMethodName",
    "timeSlot",
  ]);
  const [searchState, setSearchState] = useState({
    currency: "",
    currencyOperator: DEFAULT_IN_OPERATOR,
    deliveryArea: "",
    deliveryAreaOperator: DEFAULT_IN_OPERATOR,
    domain: "",
    domainOperator: DEFAULT_IN_OPERATOR,
    geo: "",
    geoOperator: DEFAULT_IN_OPERATOR,
    productType: "",
    productTypeOperator: DEFAULT_IN_OPERATOR,
    geoGroup: "",
    geoGroupOperator: DEFAULT_IN_OPERATOR,
    shippingMethodName: "",
    shippingMethodNameOperator: DEFAULT_IN_OPERATOR,
    timeSlot: "",
    timeSlotOperator: DEFAULT_IN_OPERATOR,
    status: true,
    currencyList: [],
  });
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const classes = useAutoCompleteStyles();
  const commonClasses = useCommonStyles();

  const breadcrumbs = [
    {
      displayName: translate("customerDeliveryCharges.customer_delivery_charges"),
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
    const mappedData = filterReducer(userInputs, filterFields);
    if (isEmpty(mappedData)) {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    } else {
      redirect(
        `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges?search=${encodeURIComponent(
          JSON.stringify(mappedData),
        )}`,
      );
    }
  };

  /**
   * Function to handle status change action
   *
   * @function onStatusChange handle status change action
   */
  const onStatusChange = () => {
    setSearchState((prevState) => ({
      ...prevState,
      status: !prevState.status,
    }));
  };

  /**
   * @function handleOnSuccessForCurrencies this function will set the data
   * @param {object} res is passed to the function
   */
  const handleOnSuccessForCurrencies = (res) => {
    const response = res?.data?.data || [];
    const listOfCurrency = [];
    response.forEach((data) => {
      listOfCurrency.push({ id: data.uomId, name: data.uomId });
    });
    setSearchState((prevState) => ({ ...prevState, currencyList: [...listOfCurrency] }));
  };

  const currencyResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms?uomType=CURRENCY`;
  useCustomQueryWithStore("getData", currencyResource, handleOnSuccessForCurrencies);

  return (
    <Grid data-test-id="data-search-form">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid item className={commonClasses.gridStyle}>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {translate("customerDeliveryCharges.customer_delivery_charges")}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" style={{ marginBottom: 20 }} />
      <FormWithRedirect
        mutators={SEARCH_STATE_MUTATORS}
        initialValues={searchState}
        save={searchSubmitHandler}
        render={({ handleSubmitWithRedirect, form }) => (
          <form>
            <FormDataConsumer>
              {({ formData }) => (
                <>
                  <Grid>
                    <Grid container direction="row" spacing={2} justify="flex-start">
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          testId="domainOperator"
                          source="domainOperator"
                          onChange={() => {
                            resetFieldBySource("domain", "domainOperator", form, formData);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CustomAutoComplete
                          multipleSelect={isMultiSelection(formData.domainOperator)}
                          label={translate("domain")}
                          source="domain"
                          apiParams={domainApiParams}
                          additionalFilter={additionFilterDomain}
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="geoOperator"
                          testId="geoOperator"
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
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="geoGroupOperator"
                          testId="geoGroupOperator"
                          onChange={() => {
                            resetFieldBySource("geoGroup", "geoGroupOperator", form, formData);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CustomAutoComplete
                          multipleSelect={isMultiSelection(formData.geoGroupOperator)}
                          source="geoGroup"
                          label={translate("geo_group")}
                          data-test-id="geoGroup"
                          apiParams={domainApiParams}
                          additionalFilter={[
                            {
                              fieldName: "TagTypeId",
                              operatorName: "Like",
                              fieldValue: "C",
                            },
                          ]}
                          rootClass={classes.root}
                        />
                      </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2} justify="flex-start">
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="shippingMethodNameOperator"
                          testId="shippingMethodNameOperator"
                          onChange={() => {
                            resetFieldBySource("shippingMethodName", "shippingMethodNameOperator", form, formData);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CustomAutoComplete
                          multipleSelect={isMultiSelection(formData.shippingMethodNameOperator)}
                          source="shippingMethodName"
                          label={translate("customerDeliveryCharges.shipping_method_name")}
                          data-test-id="shippingMethodName"
                          apiParams={geoApiParams}
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="currencyOperator"
                          testId="currencyOperator"
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
                          disabled={!searchState.currencyList.length}
                          defaultOptions={[...searchState.currencyList]}
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="timeSlotOperator"
                          testId="timeSlotOperator"
                          onChange={() => {
                            resetFieldBySource("timeSlot", "timeSlotOperator", form, formData);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CustomAutoComplete
                          multipleSelect={isMultiSelection(formData.timeSlotOperator)}
                          source="timeSlot"
                          label={translate("customerDeliveryCharges.time_slot")}
                          data-test-id="timeSlot"
                          defaultOptions={timeSlotOptions}
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <OperatorDropdown
                          label={translate("operator")}
                          source="productTypeOperator"
                          testId="productTypeOperator"
                          onChange={() => {
                            resetFieldBySource("productType", "productTypeOperator", form, formData);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CustomAutoComplete
                          multipleSelect={isMultiSelection(formData.productTypeOperator)}
                          source="productType"
                          label={translate("customerDeliveryCharges.product_type")}
                          data-test-id="productType"
                          apiParams={domainApiParams}
                          additionalFilter={[
                            {
                              fieldName: "TagTypeId",
                              operatorName: "Like",
                              fieldValue: "PT",
                            },
                          ]}
                          rootClass={classes.root}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">{translate("customerDeliveryCharges.is_enabled")}</Typography>
                        <SwitchComp record={searchState.status} onChange={onStatusChange} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{ marginTop: 40 }}>
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
    </Grid>
  );
};

export default React.memo(CustomerDeliveryChargesSearch);
