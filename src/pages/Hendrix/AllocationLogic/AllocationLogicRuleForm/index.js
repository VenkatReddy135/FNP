import React, { useState } from "react";
import { Box, Grid, Divider, Typography } from "@material-ui/core";
import {
  useTranslate,
  SimpleForm,
  DateInput,
  SaveButton,
  useNotify,
  required,
  useDataProvider,
  SelectArrayInput,
  minValue,
  maxValue,
} from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import TextInput from "../../../../components/TextInput";
import { formatDateConvert, formatDateConvertmonth } from "../../common";
import PageHeader from "../../../../components/PageHeader";
import NumberInput from "../../../../components/NumberInput";
import useStyles from "../../styles";
import { validateToDateField } from "../../../../utils/validationFunction";
import { useBaseGeoId } from "../../hooks";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Component for Adding allocation Details
 *
 * @returns {React.ReactElement} returns a CR Rating component with datagrid
 */
const AddAllocationDetails = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const location = useLocation();
  const query = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  const checkEdit = query.get("edit") === "true";
  const checkDuplicate = query.get("duplicate") === "true";
  const paramData = (query.get("add") || "").split("|");
  const { editList, inputs, pgValues } = paramData ? JSON.parse(atob(paramData)) : "";
  const [selectedFromDate, updateFromDate] = useState(checkEdit ? formatDateConvertmonth(editList.fromDate) : "");
  const [selectedToDate, updateToDate] = useState(checkEdit ? formatDateConvertmonth(editList.thruDate) : "");
  const [configName, setConfigName] = useState(checkEdit ? editList.configName : "");
  const today = new Date().toISOString().slice(0, 10);
  const [pincodeGroup, setPincodeGroup] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [fcPayload, setFcpayload] = useState({
    factorCapacityDone: checkEdit ? editList.factorCapacityDone : "",
    factorDistance: checkEdit ? editList.factorDistance : "",
    factorFCRating: checkEdit ? editList.factorFCRating : "",
    factorManualRating: checkEdit ? editList.factorManualRating : "",
    factorPrice: checkEdit ? editList.factorPrice : "",
  });
  const [carrierPayload, setCarrierPayload] = useState({
    factorLeadHours: checkEdit ? editList.factorLeadHours : "",
    factorShippingPrice: checkEdit ? editList.factorShippingPrice : "",
    factorCarrierRating: checkEdit ? editList.factorCarrierRating : "",
    factorManualRating: checkEdit ? editList.factorManualRating : "",
  });
  const baseGeoIds = useBaseGeoId(inputs);

  const resourceFc = `${window.REACT_APP_HENDRIX_SERVICE}/allocation-rules/fcs`;
  const resourceCarriers = `${window.REACT_APP_HENDRIX_SERVICE}/allocation-rules/carriers`;
  const resourceDuplicate =
    checkDuplicate && inputs.vendorType === "FC" ? `${resourceFc}/_duplicate` : `${resourceCarriers}/_duplicate`;
  const resourceFcURL = !checkDuplicate && inputs.vendorType === "FC" ? resourceFc : resourceCarriers;
  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("minValueMessage"));
  };
  /**
   * @function onConfigNameChange to update the config name on changes
   * @param {object} e event object
   * @returns {null} null
   */
  const onConfigNameChange = (e) => setConfigName(e.target.value);

  /**
   * @function onPincodeChange to update the Pincode values on change
   *  @param {object} e event object
   * @returns {null} null
   */
  const onPincodeChange = (e) => setPincodeGroup(e.target.value);

  /**
   * @function onProductGroupChange to update the Productgroup values on change
   * @param {object} e event object
   * @returns {null} null
   */
  const onProductGroupChange = (e) => setProductGroup(e.target.value);

  /**
   * @function pageRedirect to redirect to homepage when rule is updated or created
   */
  const pageRedirect = () => {
    const stateObj = { inputVal: inputs };
    const encodedObj = btoa(JSON.stringify(stateObj));
    setTimeout(() => {
      history.push({
        pathname: "/hendrix/v1/allocationlogic",
        search: `?home=${encodedObj}`,
      });
    }, TIMEOUT);
  };
  /**
   * @function onButtonClick to validate the fields and make api call for adding new rule
   */
  const onButtonClick = async () => {
    const { baseGeoId, geoGroupId, geoId, pgId, deliveryMode, id } = editList;
    let payload = {};
    const commonFields = {
      fromDate: formatDateConvert(selectedFromDate),
      thruDate: formatDateConvert(selectedToDate),
      configName,
      geoGroupId,
      geoId,
      pgId,
      deliveryMode: checkEdit ? deliveryMode : inputs.deliveryMode,
      id: checkEdit ? id : undefined,
      baseGeoId,
    };
    if (checkDuplicate) {
      const duplicateRuleFields = {
        applyToBaseGeoIds: pincodeGroup.length > 0 ? pincodeGroup : "",
        applyToPgIds: productGroup.length > 0 ? productGroup : "",
        sourceRuleId: id,
        configName,
        fromDate: commonFields.fromDate,
        thruDate: commonFields.thruDate,
      };
      if (inputs.vendorType === "FC") payload = { ...duplicateRuleFields, ...fcPayload };
      else if (inputs.vendorType === "CR") payload = { ...duplicateRuleFields, ...carrierPayload };
    } else if (!checkDuplicate && inputs.vendorType === "FC") {
      const { factorCapacityDone, factorDistance, factorFCRating, factorManualRating, factorPrice } = fcPayload;
      payload = {
        factorCapacityDone,
        factorDistance,
        factorFCRating,
        factorManualRating,
        factorPrice,
        ...commonFields,
      };
    } else if (inputs.vendorType === "CR") {
      const { factorLeadHours, factorShippingPrice, factorCarrierRating, factorManualRating } = carrierPayload;
      payload = {
        factorLeadHours,
        factorShippingPrice,
        factorCarrierRating,
        factorManualRating,
        ...commonFields,
      };
    }
    let res = [];
    if (checkEdit && !checkDuplicate) {
      res = await dataProvider.put(inputs.vendorType === "FC" ? resourceFc : resourceCarriers, {
        id: "",
        data: [payload],
      });
    } else {
      const payloadObj = { data: { dataObj: payload, params: "" } };
      const resource = checkDuplicate ? resourceDuplicate : resourceFcURL;
      res = await dataProvider.create(resource, payloadObj);
    }
    const { status } = res;
    const ruleMessage = !checkEdit ? translate("toast_add_success") : translate("toast_edit_success");
    const toastMessage = checkDuplicate ? translate("toast_duplicate_success") : ruleMessage;
    if (status === "success") {
      notify(toastMessage, "info", TIMEOUT);
      pageRedirect();
    } else if (res.message) {
      notify(translate(res.message), "error", TIMEOUT);
    }
  };
  /**
   * @function to update the state values based on field value changes
   * @param {object} e event object
   */
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    if (inputs.vendorType === "FC") {
      setFcpayload((prev) => {
        return { ...prev, [name]: value };
      });
    } else {
      setCarrierPayload((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const { factorCapacityDone, factorDistance, factorFCRating, factorManualRating, factorPrice } = fcPayload;
  const { factorLeadHours, factorShippingPrice, factorCarrierRating } = carrierPayload;
  const ruleTitle = checkEdit ? translate("edit_rule_title") : translate("add_rule_title");
  const title = checkDuplicate ? translate("duplicate_rule_title") : ruleTitle;
  return (
    <>
      <PageHeader
        header={{
          ruleName: checkDuplicate ? editList.configName : editList.baseGeoId,
          ruleLabel: title,
        }}
      />
      <SimpleForm
        className={classes.pageSimpleFormTop}
        save={onButtonClick}
        submitOnEnter={false}
        toolbar={
          <SaveButton className={classes.updateBtn} variant="contained" icon={<></>} label={translate("save")} />
        }
      >
        <Grid container item xs spacing={24}>
          <Box width={350}>
            <TextInput
              id="standard-required"
              value={configName}
              autoComplete="off"
              label={translate("config_name")}
              onChange={onConfigNameChange}
              validate={required()}
              edit
            />
          </Box>
          <Box width={300}>
            <DateInput
              source="fromDate"
              label={translate("from_date")}
              className={classes.dateField}
              defaultValue={selectedFromDate}
              onChange={(date) => updateFromDate(date.target.value)}
              validate={[required(), minValue(today, translate("fromdate_error"))]}
            />
          </Box>
          <Box width={300}>
            <DateInput
              source="thruDate"
              label={translate("to_date")}
              className={classes.dateField}
              defaultValue={selectedToDate}
              onChange={(date) => updateToDate(date.target.value)}
              validate={[required(), validateToDate(selectedFromDate)]}
            />
          </Box>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Grid item container direction="row" xs={3} className={classes.textLable1}>
              <Typography>{inputs.vendorType === "FC" ? translate("distance") : translate("lead_hours")}</Typography>
            </Grid>
            <NumberInput
              label={inputs.vendorType === "FC" ? "factorDistance" : "factorLeadHours"}
              value={inputs.vendorType === "FC" ? factorDistance : factorLeadHours}
              onChange={handleInputChange}
              validate={[required(), minValue(1), maxValue(100)]}
              min={0}
              autoComplete="off"
              edit
            />
          </Grid>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Grid item container direction="row" xs={3} className={classes.textLable2}>
              <Typography>{inputs.vendorType === "FC" ? translate("price") : translate("shipping_price")}</Typography>
            </Grid>
            <NumberInput
              label={inputs.vendorType === "FC" ? "factorPrice" : "factorShippingPrice"}
              value={inputs.vendorType === "FC" ? factorPrice : factorShippingPrice}
              onChange={handleInputChange}
              validate={[required(), minValue(1), maxValue(100)]}
              autoComplete="off"
              edit
            />
          </Grid>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Grid item container direction="row" xs={3} className={classes.textLable3}>
              <Typography>
                {inputs.vendorType === "FC" ? translate("capacity_done") : translate("carrier_rating")}
              </Typography>
            </Grid>
            <NumberInput
              label={inputs.vendorType === "FC" ? "factorCapacityDone" : "factorCarrierRating"}
              value={inputs.vendorType === "FC" ? factorCapacityDone : factorCarrierRating}
              onChange={handleInputChange}
              validate={[required(), minValue(1), maxValue(100)]}
              autoComplete="off"
              edit
            />
          </Grid>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Grid item container direction="row" xs={3} className={classes.textLable4}>
              <Typography>
                {inputs.vendorType === "FC" ? translate("fc_rating") : translate("manual_rating")}
              </Typography>
            </Grid>
            <NumberInput
              label={inputs.vendorType === "FC" ? "factorFCRating" : "factorManualRating"}
              value={inputs.vendorType === "FC" ? factorFCRating : factorManualRating}
              onChange={handleInputChange}
              validate={[required(), minValue(1), maxValue(100)]}
              autoComplete="off"
              edit
            />
          </Grid>
        </Grid>
        {inputs.vendorType === "FC" && (
          <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
            <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
              <Grid item container direction="row" xs={3} className={classes.textLable5}>
                <Typography>{translate("manual_rating")}</Typography>
              </Grid>
              <NumberInput
                label="factorManualRating"
                value={factorManualRating}
                onChange={handleInputChange}
                validate={[required(), minValue(1), maxValue(100)]}
                autoComplete="off"
                edit
              />
            </Grid>
          </Grid>
        )}
        <Divider variant="fullWidth" />
        {checkDuplicate && (
          <>
            <Grid
              item
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              xs
              className={classes.duplicateTo}
            >
              <Typography variant="h6">{translate("duplicate_label")}</Typography>
            </Grid>
            <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={9}>
              <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
                <Box width={250}>
                  <SelectArrayInput
                    fullWidth
                    source={translate("pincodes")}
                    choices={baseGeoIds}
                    optionText="name"
                    onChange={onPincodeChange}
                    optionValue="id"
                    disableValue="not_available"
                    validate={required()}
                  />
                </Box>
              </Grid>
              <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
                <Box width={250}>
                  <SelectArrayInput
                    fullWidth
                    source={translate("productGroup_placeholder")}
                    choices={pgValues}
                    onChange={onProductGroupChange}
                    optionText="name"
                    optionValue="id"
                    disableValue="not_available"
                    validate={required()}
                  />
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </SimpleForm>
    </>
  );
};

export default AddAllocationDetails;
