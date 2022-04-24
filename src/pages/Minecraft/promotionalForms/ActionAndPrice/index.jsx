import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { required, SimpleForm, useNotify, useQueryWithStore, useTranslate } from "react-admin";
import ApiQueryWrapper from "../../../../components/ApiQueryWrapper";
import BoundedCheckBoxDropdown from "../../../../components/BoundedCheckBoxDropdown";
import DropDownText from "../../../../components/Dropdown";
import MultiSelectAutoComplete from "../../../../components/MultiSelectAutoComplete";
import CustomNumberInput from "../../../../components/NumberInput";
import CustomTextInput from "../../../../components/TextInput";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import entityMappings from "../../PromotionHelper/mapping";
import maxCharacterConfig from "../../PromotionHelper/maxCharacterConfig";
import useFormValidity from "../../PromotionHelper/useFormValidity";
import useUpdateForm from "../../PromotionHelper/useUpdateForm";
import validator from "../../PromotionHelper/validator";
import useStyles from "../../style";
import ValueAndRange from "./ValueAndRange";

/**
 * @function ActionAndPrice Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @param {boolean} props.edit decides whether to show editable field or not.
 * @param {boolean} props.create decides whether component is used for creating or viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterForm update master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterFormValidity update the validation of form.
 * @returns {React.ReactElement} react-admin resource.
 */
const ActionAndPrice = (props) => {
  const { create, edit, formValues, updateMasterForm, updateMasterFormValidity } = props;

  const [actionConfigs, setActionConfigs] = useState([]);

  const [actionOptions, setActionOptions] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);

  const [mapValueFlag, setMapValueFlag] = useState(false);

  const [amountRange, setAmountRange] = useState(
    formValues.action.price.amountRange?.map((item, index) => ({ ...item, id: item.id ? `AMOUNT_${index}` : item.id })),
  );

  const [currentActionType, setCurrentActionType] = useState(null);
  const [currentPriceType, setCurrentPriceType] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);

  const [showAmountOff, setShowAmountOff] = useState(false);
  const [subTextAmountOff, setSubTextAmountOff] = useState("");

  const isMounted = useRef(true);

  const [handleChange] = useUpdateForm(updateMasterForm);

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

  const notify = useNotify();
  const translate = useTranslate();

  const classes = useStyles();

  const [updateFormValidity] = useFormValidity({
    initialForm: {
      actionAndPrice: {
        status: false,
        validations: [
          validator.required("action.actionId"),
          validator.required("action.price.priceId"),
          validator.required("action.maxCap"),
        ],
      },
    },
  });

  useEffect(() => {
    if (formValues.action.actionId && formValues.action.price.priceId && actionConfigs.length) {
      const actionType = actionConfigs.find((item) => item.id === formValues.action.actionId);
      const priceType = actionType.prices.find((item) => item.priceId === formValues.action.price.priceId);

      setCurrentActionType(actionType);
      setCurrentPriceType(priceType);
      if (priceType.values) {
        setCurrentOptions(priceType.values.map((item) => ({ id: item, name: item })));
      }
      if (
        (actionType.actionName === "FLAT_OFF" || actionType.actionName === "PERCENTAGE_OFF") &&
        priceType.fieldInputType !== "NumericAmountRange"
      ) {
        setShowAmountOff(true);
      } else {
        setShowAmountOff(false);
      }
    } else {
      setShowAmountOff(false);
    }
  }, [actionConfigs, formValues]);

  useEffect(() => {
    if (currentActionType) {
      if (currentActionType.actionName === "FLAT_OFF") {
        setSubTextAmountOff("(flat value)");
      } else if (currentActionType.actionName === "PERCENTAGE_OFF") {
        setSubTextAmountOff("(in %)");
      } else {
        setSubTextAmountOff("");
      }
    }
  }, [currentActionType]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_MINECRAFT_SERVICE}/actionPrices?sortParam=actionName:asc&status=active`,
      payload: {},
    },
    {
      onSuccess: (response) => {
        onSuccess({
          response,
          notify,
          translate,
          handleSuccess: (res) => {
            const data = res?.data?.data;
            if (isMounted.current && data) {
              setActionConfigs(data);
              setActionOptions(data.map((item) => ({ id: item.id, name: item.actionDisplayName })));
            }
          },
        });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  /**
   * @function validateForm validate the required values and update the master form validity.
   * @param {object} values contains the values of form to be validated.
   * @returns {object} returns error if any.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    updateMasterFormValidity({
      type: "validity",
      formType: "actionAndPrice",
      payload: updateFormValidity(formValues)?.actionAndPrice,
    });

    return errors;
  }, [updateFormValidity, updateMasterFormValidity, formValues]);

  /**
   * @function resetFields to reset the field that are not involved in the form.
   * @param {object} payload has field config to be reset
   */
  const resetFields = (
    payload = {
      fieldNamesConfig: [
        {
          fieldName: "action.price.amount",
          value: null,
        },
        {
          fieldName: "action.price.currency",
          value: null,
        },
        {
          fieldName: "action.price.values",
          value: [],
        },
        {
          fieldName: "action.price.amountOff",
          value: null,
        },
        {
          fieldName: "action.price.amountRange",
          value: [],
        },
      ],
    },
  ) => {
    updateMasterForm({
      type: "resetActionFields",
      payload,
    });
    if (payload.fieldNamesConfig.find((item) => item.fieldName === "action.price.amountRange")) setAmountRange([]);
  };

  /**
   * @function actionChangedHandler handle the required modification when action type changes.
   * @param {object} e event object.
   */
  const actionChangedHandler = (e) => {
    handleChange({ fieldName: "action.actionId" }, e);
    resetFields();
    updateMasterForm({
      type: "field",
      payload: { fieldName: "action.price.priceId", value: null },
    });
    setCurrentPriceType(null);
    setCurrentOptions([]);
  };

  /**
   * @function handlePriceTypeChange handle the required modification when price type changes.
   * @param {object} e event object.
   */
  const handlePriceTypeChange = (e) => {
    handleChange({ fieldName: "action.price.priceId" }, e);
    setMapValueFlag(false);
    resetFields();
    setCurrentOptions([]);
  };

  useEffect(() => {
    const actionTypeId = formValues?.action?.actionId;
    if (actionTypeId) {
      const selectedActionType = actionConfigs.find((item) => item.id === actionTypeId);
      if (selectedActionType) {
        setPriceOptions(
          selectedActionType?.prices.map((item) => ({
            id: item.priceId,
            name: item.priceDisplayName || item.priceName,
          })),
        );
      }
    }
  }, [actionConfigs, formValues.action.actionId]);

  useEffect(() => {
    if (amountRange) {
      updateMasterForm({ type: "field", payload: { fieldName: "action.price.amountRange", value: amountRange } });
    }
  }, [amountRange, updateMasterForm]);

  useEffect(() => {
    if (currentPriceType) {
      setMapValueFlag(true);
    }
  }, [currentPriceType]);

  /**
   * @function handleMultiSelectValue handle changes for multi select component
   * @param {object} e target event
   * @param {Array} newValue all the selected values
   */
  const handleMultiSelectValue = (e, newValue) => {
    const fieldValue = newValue.map((item) => item.id);
    handleChange({ fieldName: "action.price.values", fieldValue }, e);
  };

  /**
   * @function addAmountRange add new entries in the amountRange state.
   */
  const addAmountRange = () => {
    setAmountRange((prevAmount) => {
      const idx = `AMOUNT_${new Date().getTime()}`;
      return [
        ...prevAmount,
        { id: idx, minimumAmount: null, maximumAmount: null, amountOff: formValues.action.price.amountOff },
      ];
    });
    resetFields({
      fieldNamesConfig: [
        {
          fieldName: "action.price.amount",
          value: null,
        },
        {
          fieldName: "action.price.amountOff",
          value: null,
        },
        {
          fieldName: "action.price.currency",
          value: null,
        },
      ],
    });
  };

  /**
   * @function updateAmountRange update the new entries in the amountRange state.
   */
  const updateAmountRange = useCallback(
    (event, value) => {
      const newAmountRanges = amountRange.map((item) =>
        item.id === value.id ? { ...item, [value.fieldName]: value.fieldValue || event.target.value } : item,
      );
      setAmountRange(newAmountRanges);
    },
    [amountRange],
  );

  /**
   * @function deleteAmountRange delete the entries in the amountRange state.
   * @param {number} index index of entry to be removed.
   */
  const deleteAmountRange = (index) => {
    const newAmountRanges = [...amountRange];
    newAmountRanges.splice(index, 1);
    setAmountRange([...newAmountRanges]);
  };

  const cases = {
    wildcardSearch: "WildcardSearch",
    numericFreeText: "NumericFreeText",
    numericRange: "NumericAmountRange",
    freeText: "FreeText",
    dropdown: "Dropdown",
    checklist: "Checklist",
  };

  /**
   * @function amountOffKeyDown handle onKeyDown functionality.
   * @param {object} e event.
   */
  const amountOffKeyDown = (e) => {
    validator.numberInputValidation(e, Infinity, { isDecimalAllowed: true, isZeroAllowed: true });
    if (subTextAmountOff === "(in %)") {
      percentageInputValidator(e);
    }
    if (subTextAmountOff === "(flat value)") {
      flatOffInputValidator(e);
    }
    amountInputValidator(e);
  };

  /**
   * @function amountKeyDown handle onKeyDown functionality.
   * @param {object} e event.
   */
  const amountKeyDown = (e) => {
    validator.numberInputValidation(e, Infinity, { isDecimalAllowed: true, isZeroAllowed: true });
    amountInputValidator(e);
  };

  /**
   * @function getMappedValues map the field required with current selected price type.
   * @returns {React.ReactElement} react-admin resource
   */
  const getMappedValues = () => {
    switch (currentPriceType?.fieldInputType) {
      case cases.numericFreeText: {
        return (
          <>
            {subTextAmountOff === "(flat value)" && (
              <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
                <ApiQueryWrapper
                  source="action.price.currency"
                  label={translate("promotion_currency")}
                  as="dropdown"
                  edit={edit}
                  apiParams={entityMappings.CURRENCY_ID.apiParams}
                  onSelect={(e) => handleChange({ fieldName: "action.price.currency" }, e)}
                />
              </Grid>
            )}
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              <CustomNumberInput
                customSource="action.price.amount"
                label={translate("promotion_action_price_amount")}
                variant="standard"
                typeText=""
                edit={edit}
                value={formValues.action.price?.amount}
                onChange={(e) => handleChange({ fieldName: "action.price.amount" }, e)}
                onKeyDown={amountKeyDown}
                min={0}
                max={maxCharacterConfig.amount.maxNumber}
              />
            </Grid>
          </>
        );
      }

      case cases.dropdown: {
        return (
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            <DropDownText
              source="action.price.values"
              label={translate("promotion_action_price_values")}
              variant="standard"
              edit={edit}
              data={currentOptions}
              value={
                Array.isArray(formValues.action.price?.values)
                  ? formValues.action.price?.values.join("; ")
                  : formValues.action.price?.values
              }
              onSelect={(e) => handleChange({ fieldName: "action.price.values", fieldValue: [e.target.value] })}
            />
          </Grid>
        );
      }

      case cases.freeText: {
        return (
          <Grid item md={create ? 6 : 8} className={`${classes.maxWidthWrap} ${classes.gridGap}`}>
            <CustomTextInput
              source="action.price.values"
              label={translate("promotion_action_price_values_free_text")}
              autoComplete="off"
              variant="standard"
              value={formValues.action.price.values}
              edit={edit}
              onChange={(e) => handleChange({ fieldName: "action.price.values", fieldValue: [e.target.value] })}
            />
          </Grid>
        );
      }

      case cases.wildcardSearch:
        return (
          <Grid item md={create ? 6 : 8} className={classes.wildSearch}>
            <MultiSelectAutoComplete
              source="action.price.values"
              label={translate("promotion_action_price_search")}
              edit={edit}
              limitTags={3}
              apiParams={entityMappings[currentPriceType?.priceName]?.apiParams}
              onOpen
              emptySearch={!(currentPriceType?.priceName === "PRODUCT_PRICE")}
              onChange={(e, newValue) => {
                handleMultiSelectValue(e, newValue);
              }}
            />
          </Grid>
        );

      case cases.numericRange:
        return (
          <ValueAndRange
            edit={edit}
            create={create}
            amountRange={amountRange}
            formValues={formValues}
            updateAmountRange={updateAmountRange}
            deleteAmountRange={deleteAmountRange}
            handleChange={handleChange}
            addAmountRange={addAmountRange}
            subTextAmountOff={subTextAmountOff}
          />
        );

      case cases.checklist:
        return (
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            {edit ? (
              <BoundedCheckBoxDropdown
                source="action.price.values"
                type="select"
                label={translate("promotion_action_price_values")}
                variant="standard"
                selectAll
                options={currentOptions}
                onChange={(e) => {
                  handleChange({ fieldName: "action.price.values" }, e);
                }}
              />
            ) : (
              <CustomTextInput
                label={translate("promotion_action_price_values")}
                variant="standard"
                edit={false}
                value={formValues.action.price.values}
              />
            )}
          </Grid>
        );

      default:
        return <></>;
    }
  };

  return (
    <>
      <SimpleForm initialValues={formValues} toolbar={<></>} validate={validateForm} data-testid="addAndRange">
        <Grid item container direction="row" alignItems="flex-start" md={create ? 9 : 10}>
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            <DropDownText
              source="action.actionId"
              label={translate("promotion_action")}
              variant="standard"
              edit={edit}
              value={currentActionType?.actionDisplayName}
              data={actionOptions}
              onSelect={actionChangedHandler}
              validate={required()}
            />
          </Grid>

          {formValues.action.actionId && (
            <>
              <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
                <DropDownText
                  source="action.price.priceId"
                  label={translate("promotion_price")}
                  variant="standard"
                  edit={edit}
                  value={currentPriceType?.priceDisplayName}
                  data={priceOptions}
                  onSelect={(e) => handlePriceTypeChange(e)}
                  validate={required()}
                />
              </Grid>
              <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
                <CustomNumberInput
                  customSource="action.maxCap"
                  label={translate("promotion_max_cap")}
                  variant="standard"
                  value={formValues.action.maxCap}
                  typeText=""
                  min={0}
                  max={maxCharacterConfig.maxCap.maxNumber}
                  onKeyDown={(e) => {
                    validator.numberInputValidation(e, maxCharacterConfig.maxCap.maxLength, {
                      isDecimalAllowed: true,
                      isZeroAllowed: true,
                    });
                  }}
                  edit={edit}
                  onChange={(e) => handleChange({ fieldName: "action.maxCap" }, e)}
                  validate={required()}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid item container alignItems="flex-start" md={create ? 9 : 10}>
          {actionConfigs.length !== 0 &&
            formValues.action.actionId &&
            formValues.action.price.priceId &&
            mapValueFlag &&
            getMappedValues()}

          {showAmountOff && (
            <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
              <CustomTextInput
                source="action.price.amountOff"
                label={`${translate("promotion_action_price_amount_off")} ${subTextAmountOff}`}
                variant="standard"
                edit={edit}
                value={formValues.action.price?.amountOff}
                type="number"
                onChange={(e) => handleChange({ fieldName: "action.price.amountOff" }, e)}
                onKeyDown={amountOffKeyDown}
                min={0}
                max={
                  subTextAmountOff === "(in %)"
                    ? maxCharacterConfig.percentAmountOff.maxNumber
                    : maxCharacterConfig.flatAmountOff.maxNumber
                }
              />
            </Grid>
          )}
        </Grid>

        <Grid item container alignItems="flex-start" md={create ? 5 : 12}>
          <Grid item md={create ? 11 : 7} className={`${classes.maxWidthWrap} ${classes.gridGap}`}>
            <CustomTextInput
              source="action.beforeOfferMessage"
              label={translate("promotion_before_offer_message")}
              autoComplete="off"
              variant="standard"
              value={formValues.action.beforeOfferMessage}
              edit={edit}
              onChange={(e) => handleChange({ fieldName: "action.beforeOfferMessage" }, e)}
            />
          </Grid>
          <Grid item md={create ? 11 : 7} className={`${classes.maxWidthWrap} ${classes.gridGap}`}>
            <CustomTextInput
              source="action.afterOfferMessage"
              label={translate("promotion_after_offer_message")}
              autoComplete="off"
              variant="standard"
              edit={edit}
              value={formValues.action.afterOfferMessage}
              onChange={(e) => handleChange({ fieldName: "action.afterOfferMessage" }, e)}
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  );
};

ActionAndPrice.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMasterForm: PropTypes.func.isRequired,
  updateMasterFormValidity: PropTypes.func,
};

ActionAndPrice.defaultProps = {
  edit: true,
  create: true,
  updateMasterFormValidity: () => {},
};

export default ActionAndPrice;
