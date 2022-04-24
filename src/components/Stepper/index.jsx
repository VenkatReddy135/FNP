/* eslint-disable react/destructuring-assignment */
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Stepper, Step, StepLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  buttonStyle: {
    position: "absolute",
    bottom: "10px",
  },
  buttonHide: {
    display: "none",
  },
  iconActive: {
    fill: "#FFFFFF",
    zIndex: "1",
  },
  formStyle: {
    marginBottom: "10px",
  },
}));

/**
 * Component for Create stepper
 *
 * @param {*} props all the props for Generic stepper
 * @returns {React.ReactElement} returns a create stepper component
 */
const GenericStepper = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  /**
   * @function getSteps
   * @returns {Array} array of labels for stepper
   */
  function getSteps() {
    return props.LabelsArray;
  }
  const steps = getSteps();

  /**
   * @function getStepContent
   * @param {number} stepIndex get steps content
   * @returns {Array}  array of steps
   */
  function getStepContent(stepIndex) {
    return props.StepsArray[stepIndex];
  }

  /**
   * @function handleNext
   */
  const handleNext = useCallback(() => {
    if (activeStep === steps.length - 1) {
      props.createData();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      props.handleNextSteps(activeStep);
    }
  }, [activeStep, props, steps.length]);

  /**
   * @function handleBack
   */
  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    props.handlePrevSteps(activeStep);
  }, [props, activeStep]);

  return (
    <>
      <div className={classes.formStyle}>
        <Stepper activeStep={activeStep} connector={null}>
          {steps.map((label) => (
            <Step key={label.props.label}>
              <StepLabel
                StepIconProps={{
                  classes: {
                    active: classes.iconActive,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
        <div className={classes.buttonStyle}>
          <Button
            onClick={handleBack}
            data-at-id="previous"
            variant="outlined"
            size="large"
            className={activeStep === 0 ? classes.buttonHide : null}
          >
            {props.prev}
          </Button>
          <Button
            variant="contained"
            data-at-id="continue"
            onClick={handleNext}
            disabled={props.isDisable}
            size="large"
          >
            {activeStep === steps.length - 1 ? props.create : props.next}
          </Button>
        </div>
      </div>
    </>
  );
};
GenericStepper.propTypes = {
  StepsArray: PropTypes.shape.isRequired,
  LabelsArray: PropTypes.shape.isRequired,
  prev: PropTypes.string,
  create: PropTypes.string,
  next: PropTypes.string,
  createData: PropTypes.func.isRequired,
  isDisable: PropTypes.bool,
  handleNextSteps: PropTypes.func.isRequired,
  handlePrevSteps: PropTypes.func.isRequired,
};
GenericStepper.defaultProps = {
  prev: "",
  create: "",
  next: "",
  isDisable: false,
};
export default React.memo(GenericStepper);
