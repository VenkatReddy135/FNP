/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from "react";
import { useInput, useTranslate } from "react-admin";
import { TextField, Grid, Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/dayjs"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";
import formatDateValue from "../../utils/formatDateTime";

/**
 * InputComponent component
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
 * DatePickerInput component
 *
 * @param {object} props props
 * @returns {React.Component} return  Component
 */
const DatePickerInput = (props) => {
  const translate = useTranslate();

  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;

  const { value, onChange: onHandleChange } = input || {};
  const { touched, error } = meta || {};

  const [state, setState] = useState({
    datePickerVal: value || null,
    actualTimeObj: value || null,
    isChanged: false,
  });

  const { source, label, disabled, className, minDate, maxDate, dataId } = props;
  const { datePickerVal, isChanged, actualTimeObj } = state;

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
   * handleOnChange function
   *
   * @param {event} event event object
   * @returns {string} value
   */
  const handleOnChange = (event) => {
    return onHandleChange && onHandleChange(event);
  };

  /**
   * handleDatePicker function
   *
   * @param {object} e event object
   */
  const handleDatePicker = (e) => {
    const tempDate = `${e.get("year")}-${makeDoubleDigit(e.get("month") + 1)}-${makeDoubleDigit(e.get("date"))}`;
    setState((prevState) => ({ ...prevState, datePickerVal: tempDate, isChanged: true }));
  };

  useEffect(() => {
    if (isChanged) {
      let time = "";
      if (actualTimeObj) {
        time = `${datePickerVal}`;
      } else if (datePickerVal) {
        time = `${datePickerVal}`;
      }
      const event = {
        target: {
          name: source,
          value: time,
        },
      };
      handleOnChange(event);
    }
  }, [state]);

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
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  value={datePickerVal}
                  data-at-id={dataId}
                  onChange={handleDatePicker}
                  format="DD/MM/YYYY"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  invalidDateMessage=""
                  {...restObj}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          ),
        }}
      />
    </>
  );
};

DatePickerInput.propTypes = {
  source: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  dataId: PropTypes.string.isRequired,
};

DatePickerInput.defaultProps = {
  source: "",
  label: "",
  disabled: false,
  className: "",
  minDate: "",
  maxDate: "",
};

export default React.memo(DatePickerInput);
