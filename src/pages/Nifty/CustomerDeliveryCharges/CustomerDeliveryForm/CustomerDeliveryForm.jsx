/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  useRedirect,
  TextInput,
  FormWithRedirect,
  required,
  BooleanInput,
  SelectInput,
  NumberInput,
  FormDataConsumer,
  regex,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Divider, makeStyles, Box, Button, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import useCommonStyles from "../../../../assets/theme/common";
import SimpleModal from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { handleInvalidCharsInNumberInput } from "../../../../utils/validationFunction";
import CustomAutoComplete from "../../../../components/CustomAutoComplete";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import SwitchComp from "../../../../components/switch";
import { NIFTY_PAGE_TYPE, configCodeRegex, positiveValidate } from "../../niftyConfig";
import useNiftyStyles from "../../niftyStyle";

const requiredValidate = required();

const useStyles = makeStyles(() => ({
  customMargin: {
    marginBottom: "20px",
  },
}));

const additionFilterDomain = [
  {
    fieldName: "TagTypeId",
    operatorName: "Like",
    fieldValue: "D",
  },
];

const domainApiParams = {
  fieldName: "tagName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
  sortParam: "tagName",
  fieldId: "tagId",
};

const timeSlotOptions = [
  { id: "8pm-9pm", name: "8pm-9pm" },
  { id: "9pm-10pm", name: "9pm-10pm" },
  { id: "10pm-11pm", name: "10pm-11pm" },
  { id: "11pm-12am", name: "11pm-12am" },
];

/**
 * Customer Delivery Charges create component
 *
 * @param {object} props form data
 * @returns {React.ReactElement} create customer delivery charges
 */
const CustomerDeliveryChargesForm = (props) => {
  const { initialState, onSave, mode, pageTitle } = props;
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  const niftyClasses = useNiftyStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [open, toggleModal] = useState(false);
  const history = useHistory();
  const [input, setInput] = useState(initialState);
  const [currencyOptions, setCurrencyOptions] = useState(input?.currencyOptions);
  const configCodeValidationMsg = translate("customerDeliveryCharges.config_code_validation_msg");
  const validateConfigCode = regex(configCodeRegex, configCodeValidationMsg);
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode, NIFTY_PAGE_TYPE]);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode, NIFTY_PAGE_TYPE]);
  const breadcrumbs = [
    {
      displayName: translate("customerDeliveryCharges.customer_delivery_charges"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/create`,
    },
    { displayName: memoizedIsCreate ? translate("customerDeliveryCharges.new_customer_delivery_charges") : pageTitle },
  ];

  const apiParams = {
    fieldName: "categoryName",
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
    sortParam: "categoryName",
    fieldId: "categoryId",
  };

  /**
   * @function cancelHandler to redirect back to listing page
   */
  const cancelHandler = () => {
    history.goBack();
  };

  /**
   * @function saveCustomerDeliveryCharges function called on click of Add button
   * @param {object} deliveryChargeObj updated input values
   */
  const saveCustomerDeliveryCharges = (deliveryChargeObj) => {
    setInput({ ...input, ...deliveryChargeObj });
    toggleModal(true);
  };

  /**
   * @function handleActionAfterSubmit function called to create new customer delivery charges
   */
  const handleActionAfterSubmit = () => {
    if (!memoizedIsView) {
      onSave(input);
    } else {
      redirect(`/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges`);
    }
    toggleModal(false);
  };

  /**
   * @function handleRedirectEdit to redirect to edit page
   */
  const handleRedirectToEdit = () => {
    redirect(`/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/U_04710`);
  };

  const customerDeliveryChargesMutator = {
    resetFieldValue: (args, state, utils) => {
      if (
        args[1] !==
        `${
          typeof state.formState.values.domain === "object"
            ? state?.formState?.values?.domain?.name
            : state?.formState?.values?.domain
        }`
      ) {
        utils.changeValue(state, args[0], () => "");
      }
    },
    setFieldValue: (args, state, utils) => {
      if (args[1]) {
        utils.changeValue(state, args[0], () => args[2]);
      }
    },
    setCurrencyOptions: (args, state, utils) => {
      utils.changeValue(state, args[0], () => [...args[1]]);
    },
  };

  /**
   * @function getCurrencyValue update currency field value and options
   * @param {object} formData form Data
   * @param {string} value input value
   */
  const getCurrencyValue = (formData, value) => {
    const opt = [
      { id: "INR", name: "INR" },
      { id: "USA", name: "USA" },
    ];

    setCurrencyOptions([...opt]);

    if (currencyOptions?.length === 1) {
      formData.mutators.setFieldValue("currency", value, currencyOptions[0].name);
    } else formData.mutators.resetFieldValue("currency", value);
  };

  /**
   * @function historyHandler to redirect to history page
   */
  const historyHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/con_01/history`);
  });

  /**
   *@function formRenderer input form for customer delivery charges
   *@returns {React.ReactElement} create form
   */
  const formRenderer = () => {
    return (
      <>
        <FormWithRedirect
          save={saveCustomerDeliveryCharges}
          mutators={customerDeliveryChargesMutator}
          record={input}
          render={({ handleSubmitWithRedirect, ...rest }) => (
            <form>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                md={memoizedIsView ? 12 : 9}
                className={memoizedIsView ? commonClasses.customMargin : ""}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="domain"
                    label={translate("domain")}
                    data-test-id="domain"
                    apiParams={domainApiParams}
                    validate={requiredValidate}
                    additionalFilter={additionFilterDomain}
                    onSearchInputChange={(value) => {
                      if (typeof value === "string") {
                        rest.form.mutators.resetFieldValue("geo", value);
                        getCurrencyValue(rest.form, value);
                      }
                    }}
                    disabled={memoizedIsView}
                    autoCompleteClass={memoizedIsView ? niftyClasses.disableBorder : ""}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <CustomAutoComplete
                        label={translate("geo")}
                        data-test-id="geo"
                        source="geo"
                        disabled={!formData?.domain || memoizedIsView}
                        apiParams={{
                          fieldName: "geoName",
                          type: "getData",
                          url: `${window.REACT_APP_GALLERIA_SERVICE}/geographies?domainId=${
                            typeof formData?.domain === "object" ? formData?.domain?.id : formData?.domain
                          }`,
                          sortParam: "tagName",
                          fieldId: "geoId",
                        }}
                        validate={requiredValidate}
                        autoCompleteClass={memoizedIsView ? niftyClasses.disableBorder : ""}
                      />
                    )}
                  </FormDataConsumer>
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <TextInput
                    source="configurationCode"
                    label={translate("customerDeliveryCharges.configuration_code")}
                    className={`${niftyClasses.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                    data-test-id="configurationCode"
                    validate={[validateConfigCode, requiredValidate]}
                    autoComplete="off"
                    variant="standard"
                    disabled={memoizedIsView}
                    margin="normal"
                  />
                </Grid>
                {memoizedIsView && (
                  <Grid item container direction="row" justify="flex-end" alignItems="flex-start" xs>
                    <IconButton data-at-id="edit_button" onClick={handleRedirectToEdit}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton data-at-id="delete_button" onClick={() => toggleModal(true)}>
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
                justify="space-between"
                className={commonClasses.customMargin}
                md={9}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="geoGroup"
                    label={translate("geo_group")}
                    data-test-id="geoGroup"
                    apiParams={domainApiParams}
                    validate={requiredValidate}
                    additionalFilter={[
                      {
                        fieldName: "TagTypeId",
                        operatorName: "Like",
                        fieldValue: "C",
                      },
                    ]}
                    disabled={memoizedIsView}
                    autoCompleteClass={memoizedIsView ? niftyClasses.disableBorder : ""}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="shippingMethodName"
                    label={translate("customerDeliveryCharges.shipping_method_name")}
                    data-test-id="shippingMethodName"
                    apiParams={domainApiParams}
                    additionalFilter={[
                      {
                        fieldName: "TagTypeId",
                        operatorName: "Like",
                        fieldValue: "C",
                      },
                    ]}
                    validate={requiredValidate}
                    disabled={memoizedIsView}
                    autoCompleteClass={memoizedIsView ? niftyClasses.disableBorder : ""}
                  />
                </Grid>
                {memoizedIsView ? (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <TextInput
                      disabled
                      source="productType"
                      variant="standard"
                      margin="normal"
                      validate={requiredValidate}
                      label={translate("customerDeliveryCharges.product_type")}
                      className={niftyClasses.disableBorder}
                    />
                  </Grid>
                ) : (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <CustomAutoComplete
                      multipleSelect
                      source="productType"
                      label={translate("customerDeliveryCharges.product_type")}
                      data-test-id="productType"
                      apiParams={domainApiParams}
                      validate={requiredValidate}
                      additionalFilter={[
                        {
                          fieldName: "TagTypeId",
                          operatorName: "Like",
                          fieldValue: "PT",
                        },
                      ]}
                      disabled={memoizedIsView}
                      // selectAll
                    />
                  </Grid>
                )}
              </Grid>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                className={memoizedIsView ? commonClasses.customMargin : classes.customMargin}
                md={9}
              >
                {memoizedIsView ? (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <TextInput
                      disabled
                      source="timeSlot"
                      variant="standard"
                      margin="normal"
                      validate={requiredValidate}
                      label={translate("customerDeliveryCharges.time_slot")}
                      className={niftyClasses.disableBorder}
                    />
                  </Grid>
                ) : (
                  <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <CustomAutoComplete
                      multipleSelect
                      source="timeSlot"
                      label={translate("customerDeliveryCharges.time_slot")}
                      data-test-id="timeSlot"
                      apiParams={apiParams}
                      validate={requiredValidate}
                      defaultOptions={timeSlotOptions}
                      disabled={memoizedIsView}
                      selectAll
                    />
                  </Grid>
                )}
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <NumberInput
                    source="customerDeliveryCharges"
                    label={translate("customerDeliveryCharges.customer_delivery_charges")}
                    variant="standard"
                    data-test-id="customerDeliveryCharges"
                    validate={[requiredValidate, positiveValidate("NUMBER SHOULD BE +Ve")]}
                    className={commonClasses.numberInputField}
                    onKeyDown={handleInvalidCharsInNumberInput}
                    autoComplete="Off"
                    margin="normal"
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <SelectInput
                    data-test-id="currency"
                    source="currency"
                    label={translate("currency")}
                    variant="standard"
                    margin="normal"
                    validate={required()}
                    choices={currencyOptions}
                    className={`${niftyClasses.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                    disabled={currencyOptions?.length <= 1 || memoizedIsView}
                  />
                </Grid>
              </Grid>
              <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={9}>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  {memoizedIsView ? (
                    <>
                      <Typography variant="caption">{translate("customerDeliveryCharges.is_enabled")}</Typography>
                      <Grid item className={commonClasses.disableButton}>
                        <SwitchComp disable record={initialState.isEnabled} />
                      </Grid>
                    </>
                  ) : (
                    <BooleanInput
                      data-test-id="isEnabled"
                      label={translate("customerDeliveryCharges.is_enabled")}
                      source="isEnabled"
                      className={niftyClasses.basicSwitchButton}
                    />
                  )}
                </Grid>
              </Grid>
              <Box display="flex" mt="1em" className={memoizedIsView ? commonClasses.customMargin : ""}>
                <Button variant="outlined" color="default" onClick={cancelHandler}>
                  {memoizedIsView ? translate("back") : translate("cancel")}
                </Button>
                {!memoizedIsView && (
                  <Button variant="contained" color="default" onClick={handleSubmitWithRedirect}>
                    {memoizedIsCreate ? translate("add") : translate("update")}
                  </Button>
                )}
              </Box>
            </form>
          )}
        />
      </>
    );
  };

  const pageHeader = memoizedIsCreate ? translate("customerDeliveryCharges.new_customer_delivery_charges") : pageTitle;
  const modalMessage = memoizedIsCreate
    ? translate("customerDeliveryCharges.create_modal_message")
    : translate("customerDeliveryCharges.update_modal_message");
  const modalDeleteMessage = translate("customerDeliveryCharges.delete_modal_message");

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid className={commonClasses.gridStyle} item>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {pageHeader}
          </Typography>
        </Grid>
        {(memoizedIsView || (!memoizedIsCreate && !memoizedIsView)) && (
          <Grid item>
            <Button variant="outlined" color="default" onClick={historyHandler}>
              {translate("View History")}
            </Button>
          </Grid>
        )}
      </Grid>
      <Divider variant="fullWidth" className={classes.customMargin} />
      {formRenderer()}
      <SimpleModal
        openModal={open}
        dialogContent={<CommonDialogContent message={memoizedIsView ? modalDeleteMessage : modalMessage} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={() => toggleModal(false)}
        handleAction={handleActionAfterSubmit}
      />
    </>
  );
};

CustomerDeliveryChargesForm.propTypes = {
  mode: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.any),
  pageTitle: PropTypes.string,
};
CustomerDeliveryChargesForm.defaultProps = {
  onSave: () => {
    /* comment */
  },
  initialState: {},
  pageTitle: "",
};

export default React.memo(CustomerDeliveryChargesForm);
