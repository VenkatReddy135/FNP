/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";

/**
 * CustomViewUI component
 *
 * @param {*} props props
 * @param {string} props.label label props
 * @param {string} props.value value props
 * @param {object} props.gridSize gridSize props
 * @returns {React.Component} return  Component
 */
const CustomViewUI = (props) => {
  const { label, value, gridSize } = props;
  const gridSizeToUse = gridSize || { xs: 12, sm: 4, md: 4 };
  return (
    <>
      <Grid item {...gridSizeToUse}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h6">{value}</Typography>
      </Grid>
    </>
  );
};

CustomViewUI.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, undefined, null]),
  gridSize: PropTypes.objectOf(PropTypes.any),
};
CustomViewUI.defaultProps = {
  label: "",
  value: null,
  gridSize: null,
};
export default CustomViewUI;
