import React, { useState } from "react";
import {
  SimpleShowLayout,
  useTranslate,
  SimpleForm,
  DateInput,
  useDataProvider,
  SaveButton,
  required,
  minValue,
  useNotify,
} from "react-admin";
import { useLocation, useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import useStyles from "../../styles";
import PageHeader from "../../../../components/PageHeader";
import TextInput from "../../../../components/TextInput";
import NumberInput from "../../../../components/NumberInput";
import { formatDateConvertmonth, formatDateConvert } from "../../common";
import { validateToDateField } from "../../../../utils/validationFunction";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/capacities/configurations`;

/**
 * Component for FC capacity Add new item
 *
 * @returns {React.ReactElement} returns a FC capacity component
 */
const FcCapacityForm = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  const paramData = (query.get("add") || "").split("|");
  const { editList, inputData } = paramData ? JSON.parse(paramData) : "";
  const [selectedFromDate, updateFromDate] = useState(
    query.get("edit") === "true" ? formatDateConvertmonth(editList.fromDate) : "",
  );
  const [selectedToDate, updateToDate] = useState(
    query.get("edit") === "true" ? formatDateConvertmonth(editList.thruDate) : "",
  );
  const [configName, setConfigName] = useState(query.get("edit") === "true" ? editList.configName : "");
  const [capacity, setCapacity] = useState(query.get("edit") === "true" ? editList.capacity : "");
  const today = new Date().toISOString().slice(0, 10);
  /**
   * @function onWeightageChange to update the capacity value on changes
   * @param {object} e event object
   *
   */
  const onWeightageChange = (e) => {
    setCapacity(e.target.value);
  };

  /**
   * @function onConfigName to update the config name on changes
   * @param {object} e event object
   *
   */
  const onConfigName = (e) => {
    setConfigName(e.target.value);
  };

  /**
   * @function pageRedirect to redirect to homepage when rule is updated or created
   */
  function pageRedirect() {
    const stateVal = { inputVal: inputData };
    setTimeout(() => {
      history.push({
        pathname: "/hendrix/v1/fccapacity",
        search: `?home=${JSON.stringify(stateVal)}`,
      });
    }, TIMEOUT);
  }
  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("minValueMessage"));
  };

  /**
   * @function onButtonClick to make api call for adding new / edit rule
   */
  const onButtonClick = async () => {
    const { fullFilmentcenterId, isGlobal } = editList;
    const dateObj = {
      fromDate: formatDateConvert(selectedFromDate),
      thruDate: formatDateConvert(selectedToDate),
    };
    if (query.get("edit") === "true") {
      const { deliveryMode, geoGroupId, geoId } = inputData;
      let payload;
      if (isGlobal) {
        payload = {
          capacity,
          configName,
          deliveryMode,
          geoGroupId,
          geoId,
          id: editList.id,
          isGlobal,
          vendorId: fullFilmentcenterId,
          ...dateObj,
        };
      } else {
        payload = {
          capacity,
          configName,
          isGlobal,
          id: editList.id,
          ...dateObj,
        };
      }
      const res = await dataProvider.put(resource, { id: "", data: [payload] });
      if (res?.status === "success") {
        notify(translate("toast_edit"), "info", TIMEOUT);
        pageRedirect();
      } else if (res.errors) {
        notify(translate(res.data.errors[0]?.message), "error", TIMEOUT);
      }
    } else {
      const { deliveryMode, geoGroupId, geoId } = inputData;
      const payload = {
        capacity,
        configName,
        deliveryMode,
        geoGroupId,
        geoId,
        vendorId: fullFilmentcenterId,
        vendorType: "FC", // static value
        ...dateObj,
      };
      const payloadObj = { data: { dataObj: payload, params: "" } };
      const res = await dataProvider.create(resource, payloadObj);
      if (res?.status === "success") {
        notify(translate("toast_add"), "info", TIMEOUT);
        pageRedirect();
      } else notify(translate(res.data.errors[0]?.message), "error", TIMEOUT);
    }
  };

  return (
    <>
      <SimpleShowLayout component="div">
        <PageHeader
          header={{
            ruleLabel: query.get("edit") === "true" ? translate(`fc_editRuleTitle`) : translate(`fc_addRuleTitle`),
            ruleName: editList.fullFilmentcenterName || "",
          }}
          buttonName={translate(`fc_addRuleSaveButton`)}
        />
        <SimpleForm
          save={onButtonClick}
          submitOnEnter={false}
          toolbar={
            <SaveButton className={classes.updateBtn} variant="contained" icon={<></>} label={translate("save")} />
          }
        >
          <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <TextInput
                id="standard-basic"
                initialValues={configName}
                value={configName}
                autoComplete="off"
                label={translate(`fc_configName`)}
                onChange={onConfigName}
                validate={required()}
                edit
              />
            </Grid>
          </Grid>
          <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <DateInput
                source="fromDate"
                label={translate("from_date")}
                className={classes.dateField}
                defaultValue={selectedFromDate}
                onChange={(date) => {
                  updateFromDate(date.target.value);
                }}
                validate={[required(), minValue(today, translate("fromdate_error"))]}
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <DateInput
                source="thruDate"
                label={translate("to_date")}
                className={classes.dateField}
                defaultValue={selectedToDate}
                onChange={(date) => {
                  updateToDate(date.target.value);
                }}
                FormHelperTextProps={{ classes: { root: classes.helperText } }}
                validate={[required(), validateToDate(selectedFromDate)]}
              />
            </Grid>
          </Grid>
          <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <NumberInput
                label={translate(`fc_capacity`)}
                source="capacity"
                value={capacity}
                onChange={onWeightageChange}
                validate={[required(), minValue(1)]}
                min={0}
                autoComplete="off"
                edit
              />
            </Grid>
          </Grid>
        </SimpleForm>
      </SimpleShowLayout>
    </>
  );
};

export default FcCapacityForm;
