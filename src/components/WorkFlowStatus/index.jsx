import PropTypes from "prop-types";
import React from "react";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { makeStyles } from "@material-ui/core";

/**
 * makeStyles hook of material-ui to apply style for status component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  approved: {
    fill: "#009D43",
    height: "20px",
    width: " 20px",
  },
  declined: {
    fill: "#E53333",
    height: "20px",
    width: " 20px",
  },
  pending: {
    fill: "#FF9212",
    height: "20px",
    width: " 20px",
  },
});
/**
 * Component for workflow status icon for displaying workflow status.
 *
 * @param {*} props all the props required for workflow icon
 * @returns {React.ReactElement} returns a React component for workflow status.
 */
const WorkFlowStatus = (props) => {
  const classes = useStyles();
  const { record, source } = props;
  const workflowStatusIcon = record[source] || record;
  let workFlowStatus = null;
  switch (workflowStatusIcon) {
    case "APPROVED":
      workFlowStatus = <CheckCircleOutlineOutlinedIcon className={classes.approved} />;
      break;
    case "PENDING":
      workFlowStatus = <img src="/images/pending-24px.svg" alt="pending" className={classes.pending} />;
      break;
    case "DECLINED":
      workFlowStatus = <CancelOutlinedIcon className={classes.declined} />;
      break;
    default:
      return null;
  }
  return workFlowStatus;
};

WorkFlowStatus.propTypes = {
  record: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  source: PropTypes.string,
};

WorkFlowStatus.defaultProps = {
  record: null,
  source: "workflowStatus",
};

export default WorkFlowStatus;
