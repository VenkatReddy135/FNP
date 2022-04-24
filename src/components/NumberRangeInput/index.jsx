/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from "react";
import { useInput, useTranslate } from "react-admin";
import { TextField, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
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
 * NumberRangeInput component
 *
 * @param {object} props props
 * @returns {React.Component} return  Component
 */
const NumberRangeInput = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const data = useInput(props);

  const input = data && data?.input;
  const meta = data && data?.meta;

  const { value, onChange: onHandleChange } = input || {};
  const { touched, error } = meta || {};
  const { edit, source, label, onKeyDown, startLabel, endLabel, min, max } = props;

  const [range, setRange] = useState([value ? value[0] : null, value ? value[1] : null]);

  const [maxFromValue, setMaxFromValue] = useState(null);
  const [minToValue, setMinToValue] = useState(null);

  /**
   * handleStartValue function
   *
   * @param {object} e event object
   */
  const handleStartValue = (e) => {
    setRange([e.target.value, range[1]]);
  };

  /**
   * handleEndValue function
   *
   * @param {object} e event object
   */
  const handleEndValue = (e) => {
    setRange([range[0], e.target.value]);
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
      setMinToValue(range[0]);
    } else {
      setMinToValue(min);
    }
    if (range[1]) {
      setMaxFromValue(range[1]);
    } else {
      setMaxFromValue(max);
    }
  }, [range]);

  if (!edit) {
    return (
      <Grid container item md={12}>
        <Grid item md={6} className={classes.toRight}>
          <Typography variant="caption">{startLabel}</Typography>
          <Typography variant="h6">{value[0]}</Typography>
        </Grid>
        <Grid item md={6} className={classes.toLeft}>
          <Typography variant="caption">{endLabel}</Typography>
          <Typography variant="h6">{value[1]}</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <TextField
        data-testid="NumberRangeInput"
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
            <Grid item container wrap="nowrap" justify="space-between" md={12}>
              <Grid item md={6} className={classes.toRight}>
                <TextField
                  className={classes.inputWrapper}
                  name="start"
                  variant="standard"
                  label="From Value"
                  type="number"
                  inputProps={{ "data-testid": "start", style: { fontWeight: 600 }, min, max: maxFromValue }}
                  value={range[0]}
                  onChange={handleStartValue}
                  onKeyDown={onKeyDown}
                />
              </Grid>

              <Grid item md={6} className={classes.toLeft}>
                <TextField
                  className={classes.inputWrapper}
                  name="end"
                  variant="standard"
                  label="To Value"
                  type="number"
                  inputProps={{ "data-testid": "end", style: { fontWeight: 600 }, min: minToValue, max }}
                  value={range[1]}
                  onChange={handleEndValue}
                  onKeyDown={onKeyDown}
                />
              </Grid>
            </Grid>
          ),
        }}
      />
    </>
  );
};

NumberRangeInput.propTypes = {
  edit: PropTypes.bool,
  source: PropTypes.string,
  label: PropTypes.string,
  onKeyDown: PropTypes.func,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

NumberRangeInput.defaultProps = {
  edit: true,
  source: "",
  label: "",
  onKeyDown: () => {},
  startLabel: "From Value",
  endLabel: "To Value",
  min: null,
  max: null,
};

export default React.memo(NumberRangeInput);
