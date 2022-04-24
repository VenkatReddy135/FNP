/* eslint-disable no-underscore-dangle */
import React from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@material-ui/core";
import { useTranslate } from "react-admin";
import useStyles from "./CommonButtonStyle";

/**
 *
 * @param {*} param0 props of the commonButtonRow
 * @returns {React.Component} return component
 */
const CommonButtonRow = ({ onClickCancel, onClickUpdate, updateBtnDisable, create }) => {
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <Grid container spacing={1} className={classes.buttonView}>
      <Grid item>
        <Button onClick={onClickCancel} type="button" variant="outlined" className={classes.cancelButton}>
          {translate("cancel")}
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={onClickUpdate}
          variant="contained"
          className={classes.submitButton}
          disabled={updateBtnDisable}
        >
          {create ? translate("create") : translate("update")}
        </Button>
      </Grid>
    </Grid>
  );
};

CommonButtonRow.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  onClickUpdate: PropTypes.func.isRequired,
  updateBtnDisable: PropTypes.bool,
  create: PropTypes.bool,
};
CommonButtonRow.defaultProps = {
  updateBtnDisable: false,
  create: false,
};
export default CommonButtonRow;
