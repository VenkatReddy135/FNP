/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  TextInput,
  useRedirect,
  FormWithRedirect,
  SelectInput,
  required,
  FormDataConsumer,
  regex,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Divider, makeStyles, Box, Button, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useCommonStyles from "../../../../../assets/theme/common";
import SimpleModal from "../../../../../components/CreateModal";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import GenericRadioGroup from "../../../../../components/RadioGroup";
import CustomAutoComplete from "../../../../../components/CustomAutoComplete";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import DateTimeInput from "../../../../../components/CustomDateTimeV2";
import { getFormattedTimeValue, getFormattedDate } from "../../../../../utils/formatDateTime";
import { NIFTY_PAGE_TYPE, priceRuleNameRegex, overrideTypeRegex } from "../../../niftyConfig";
import useNiftyStyles from "../../../niftyStyle";

const requiredValidate = required();

const ruleAppliedOnOptions = [
  { id: "Component Names", name: "Component Names" },
  { id: "Component Groups", name: "Component Groups" },
];

const RULE_APPLIED_ON_MAPPING = {
  NAME: "Component Names",
  GROUP: "Component Groups",
};

const overrideTypeOptions = [
  { id: "Flat Amount Update", name: "Flat Amount Update" },
  { id: "Percent Update", name: "Percent Update" },
];

const OVERRIDE_TYPE_MAPPING = {
  FLAT: "Flat Amount Update",
  PERCENT: "Percent Update",
};

const useStyles = makeStyles(() => ({
  basicField: {
    width: "300px",
  },
  customMargin: {
    marginBottom: "20px",
  },
  editIconAlignment: {
    marginLeft: "17rem",
  },
}));

const apiParams = {
  fieldName: "categoryName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
  sortParam: "categoryName",
  fieldId: "categoryId",
};

const geoApiParams = {
  fieldName: "countryName",
  type: "getData",
  url: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
  sortParam: "countryName",
  fieldId: "countryId",
};

const apiParamsForName = {
  fieldName: "categoryName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
  sortParam: "categoryName",
  fieldId: "categoryId",
};

const apiParamsForGroup = {
  fieldName: "categoryName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
  sortParam: "categoryName",
  fieldId: "categoryId",
};

/**
 * Component Price Rule Manager component
 *
 * @param {*} props object expected to display this component
 * @returns {React.ReactElement} component price rule manager component
 */
const ComponentPriceRuleManagerForm = (props) => {
  const { initialState, onSave, mode, pageTitle } = props;
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  const formReference = useRef(null);
  const niftyClasses = useNiftyStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [input, setInput] = useState(initialState);
  const [dateTimeValue, setDateTimeValue] = useState({
    fromDate: initialState.fromDate || null,
    toDate: initialState.toDate || null,
  });
  const [open, toggleModal] = useState(false);
  const history = useHistory();
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode, NIFTY_PAGE_TYPE]);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode, NIFTY_PAGE_TYPE]);
  const validationMessage = translate("componentPriceRuleManager.price_rule_name_validation");
  const validatePriceRuleName = regex(priceRuleNameRegex, validationMessage);
  const errorMessage = translate("componentPriceRuleManager.override_type_validation");
  const validateOverrideType = regex(overrideTypeRegex, errorMessage);

  const breadcrumbs = [
    {
      displayName: translate("componentPriceRuleManager.price_rule_title"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/price-master`,
    },
    { displayName: memoizedIsCreate ? translate("componentPriceRuleManager.new_price_rule") : pageTitle },
  ];

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
   * @function cancelHandler to redirect back to price-master page
   */
  const cancelHandler = useCallback(() => {
    if (memoizedIsView) {
      history.push(`/${window.REACT_APP_NIFTY_SERVICE}/price-master`);
    } else {
      history.goBack();
    }
  });

  /**
   * @function handleDateChange function to update the local state of date
   * @param {object} event event data for current input
   */
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const dateValue = getFormattedDate(value);
    const timeValue = getFormattedTimeValue(new Date(value));
    setDateTimeValue({
      ...dateTimeValue,
      [name]: `${dateValue}T${timeValue}`,
    });
  };

  const componentPriceRuleMutator = {
    resetFieldValue: (args, state, utils) => {
      if (args[1] !== state.formState.values.fulfillmentGeo?.name) {
        utils.changeValue(state, args[0], () => "");
      }
    },
    setFieldValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
    resetOverrideValues: (args, state, utils) => {
      utils.changeValue(state, args[0], () => "");
    },
    resetRuleAppliedOn: (args, state, utils) => {
      utils.changeValue(state, args[0], () => "");
    },
    setCurrencyOptions: (args, state, utils) => {
      utils.changeValue(state, args[0], () => [...args[1]]);
    },
  };

  const currencyResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms?uomType=CURRENCY`;

  useCustomQueryWithStore("getData", currencyResource, (res) => {
    const response = res?.data?.data || [];
    const listOfCurrency = [];
    response.forEach((data) => {
      listOfCurrency.push({ id: data.uomId, name: data.uomId });
    });
    formReference.current.mutators.setCurrencyOptions("currencyOptions", listOfCurrency);
  });

  /**
   * @function getCurrencyValue update currency field value and options
   * @param {object} formData form Data
   * @param {string} value input value
   */
  const getCurrencyValue = (formData, value) => {
    if (!memoizedIsView && memoizedIsCreate) {
      if (formData?.getState()?.values?.currencyOptions?.length === 1) {
        formData.mutators.setFieldValue("currency", formData.getState()?.values?.currencyOptions[0]?.name);
      } else formData.mutators.resetFieldValue("currency", value);
    }
  };

  /**
   * @function saveComponentPriceRuleManager function called on click of Add button
   * @param {object} priceRuleObj updated input values
   */
  const saveComponentPriceRuleManager = useCallback((priceRuleObj) => {
    setInput({ ...input, ...priceRuleObj });
    toggleModal(true);
  });

  /**
   * @function handleActionAfterSubmit function called to create new component price rule manager model
   */
  const handleActionAfterSubmit = useCallback(() => {
    toggleModal(false);
    onSave(input);
  });

  /**
   * @function handleRedirectToEdit to redirect to edit page
   */
  const handleRedirectToEdit = useCallback(() => {
    redirect(`/${window.REACT_APP_NIFTY_SERVICE}/price-master-details/component-price-rule-manager/rule_1`);
  });

  /**
   *@function inputForm input form for component price rule manager
   *@returns {React.ReactElement} create form
   */
  const inputForm = () => {
    return (
      <>
        <FormWithRedirect
          save={saveComponentPriceRuleManager}
          mutators={componentPriceRuleMutator}
          record={input}
          render={({ handleSubmitWithRedirect, ...rest }) => (
            <form>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                md={12}
                className={memoizedIsView ? classes.customMargin : ""}
              >
                <Grid
                  item
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  md={memoizedIsView ? 3 : 4}
                >
                  <TextInput
                    source="ruleName"
                    label={translate("componentPriceRuleManager.rule_name")}
                    data-test-id="ruleName"
                    validate={[validatePriceRuleName, requiredValidate]}
                    autoComplete="off"
                    variant="standard"
                    margin="normal"
                    disabled={memoizedIsView}
                    className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  md={memoizedIsView ? 3 : 4}
                >
                  <CustomAutoComplete
                    label={translate("componentPriceRuleManager.fulfillment_geo")}
                    data-test-id="fulfillmentGeo"
                    source="fulfillmentGeo"
                    apiParams={geoApiParams}
                    validate={!memoizedIsView && requiredValidate}
                    onSearchInputChange={(value) => {
                      if (value) {
                        getCurrencyValue(rest?.form, value);
                      }
                    }}
                    autoCompleteClass={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                    disabled={memoizedIsView}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  md={memoizedIsView ? 3 : 4}
                >
                  <CustomAutoComplete
                    multipleSelect
                    source="FCGroupId"
                    label={translate("componentPriceRuleManager.fc_group_id")}
                    data-test-id="FCGroupId"
                    apiParams={apiParams}
                    onOpen
                    validate={requiredValidate}
                    disabled={memoizedIsView}
                    autoCompleteClass={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                    defaultOptions={[
                      { id: "6699787", name: "FC_123" },
                      { id: "14469204", name: "FC_456" },
                      { id: "14467979", name: "FC_789" },
                    ]}
                    selectAll
                  />
                </Grid>
                {memoizedIsView && (
                  <Grid item direction="column" justify="flex-start" alignItems="flex-start" md={3}>
                    <IconButton
                      data-at-id="edit_button"
                      className={classes.editIconAlignment}
                      onClick={handleRedirectToEdit}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
              <FormDataConsumer>
                {({ formData }) => (
                  <>
                    {!memoizedIsView && (
                      <Grid direction="row" container spacing={2}>
                        <Grid item xs={4}>
                          <GenericRadioGroup
                            data-test-id="ruleAppliedOn"
                            label={translate("componentPriceRuleManager.rule_applied_on")}
                            source="ruleAppliedOn"
                            validate={requiredValidate}
                            choices={ruleAppliedOnOptions}
                            editable
                            onChange={() => {
                              rest?.form?.mutators?.resetRuleAppliedOn("componentValues");
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <CustomAutoComplete
                            multipleSelect
                            source="componentValues"
                            data-test-id="componentValues"
                            label={
                              formData?.ruleAppliedOn === RULE_APPLIED_ON_MAPPING.NAME
                                ? translate("componentPriceRuleManager.component_name")
                                : translate("componentPriceRuleManager.component_group")
                            }
                            apiParams={
                              formData?.ruleAppliedOn === RULE_APPLIED_ON_MAPPING.NAME
                                ? apiParamsForName
                                : apiParamsForGroup
                            }
                            onOpen
                            validate={requiredValidate}
                            autoCompleteClass={classes.basicField}
                            defaultOptions={[
                              { id: "6699787", name: "flowers" },
                              { id: "14469204", name: "mugs" },
                              { id: "14467979", name: "covers" },
                            ]}
                            selectAll
                          />
                        </Grid>
                      </Grid>
                    )}
                    {memoizedIsView && (
                      <>
                        <Grid
                          item
                          container
                          direction="row"
                          alignItems="flex-start"
                          justify="space-between"
                          md={12}
                          className={memoizedIsView ? classes.customMargin : ""}
                        >
                          <Grid item md={3}>
                            <TextInput
                              disabled
                              data-test-id="ruleAppliedOn"
                              source="ruleAppliedOn"
                              label={translate("componentPriceRuleManager.rule_applied_on")}
                              variant="standard"
                              className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item md>
                            <TextInput
                              disabled
                              data-test-id="componentValues"
                              source="componentValues"
                              label={
                                formData?.ruleAppliedOn === RULE_APPLIED_ON_MAPPING.NAME
                                  ? translate("componentPriceRuleManager.component_name")
                                  : translate("componentPriceRuleManager.component_group")
                              }
                              variant="standard"
                              className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid
                      item
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="flex-start"
                      md={memoizedIsView ? 9 : 12}
                      className={memoizedIsView ? classes.customMargin : ""}
                    >
                      <Grid item container md={4}>
                        <DateTimeInput
                          source="fromDate"
                          data-test-id="fromDate"
                          label={translate("componentPriceRuleManager.from_date_time")}
                          className={classes.basicField}
                          onChange={handleDateChange}
                          validate={requiredValidate}
                          disabled={memoizedIsView}
                        />
                      </Grid>
                      <Grid item container md>
                        <DateTimeInput
                          source="toDate"
                          data-test-id="toDate"
                          label={translate("componentPriceRuleManager.to_date_time")}
                          className={classes.basicField}
                          onChange={handleDateChange}
                          validate={requiredValidate}
                          throwError={
                            dateTimeValue?.fromDate &&
                            dateTimeValue?.toDate &&
                            dateTimeValue?.fromDate >= dateTimeValue?.toDate
                              ? translate("componentPriceRuleManager.to_date_time_validation")
                              : ""
                          }
                          disabled={memoizedIsView}
                        />
                      </Grid>
                    </Grid>
                    <Grid item direction="row" container spacing={2} md={memoizedIsView ? 9 : 12}>
                      {!memoizedIsView && (
                        <>
                          <Grid item md={4}>
                            <GenericRadioGroup
                              data-test-id="override_type"
                              label={translate("componentPriceRuleManager.override_type")}
                              source="overrideType"
                              choices={overrideTypeOptions}
                              editable
                              onChange={() => {
                                rest?.form?.mutators?.resetOverrideValues("overrideValue");
                              }}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextInput
                              label={
                                formData?.overrideType === OVERRIDE_TYPE_MAPPING.FLAT
                                  ? translate("componentPriceRuleManager.flat_amount_update")
                                  : translate("componentPriceRuleManager.percent_update")
                              }
                              source="overrideValue"
                              data-test-id="overrideValue"
                              validate={[validateOverrideType, requiredValidate]}
                              className={`${commonClasses.numberInputField} ${classes.basicField}`}
                              autoComplete="off"
                              variant="standard"
                              margin="normal"
                            />
                          </Grid>
                        </>
                      )}
                      {memoizedIsView && (
                        <>
                          <Grid item md={4}>
                            <TextInput
                              disabled
                              source="overrideType"
                              data-test-id="override_type"
                              label={translate("componentPriceRuleManager.override_type")}
                              variant="standard"
                              className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item md>
                            <TextInput
                              disabled
                              source="overrideValue"
                              data-test-id="overrideValue"
                              label={
                                formData?.overrideType === OVERRIDE_TYPE_MAPPING.FLAT
                                  ? translate("componentPriceRuleManager.flat_amount_update")
                                  : translate("componentPriceRuleManager.percent_update")
                              }
                              variant="standard"
                              className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                              margin="normal"
                            />
                          </Grid>
                        </>
                      )}
                      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" md={4}>
                        <SelectInput
                          source="currency"
                          label={translate("currency")}
                          data-test-id="currency"
                          variant="standard"
                          validate={requiredValidate}
                          choices={[...rest?.form?.getState()?.values?.currencyOptions]}
                          className={`${classes.basicField} ${memoizedIsView && niftyClasses.disableBorder}`}
                          disabled={rest?.form?.getState()?.values?.currencyOptions?.length <= 1 || memoizedIsView}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </FormDataConsumer>
              <Grid
                item
                container
                direction="row"
                justify="space-between"
                className={classes.customMargin}
                alignItems="flex-start"
                md={9}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <TextInput
                    source="state"
                    label={translate("state")}
                    data-test-id="state"
                    variant="standard"
                    className={(classes.basicField, niftyClasses.disableBorder)}
                    margin="normal"
                    disabled
                  />
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
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/price-master-details/component-price-rule-manager/rule_1/history`);
  });

  const pageHeader = memoizedIsCreate ? translate("componentPriceRuleManager.new_price_rule") : pageTitle;
  const modalMessage = memoizedIsCreate
    ? translate("componentPriceRuleManager.create_modal_message")
    : translate("componentPriceRuleManager.update_modal_message");

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
              {translate("view_history")}
            </Button>
          </Grid>
        )}
      </Grid>
      <Divider variant="fullWidth" className={classes.customMargin} />
      {inputForm()}
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

ComponentPriceRuleManagerForm.propTypes = {
  mode: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.any),
  pageTitle: PropTypes.string,
};
ComponentPriceRuleManagerForm.defaultProps = {
  onSave: () => {
    /* comment */
  },
  initialState: {},
  pageTitle: "",
};

export default React.memo(ComponentPriceRuleManagerForm);
