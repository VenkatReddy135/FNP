import React from "react";
import PropTypes from "prop-types";
import useStyles from "./StatusStyle";

/**
 * @function StatusField to display Active/Inactive/Expired status and to apply color on  status values either red or green
 * @param {object} props - Passing record, source
 * @returns {string} status - according to status, color is applied to the values
 */
const StatusField = (props) => {
  const classes = useStyles();
  const { record, source, displayStatusText } = props;

  if (record[source] === true || record[source] === "active") {
    return <span className={classes.statusActive}>{displayStatusText.trueText}</span>;
  }
  return <span className={classes.statusInActive}>{displayStatusText.falseText}</span>;
};

StatusField.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  source: PropTypes.string.isRequired,
  displayStatusText: PropTypes.objectOf(PropTypes.string),
};

StatusField.defaultProps = {
  record: {},
  displayStatusText: { trueText: "", falseText: "" },
};

export default StatusField;
