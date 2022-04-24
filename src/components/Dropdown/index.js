/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { SelectInput, useTranslate } from "react-admin";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "./DropdownStyle";

/**
 * DropDownText component
 *
 * @param {*} root0 props
 * @param {string} root0.label label props
 * @param {string} root0.value value props
 * @param {Array} root0.data data props
 * @param {boolean} root0.edit edit props
 * @param {Function} root0.onSelect onSelect props
 * @returns {React.Component} return  Component
 */
const DropDownText = ({ label, value, data, edit, onSelect, validate, className, gridSize, source, disabled }) => {
  const classes = useStyles();
  const translate = useTranslate();

  if (!edit) {
    return (
      <Grid item {...gridSize} className={className}>
        <Grid className={classes.labelText}>{translate(label)}</Grid>
        <Grid className={classes.valueText}>{value}</Grid>
      </Grid>
    );
  }

  return (
    <Grid item {...gridSize} className={className}>
      <SelectInput
        onChange={onSelect}
        fullWidth
        defaultValue={value}
        variant="standard"
        label={translate(label)}
        validate={validate}
        source={source || label}
        choices={data}
        disabled={disabled}
      />
    </Grid>
  );
};
const dataArrayType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});
DropDownText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  data: PropTypes.arrayOf(dataArrayType).isRequired,
  edit: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.any]),
  className: PropTypes.string,
  source: PropTypes.string,
  gridSize: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
};
DropDownText.defaultProps = {
  validate: null,
  value: null,
  onSelect: null,
  className: "",
  source: "",
  gridSize: { xs: 12, sm: 4, md: 4 },
  disabled: false,
};
export default DropDownText;
