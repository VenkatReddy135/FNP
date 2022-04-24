/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/dayjs"; // choose your lib
import { TextField } from "@material-ui/core";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";
import { useInput, useTranslate } from "react-admin";

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
const TimeInput = (props) => {
  const { source, className, label, disabled } = props;
  const [selectedDate, setSelectedDate] = useState("");
  const translate = useTranslate();
  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;
  const { touched, error } = meta || {};

  const { value, onChange: onHandleChange } = input || {};

  /**
   * handleTimePicker function
   *
   * @param {object} e event object
   */
  const handleTimePicker = (e) => {
    setSelectedDate(e);
  };

  /**
   * handleDatePicker function
   *
   * @param {number} val event object
   * @returns {string} value
   */
  const makeDoubleDigit = (val) => {
    return val.toString().length === 1 ? `0${val}` : val;
  };

  useEffect(() => {
    if (value.length) {
      const getDate = new Date().toLocaleString().split(",");
      const date = getDate[0].split("/");
      const year = date[2];
      const month = date[1];
      const day = date[0];
      const dateString = `${year}-${month}-${day}`;
      setSelectedDate(`${dateString}T${value}`);
    }
  }, []);

  useEffect(() => {
    if (selectedDate !== "") {
      const getDate = new Date(selectedDate) || "";
      const hh = getDate.getHours();
      const mm = getDate.getMinutes();
      const ss = getDate.getSeconds();
      const event = {
        target: {
          name: source,
          value: `${makeDoubleDigit(hh)}:${makeDoubleDigit(mm)}:${makeDoubleDigit(ss)}`,
        },
      };
      onHandleChange(event);
    }
  }, [selectedDate]);

  return (
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              name={source}
              ampm={false}
              openTo="hours"
              views={["hours", "minutes", "seconds"]}
              format="HH:mm:ss"
              value={selectedDate}
              className={className}
              onChange={handleTimePicker}
              disabled={disabled}
              InputProps={{
                disableUnderline: true,
              }}
              invalidDateMessage=""
            />
          </MuiPickersUtilsProvider>
        ),
      }}
    />
  );
};

TimeInput.propTypes = {
  source: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

TimeInput.defaultProps = {
  source: "",
  label: "",
  disabled: false,
  className: "",
};

export default TimeInput;
