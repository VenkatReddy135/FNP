/* eslint-disable react/destructuring-assignment */
import React from "react";
import { DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../assets/theme/common";
/**
 *
 * @param {*} props all props
 *@function CommonDialogContent
 * @returns {React.createElement} CommonDialogContent
 */
export default function CommonDialogContent(props) {
  const classes = useStyles();
  return (
    <DialogContent>
      <DialogContentText className={classes.dialogContentStyle}>{props.message}</DialogContentText>
    </DialogContent>
  );
}

CommonDialogContent.propTypes = {
  message: PropTypes.string.isRequired,
};
