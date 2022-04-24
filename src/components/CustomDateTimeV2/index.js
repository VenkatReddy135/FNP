/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from "react";
import { useInput, useTranslate } from "react-admin";
import { TextField, Grid, Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/dayjs"; // choose your lib
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";

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
  const translate = useTranslate();

  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;

  const { value, onChange: onHandleChange } = input || {};
  const { touched, error } = meta || {};

  /**
   * formatApiDate function
   *
   * @returns {string} containing splitted date time value
   */
  const formatApiDate = () => {
    if (value.includes("T")) {
      return value.split("T");
    }
    return null;
  };

  const [state, setState] = useState({
    datePickerVal: value ? formatApiDate(value)[0] : null,
    timePickerVal: value ? formatApiDate(value)[1] : null,
    actualTimeObj: value || null,
    isChanged: false,
  });

  const { source, label, disabled, resetSignal, className, minDate, maxDate, throwError } = props;
  const { datePickerVal, timePickerVal, isChanged, actualTimeObj } = state;

  let restObj = {};
  if (minDate) {
    restObj = { ...restObj, minDate };
  }
  if (maxDate) {
    restObj = { ...restObj, maxDate };
  }

  /**
   * handleDatePicker function
   *
   * @param {number} val event object
   * @returns {string} value
   */
  const makeDoubleDigit = (val) => {
    return val.toString().length === 1 ? `0${val}` : val;
  };

  /**
   * handleDatePicker function
   *
   * @param {object} e event object
   */
  const handleDatePicker = (e) => {
    const tempDate = `${e.get("year")}-${makeDoubleDigit(e.get("month") + 1)}-${makeDoubleDigit(e.get("date"))}`;
    setState((prevState) => ({ ...prevState, datePickerVal: tempDate, isChanged: true }));
    if (!timePickerVal) {
      setState((prevState) => ({ ...prevState, timePickerVal: "00:00:00", actualTimeObj: `${tempDate}T00:00:00` }));
    }
  };

  /**
   * handleTimePicker function
   *
   * @param {object} e event object
   */
  const handleTimePicker = (e) => {
    const tempTime = `${makeDoubleDigit(e.get("hour"))}:${makeDoubleDigit(e.get("minute"))}:${makeDoubleDigit(
      e.get("second"),
    )}`;
    const totalTime = `${datePickerVal}T${tempTime}`;
    setState((prevState) => ({ ...prevState, timePickerVal: tempTime, actualTimeObj: totalTime, isChanged: true }));
  };

  useEffect(() => {
    if (isChanged) {
      let time = "";
      if (actualTimeObj) {
        time = `${datePickerVal}T${timePickerVal}`;
      } else if (datePickerVal) {
        time = `${datePickerVal}T00:00:00`;
      }
      const event = {
        target: {
          name: source,
          value: time,
        },
      };
      onHandleChange && onHandleChange(event);
    }
  }, [state]);

  useEffect(() => {
    if (resetSignal) {
      setState({
        datePickerVal: null,
        timePickerVal: null,
        actualTimeObj: null,
        isChanged: false,
      });
    }
  }, [resetSignal]);

  if (disabled) {
    return (
      <Grid container>
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
        error={(touched && error) || throwError}
        multiline
        InputLabelProps={{ shrink: true }}
        InputProps={{
          inputComponent: InputComponent,
        }}
        helperText={(touched && translate(error)) || throwError || " "}
        inputProps={{
          children: (
            <Grid container wrap="nowrap">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  value={datePickerVal}
                  onChange={handleDatePicker}
                  format="DD/MM/YYYY"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  invalidDateMessage=""
                  {...restObj}
                />
                <TimePicker
                  placeholder="HH:MM:SS"
                  ampm={false}
                  openTo="hours"
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  value={actualTimeObj}
                  onChange={handleTimePicker}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  invalidDateMessage=""
                  disabled={!datePickerVal}
                />
              </MuiPickersUtilsProvider>
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
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  throwError: PropTypes.string,
};

DateTimeInput.defaultProps = {
  source: "",
  label: "",
  disabled: false,
  resetSignal: false,
  className: "",
  minDate: null,
  maxDate: null,
  throwError: "",
};

export default React.memo(DateTimeInput);
