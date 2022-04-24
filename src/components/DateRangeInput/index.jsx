/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import { Grid, TextField, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { SimpleForm, useInput, useTranslate } from "react-admin";
import formatDateValue from "../../utils/formatDateTime";
import DateTimeimput from "../CustomDateTimeV2";
import useStyles from "./style";

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
 * DateRangeInput component
 *
 * @param {object} props props
 * @returns {React.Component} return  Component
 */
const DateRangeInput = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;

  const { value, onChange: onHandleChange } = input || {};
  const { touched, error } = meta || {};
  const { edit, source, label, startLabel, endLabel, minDate, maxDate } = props;

  const [range, setRange] = useState([value ? value[0] : "", value ? value[1] : ""]);

  const [maxStartDate, setMaxStartDate] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);

  const [key, setKey] = useState("date-key");

  /**
   * handleStartValue function
   *
   * @param {object} e event object
   */
  const handleStartValue = (e) => {
    setKey("from-date-key");
    setRange([e.target.value, range[1]]);
  };

  /**
   * handleEndValue function
   *
   * @param {object} e event object
   */
  const handleEndValue = (e) => {
    setKey("thru-date-key");
    setRange([range[0], e.target.value]);
  };

  const formValue = {
    start: range[0],
    end: range[1],
  };

  useEffect(() => {
    const event = {
      target: {
        name: source,
        value: range,
      },
    };
    onHandleChange && onHandleChange(event);
  }, [range]);

  useEffect(() => {
    if (range[0]) {
      setMinEndDate(range[0].split("T")[0]);
    } else {
      setMinEndDate(minDate);
    }
    if (range[1]) {
      setMaxStartDate(range[1].split("T")[0]);
    } else {
      setMaxStartDate(maxDate);
    }
  }, [range]);

  if (!edit) {
    return (
      <Grid container item md={12}>
        <Grid item md={6} className={classes.toRight}>
          <Typography variant="caption">{startLabel}</Typography>
          <Typography variant="h6">{formatDateValue(value[0])}</Typography>
        </Grid>
        <Grid item md={6} className={classes.toLeft}>
          <Typography variant="caption">{endLabel}</Typography>
          <Typography variant="h6">{formatDateValue(value[1])}</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <TextField
        data-testid="DateRangeInput"
        className={classes.wrapper}
        variant="outlined"
        label={label}
        error={touched && error}
        multiline
        InputLabelProps={{ shrink: true }}
        InputProps={{
          inputComponent: InputComponent,
        }}
        helperText={(touched && translate(error)) || " "}
        inputProps={{
          children: (
            <SimpleForm initialValues={formValue} toolbar={<></>}>
              <Grid item container wrap="nowrap" justify="space-between" md={12} key={key}>
                <Grid item md={6} className={classes.toRight}>
                  <DateTimeimput
                    source="start"
                    label="From Date"
                    onChange={handleStartValue}
                    minDate={minDate}
                    maxDate={maxStartDate}
                  />
                </Grid>
                <Grid item md={6} className={classes.toLeft}>
                  <DateTimeimput
                    source="end"
                    label="To Date"
                    onChange={handleEndValue}
                    minDate={minEndDate}
                    maxDate={maxDate}
                  />
                </Grid>
              </Grid>
            </SimpleForm>
          ),
        }}
      />
    </>
  );
};

DateRangeInput.propTypes = {
  edit: PropTypes.bool,
  source: PropTypes.string,
  label: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

DateRangeInput.defaultProps = {
  edit: true,
  source: "",
  label: "",
  startLabel: "From Date",
  endLabel: "To Date",
  minDate: null,
  maxDate: null,
};

export default React.memo(DateRangeInput);
