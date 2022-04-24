/* eslint-disable react/jsx-props-no-spreading */
import { Chip, Divider, Grid, Typography } from "@material-ui/core";
import React, { useCallback, useReducer } from "react";
import { useTranslate } from "react-admin";
import useStyles from "../../../../assets/theme/common";
import Stepper from "../../../../components/Stepper";
import Features from "./features";
import BasicDetails from "./BasicDetails";
import formReducer from "../../helper/createProductReducer";
import { INCREMENT_STEPPER, DECREMENT_STEPPER } from "../../helper/createProductAction";

/**
 * @function CreateProduct Create product container of multiple forms.
 * @returns {React.Component} return react component.
 */
const CreateProduct = () => {
  const classes = useStyles();
  const translate = useTranslate();

  const [state, dispatch] = useReducer(formReducer, { stepCount: 0 });

  const childForms = [
    <BasicDetails />,
    <div {...state}>form 2</div>,
    <div {...state}>form 3</div>,
    <div {...state}>form 4</div>,
    <Features {...state} />,
    <div {...state}>form 6</div>,
  ];

  const stepperLabels = [
    <Chip label={translate("basic_details")} href="#chip" variant="outlined" />,
    <Chip label={translate("relations")} href="#chip" variant="outlined" />,
    <Chip label={translate("composition_details")} href="#chip" variant="outlined" />,
    <Chip label={translate("tags")} href="#chip" variant="outlined" />,
    <Chip label={translate("features")} href="#chip" variant="outlined" />,
    <Chip label={translate("personalization")} href="#chip" variant="outlined" />,
  ];

  /**
   * @function handleCreate handle creation of form details
   */
  const handleCreate = () => {};

  /**
   * @function handleNextStepCount move to next form to be filled.
   */
  const handleNextStepCount = useCallback((step) => {
    dispatch({ type: INCREMENT_STEPPER, value: step });
  }, []);

  /**
   * @function handlePrevStepCount move to previous form to be edited.
   */
  const handlePrevStepCount = useCallback((step) => {
    dispatch({ type: DECREMENT_STEPPER, value: step });
  }, []);

  return (
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
          {translate("new_product")}
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
      />
    </Grid>
  );
};

export default CreateProduct;
