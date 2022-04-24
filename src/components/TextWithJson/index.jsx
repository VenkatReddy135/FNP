/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import * as React from "react";

import { TextField } from "react-admin";

/**
 * Component for creating text component which is for nested object
 *
 * @param {*} props all the props required for TextWithJson
 * @returns {React.ReactElement} returns a React component with Link.
 */
const TextWithJson = (props) => {
  const { record, source, indent = 2 } = props;

  if (Object.prototype.toString.call(record[source]) === "[object Object]") {
    return <pre>{JSON.stringify(record[source], undefined, indent)}</pre>;
  }
  return <TextField title={record[source] || ""} {...props} />;
};

TextWithJson.propTypes = {
  record: PropTypes.objectOf(PropTypes.object),
  source: PropTypes.string,
  indent: PropTypes.string,
};
TextWithJson.defaultProps = {
  record: {},
  source: "",
  indent: "",
};

export default TextWithJson;
