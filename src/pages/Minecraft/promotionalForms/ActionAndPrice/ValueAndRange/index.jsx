import { Button, Grid, IconButton } from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import PropTypes from "prop-types";
import React from "react";
import { useTranslate } from "react-admin";
import ApiQueryWrapper from "../../../../../components/ApiQueryWrapper";
import CustomNumberInput from "../../../../../components/TextInput";
import apiMapping from "../../../PromotionHelper/mapping";
import maxCharacterConfig from "../../../PromotionHelper/maxCharacterConfig";
import validator from "../../../PromotionHelper/validator";
import useStyles from "../../../style";

/**
 * @function ValueAndRange Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for Value And Range Component.
 * @param {boolean} props.edit decides whether to show editable field or not.
 * @param {boolean} props.create decides whether component is used for creating or viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {function():void} props.addAmountRange handle the addition of new entry.
 * @param {function(object,object):void} props.updateAmountRange handle the updation of amount range.
 * @param {function(object,object):void} props.deleteAmountRange handle the deletion of amount range.
 * @param {function(object,object):void} props.handleChange handle the change of amount and amount off.
 * @param {string} props.subTextAmountOff sub text for the amountOff label.
 * @returns {React.ReactElement} react-admin resource.
 */
const ValueAndRange = (props) => {
  const classes = useStyles();

  const {
    edit,
    create,
    amountRange,
    formValues,
    addAmountRange,
    updateAmountRange,
    deleteAmountRange,
    handleChange,
    subTextAmountOff,
  } = props;

  const translate = useTranslate();

  const [percentageInputValidator] = validator.useMaxNumberInputValidation(
    maxCharacterConfig.percentAmountOff.maxNumber,
    maxCharacterConfig.percentAmountOff.maxLength,
  );
  const [flatOffInputValidator] = validator.useMaxNumberInputValidation(
    maxCharacterConfig.flatAmountOff.maxNumber,
    maxCharacterConfig.flatAmountOff.maxLength,
  );
  const [amountInputValidator] = validator.useMaxNumberInputValidation(
    maxCharacterConfig.amount.maxNumber,
    maxCharacterConfig.amount.maxLength,
  );

  /**
   * @function keyDown handle onKeyDown functionality.
   * @param {object} e event.
   * @param {string} type which input field
   */
  const keyDown = (e, type) => {
    validator.numberInputValidation(e, Infinity, { isDecimalAllowed: true, isZeroAllowed: true });
    if (type === "amountOff" && subTextAmountOff === "(in %)") {
      percentageInputValidator(e);
    }
    if (type === "amountOff" && subTextAmountOff === "(flat value)") {
      flatOffInputValidator(e);
    }
    amountInputValidator(e);
  };

  /**
   * @function maxLimit decides max number for input.
   * @returns {number} maxNumber.
   */
  const maxLimit = () => {
    if (subTextAmountOff === "(in %)") return maxCharacterConfig.percentAmountOff.maxNumber;
    return maxCharacterConfig.flatAmountOff.maxNumber;
  };

  /**
   * @function renderCustomNumberInput to display the input field.
   * @param {string} label display name for input field.
   * @param {number} idx index of the entry to be shown.
   * @param {number} id id of the entry to be shown.
   * @param {string} fieldName fieldname of the entry to be shown.
   * @returns {React.Component} return CustomTextInput Component.
   */
  const renderCustomNumberInput = (label, idx, id, fieldName) => {
    return (
      <CustomNumberInput
        source={`action.price.amountRange[${idx}].${fieldName}`}
        label={`${translate(label)} ${fieldName === "amountOff" ? subTextAmountOff : ""}`}
        variant="standard"
        edit={edit}
        value={amountRange[idx][fieldName] ? String(amountRange[idx][fieldName]) : null}
        type="number"
        onChange={(e) => updateAmountRange(e, { id, index: idx, fieldName })}
        onKeyDown={(e) => keyDown(e, fieldName)}
        min={0}
        max={fieldName === "amountOff" ? maxLimit() : maxCharacterConfig.amount.maxNumber}
      />
    );
  };

  /**
   * @function showAddAmountRangeBtn To check whether to show add amount range button.
   * @returns {boolean} return condition.
   */
  const showAddAmountRangeBtn = () => {
    let flag = true;

    amountRange.forEach((item) => {
      if (!item.minimumAmount || !item.maximumAmount || !item.amountOff) {
        flag = false;
      }
    });
    return flag;
  };

  return (
    <>
      {amountRange.length === 0 ? (
        <>
          {subTextAmountOff === "(flat value)" && (
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              <ApiQueryWrapper
                source="action.price.currency"
                label={translate("promotion_currency")}
                as="dropdown"
                edit={edit}
                apiParams={apiMapping.CURRENCY_ID.apiParams}
                onSelect={(e) => handleChange({ fieldName: "action.price.currency" }, e)}
              />
            </Grid>
          )}
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap} data-testid="amountRange">
            <CustomNumberInput
              source="action.price.amount"
              label={translate("promotion_action_price_amount")}
              variant="standard"
              edit={edit}
              value={formValues.action.price.amount}
              type="number"
              onChange={(e) => handleChange({ fieldName: "action.price.amount" }, e)}
              onKeyDown={(e) => keyDown(e, "amount")}
              min={0}
              max={maxCharacterConfig.amount.maxNumber}
            />
          </Grid>
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            <CustomNumberInput
              source="action.price.amountOff"
              label={`${translate("promotion_action_price_amount_off")} ${subTextAmountOff}`}
              variant="standard"
              edit={edit}
              value={formValues.action.price.amountOff}
              type="number"
              onChange={(e) => handleChange({ fieldName: "action.price.amountOff" }, e)}
              onKeyDown={(e) => keyDown(e, "amountOff")}
              min={0}
              max={maxLimit()}
            />
          </Grid>
          {edit && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                addAmountRange();
              }}
            >
              {translate("promotion_add_range")}
            </Button>
          )}
        </>
      ) : (
        amountRange.map((data, index) => (
          <Grid item container md={12} key={data.id} className={classes.gridGap} data-testid="amountLength">
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              {renderCustomNumberInput("promotion_action_price_minimum_amount", index, data.id, "minimumAmount")}
            </Grid>
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              {renderCustomNumberInput("promotion_action_price_maximum_amount", index, data.id, "maximumAmount")}
            </Grid>
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              {renderCustomNumberInput("promotion_action_price_amount_off", index, data.id, "amountOff")}
            </Grid>
            {edit && (
              <Grid item container md={create ? 2 : 0} className={!create && classes.valueAndRangeBtns}>
                <IconButton
                  style={{ strokeWidth: "1", display: "block" }}
                  onClick={() => {
                    deleteAmountRange(index);
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
                {index === amountRange.length - 1 && showAddAmountRangeBtn() && (
                  <IconButton
                    style={{
                      color: "#FF9212",
                      strokeWidth: "1",
                      display: "block",
                    }}
                    onClick={() => addAmountRange()}
                  >
                    <AddBoxOutlinedIcon />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>
        ))
      )}
    </>
  );
};

ValueAndRange.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  amountRange: PropTypes.arrayOf(PropTypes.any).isRequired,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateAmountRange: PropTypes.func.isRequired,
  deleteAmountRange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  addAmountRange: PropTypes.func.isRequired,
  subTextAmountOff: PropTypes.string,
};

ValueAndRange.defaultProps = {
  edit: true,
  create: true,
  subTextAmountOff: "",
};

export default ValueAndRange;
