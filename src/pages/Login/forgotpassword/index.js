import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useTranslate } from "react-admin";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import { Paper, Grid, Typography, Button, Hidden } from "@material-ui/core";
import useStyles from "./forgot-password-styles";
import ForgotPasswordForm from "./ForgotPasswordForm";
/**
 *
 * Forgot password Form to enter email id to get reset link in the email
 *
 * @function ForgotPassword
 * @returns {React.ReactElement} Forgot Password form.
 */
const ForgotPassword = () => {
  const classes = useStyles();
  const [toggleFlag, toggleContent] = useState(false);
  const translate = useTranslate();

  return (
    <>
      <Paper elevation={3} className={classes.container}>
        <Grid container spacing={3}>
          <Hidden smDown>
            <Grid container item md={6}>
              <img src="/images/Flower.png" alt="Ferns And Petals" className={classes.flowerImg} />
            </Grid>
          </Hidden>
          <Grid container item md={6} direction="column" justify="flex-start" alignItems="center">
            <img src="images/zeus-logo.png" alt="Logo" className={classes.logoClass} />
            {!toggleFlag ? (
              <>
                <Typography variant="subtitle1" className={classes.subtitle1}>
                  {translate("forgotForm.sectionHeader")}
                </Typography>
                <Typography variant="body2" className={classes.body2}>
                  {translate("forgotForm.sectionDescription")}
                </Typography>
                <ForgotPasswordForm toggleContent={(event) => toggleContent(event)} />
                <Link className={classes.backToLoginBtn} data-at-id="backToLoginLink" to="/login">
                  {translate("forgotForm.backToLoginText")}
                </Link>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" className={classes.subtitle1}>
                  {translate("forgotForm.successSectionHeading")}
                </Typography>
                <CheckCircleOutlinedIcon className={classes.checkedLogo} />
                <Typography variant="body2" gutterBottom className={classes.body2}>
                  {translate("forgotForm.successSectionDescription")}
                </Typography>
                <Button
                  variant="contained"
                  data-at-id="backToLogin"
                  color="primary"
                  component={Link}
                  to="/login"
                  className={classes.btnContained}
                >
                  {translate("forgotForm.backToLoginText")}
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ForgotPassword;
