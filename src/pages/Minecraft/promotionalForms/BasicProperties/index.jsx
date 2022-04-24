import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { required, SimpleForm, useTranslate } from "react-admin";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import DropDownText from "../../../../components/Dropdown";
import GenericRadioGroup from "../../../../components/RadioGroup";
import CustomTextInput from "../../../../components/TextInput";
import promotionConfig from "../../../../config/PromotionConfig";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import maxCharacterConfig from "../../PromotionHelper/maxCharacterConfig";
import useFormValidity from "../../PromotionHelper/useFormValidity";
import useRenderInput from "../../PromotionHelper/useRenderInput";
import useUpdateForm from "../../PromotionHelper/useUpdateForm";
import validators from "../../PromotionHelper/validator";
import useStyles from "../../style";

/**
 * @function BasicProperties Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @param {boolean} props.edit decides whether to show editable field or not.
 * @param {boolean} props.create decides whether component is used for creating or viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterForm update master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterFormValidity update the validation of form.
 * @returns {React.ReactElement} react-admin resource.
 */
const BasicProperties = (props) => {
  const { edit, create, formValues, updateMasterForm, updateMasterFormValidity } = props;

  const translate = useTranslate();
  const classes = useStyles();

  const resourceForPromotionTypes = `${window.REACT_APP_MINECRAFT_SERVICE}/promotionTypes`;

  const [promotionalTypes, setPromotionalTypes] = useState([]);
  const [startDate] = useState(formValues.fromDate);

  const [renderFromDateInput, fromDateRemount] = useRenderInput();
  const [renderThruDateInput, thruDateRemount] = useRenderInput();

  const [handleChange] = useUpdateForm(updateMasterForm);

  const [updateFormValidity] = useFormValidity({
    initialForm: {
      basicProperties: {
        status: false,
        validations: [
          validators.required("promotionName"),
          validators.required("promotionDescription"),
          validators.required("promotionTypeId"),
          validators.required("fromDate"),
          validators.required("thruDate"),
        ],
      },
    },
  });

  useCustomQueryWithStore("getData", resourceForPromotionTypes, (res) => {
    setPromotionalTypes([...res?.data?.data?.map((item) => ({ id: item.id, name: item.displayName }))]);
  });

  /**
   * @function validateForm validate the required values and update the master form validity.
   * @param {object} values contains the values of form to be validated.
   * @returns {object} returns error if any.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    updateMasterFormValidity({
      type: "validity",
      formType: "basicProperties",
      payload: updateFormValidity(formValues)?.basicProperties,
    });

    return errors;
  }, [updateFormValidity, updateMasterFormValidity, formValues]);

  /**
   * @function renderPromotionId to display the promotion id.
   * @returns {React.Component} return CustomTextInput Component.
   */
  const renderPromotionId = () => {
    return <CustomTextInput label={translate("promotion_id")} edit={false} value={formValues.id} />;
  };

  /**
   * @function renderPromotionName to display the promotion name.
   * @returns {React.Component} return CustomTextInput Component.
   */
  const renderPromotionName = () => {
    return (
      <CustomTextInput
        source="promotionName"
        label={translate("promotion_name")}
        autoComplete="off"
        variant="standard"
        edit={edit}
        value={formValues.promotionName}
        onChange={(e) => {
          handleChange({ fieldName: "promotionName", fieldValue: e.target.value.trim() }, e);
        }}
        onKeyDown={(e) => {
          if (!formValues.promotionName && e.key === " ") e.preventDefault();
        }}
        validate={required()}
        maxLength={maxCharacterConfig.promotionName.maxLength}
      />
    );
  };

  /**
   * @function renderPromotionState to display the promotion state.
   * @returns {React.Component} return GenericRadioGroup Component.
   */
  const renderPromotionState = () => {
    return (
      <GenericRadioGroup
        label={translate("promotion_state")}
        source="status"
        choices={promotionConfig.promotionStatusOptions}
        editable={edit}
        displayText={formValues.status}
        onChange={(e) => handleChange({ fieldName: "status" }, e, "generic_radio_group")}
      />
    );
  };

  /**
   * @function renderPromotionDescription to display the promotion description.
   * @returns {React.Component} return CustomTextInput Component.
   */
  const renderPromotionDescription = () => {
    return (
      <CustomTextInput
        source="promotionDescription"
        label={translate("promotion_description")}
        autoComplete="off"
        variant="standard"
        edit={edit}
        value={formValues.promotionDescription}
        onChange={(e) => handleChange({ fieldName: "promotionDescription", fieldValue: e.target.value.trim() }, e)}
        onKeyDown={(e) => {
          if (!formValues.promotionDescription && e.key === " ") e.preventDefault();
        }}
        maxLength={maxCharacterConfig.promotionDescription.maxLength}
        validate={required()}
      />
    );
  };

  /**
   * @function handleChangeFromDate handle changes requried for from date update.
   * @param {object} e event
   */
  const handleChangeFromDate = (e) => {
    if (!formValues.fromDate) fromDateRemount();
    if (formValues.thruDate) {
      const thruDate = new Date(formValues.thruDate.split("T")[0]);
      const fromDate = new Date(e.target.value);
      if (fromDate > thruDate) {
        handleChange({ fieldName: "thruDate", fieldValue: null }, null);
        thruDateRemount();
      }
    }
    handleChange({ fieldName: "fromDate" }, e);
  };

  /**
   * @function minStartDate to get minimum start date.
   * @returns {Date} returns minDate.
   */
  const getMinStartDate = () => {
    const today = new Date();
    if (create) return today.toISOString().split("T")[0];
    if (!create && startDate) {
      const minStartDate = new Date(startDate.split("T")[0]);
      if (today.getTime() < minStartDate.getTime()) {
        return today.toISOString().split("T")[0];
      }
      return minStartDate.toISOString().split("T")[0];
    }
    return null;
  };

  /**
   * @function renderFromDate to display the promotion start date.
   * @returns {React.Component} return either DateTimeInput or CustomTextInput Component.
   */
  const renderFromDate = () => {
    return (
      <DateTimeInput
        source="fromDate"
        label={translate("promotion_start_date")}
        disabled={!edit}
        value={formValues.formDate}
        onChange={(e) => handleChangeFromDate(e)}
        validate={required()}
        minDate={getMinStartDate()}
      />
    );
  };

  /**
   * @function renderThruDate to display the promotion end date.
   * @returns {React.Component} return either DateTimeInput or CustomTextInput Component.
   */
  const renderThruDate = () => {
    return (
      <DateTimeInput
        source="thruDate"
        label={translate("promotion_end_date")}
        edit={edit}
        disabled={!edit}
        onChange={(e) => {
          if (!formValues.thruDate) thruDateRemount();
          handleChange({ fieldName: "thruDate" }, e);
        }}
        validate={required()}
        minDate={
          formValues.fromDate
            ? new Date(formValues.fromDate.split("T")[0]).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        }
      />
    );
  };

  /**
   * @function renderPromotionTypeId to display the promotion PromotionTypeId.
   * @returns {React.Component} return DropDownText Component.
   */
  const renderPromotionTypeId = () => {
    return (
      <DropDownText
        source="promotionTypeId"
        label={translate("promotion_type")}
        variant="standard"
        edit={edit}
        value={promotionalTypes.find((item) => item.id === formValues.promotionTypeId)?.name}
        data={promotionalTypes}
        onSelect={(e) => handleChange({ fieldName: "promotionTypeId" }, e)}
        validate={required()}
      />
    );
  };

  return (
    <SimpleForm
      initialValues={formValues}
      toolbar={<></>}
      validate={validateForm}
      data-testid="basicPropertiesComponent"
    >
      <Grid container>
        {create ? (
          <Grid
            container
            item
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            md={10}
            data-testid="create_true"
          >
            <Grid container item direction="column" xs={3}>
              <Grid item className={classes.maxWidthWrap}>
                {renderPromotionName()}
              </Grid>
              <Grid item>{renderPromotionState()}</Grid>
            </Grid>
            <Grid container item direction="column" xs={7}>
              <Grid item className={classes.maxWidthWrap}>
                {renderPromotionDescription()}
              </Grid>
              <Grid container item direction="row" justify="space-between" spacing={8}>
                <Grid md={6} item className={classes.dateAndTime}>
                  {renderFromDateInput && renderFromDate()}
                </Grid>
                <Grid md={6} item className={classes.dateAndTime}>
                  {renderThruDateInput && renderThruDate()}
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={2} item className={classes.maxWidthWrap}>
              {renderPromotionTypeId()}
            </Grid>
          </Grid>
        ) : (
          <Grid container item direction="column" md={10} data-testid="create_false">
            <Grid container item justify="flex-start" className={classes.gridHeight}>
              <Grid item md={4}>
                {renderPromotionId()}
              </Grid>
              <Grid item md={4} className={classes.maxWidthWrap}>
                {renderPromotionName()}
              </Grid>
              <Grid item md={4} className={classes.maxWidthWrap}>
                {renderPromotionTypeId()}
              </Grid>
            </Grid>
            <Grid container item justify="flex-start">
              <Grid item md={4}>
                {renderPromotionState()}
              </Grid>
              <Grid item md={8} className={classes.maxWidthWrap}>
                {renderPromotionDescription()}
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item md={4} className={classes.maxWidthWrap}>
                {renderFromDateInput && renderFromDate()}
              </Grid>
              <Grid item md={4} className={classes.maxWidthWrap}>
                {renderThruDateInput && renderThruDate()}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </SimpleForm>
  );
};

BasicProperties.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMasterForm: PropTypes.func.isRequired,
  updateMasterFormValidity: PropTypes.func,
};

BasicProperties.defaultProps = {
  edit: true,
  create: true,
  updateMasterFormValidity: () => {},
};

export default BasicProperties;
