import React from "react";
import PropTypes from "prop-types";
import jsonxml from "jsontoxml";

/**
 * Component for Displaying data in xml view.
 *
 * @param {object}props all the props needed for JsonToXml.
 * @returns {React.Component} React component for Mega menu
 */
const JsonToXml = (props) => {
  const { jsonObj } = props;
  return <pre style={{ color: "#009D43" }}>{jsonxml(jsonObj, { prettyPrint: true, indent: "", xmlHeader: true })}</pre>;
};

JsonToXml.propTypes = {
  jsonObj: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default JsonToXml;
