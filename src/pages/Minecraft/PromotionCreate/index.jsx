import { Chip, Divider, Grid, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useCreate, useNotify, useRedirect, useTranslate } from "react-admin";
import useStyles from "../../../assets/theme/common";
import Stepper from "../../../components/Stepper";
import { TIMEOUT } from "../../../config/GlobalConfig";
import promotionConfig from "../../../config/PromotionConfig";
import { onFailure, onSuccess } from "../../../utils/CustomHooks";
import ActionAndPrice from "../promotionalForms/ActionAndPrice";
import BasicProperties from "../promotionalForms/BasicProperties";
import Criteria from "../promotionalForms/Criteria";
import ManageCodes from "../promotionalForms/ManageCodes";
import preparePromotionalData from "../PromotionHelper/preparePromotionData";
import { formReducer, formValidityReducer } from "../PromotionHelper/promotionReducer";

/**
 * @function PromotionCreate Component used to show new fields based on selected form.
 * @returns {React.Component} return react component.
 */
const PromotionCreate = () => {
  const classes = useStyles();
  const [stepCount, setStepCount] = useState(promotionConfig.defaultStepperCount);

  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  const listingUrl = `/${window.REACT_APP_MINECRAFT_SERVICE}/promotions`;

  const [masterForm, updateMasterForm] = useReducer(formReducer, promotionConfig.initialMasterFormValue);

  const [masterFormValidity, updateMasterFormValidity] = useReducer(
    formValidityReducer,
    promotionConfig.initialMasterFormValidity,
  );

  useEffect(() => {
    updateMasterForm({ type: "setValue", payload: promotionConfig.initialMasterFormValue });
  }, []);

  const childForms = [
    <BasicProperties
      formValues={masterForm}
      updateMasterForm={updateMasterForm}
      updateMasterFormValidity={updateMasterFormValidity}
    />,
    <ManageCodes
      formValues={masterForm}
      updateMasterForm={updateMasterForm}
      updateMasterFormValidity={updateMasterFormValidity}
    />,
    <Criteria
      formValues={masterForm}
      updateMasterForm={updateMasterForm}
      updateMasterFormValidity={updateMasterFormValidity}
    />,
    <ActionAndPrice
      formValues={masterForm}
      updateMasterForm={updateMasterForm}
      updateMasterFormValidity={updateMasterFormValidity}
    />,
  ];

  const stepperLabels = [
    <Chip label={translate("basic_properties")} href="#chip" variant="outlined" />,
    <Chip label={translate("manage_codes")} href="#chip" variant="outlined" />,
    <Chip label={translate("criteria")} href="#chip" variant="outlined" />,
    <Chip label={translate("action_and_Price")} href="#chip" variant="outlined" />,
  ];

  /**
   *
   * @function handleCreatePromotionSuccess handle success of promotion creation
   * @param {object} res response.
   */
  const handleCreatePromotionSuccess = (res) => {
    notify(`${translate("promotion_created")} - ${res?.data?.data?.promotionName}`, "info", TIMEOUT);
    redirect(listingUrl);
  };

  const [createPromotion] = useCreate(
    `${window.REACT_APP_MINECRAFT_SERVICE}/promotions`,
    {
      dataObj: preparePromotionalData.create(masterForm),
      params: {},
    },
    {
      onSuccess: (response) =>
        onSuccess({
          response,
          notify,
          translate,
          handleSuccess: handleCreatePromotionSuccess,
        }),
      onFailure: (error) => onFailure({ error, notify, translate }),
    },
  );

  /**
   * @function handleCreate handle creation of form details
   */
  const handleCreate = useCallback(() => {
    createPromotion();
  }, [createPromotion]);

  /**
   * @function handleNextStepCount move to next form to be filled.
   */
  const handleNextStepCount = useCallback((step) => {
    setStepCount(step + 1);
  }, []);

  /**
   * @function handlePrevStepCount move to previous form to be edited.
   */
  const handlePrevStepCount = useCallback((step) => {
    setStepCount(step - 1);
  }, []);

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={1}
        justify="space-between"
        className={classes.gridStyle}
        data-testid="promotionCreate"
      >
        <Grid item>
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("promotion_title")}
          </Typography>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
        </Grid>
        <Stepper
          StepsArray={childForms}
          LabelsArray={stepperLabels}
          prev={translate("prev")}
          next={translate("next")}
          create={translate("create")}
          createData={handleCreate}
          handleNextSteps={handleNextStepCount}
          handlePrevSteps={handlePrevStepCount}
          isDisable={!masterFormValidity[promotionConfig?.stepperForms[stepCount]?.type]}
        />
      </Grid>
    </>
  );
};

export default PromotionCreate;
