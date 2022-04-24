import { Button, Grid, IconButton } from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { SimpleForm, useCreate, useDelete, useNotify, useTranslate } from "react-admin";
import CustomNumberInput from "../../../../components/NumberInput";
import GenericRadioGroup from "../../../../components/RadioGroup";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import promotionConfig from "../../../../config/PromotionConfig";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import maxCharacterConfig from "../../PromotionHelper/maxCharacterConfig";
import useFormValidity from "../../PromotionHelper/useFormValidity";
import useUpdateForm from "../../PromotionHelper/useUpdateForm";
import validator from "../../PromotionHelper/validator";
import useStyles from "../../style";
import AutoCodeConfig from "./AutoCodeConfig";
import CodesData from "./CodesData";

/**
 * @function ManageCodes Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @param {boolean} props.edit to choose whether to show editable field.
 * @param {boolean} props.create decides whether component is used for creating a promotion or for viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterForm update master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterFormValidity update the validation of forms.
 * @returns {React.ReactElement} react-admin resource.
 */
const ManageCodes = (props) => {
  const { edit, create, formValues, updateMasterForm, updateMasterFormValidity } = props;

  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [createRequest] = useCreate();

  const [autoCodeConfigs, setAutoCodeConfigs] = useState(formValues.autoCodeConfigs);
  const [manualCodes, setManualCodes] = useState(formValues.manualCodes);

  const [autoCodes, setAutoCodes] = useState(formValues.autoCodes);

  const [handleChange] = useUpdateForm(updateMasterForm);

  const [updateFormValidity] = useFormValidity({
    initialForm: {
      manageCodes: {
        status: false,
        validations: [
          validator.checkForAutoCodeValidity("autoCodeConfigs"),
          validator.checkForNoNullEntry("manualCodes", { values: ["fromDate", "thruDate", "code"] }),
          validator.checkForCouponRequired("couponRequired"),
        ],
      },
    },
  });

  const [deleteOne] = useDelete();

  useEffect(() => {
    if (manualCodes) {
      handleChange({ fieldName: "manualCodes", fieldValue: manualCodes });
    }
  }, [manualCodes, handleChange]);

  useEffect(() => {
    if (autoCodes) {
      handleChange({ fieldName: "autoCodes", fieldValue: autoCodes });
    }
  }, [autoCodes, handleChange]);

  useEffect(() => {
    if (autoCodeConfigs) {
      handleChange({ fieldName: "autoCodeConfigs", fieldValue: autoCodeConfigs });
    }
  }, [autoCodeConfigs, handleChange]);

  /**
   * @function updateAutoCodeConfigs update fields of autoCodesConfigs.
   */
  const updateAutoCodeConfigs = useCallback(
    (event, value) => {
      let newAutoCodesConfig;
      const isValidDependencies = ["isValid", "fromDate", "thruDate"];
      if (value.fieldName === "resetThruDate") {
        newAutoCodesConfig = autoCodeConfigs.map((item) =>
          item.id === value.id
            ? { ...item, fromDate: value.fieldValue || event?.target?.value, thruDate: null, isValid: false }
            : item,
        );
      } else if (!isValidDependencies.includes(value.fieldName)) {
        newAutoCodesConfig = autoCodeConfigs.map((item) =>
          item.id === value.id
            ? { ...item, [value.fieldName]: value.fieldValue || event?.target?.value, isValid: false }
            : item,
        );
      } else {
        newAutoCodesConfig = autoCodeConfigs.map((item) =>
          item.id === value.id ? { ...item, [value.fieldName]: value.fieldValue || event?.target?.value } : item,
        );
      }
      setAutoCodeConfigs(newAutoCodesConfig);
    },
    [autoCodeConfigs],
  );

  /**
   * @function handleValidateAutoCodesSuccess handle success of validating code config.
   * @param {object} response success response data.
   * @param {number} id Id of the current auto config to be updated.
   */
  const handleValidateAutoCodesSuccess = useCallback(
    (response, id) => {
      if (response.status === "success") {
        updateAutoCodeConfigs(null, { id, fieldName: "isValid", fieldValue: response.data?.data?.validationStatus });
        notify(translate("autocode_is_valid"));
      } else notify(response.message, "error", TIMEOUT);
    },
    [notify, updateAutoCodeConfigs, translate],
  );

  /**
   * @function validateAutoCodes validate the auto code generation.
   * @param {number} autoCodeConfigId Id of selected auto code.
   * @param {number} index index of the current auto code.
   */
  const validateAutoCodes = (autoCodeConfigId, index) => {
    if (!formValues.autoCodeConfigs[index].fromDate || !formValues.autoCodeConfigs[index].thruDate) {
      notify("Please provide date for the autoCodes", "error", TIMEOUT);
      return;
    }
    const resource = `${window.REACT_APP_MINECRAFT_SERVICE}/coupons/validate`;
    const data = {
      dataObj: { ...formValues.autoCodeConfigs[index] },
      params: {},
    };
    const options = {
      onSuccess: (response) => {
        onSuccess({
          response,
          notify,
          translate,
          handleSuccess: () => handleValidateAutoCodesSuccess(response, autoCodeConfigId),
        });
      },
      onFailure: (error) => onFailure({ error, notify, translate }),
    };
    createRequest(resource, data, options);
  };

  /**
   * @function clearAutoCodes validate the auto code generation.
   * @param {number} autoCodeConfigId Id of selected auto code.
   * @param {number} index index of the current auto code.
   */
  const clearAutoCodes = (autoCodeConfigId, index) => {
    setAutoCodeConfigs(() =>
      autoCodeConfigs.map((item, idx) =>
        idx === index || item.id === autoCodeConfigId ? promotionConfig.autoCodeDefaultConfig : item,
      ),
    );
  };

  /**
   * @function addManualCode add new field to manual Code to be filled.
   */
  const addManualCode = () => {
    setManualCodes((prevCodes) => {
      const idx = `CODE_${new Date().getTime()}`;
      return [...prevCodes, { id: idx, code: null, fromDate: null, thruDate: null }];
    });
  };

  /**
   * @function updateManualCodes update fields of manual Codes.
   */
  const updateManualCodes = useCallback(
    (event, value) => {
      if (value.fieldName === "resetThruDate") {
        const newCodesConfig = manualCodes.map((item) =>
          item.id === value.id
            ? { ...item, fromDate: value.fieldValue || event?.target?.value, thruDate: null, isUpdated: true }
            : item,
        );
        setManualCodes(newCodesConfig);
      } else {
        const newCodesConfig = manualCodes.map((item) =>
          item.id === value.id
            ? { ...item, [value.fieldName]: value.fieldValue || event?.target?.value, isUpdated: true }
            : item,
        );
        setManualCodes(newCodesConfig);
      }
    },
    [manualCodes],
  );

  /**
   * @function deleteManualCodes delete the entry in the manual Codes.
   * @param {number} index contains the index of the value to be deleted from manual Codes array.
   */
  const deleteManualCodes = (index) => {
    /**
     * @function deleteCode to delete entry form array of codes.
     */
    const deleteCode = () => {
      const newManualCodes = [...manualCodes];
      newManualCodes.splice(index, 1);
      setManualCodes([...newManualCodes]);
    };

    if (manualCodes[index].batchId) {
      const resource = `${window.REACT_APP_MINECRAFT_SERVICE}/coupons/${manualCodes[index].batchId}/`;
      deleteOne(resource, {}, null, {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: () => {
              notify(response.data?.message);
              deleteCode();
            },
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      });
    } else {
      deleteCode();
    }
  };

  /**
   * @function deleteAutoCodes delete the entry in the auto Codes.
   * @param {number} index contains the index of the value to be deleted from auto Codes array.
   */
  const deleteAutoCodes = (index) => {
    const resource = `${window.REACT_APP_MINECRAFT_SERVICE}/coupons/${autoCodes[index].batchId}/`;
    deleteOne(resource, {}, null, {
      onSuccess: (response) => {
        onSuccess({
          response,
          notify,
          translate,
          handleSuccess: () => {
            notify(response.data?.message);
            const newAutoCodes = [...autoCodes];
            newAutoCodes.splice(index, 1);
            setAutoCodes([...newAutoCodes]);
          },
        });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    });
  };

  /**
   * @function updateAutoCodes update fields of auto Codes.
   */
  const updateAutoCodes = useCallback(
    (event, value) => {
      if (!autoCodes) return;
      if (value.fieldName === "resetThruDate") {
        const newCodesConfig = autoCodes.map((item) =>
          item.id === value.id
            ? { ...item, fromDate: value.fieldValue || event?.target?.value, thruDate: null, isUpdated: true }
            : item,
        );
        setAutoCodes(newCodesConfig);
      } else {
        const newCodesConfig = autoCodes.map((item) =>
          item.id === value.id
            ? { ...item, [value.fieldName]: value.fieldValue || event?.target?.value, isUpdated: true }
            : item,
        );
        setAutoCodes(newCodesConfig);
      }
    },
    [autoCodes],
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
      formType: "manageCodes",
      payload: updateFormValidity(formValues)?.manageCodes,
    });

    return errors;
  }, [updateMasterFormValidity, updateFormValidity, formValues]);

  /**
   * @function onCouponRequiredHandler update the form value to show new input fields.
   */
  const onCouponRequiredHandler = useCallback(
    (e) => {
      handleChange({ fieldName: "couponRequired" }, e, "generic_radio_group");

      updateMasterForm({
        type: "resetMultipleFields",
        payload: {
          fieldNamesConfig: [
            {
              fieldName: "useLimitPerCode",
              value: null,
            },
            {
              fieldName: "useLimitPerCustomer",
              value: null,
            },
            {
              fieldName: "manualCodes",
              value: [],
            },
            {
              fieldName: "autoCodeConfigs",
              value: [promotionConfig.autoCodeDefaultConfig],
            },
          ],
        },
      });

      setManualCodes([]);
      setAutoCodeConfigs([promotionConfig.autoCodeDefaultConfig]);
    },
    [handleChange, updateMasterForm],
  );

  /**
   * @function showAddButton validate whether to show Add Code button or not.
   * @returns {boolean} return true or false.
   */
  const showAddButton = () => {
    return create ? manualCodes.length === 0 : edit;
  };

  return (
    <>
      <SimpleForm initialValues={formValues} toolbar={<></>} validate={validateForm} data-testid="manageCode">
        <Grid container>
          <Grid container item direction="row" alignItems="center" md={create ? 8 : 10}>
            <Grid item md={4} className={edit ? null : classes.setMargin}>
              <GenericRadioGroup
                label={translate("coupon_required")}
                source="couponRequired"
                choices={promotionConfig.promotionCouponRequiredOptions}
                editable={edit}
                displayText={formValues.couponRequired ? translate("Yes") : translate("No")}
                onChange={onCouponRequiredHandler}
              />
            </Grid>

            {formValues.couponRequired && (
              <>
                <Grid item md={4} className={classes.maxWidthWrap}>
                  <CustomNumberInput
                    customSource="useLimitPerCode"
                    label={translate("coupon_limit_per_code")}
                    autoComplete="off"
                    variant="standard"
                    edit={edit}
                    value={formValues.useLimitPerCode}
                    type="number"
                    min={0}
                    max={maxCharacterConfig.useLimitPerCode.maxNumber}
                    typeText=""
                    onChange={(e) => handleChange({ fieldName: "useLimitPerCode", fieldValue: +e.target.value })}
                    onKeyDown={(e) => {
                      validator.numberInputValidation(e, maxCharacterConfig.useLimitPerCode.maxLength, {
                        isDecimalAllowed: false,
                        isZeroAllowed: true,
                      });
                    }}
                  />
                </Grid>
                <Grid item md={4} className={classes.maxWidthWrap}>
                  <CustomNumberInput
                    customSource="useLimitPerCustomer"
                    label={translate("coupon_limit_per_customer")}
                    autoComplete="off"
                    variant="standard"
                    edit={edit}
                    value={formValues.useLimitPerCustomer}
                    type="number"
                    min={0}
                    max={maxCharacterConfig.useLimitPerCustomer.maxNumber}
                    typeText=""
                    onChange={(e) => handleChange({ fieldName: "useLimitPerCustomer", fieldValue: +e.target.value })}
                    onKeyDown={(e) => {
                      validator.numberInputValidation(e, maxCharacterConfig.useLimitPerCustomer.maxLength, {
                        isDecimalAllowed: false,
                        isZeroAllowed: true,
                      });
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          {formValues.couponRequired && (
            <Grid container item direction="row" alignItems="flex-start" justify="space-between" md={create ? 8 : 10}>
              <Grid
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                md={12}
                className={classes.heading}
              >
                {translate("auto_codes")}
              </Grid>
              {edit && (
                <Grid container item direction="column" md={12}>
                  {autoCodeConfigs.map((item, idx) => (
                    <AutoCodeConfig
                      id={item.id}
                      key={item.id}
                      index={idx}
                      updateAutoCodeConfigs={updateAutoCodeConfigs}
                      validateAutoCodes={validateAutoCodes}
                      clearAutoCodes={clearAutoCodes}
                      formValues={formValues}
                    />
                  ))}
                </Grid>
              )}
              {!create && (
                <Grid container item direction="column" md={12}>
                  <CodesData
                    edit={edit}
                    type="autoCodes"
                    data={formValues.autoCodes}
                    updateCodes={updateAutoCodes}
                    deleteCodes={deleteAutoCodes}
                    formValues={formValues}
                  />
                </Grid>
              )}
            </Grid>
          )}

          {formValues.couponRequired && (
            <Grid container item direction="row" alignItems="center" justify="flex-start" md={create ? 12 : 10}>
              <Grid item md={7} className={classes.heading}>
                {translate("manual_codes")}
              </Grid>
              {manualCodes.length !== 0 && create && (
                <Grid container item alignItems="flex-end" md={12}>
                  <Grid item md={8}>
                    <CodesData
                      edit
                      type="manualCodes"
                      data={formValues.manualCodes}
                      updateCodes={updateManualCodes}
                      deleteCodes={deleteManualCodes}
                      formValues={formValues}
                    />
                  </Grid>
                  <Grid item md={1} className={classes.plusBtn}>
                    {validator.checkForNoNullEntry("manualCodes")(formValues) && (
                      <IconButton
                        style={{
                          color: "#FF9212",
                          strokeWidth: "1",
                          display: "block",
                        }}
                        onClick={addManualCode}
                      >
                        <AddBoxOutlinedIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              )}
              {!create && (
                <Grid container item direction="column" md={12}>
                  <CodesData
                    edit={edit}
                    type="manualCodes"
                    data={formValues.manualCodes}
                    updateCodes={updateManualCodes}
                    deleteCodes={deleteManualCodes}
                    formValues={formValues}
                  />
                </Grid>
              )}
              {showAddButton() && (
                <Grid item md={9}>
                  <Button variant="outlined" size="large" onClick={addManualCode} className={classes.addCodeBtn}>
                    {translate("add_code")}
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </SimpleForm>
    </>
  );
};

ManageCodes.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMasterForm: PropTypes.func.isRequired,
  updateMasterFormValidity: PropTypes.func,
};

ManageCodes.defaultProps = {
  edit: true,
  create: true,
  updateMasterFormValidity: () => {},
};

export default ManageCodes;
