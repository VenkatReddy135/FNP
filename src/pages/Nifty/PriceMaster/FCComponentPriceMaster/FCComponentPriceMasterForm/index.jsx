/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  TextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  required,
  useTranslate,
  useRedirect,
  FormWithRedirect,
  SelectInput,
  FormDataConsumer,
} from "react-admin";
import { Typography, Grid, Divider, makeStyles, IconButton, Button, Box } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SimpleModal from "../../../../../components/CreateModal";
import useCommonStyles from "../../../../../assets/theme/common";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import CustomAutoComplete from "../../../../../components/CustomAutoComplete";
import SwitchComp from "../../../../../components/switch";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { handleInvalidCharsInNumberInput } from "../../../../../utils/validationFunction";
import { NIFTY_PAGE_TYPE, positiveValidate, rangeValidate } from "../../../niftyConfig";
import useNiftyStyles from "../../../niftyStyle";

const useStyles = makeStyles(() => ({
  hiddenConfig: {
    visibility: "hidden",
    width: 0,
    height: 0,
  },
}));

const domainApiParams = {
  fieldName: "tagName",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
  sortParam: "tagName",
  fieldId: "tagId",
};
const requiredValidate = required();

const geoOptions = [
  { id: "INDIA", name: "INDIA" },
  { id: "USA", name: "USA" },
];

const componentNameOptions = [
  { id: "Red-Roses", name: "Red-Roses" },
  { id: "Blue-Roses", name: "Blue-Roses" },
];

const fcNameOptions = [
  { id: "Delhi Flower Vendor", name: "Delhi Flower Vendor" },
  { id: "Mumbai Flower Vendor", name: "Mumbai Flower Vendor" },
];

/**
 * FC Component Price Rule Master component
 *
 * @param {object} props props required to render component
 * @returns {React.ReactElement} FC component price rule Master component
 */
const FCComponentPriceMasterForm = (props) => {
  const { initialState, handleAction, mode, pageTitle } = props;
  const formReference = useRef(null);
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode]);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode]);
  const commonClasses = useCommonStyles();
  const niftyClasses = useNiftyStyles();
  const classes = useStyles();
  const history = useHistory();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [open, toggleModal] = useState(false);
  const [input, setInput] = useState(initialState);

  const breadcrumbs = [
    {
      displayName: translate("fcComponentPriceMaster.fc_component_price_master"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/price-master`,
    },
    { displayName: memoizedIsCreate ? translate("fcComponentPriceMaster.new_fc_component_mapping") : pageTitle },
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
   * @function savePriceMasterData function called on click of Add button
   * @param {object} priceMasterObj updated input values
   */
  const savePriceMasterData = (priceMasterObj) => {
    setInput({ ...input, ...priceMasterObj });
    toggleModal(true);
  };

  /**
   * @function handleActionAfterSubmit function called to create new customer delivery charges
   */
  const handleActionAfterSubmit = () => {
    toggleModal(false);
    handleAction(input);
  };

  /**
   * @function handleRedirectEdit to redirect to edit page
   */
  const handleRedirectToEdit = () => {
    redirect(`/${window.REACT_APP_NIFTY_SERVICE}/price-master-details/fc-component-price-master/FC_1234`);
  };

  /**
   * Function cancelHandler to redirect back to previous page
   *
   * @function cancelHandler function to update status
   */
  const cancelHandler = () => {
    if (memoizedIsView) {
      history.push(`/${window.REACT_APP_NIFTY_SERVICE}/price-master`);
    } else {
      history.goBack();
    }
  };

  /**
   * @function historyHandler to redirect to history page
   */
  const historyHandler = useCallback(() => {
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/price-master-details/fc-component-price-master/FC_1234/history`);
  });

  const fcCompPriceMasterMutator = {
    setFieldValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
  };

  /**
   * @function getCurrencyValue update currency field value and options
   * @param {string} value input value
   */
  const getCurrencyValue = (value) => {
    if (typeof value !== "undefined") {
      if (value === "INDIA") {
        formReference.current.mutators.setFieldValue("currencyOptions", [{ id: "INR", name: "INR" }]);
      } else if (value === "USA") {
        formReference.current.mutators.setFieldValue("currencyOptions", [
          { id: "USD", name: "USD" },
          { id: "INR", name: "INR" },
        ]);
      } else {
        formReference.current.mutators.setFieldValue("currencyOptions", []);
      }

      if (!memoizedIsView && memoizedIsCreate) {
        if (formReference.current.getState().values.currencyOptions?.length === 1) {
          formReference.current.mutators.setFieldValue(
            "currency",
            formReference.current.getState()?.values?.currencyOptions[0]?.name,
          );
        } else formReference.current.mutators.setFieldValue("currency", "");
      }
    }
  };

  /**
   * @function onFcInputChange to handle onchange event
   * @param {string} value selected value
   * @param {object} event event object
   */
  const onFcInputChange = (value, event) => {
    if (typeof value !== "undefined" && (event?.type === "click" || event?.type === "change")) {
      formReference.current.mutators.setFieldValue("fcGroupId", "FC_0021");
    }
  };

  const pageHeader = memoizedIsCreate ? translate("fcComponentPriceMaster.new_fc_component_mapping") : pageTitle;
  const modalMessage = memoizedIsCreate
    ? translate("fcComponentPriceMaster.create_modal_message")
    : translate("fcComponentPriceMaster.update_modal_message");
  const modalDeleteMessage = translate("fcComponentPriceMaster.delete_modal_message");

  return (
    <div data-test-id="createPage">
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
      <Divider variant="fullWidth" className={commonClasses.customMargin} />
      <Grid>
        <FormWithRedirect
          save={savePriceMasterData}
          mutators={fcCompPriceMasterMutator}
          record={input}
          render={({ handleSubmitWithRedirect, ...rest }) => (
            <form>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                className={commonClasses.customMargin}
                justify="space-between"
                md={!memoizedIsView ? 9 : 12}
              >
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="fulFillmentGeo"
                    label={translate("fcComponentPriceMaster.fulfillment_geo")}
                    data-test-id="fulFillmentGeo"
                    apiParams={domainApiParams}
                    defaultOptions={geoOptions}
                    onSearchInputChange={getCurrencyValue}
                    validate={requiredValidate}
                    autoCompleteClass={commonClasses.autoCompleteItem}
                    disabled={!memoizedIsCreate}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <CustomAutoComplete
                    source="fcGroupName"
                    label={translate("fcComponentPriceMaster.fc_group_name")}
                    data-test-id="fcGroupName"
                    defaultOptions={fcNameOptions}
                    onSearchInputChange={onFcInputChange}
                    apiParams={domainApiParams}
                    validate={requiredValidate}
                    autoCompleteClass={commonClasses.autoCompleteItem}
                    disabled={!memoizedIsCreate}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <TextInput
                    disabled
                    source="fcGroupId"
                    data-test-id="fcGroupId"
                    label={translate("fcComponentPriceMaster.fc_group_id")}
                    variant="standard"
                    margin="normal"
                    className={`${niftyClasses.basicField} ${niftyClasses.disableBorder}`}
                  />
                </Grid>

                {memoizedIsView && (
                  <Grid item style={{ paddingLeft: "265px" }}>
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
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={4}>
                  <CustomAutoComplete
                    source="componentName"
                    label={translate("fcComponentPriceMaster.component_name")}
                    data-test-id="componentName"
                    defaultOptions={componentNameOptions}
                    apiParams={domainApiParams}
                    validate={requiredValidate}
                    autoCompleteClass={commonClasses.autoCompleteItem}
                    disabled={!memoizedIsCreate}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={4}>
                  <NumberInput
                    label={translate("price")}
                    data-test-id="price"
                    source="price"
                    validate={[
                      requiredValidate,
                      positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                    ]}
                    onKeyDown={handleInvalidCharsInNumberInput}
                    autoComplete="Off"
                    variant="standard"
                    margin="normal"
                    disabled={memoizedIsView}
                    className={`${commonClasses.numberInputField} ${niftyClasses.basicField}`}
                  />
                </Grid>
                <FormDataConsumer>
                  {({ formData }) => (
                    <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs={4}>
                      <SelectInput
                        data-test-id="currency"
                        source="currency"
                        label={translate("currency")}
                        variant="standard"
                        validate={requiredValidate}
                        choices={formData?.currencyOptions}
                        className={`${niftyClasses.basicField} ${niftyClasses.disableBorder}`}
                        disabled={formData?.currencyOptions?.length <= 1 || !memoizedIsCreate}
                        margin="normal"
                      />
                    </Grid>
                  )}
                </FormDataConsumer>
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
                  {memoizedIsView ? (
                    <>
                      <Typography variant="caption">{translate("status")}</Typography>
                      <Grid item className={commonClasses.disableButton}>
                        <SwitchComp disable record={initialState.status} />
                      </Grid>
                    </>
                  ) : (
                    <BooleanInput
                      source="status"
                      data-test-id="status"
                      label={translate("status")}
                      className={niftyClasses.basicSwitchButton}
                    />
                  )}
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <DateInput
                    source="fromDate"
                    data-test-id="fromDate"
                    label={translate("from_date")}
                    margin="normal"
                    variant="standard"
                    validate={requiredValidate}
                    className={`${niftyClasses.basicField} ${niftyClasses.disableBorder}`}
                    disabled={!memoizedIsCreate}
                  />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <DateInput
                    source="toDate"
                    data-test-id="toDate"
                    label={translate("to_date")}
                    margin="normal"
                    variant="standard"
                    validate={rangeValidate(rest?.form, translate("to_date_validation_message"), "fromDate")}
                    className={`${niftyClasses.basicField} ${niftyClasses.disableBorder} ${
                      memoizedIsView && !input.toDate && classes.hiddenConfig
                    }`}
                    disabled={memoizedIsView}
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
      </Grid>
      <SimpleModal
        openModal={open}
        dialogContent={<CommonDialogContent message={memoizedIsView ? modalDeleteMessage : modalMessage} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={() => toggleModal(false)}
        handleAction={handleActionAfterSubmit}
      />
    </div>
  );
};

FCComponentPriceMasterForm.propTypes = {
  mode: PropTypes.string.isRequired,
  handleAction: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.any),
  pageTitle: PropTypes.string,
};
FCComponentPriceMasterForm.defaultProps = {
  handleAction: () => {
    /* comment */
  },
  initialState: {},
  pageTitle: "",
};

export default React.memo(FCComponentPriceMasterForm);
