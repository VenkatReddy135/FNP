/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import get from "lodash/get";

/**
 * Component for creating text component
 *
 * @param {*} props all the props required for TextField
 * @returns {React.ReactElement} returns a React component with Link.
 */
const TextField = (props) => {
  const { record, source } = props;
  const value = get(record, source) || "";

  return (
    <Typography component="span" title={value} variant="body2" {...props}>
      {value !== null && typeof value !== "string" ? JSON.stringify(value) : value || ""}
    </Typography>
  );
};

TextField.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  source: PropTypes.string,
};
TextField.defaultProps = {
  record: {},
  source: "",
};
export default TextField;
