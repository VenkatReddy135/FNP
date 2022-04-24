/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  FormWithRedirect,
  BooleanInput,
  required,
  TextInput,
  SelectInput,
  regex,
  useRedirect,
  FormDataConsumer,
} from "react-admin";
import { Grid, Box, Button, Typography, Divider, makeStyles, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory } from "react-router-dom";
import CustomBreadCrumbs from "../../../../components/Breadcrumbs";
import CustomAutoComplete from "../../../../components/CustomAutoComplete";
import useCommonStyles from "../../../../assets/theme/common";
import SingleTieredConfiguration from "../SingleTieredConfiguration";
import MultiTieredConfiguration from "../MultiTieredConfiguration";
import SwitchComp from "../../../../components/switch";
import SimpleModal from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { color } from "../../../../config/GlobalConfig";
import { NIFTY_PAGE_TYPE, configCodeRegex, getUniqId, INITIAL_SHIPPING_CONFIG } from "../../niftyConfig";
import useNiftyStyles from "../../niftyStyle";

const requiredValidate = required();

const uomValuesOptions = [
  { id: "Configured", name: "Configured" },
  { id: "Actual", name: "Actual" },
];
const uomTypesOptions = [
  { id: "Volumetric Weight", name: "Volumetric Weight" },
  { id: "Box Size", name: "Box Size" },
];
const shippingRateTypeConfigOptions = [
  { id: "Single Tiered", name: "Single Tiered" },
  { id: "Multi-Tiered", name: "Multi-Tiered" },
];

const SHIPPING_TYPE_CONFIG = {
  SINGLE_TIERED: "Single Tiered",
  MULTI_TIERED: "Multi-Tiered",
};

const singleTieredRateTypes = [{ id: "Flat Rate", name: "Flat Rate" }];
const multiTieredRateTypes = [
  { id: "By Item Weight", name: "By Item Weight" },
  { id: "By Item Quantity", name: "By Item Quantity" },
  { id: "By Distance", name: "By Distance" },
  { id: "By Sub-Order Total", name: "By Sub-Order Total" },
];

/**
 * @function shippingRateTypes function to return options
 * @param {string} value shippingRateTypeConfig
 * @returns {Array} returns  shipping Rate Types
 */
const shippingRateTypes = (value) => {
  return value.getState().values.shippingRateTypeConfig === SHIPPING_TYPE_CONFIG.SINGLE_TIERED
    ? singleTieredRateTypes
    : multiTieredRateTypes;
};

const apiParams = {
  fieldName: "categoryName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
  sortParam: "categoryName",
  fieldId: "categoryId",
};

const useStyles = makeStyles(() => ({
  basicField: {
    width: "255px",
  },
  hiddenConfig: {
    visibility: "hidden",
    width: 0,
    height: 0,
  },
  errorClass: {
    color: `${color.red}`,
    fontWeight: 500,
  },
}));

/**
 * Carrier Shipping Master component
 *
 * @param {object} props form data
 * @returns {React.ReactElement} create carrier shipping master
 */
const CarrierShippingMasterForm = (props) => {
  const { initialState, handleAction, mode, pageTitle } = props;
  const formReference = useRef(null);
  const translate = useTranslate();
  const commonClasses = useCommonStyles();
  const niftyClasses = useNiftyStyles();
  const classes = useStyles();
  const history = useHistory();
  const [states, setState] = useState({
    input: initialState,
    open: false,
    iconState: false,
    isConfig: false,
    configValidation: false,
    configVal: initialState.shippingRateTypeConfig,
    currentConfig: initialState.shippingRateTypeConfig,
    shippingRateOptions:
      initialState.shippingRateTypeConfig === SHIPPING_TYPE_CONFIG.SINGLE_TIERED
        ? singleTieredRateTypes
        : multiTieredRateTypes,
  });
  const redirect = useRedirect();
  const configCodeValidationMsg = translate("carrierShippingPriceMaster.config_code_validation_msg");
  const validateConfigCode = regex(configCodeRegex, configCodeValidationMsg);
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode]);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode]);
  const [currencyOptions, setCurrencyOptions] = useState(
    initialState?.currencyOptions?.length ? [...initialState.currencyOptions] : [],
  );
  const breadcrumbs = [
    {
      displayName: translate("carrierShippingPriceMaster.carrier_shipping_price_master"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/carrier-shipping-price-master`,
    },
    { displayName: memoizedIsCreate ? translate("carrierShippingPriceMaster.new_shipment_rate") : pageTitle },
  ];

  /**
   * @function cancelHandler to redirect back to price-master page
   */
  const cancelHandler = useCallback(() => {
    if (memoizedIsView) {
      history.push(`/${window.REACT_APP_NIFTY_SERVICE}/carrier-shipping-price-master`);
    } else {
      history.goBack();
    }
  });

  /**
   * @function handleConfigForm to operate config form
   */
  const handleConfigForm = () => {
    const updateState = {
      ...states,
      iconState: !states.iconState,
      configValidation: false,
    };
    setState(updateState);
  };

  /**
   * @function handleRedirectEdit to redirect to edit page
   */
  const handleRedirectToEdit = () => {
    redirect(`/${window.REACT_APP_NIFTY_SERVICE}/carrier-shipping-price-master/blueDart`);
  };

  /**
   * @function saveCarrierShippingCharges function called on click of Add button
   * @param {object} carrierChargeObj updated input values
   */
  const saveCarrierShippingCharges = (carrierChargeObj) => {
    const updateState = {
      ...states,
      input: carrierChargeObj,
      open: true,
      isConfig: false,
    };
    setState(updateState);
  };

  const carrierMasterMutator = {
    resetFieldValue: (args, state, utils) => {
      if (args[1] !== state.formState.values.shippingRateTypeConfig) {
        utils.changeValue(state, args[0], () => "");
      }
    },

    setFieldValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
  };

  /**
   * @function onDeleteShipment delete shipment rate
   */
  const onDeleteShipment = () => {
    const updateState = {
      ...states,
      open: true,
    };
    setState(updateState);
  };

  /**
   * @function onAddConfig config save callback
   * @param {object} form parent form reference
   */
  const onAddConfig = (form) => {
    const { configList } = form.getState().values;
    form.mutators.setFieldValue("configList", [...configList, { ...INITIAL_SHIPPING_CONFIG, configId: getUniqId() }]);
  };

  /**
   * @function onDeleteConfig delete config callback
   * @param {object} form parent form reference
   * @param {object} data delete data
   */
  const onDeleteConfig = (form, data) => {
    const { configList } = form.getState().values;
    const updatedConfig = configList.filter((config) => config.configId !== data.configId);
    form.mutators.setFieldValue("configList", [...updatedConfig]);
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
   * @function handleSubmitWithRedirectEvent function to handle add button event
   * @param {object} formData form Data
   * @param {Function} handleSubmitWithRedirect function
   */
  const handleSubmitWithRedirectEvent = (formData, handleSubmitWithRedirect) => {
    const errors = Object.keys(formData.getState().errors);
    let configError;
    if (formData.getState().values.shippingRateTypeConfig === SHIPPING_TYPE_CONFIG.SINGLE_TIERED) {
      configError = errors.find((key) => key === "singleTieredConfig");
    } else {
      configError = errors.find((key) => key === "configList");
    }

    if (errors && configError) {
      if (!states.iconState) {
        const updateState = {
          ...states,
          configValidation: true,
        };
        setState(updateState);
      }
    }

    handleSubmitWithRedirect();
  };

  /**
   * @function getCurrencyValue update currency field value and options
   * @param {object} formData form Data
   */
  const getCurrencyValue = (formData) => {
    const opt = [
      { id: "INR", name: "INR" },
      { id: "USD", name: "USD" },
    ];

    setCurrencyOptions([...opt]);
    formData.mutators.setFieldValue("currency", "");
  };

  /**
   *@function CarrierShippingForm Carrier Shipping Form
   *@returns {React.ReactElement} Carrier Shipping Form component
   */
  const carrierShippingForm = () => {
    return (
      <>
        <FormWithRedirect
          save={saveCarrierShippingCharges}
          mutators={carrierMasterMutator}
          record={states.input}
          render={({ handleSubmitWithRedirect, ...rest }) => (
            <form>
              <Grid
                item
                container
                direction="row"
                justify="space-between"
                className={memoizedIsView ? commonClasses.customMargin : ""}
                alignItems="flex-start"
                md={memoizedIsView ? 12 : 11}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <TextInput
                    source="configurationCode"
                    label={translate("carrierShippingPriceMaster.config_code")}
                    data-test-id="configurationCode"
                    validate={[validateConfigCode, requiredValidate]}
                    autoComplete="off"
                    variant="standard"
                    margin="normal"
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    disabled={!memoizedIsCreate}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    label={translate("geo")}
                    data-test-id="geo"
                    source="geo"
                    apiParams={apiParams}
                    validate={requiredValidate}
                    defaultOptions={[
                      { id: "India", name: "India" },
                      { id: "USA", name: "USA" },
                    ]}
                    onSearchInputChange={(value, event) => {
                      if (typeof value !== "undefined" && (event?.type === "click" || event?.type === "change")) {
                        getCurrencyValue(rest.form);
                      }
                    }}
                    disabled={memoizedIsView}
                    autoCompleteClass={niftyClasses.disableBorder}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    label={translate("carrierShippingPriceMaster.fulfillment_center")}
                    data-test-id="fulfillmentCenter"
                    source="fulfillmentCenter"
                    defaultOptions={[
                      { id: "Center1", name: "Center1" },
                      { id: "Center2", name: "Center2" },
                    ]}
                    apiParams={apiParams}
                    disabled={memoizedIsView}
                    validate={requiredValidate}
                    autoCompleteClass={niftyClasses.disableBorder}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="uomValues"
                    source="uomValues"
                    label={translate("carrierShippingPriceMaster.uom_values")}
                    variant="standard"
                    margin="normal"
                    validate={requiredValidate}
                    choices={uomValuesOptions}
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    disabled={memoizedIsView}
                  />
                </Grid>
                {memoizedIsView && (
                  <Grid item container direction="row" justify="flex-end" alignItems="flex-start" xs={1}>
                    <IconButton data-at-id="edit_button" onClick={handleRedirectToEdit}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton data-at-id="delete_button" onClick={onDeleteShipment}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                className={memoizedIsView ? commonClasses.customMargin : ""}
                justify="space-between"
                md={11}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    label={translate("carrierShippingPriceMaster.origin_geo")}
                    data-test-id="originGeo"
                    source="originGeo"
                    defaultOptions={[
                      { id: "ind", name: "INDIA" },
                      { id: "usa", name: "USA" },
                    ]}
                    apiParams={apiParams}
                    disabled={memoizedIsView}
                    autoCompleteClass={niftyClasses.disableBorder}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    label={translate("carrierShippingPriceMaster.carrier_name")}
                    data-test-id="carrierName"
                    source="carrierName"
                    defaultOptions={[
                      { id: "Carrier1", name: "Carrier1" },
                      { id: "Carrier2", name: "Carrier2" },
                    ]}
                    apiParams={apiParams}
                    validate={requiredValidate}
                    autoCompleteClass={niftyClasses.disableBorder}
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="shippingRateType"
                    source="shippingRateType"
                    label={translate("carrierShippingPriceMaster.shipping_rate_type")}
                    variant="standard"
                    margin="normal"
                    validate={requiredValidate}
                    choices={states.shippingRateOptions}
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="uomTypes"
                    source="uomTypes"
                    label={translate("carrierShippingPriceMaster.uom_type")}
                    variant="standard"
                    margin="normal"
                    validate={requiredValidate}
                    choices={uomTypesOptions}
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    disabled={memoizedIsView}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                className={memoizedIsView ? commonClasses.customMargin : undefined}
                md={11}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    label={translate("geo_group")}
                    data-test-id="geoGroup"
                    source="geoGroup"
                    defaultOptions={[
                      { id: "delhi-ecda=[110011,110012]", name: "delhi-ecda=[110011,110012]" },
                      { id: "mumbai-ecda=[110011,110012]", name: "mumbai-ecda=[110011,110012]" },
                    ]}
                    apiParams={apiParams}
                    validate={requiredValidate}
                    disabled={memoizedIsView}
                    autoCompleteClass={niftyClasses.disableBorder}
                    multipleSelect
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="currency"
                    source="currency"
                    label={translate("currency")}
                    variant="standard"
                    margin="normal"
                    validate={requiredValidate}
                    choices={currencyOptions}
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="shippingRateTypeConfig"
                    source="shippingRateTypeConfig"
                    label={translate("carrierShippingPriceMaster.shipping_rate_type_configuration")}
                    variant="standard"
                    margin="normal"
                    validate={requiredValidate}
                    choices={shippingRateTypeConfigOptions}
                    className={`${classes.basicField} ${niftyClasses.disableBorder}`}
                    onChange={(e) => {
                      const updateState = {
                        ...states,
                        open: true,
                        isConfig: true,
                        currentConfig: e.target.value,
                      };
                      setState(updateState);
                      rest.form.mutators?.setFieldValue("shippingRateTypeConfig", states.configVal);
                    }}
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="shippingMethodName"
                    label={translate("carrierShippingPriceMaster.shipping_method_name")}
                    data-test-id="shippingMethodName"
                    apiParams={{
                      type: "getData",
                      url: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/shippingmethods`,
                    }}
                    validate={requiredValidate}
                    disabled={memoizedIsView}
                    autoCompleteClass={niftyClasses.disableBorder}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                className={commonClasses.customMargin}
                md={12}
              >
                {memoizedIsView ? (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <TextInput
                      disabled
                      source="timeSlot"
                      autoComplete="off"
                      variant="standard"
                      margin="normal"
                      label={translate("carrierShippingPriceMaster.time_slot")}
                      className={niftyClasses.disableBorder}
                    />
                  </Grid>
                ) : (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <CustomAutoComplete
                      multipleSelect
                      source="timeSlot"
                      label={translate("carrierShippingPriceMaster.time_slot")}
                      data-test-id="timeSlot"
                      apiParams={apiParams}
                      onOpen
                      validate={requiredValidate}
                      autoCompleteClass={niftyClasses.disableBorder}
                      defaultOptions={[
                        { id: "6699787", name: "tests category" },
                        { id: "14469204", name: "testStatistics" },
                        { id: "14467979", name: "testStats" },
                      ]}
                      selectAll
                    />
                  </Grid>
                )}
              </Grid>
              <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={3}>
                <Grid
                  item
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  className={commonClasses.customMargin}
                  xs
                >
                  {memoizedIsView ? (
                    <>
                      <Typography variant="caption">{translate("carrierShippingPriceMaster.is_enabled")}</Typography>
                      <Grid item className={commonClasses.disableButton}>
                        <SwitchComp disable record={initialState.isEnabled} />
                      </Grid>
                    </>
                  ) : (
                    <BooleanInput
                      data-test-id="isEnabled"
                      label={translate("carrierShippingPriceMaster.is_enabled")}
                      source="isEnabled"
                      className={niftyClasses.basicSwitchButton}
                    />
                  )}
                </Grid>
              </Grid>
              <FormDataConsumer>
                {({ formData }) => (
                  <>
                    <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={12}>
                      <Button
                        variant="outlined"
                        color="default"
                        endIcon={states.iconState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={handleConfigForm}
                        disabled={!formData?.shippingRateType}
                      >
                        {translate("carrierShippingPriceMaster.manage_shipment_rate_type_configuration")}
                      </Button>
                    </Grid>
                    <Grid style={{ padding: "20px 0px 20px 20px" }}>
                      {formData?.shippingRateType && states.configValidation && (
                        <span className={classes.errorClass}>
                          {translate("carrierShippingPriceMaster.validation_message")}
                        </span>
                      )}
                    </Grid>
                  </>
                )}
              </FormDataConsumer>
              <div className={!states.iconState ? classes.hiddenConfig : undefined}>
                {states.configVal === SHIPPING_TYPE_CONFIG.SINGLE_TIERED ? (
                  <SingleTieredConfiguration formRef={rest.form} mode={mode} />
                ) : (
                  <MultiTieredConfiguration
                    sourceName="configList"
                    addConfig={onAddConfig}
                    deleteConfig={onDeleteConfig}
                    formRef={rest.form}
                    mode={mode}
                  />
                )}
              </div>
              <Box display="flex" mt="1em">
                <Button variant="outlined" color="default" onClick={cancelHandler}>
                  {memoizedIsView ? translate("back") : translate("cancel")}
                </Button>
                {!memoizedIsView && (
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => {
                      handleSubmitWithRedirectEvent(rest.form, handleSubmitWithRedirect);
                    }}
                  >
                    {memoizedIsCreate ? translate("add") : translate("update")}
                  </Button>
                )}
              </Box>
              {setFormReference(rest.form)}
            </form>
          )}
        />
      </>
    );
  };

  /**
   * @function handleActionAfterSubmit function called after confirmation
   */
  const handleActionAfterSubmit = () => {
    if (states.isConfig) {
      formReference.current.mutators?.setFieldValue("shippingRateTypeConfig", states.currentConfig);
      if (states.currentConfig === "Single Tiered") {
        formReference.current.mutators?.setFieldValue("shippingRateType", "Flat Rate");
      } else {
        formReference.current.mutators?.resetFieldValue("shippingRateType");
      }
      formReference.current.mutators?.setFieldValue("configList", [{ ...INITIAL_SHIPPING_CONFIG }]);
      formReference.current.mutators?.setFieldValue("singleTieredConfig", { rate: "", isEnabled: true });
      const updateState = {
        ...states,
        shippingRateOptions: shippingRateTypes(formReference.current),
        configVal: states.currentConfig,
        iconState: false,
        open: false,
      };
      setState(updateState);
    } else {
      const updateState = {
        ...states,
        open: false,
      };
      setState(updateState);
      handleAction(states.input);
    }
  };

  /**
   * @function handleCloseEvent function called after modal cancel click
   */
  const handleCloseEvent = () => {
    if (states.isConfig) {
      formReference.current.mutators?.setFieldValue("shippingRateTypeConfig", states.configVal);
      const updateStates = {
        ...states,
        isConfig: false,
      };
      setState(updateStates);
    }
    const updateState = {
      ...states,
      open: false,
    };
    setState(updateState);
  };

  /**
   * @function historyHandler to redirect to history page
   */
  const historyHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/carrier-shipping-price-master/con_01/history`);
  });

  const modalMessage = memoizedIsCreate
    ? translate("carrierShippingPriceMaster.create_modal_message")
    : translate("carrierShippingPriceMaster.update_modal_message");
  const modalDeleteMessage = translate("carrierShippingPriceMaster.delete_modal_message");
  const configMessage = translate("carrierShippingPriceMaster.config_modal_message");

  /**
   * @function modeBasedModalMessages function to return messages based on mode
   * @returns {string} returns confirmation messages
   */
  const modeBasedModalMessages = () => (memoizedIsView ? modalDeleteMessage : modalMessage);

  return (
    <>
      <CustomBreadCrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid className={commonClasses.gridStyle} item>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {memoizedIsCreate ? translate("carrierShippingPriceMaster.new_shipment_rate") : pageTitle}
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
      <Divider variant="fullWidth" className={commonClasses.customMargin} />
      {carrierShippingForm()}
      <SimpleModal
        openModal={states.open}
        dialogContent={<CommonDialogContent message={states.isConfig ? configMessage : modeBasedModalMessages()} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={handleCloseEvent}
        handleAction={handleActionAfterSubmit}
      />
    </>
  );
};

CarrierShippingMasterForm.propTypes = {
  mode: PropTypes.string.isRequired,
  handleAction: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.any),
  pageTitle: PropTypes.string,
};
CarrierShippingMasterForm.defaultProps = {
  initialState: {},
  handleAction: () => {
    /* comment */
  },
  pageTitle: "",
};
export default React.memo(CarrierShippingMasterForm);
