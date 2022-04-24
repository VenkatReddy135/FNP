/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  useRedirect,
  FormWithRedirect,
  required,
  SelectInput,
  NumberInput,
  BooleanInput,
  FormDataConsumer,
  TextInput,
  useMutation,
  useNotify,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { TextField, Typography, Grid, Divider, Box, Button, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useCommonStyles from "../../../../assets/theme/common";
import SimpleModal from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import GenericRadioGroup from "../../../../components/RadioGroup";
import CustomAutoComplete from "../../../../components/CustomAutoComplete";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { handleInvalidCharsInNumberInput } from "../../../../utils/validationFunction";
import SwitchComp from "../../../../components/switch";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import { NIFTY_PAGE_TYPE, positiveValidate, validateCeilingPrice, PP_CALCULATION_METHODS } from "../../niftyConfig";
import useNiftyStyles from "../../niftyStyle";
import DatePicker from "../../../../components/CustomDatePicker";

const requiredValidate = required();

const noOfDaysOptions = [
  { id: 7, name: 7 },
  { id: 15, name: 15 },
  { id: 30, name: 30 },
  { id: 60, name: 60 },
  { id: 90, name: 90 },
  { id: 180, name: 180 },
  { id: 365, name: 365 },
];

const deliveryChargesOptions = [
  { id: "Yes", name: "Yes" },
  { id: "No", name: "No" },
];

const lookBackPeriodOptions = [
  { id: "Number of Days", name: "Number of Days" },
  { id: "Date Range", name: "Date Range" },
];

const LOOK_BACK_PERIOD_MAPPING = {
  DAYS: "Number of Days",
  DATE_RANGE: "Date Range",
};

/**
 * Base Price Form  component
 *
 * @param {object} props form data
 * @returns {React.ReactElement} create base price form
 */
const BasePriceForm = (props) => {
  const { initialState, onSave, mode, pageTitle } = props;
  const commonClasses = useCommonStyles();
  const niftyClasses = useNiftyStyles();
  const formReference = useRef(null);
  const [mutate] = useMutation();
  const notify = useNotify();
  const classes = useNiftyStyles();
  const translate = useTranslate();
  const [open, toggleModal] = useState(false);
  const history = useHistory();
  const redirect = useRedirect();
  const [input, setInput] = useState(initialState);
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode, NIFTY_PAGE_TYPE]);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode, NIFTY_PAGE_TYPE]);
  const breadcrumbs = [
    {
      displayName: translate("basePriceModel.base_price_model"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/base-price-model`,
    },
    { displayName: memoizedIsCreate ? translate("basePriceModel.new_base_price_model") : pageTitle },
  ];

  useEffect(() => {
    setInput((prevState) => ({ ...prevState, ...initialState }));
  }, [initialState]);

  /**
   * @function cancelHandler to redirect back to listing page
   */
  const cancelHandler = useCallback(() => {
    if (memoizedIsView) {
      history.push(`/${window.REACT_APP_NIFTY_SERVICE}/base-price-model`);
    } else {
      history.goBack();
    }
  });

  /**
   * @function saveBasePriceData function called on click of Add button
   * @param {object} basePriceObj updated input values
   */
  const saveBasePriceData = useCallback((basePriceObj) => {
    setInput({ ...input, ...basePriceObj });
    toggleModal(true);
  });

  /**
   * @function handleActionAfterSubmit function called to create new base price model
   */
  const handleActionAfterSubmit = useCallback(() => {
    toggleModal(false);
    onSave(input);
  });

  const basePriceModelMutator = {
    resetFieldValue: (args, state, utils) => {
      if (args[1] !== state.formState.values.geography?.name) {
        utils.changeValue(state, args[0], () => "");
      }
    },
    setFieldValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
    resetLookBackPeriod: (args, state, utils) => {
      utils.changeValue(state, args[0], () => "");
    },
  };

  /**
   * @function handleCurrencySetting update currency field value and options
   * @param {object} response api response
   */
  const handleCurrencySetting = (response) => {
    const currencyValues = [];
    response.data.data[0].currencies.forEach((currency) => {
      currencyValues.push({ id: currency.currencyId, name: currency.currencyId });
    });
    formReference.current.mutators.setFieldValue("currencyOptions", currencyValues);

    if (!memoizedIsView && memoizedIsCreate) {
      if (currencyValues.length === 1) {
        formReference.current.mutators.setFieldValue("currency", currencyValues[0]?.name);
      } else formReference.current.mutators.setFieldValue("currency", "");
    }
  };

  /**
   * @function handleCurrencyFailure update currency field value and options on failure
   */
  const handleCurrencyFailure = () => {
    formReference.current.mutators.setFieldValue("currencyOptions", []);
  };

  /**
   * @function getCurrencyValue  set currency
   * @param {string} val input value
   * @param {object} event event object
   */
  const getCurrencyValue = (val, event) => {
    if (event.type === "click") {
      const geoId = formReference.current.getState().values?.geography?.id;
      mutate(
        {
          type: "getOne",
          resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/geo-preference?geoIds=${geoId}`,
        },
        {
          onSuccess: (response) => {
            onSuccess({
              response,
              notify,
              translate,
              handleSuccess: handleCurrencySetting,
            });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate, handleFailure: handleCurrencyFailure });
          },
        },
      );
    } else {
      formReference.current.mutators.resetFieldValue("currency", val);
    }
  };

  /**
   * @function handleRedirectEdit to redirect to edit page
   */
  const handleRedirectToEdit = useCallback(() => {
    redirect(`/${window.REACT_APP_NIFTY_SERVICE}/base-price-model/${pageTitle}`);
  });

  /**
   * @function getLookBackPeriodValue to get look back period view value
   * @param {object} formData form data
   * @returns {string} look back period value
   */
  const getLookBackPeriodValue = (formData) => {
    const { lookBackPeriod, numberOfDays, fromDate, toDate } = formData;
    if (lookBackPeriod === lookBackPeriodOptions[0].id) {
      return `${numberOfDays} Days`;
    }
    return `${fromDate} To ${toDate}`;
  };

  /**
   * @function setFormReference function to set form reference
   * @param {object} form form data
   */
  const setFormReference = useCallback(
    (form) => {
      if (!formReference.current) {
        formReference.current = form;
      }
    },
    [formReference],
  );

  /**
   * @function onLookBackPeriodChange to handle change of look back period type
   * @param {string} value type of look back period
   */
  const onLookBackPeriodChange = (value) => {
    if (value === LOOK_BACK_PERIOD_MAPPING?.DAYS) {
      formReference.current.mutators?.resetLookBackPeriod("fromDate");
      formReference.current.mutators?.resetLookBackPeriod("toDate");
    } else {
      formReference.current.mutators?.resetLookBackPeriod("numberOfDays");
    }
  };

  const geoApiParams = {
    fieldName: "countryName",
    type: "getData",
    url: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
    sortParam: "countryName",
    fieldId: "countryId",
  };

  /**
   *@function formRenderer render form for base price model
   *@returns {React.ReactElement} base price form component
   */
  const formRenderer = () => {
    return (
      <>
        <FormWithRedirect
          save={saveBasePriceData}
          mutators={basePriceModelMutator}
          record={input}
          render={({ handleSubmitWithRedirect, ...rest }) => (
            <form>
              <FormDataConsumer>
                {({ formData }) => (
                  <>
                    <Grid
                      item
                      container
                      direction="row"
                      alignItems="flex-start"
                      justify="space-between"
                      md={memoizedIsCreate ? 9 : 13}
                      className={memoizedIsView ? commonClasses.customMargin : ""}
                    >
                      {!memoizedIsCreate && (
                        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                          <TextInput
                            disabled
                            source="modelId"
                            data-test-id="modelId"
                            label={translate("basePriceModel.model_id")}
                            variant="standard"
                            margin="normal"
                            className={`${classes.basicField} ${classes.disableBorder}`}
                          />
                        </Grid>
                      )}
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <CustomAutoComplete
                          data-test-id="geo"
                          source="geography"
                          label={translate("geo")}
                          apiParams={geoApiParams}
                          validate={memoizedIsCreate && requiredValidate}
                          autoCompleteClass={classes.disableBorder}
                          onSearchInputChange={getCurrencyValue}
                          disabled={!memoizedIsCreate}
                        />
                      </Grid>
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <NumberInput
                          data-test-id="sales_percentage"
                          className={`${commonClasses.numberInputField} ${classes.basicField}`}
                          label={translate("basePriceModel.sales_percentage")}
                          source="salesPercentage"
                          validate={[
                            requiredValidate,
                            positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                          ]}
                          onKeyDown={handleInvalidCharsInNumberInput}
                          autoComplete="Off"
                          variant="standard"
                          disabled={memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <NumberInput
                          data-test-id="dc"
                          className={`${commonClasses.numberInputField} ${classes.basicField}`}
                          label={translate("basePriceModel.dc")}
                          source="deliveryCharges"
                          validate={[
                            requiredValidate,
                            positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                          ]}
                          onKeyDown={handleInvalidCharsInNumberInput}
                          autoComplete="Off"
                          variant="standard"
                          disabled={memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                      {memoizedIsView && (
                        <Grid item container direction="row" justify="flex-end" alignItems="flex-start" xs={1}>
                          <IconButton data-at-id="edit_button" onClick={handleRedirectToEdit}>
                            <EditOutlinedIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                    {!memoizedIsView && (
                      <Grid direction="row" container spacing={2}>
                        <Grid item xs={3}>
                          <GenericRadioGroup
                            data-test-id="look_back_period"
                            label={translate("basePriceModel.look_back_period")}
                            source="lookBackPeriod"
                            choices={lookBackPeriodOptions}
                            editable
                            onChange={onLookBackPeriodChange}
                          />
                        </Grid>
                        {formData?.lookBackPeriod === LOOK_BACK_PERIOD_MAPPING?.DATE_RANGE ? (
                          <>
                            <Grid item xs={2}>
                              <DatePicker
                                source="fromDate"
                                label={translate("from_date")}
                                data-test-id="fromDate"
                                dataId="basePriceToDate"
                                maxDate={formData.toDate || ""}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <DatePicker
                                source="toDate"
                                label={translate("to_date")}
                                data-test-id="toDate"
                                dataId="basePriceToDate"
                                minDate={formData.fromDate || ""}
                              />
                            </Grid>
                          </>
                        ) : (
                          <Grid item xs>
                            <SelectInput
                              data-test-id="number_of_days"
                              source="numberOfDays"
                              label={translate("basePriceModel.number_of_days_last")}
                              variant="standard"
                              validate={requiredValidate}
                              choices={noOfDaysOptions}
                              className={classes.basicField}
                              margin="normal"
                            />
                          </Grid>
                        )}
                      </Grid>
                    )}
                    <Grid
                      item
                      container
                      direction="row"
                      alignItems="flex-start"
                      justify="space-between"
                      md={memoizedIsView ? 11 : 9}
                      className={memoizedIsView ? commonClasses.customMargin : ""}
                    >
                      {memoizedIsView && (
                        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                          <TextField
                            disabled
                            value={getLookBackPeriodValue(formData)}
                            label={translate("basePriceModel.look_back_period")}
                            data-test-id="lookBackPeriod_view"
                            variant="standard"
                            className={`${classes.basicField} ${memoizedIsView && classes.disableBorder}`}
                            margin="normal"
                          />
                        </Grid>
                      )}
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <SelectInput
                          data-test-id="pp_calc"
                          source="ppCalculationMethod"
                          label={translate("basePriceModel.pp_calculation_method")}
                          variant="standard"
                          validate={requiredValidate}
                          className={`${classes.basicField} ${memoizedIsView && classes.disableBorder}`}
                          choices={PP_CALCULATION_METHODS}
                          disabled={memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <TextInput
                          data-test-id="ceilingAmount"
                          label={translate("basePriceModel.ceiling_amount")}
                          source="ceilingAmount"
                          validate={[
                            requiredValidate,
                            validateCeilingPrice(translate("basePriceModel.ceiling_amount_validation")),
                          ]}
                          className={`${classes.basicField} ${memoizedIsView && classes.disableBorder}`}
                          autoComplete="off"
                          variant="standard"
                          disabled={memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                        <NumberInput
                          data-test-id="fall_back_charges"
                          className={`${commonClasses.numberInputField} ${classes.basicField}`}
                          label={translate("basePriceModel.fallback_carrier_charges")}
                          source="fallBackCarrierCharges"
                          validate={[
                            requiredValidate,
                            positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                          ]}
                          onKeyDown={handleInvalidCharsInNumberInput}
                          autoComplete="Off"
                          variant="standard"
                          disabled={memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      container
                      direction="row"
                      alignItems="flex-start"
                      justify="space-between"
                      md={memoizedIsView ? 11 : 8}
                    >
                      {memoizedIsView ? (
                        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={3}>
                          <TextInput
                            disabled
                            source="includeDeliveryCharge"
                            label={translate("basePriceModel.include_dc")}
                            variant="standard"
                            className={`${classes.basicField} ${memoizedIsView && classes.disableBorder}`}
                            margin="normal"
                          />
                        </Grid>
                      ) : (
                        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={3}>
                          <GenericRadioGroup
                            data-test-id="incl_delivery_charge"
                            label={translate("basePriceModel.include_dc")}
                            source="includeDeliveryCharge"
                            choices={deliveryChargesOptions}
                            editable
                            className={classes.basicField}
                          />
                        </Grid>
                      )}
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={3}>
                        <SelectInput
                          data-test-id="currency"
                          source="currency"
                          label={translate("currency")}
                          variant="standard"
                          validate={formData?.currencyOptions.length && formData.geography && requiredValidate}
                          choices={formData?.currencyOptions}
                          className={`${classes.basicField} ${memoizedIsView && classes.disableBorder}`}
                          disabled={formData?.currencyOptions.length <= 1 || memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                        xs={memoizedIsView ? 6 : 3}
                      >
                        {memoizedIsView ? (
                          <Grid container item direction="column" className={niftyClasses.viewSwitch}>
                            <Typography className={commonClasses.gridMarginStyle} variant="caption">
                              {translate("status")}
                            </Typography>
                            <SwitchComp disable record={initialState.status} />
                          </Grid>
                        ) : (
                          <BooleanInput
                            data-test-id="status"
                            label={translate("status")}
                            source="status"
                            className={classes.switchButton}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <Box display="flex" mt="1em">
                      <Button variant="outlined" color="default" onClick={cancelHandler}>
                        {memoizedIsView ? translate("back") : translate("cancel")}
                      </Button>
                      {!memoizedIsView && (
                        <Button variant="contained" color="default" onClick={handleSubmitWithRedirect}>
                          {memoizedIsCreate ? translate("add") : translate("update")}
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </FormDataConsumer>
              {setFormReference(rest.form)}
            </form>
          )}
        />
      </>
    );
  };

  /**
   * @function historyHandler to redirect to history page
   */
  const historyHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/base-price-model/MOD_001/history`);
  });

  const pageHeader = memoizedIsCreate ? translate("basePriceModel.new_base_price_model") : pageTitle;
  const modalMessage = memoizedIsCreate
    ? translate("basePriceModel.create_modal_message")
    : translate("basePriceModel.update_modal_message");

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid item className={commonClasses.gridStyle}>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {pageHeader}
          </Typography>
        </Grid>
        {(memoizedIsView || (!memoizedIsCreate && !memoizedIsView)) && (
          <Grid item>
            <Button variant="outlined" color="default" onClick={historyHandler}>
              {translate("view_history")}
            </Button>
          </Grid>
        )}
      </Grid>
      <Divider variant="fullWidth" style={{ marginBottom: 20 }} />
      {formRenderer()}
      <SimpleModal
        openModal={open}
        dialogContent={<CommonDialogContent message={modalMessage} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={() => toggleModal(false)}
        handleAction={handleActionAfterSubmit}
      />
    </>
  );
};

BasePriceForm.propTypes = {
  mode: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.any),
  pageTitle: PropTypes.string,
};
BasePriceForm.defaultProps = {
  onSave: () => {
    /* comment */
  },
  initialState: {},
  pageTitle: "",
};
export default React.memo(BasePriceForm);
