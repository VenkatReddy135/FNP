/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TextInput, useTranslate } from "react-admin";
import { Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../assets/theme/common";

/**
 * TextInput component
 *
 * @param {*} root0 props
 * @param {string} root0.source source props
 * @param {string} root0.label label props
 * @param {string} root0.value value props
 * @param {object} root0.validate validate props
 * @param {Function} root0.onChange onChange props
 * @param {Function} root0.onKeyDown onKeyDown props
 * @param {boolean} root0.edit edit props
 * @param {boolean} root0.multiline multiline props
 * @param {string} root0.type type props
 * @param {object} root0.gridSize gridSize props
 * @param {object} root0.className className props
 * @param {object} root0.gridClass gridClass props
 * @param {object} root0.title title props
 * @param {object} root0.defaultValue defaultValue props
 * @param {object} root0.maxLength maxLength props
 * @param {object} root0.min min props
 * @param {object} root0.max max props
 * @returns {React.Component} return  Component
 */
const CustomTextInput = ({
  source,
  label,
  value,
  validate,
  onChange,
  onKeyDown,
  edit,
  multiline,
  type,
  gridSize,
  className,
  gridClass,
  title,
  defaultValue,
  maxLength,
  min,
  max,
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const gridSizeToUse = gridSize || { xs: 12, sm: 4, md: 4 };

  if (!edit) {
    return (
      <Grid item {...gridSizeToUse}>
        <Typography variant="caption">{translate(label)}</Typography>
        <Typography variant="h6" title={title} className={className}>
          {defaultValue || value}
        </Typography>
      </Grid>
    );
  }
  return (
    <Grid item {...gridSizeToUse} className={gridClass}>
      <TextInput
        className={className || classes.textInputWrap}
        variant="standard"
        name={source || label}
        label={translate(label)}
        source={source || label}
        defaultValue={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        validate={validate}
        type={type}
        multiline={multiline}
        inputProps={{ maxLength, min, max }}
      />
    </Grid>
  );
};

CustomTextInput.propTypes = {
  source: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  edit: PropTypes.bool,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.any]),
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  multiline: PropTypes.bool,
  type: PropTypes.string,
  gridSize: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  gridClass: PropTypes.string,
  title: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};
CustomTextInput.defaultProps = {
  source: null,
  validate: null,
  multiline: false,
  edit: false,
  type: "text",
  value: null,
  onChange: null,
  onKeyDown: () => {},
  gridSize: null,
  className: null,
  gridClass: null,
  title: null,
  defaultValue: "",
  maxLength: null,
  min: null,
  max: null,
};
export default CustomTextInput;
