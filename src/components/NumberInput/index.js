import React from "react";
import { NumberInput, useTranslate } from "react-admin";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../assets/theme/common";
/**
 * TextInput component
 *
 * @param {*} root0 props
 * @param {string} root0.label label props
 * @param {string} root0.value value props
 * @param {boolean} root0.edit edit props
 * @param {string} root0.validate validate props
 * @param {string} root0.typeText typeText props
 * @param {string} root0.onKeyDown onKeyDown props
 * @param {string} root0.min min props
 * @param {string} root0.max max props
 * @param {string} root0.customSource customSource props
 * @returns {React.Component} return  Component
 */
const CustomNumberInput = ({ label, value, validate, onChange, edit, typeText, onKeyDown, min, max, customSource }) => {
  const classes = useStyles();
  const translate = useTranslate();
  if (!edit) {
    return (
      <Grid item xs={12} sm={4} md={4}>
        <Grid className={classes.labelText}>{translate(label)}</Grid>
        <Grid className={classes.valueText}>{typeText ? `${value} - ${typeText}` : value}</Grid>
      </Grid>
    );
  }
  return (
    <Grid item xs={12} sm={4} md={4}>
      <NumberInput
        className={classes.textInputWrap}
        variant="standard"
        name={customSource || label}
        label={translate(label)}
        source={customSource || label}
        defaultValue={value}
        onChange={onChange}
        validate={validate}
        onKeyDown={onKeyDown}
        min={min}
        max={max}
      />
    </Grid>
  );
};

CustomNumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  edit: PropTypes.bool.isRequired,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.any]),
  onChange: PropTypes.func,
  typeText: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  customSource: PropTypes.string,
};
CustomNumberInput.defaultProps = {
  validate: null,
  value: null,
  onChange: null,
  onKeyDown: () => {},
  min: null,
  max: null,
  customSource: null,
};
export default CustomNumberInput;
