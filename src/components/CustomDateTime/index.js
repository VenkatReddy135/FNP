/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from "react";
import { useInput, useTranslate } from "react-admin";
import { TextField, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "./CustomDateTimeStyle";
import formatDateValue from "../../utils/formatDateTime";
/**
 * TextInput component
 *
 * @param {object} object is passed to the function
 * @param {object} object.inputRef props
 * @returns {React.Component} return InputComponent
 */
const InputComponent = ({ inputRef, ...other }) => <div {...other} />;

InputComponent.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

/**
 * TextInput component
 *
 * @param {object} props props
 * @returns {React.Component} return  Component
 */
const DateTimeInput = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;

  const { value, onChange: onHandleChange } = input || {};
  const { touched, error } = meta || {};

  /**
   * dateTimeSplitter function
   *
   * @returns {Array} containing splitted date time value
   */
  const dateTimeSplitter = () => {
    if (value.includes("T")) {
      return value.split("T");
    }
    return value.split(" ");
  };
  const [state, setState] = useState({
    datePickerVal: dateTimeSplitter()[0] || "",
    timePickerVal: dateTimeSplitter()[1] || "",
    isChanged: false,
  });

  const { source, label, disabled, resetSignal, className, hasSeconds, minDate, maxDate } = props;
  const { datePickerVal, timePickerVal, isChanged } = state;

  const addStep = hasSeconds ? 2 : "";
  const addSecondsValue = hasSeconds ? ":00" : "";

  /**
   * handleDatePicker function
   *
   * @param {object} e event object
   */
  const handleDatePicker = (e) => {
    setState((prevState) => ({ ...prevState, datePickerVal: e.target.value, isChanged: true }));
  };

  /**
   * handleTimePicker function
   *
   * @param {object} e event object
   */
  const handleTimePicker = (e) => {
    setState((prevState) => ({ ...prevState, timePickerVal: e.target.value, isChanged: true }));
  };

  useEffect(() => {
    if (isChanged) {
      const event = {
        target: {
          name: source,
          value: datePickerVal ? `${datePickerVal}T${timePickerVal || `00:00${addSecondsValue}`}` : "",
        },
      };
      onHandleChange && onHandleChange(event);
    }
  }, [state]);

  useEffect(() => {
    if (resetSignal) {
      setState({
        datePickerVal: "",
        timePickerVal: "",
        isChanged: false,
      });
    }
  }, [resetSignal]);

  if (disabled) {
    return (
      <Grid className={classes.gridStyleNew} container>
        <Grid item container direction="column">
          <Typography variant="caption">{label}</Typography>
          <Typography variant="subtitle2">{formatDateValue(value)}</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <TextField
        fullWidth
        data-testid="CustomDateTimeInput"
        className={className}
        variant="standard"
        label={`${label} ${data.isRequired ? "*" : ""}`}
        error={touched && error}
        multiline
        InputLabelProps={{ shrink: true }}
        InputProps={{
          inputComponent: InputComponent,
        }}
        helperText={(touched && translate(error)) || " "}
        inputProps={{
          children: (
            <Grid container wrap="nowrap">
              <TextField
                name="date"
                variant="standard"
                type="date"
                inputProps={{ "data-testid": "date", min: minDate, max: maxDate }}
                value={datePickerVal}
                onChange={handleDatePicker}
                InputProps={{
                  classes: { input: classes.pointer },
                  disableUnderline: true,
                }}
              />
              <TextField
                name="time"
                inputProps={{ "data-testid": "time", step: addStep }}
                className={classes.timePicker}
                variant="standard"
                type="time"
                value={timePickerVal}
                disabled={!datePickerVal}
                onChange={handleTimePicker}
                InputProps={{
                  classes: { input: classes.pointer },
                  disableUnderline: true,
                }}
              />
            </Grid>
          ),
        }}
      />
    </>
  );
};

DateTimeInput.propTypes = {
  source: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  resetSignal: PropTypes.bool,
  className: PropTypes.string,
  hasSeconds: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

DateTimeInput.defaultProps = {
  source: "",
  label: "",
  disabled: false,
  resetSignal: false,
  className: "",
  hasSeconds: true,
  minDate: null,
  maxDate: null,
};

export default React.memo(DateTimeInput);
