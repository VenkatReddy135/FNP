import * as React from "react";
import Button from "@material-ui/core/Button";
import ErrorIcon from "@material-ui/icons/Report";
import History from "@material-ui/icons/History";
import { Title, useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
/**
 *
 * ErrorBoundary for Zeus
 *
 * @function ErrorBoundary
 * @returns {React.ReactElement} ErrorBoundary
 */
const ErrorBoundary = () => {
  const translate = useTranslate();
  const history = useHistory();
  const classes = useStyles();
  return (
    <div>
      <Title title="Error" />
      <Grid container justify="center" alignItems="center" className={classes.errorGridStyle}>
        <ErrorIcon color="inherit" className={classes.errorIcon} />
        <Typography className={classes.errorMsg}>{translate("error_boundary_heading")}</Typography>
      </Grid>
      <Grid container justify="center" alignItems="center" direction="column" className={classes.errorGridStyle}>
        <p>{translate("error_boundary_error_desc")}</p>
        <Button variant="contained" startIcon={<History />} onClick={() => history.go(-1)}>
          {translate("error_boundary_back_nav")}
        </Button>
      </Grid>
    </div>
  );
};

export default ErrorBoundary;
