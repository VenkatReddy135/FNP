import { Button, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import { useTranslate } from "react-admin";
import DateTimeInput from "../../../../../components/CustomDateTimeV2";
import CustomNumberInput from "../../../../../components/NumberInput";
import CustomTextInput from "../../../../../components/TextInput";
import useRenderInput from "../../../PromotionHelper/useRenderInput";
import useStyles from "../../../style";
import maxCharacterConfig from "../../../PromotionHelper/maxCharacterConfig";
import validator from "../../../PromotionHelper/validator";

/**
 * @function AutoCodeConfig Component used to handle the creation of auto codes.
 * @param {object} props object which is required dependencies for the Component.
 * @param {number} props.id the id of the auto code config.
 * @param {number} props.index the the index of the auto code config.
 * @param {object} props.formValues have the master forms values.
 * @param {function():void} props.validateAutoCodes handle the updation of the auto codes.
 * @param {function():void} props.clearAutoCodes handle the clearing the autocode fields.
 * @param {function(number):void} props.updateAutoCodeConfigs handle the updation of the auto codes.
 * @returns {React.ReactElement} react-admin resource.
 */
const AutoCodeConfig = (props) => {
  const { updateAutoCodeConfigs, validateAutoCodes, clearAutoCodes, formValues, id, index } = props;

  const classes = useStyles();
  const translate = useTranslate();

  const [renderFromDateInput, fromDateRemount] = useRenderInput();
  const [renderThruDateInput, thruDateRemount] = useRenderInput();

  /**
   * @function handleChangeFromDate handle changes requried for from date update.
   * @param {object} e event.
   */
  const handleChangeFromDate = (e) => {
    if (!formValues.autoCodeConfigs[index].fromDate) fromDateRemount();
    if (
      formValues.autoCodeConfigs[index].thruDate &&
      new Date(e.target.value) > new Date(formValues.autoCodeConfigs[index].thruDate.split("T")[0])
    ) {
      updateAutoCodeConfigs(e, { fieldName: "resetThruDate", id });
      thruDateRemount();
    } else updateAutoCodeConfigs(e, { fieldName: "fromDate", id });
  };

  /**
   * @function handleChangeThruDate handle changes requried for thru date update.
   * @param {object} e event.
   */
  const handleChangeThruDate = (e) => {
    if (!formValues.autoCodeConfigs[index].thruDate) thruDateRemount();
    updateAutoCodeConfigs(e, { fieldName: "thruDate", id });
  };

  /**
   * @function keyDownLengthOfCode handle validation requried for lengthOfCode field.
   * @param {object} e event.
   */
  const keyDownLengthOfCode = (e) => {
    validator.numberInputValidation(e, maxCharacterConfig.lengthOfCode.maxLength, {
      isDecimalAllowed: false,
      isZeroAllowed: false,
    });
    if (e.target.value && e.target.value + e.key > 25) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Grid item container alignItems="center" md={12} data-testid="autoCodeConfigs-0">
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomNumberInput
            customSource={`autoCodeConfigs[${index}].noOfCodes`}
            label={translate("no_of_codes")}
            autoComplete="off"
            variant="standard"
            edit
            type="number"
            min={1}
            typeText=""
            onChange={(e) => updateAutoCodeConfigs(e, { fieldName: "noOfCodes", id, fieldValue: +e.target.value })}
            onKeyDown={(e) => {
              validator.numberInputValidation(e, Infinity, { isDecimalAllowed: false, isZeroAllowed: false });
            }}
          />
        </Grid>
        <Grid item md={4} className={classes.dateTimeGrid}>
          {renderFromDateInput && (
            <DateTimeInput
              label={translate("start_date")}
              source={`autoCodeConfigs[${index}].fromDate`}
              onChange={(e) => handleChangeFromDate(e)}
              minDate={new Date(formValues.fromDate?.split("T")[0]).toISOString().split("T")[0]}
              maxDate={new Date(formValues.thruDate?.split("T")[0]).toISOString().split("T")[0]}
            />
          )}
        </Grid>

        <Grid item md={4} className={classes.dateTimeGrid}>
          {renderThruDateInput && (
            <DateTimeInput
              label={translate("end_date")}
              source={`autoCodeConfigs[${index}].thruDate`}
              onChange={(e) => handleChangeThruDate(e)}
              minDate={
                formValues.autoCodeConfigs[index].fromDate
                  ? new Date(formValues.autoCodeConfigs[index].fromDate?.split("T")[0]).toISOString().split("T")[0]
                  : new Date(formValues.fromDate?.split("T")[0]).toISOString().split("T")[0]
              }
              maxDate={new Date(formValues.thruDate?.split("T")[0]).toISOString().split("T")[0]}
            />
          )}
        </Grid>
      </Grid>
      <Grid container item data-testid="autoCodeConfigs-1">
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomNumberInput
            customSource={`autoCodeConfigs[${index}].lengthOfCode`}
            label={translate("code_length")}
            autoComplete="off"
            variant="standard"
            edit
            type="number"
            min={1}
            max={maxCharacterConfig.lengthOfCode.maxNumber}
            typeText=""
            onChange={(e) => updateAutoCodeConfigs(e, { fieldName: "lengthOfCode", id, fieldValue: +e.target.value })}
            onKeyDown={(e) => keyDownLengthOfCode(e)}
          />
        </Grid>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomTextInput
            source={`autoCodeConfigs[${index}].codeStartsWith`}
            label={translate("code_starts_with")}
            autoComplete="off"
            variant="standard"
            edit
            onChange={(e) => updateAutoCodeConfigs(e, { fieldName: "codeStartsWith", id })}
            maxLength={maxCharacterConfig.codeStartsWith.maxLength}
          />
        </Grid>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <Button onClick={() => validateAutoCodes(id, index)} size="large" className={classes.validateBtn}>
            {translate("Validate")}
          </Button>
          <Button
            onClick={() => {
              clearAutoCodes(id, index);
              fromDateRemount();
              thruDateRemount();
            }}
            size="large"
            className={classes.validateBtn}
          >
            {translate("Clear")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

AutoCodeConfig.propTypes = {
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateAutoCodeConfigs: PropTypes.func.isRequired,
  validateAutoCodes: PropTypes.func.isRequired,
  clearAutoCodes: PropTypes.func.isRequired,
};

export default AutoCodeConfig;
