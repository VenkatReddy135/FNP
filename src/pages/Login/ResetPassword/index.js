import React, { useState } from "react";
import { useTranslate } from "react-admin";
import { Paper, Grid, Hidden } from "@material-ui/core";
import ResetForm from "./ResetForm";
import ResetConfirmation from "./ResetConfirmation";
import useStyles from "../login-styles";

/**
 * Reset Password Form to enter password and confirm password
 *
 * @function Reset Password
 * @returns {React.ReactElement} Reset form.
 */
const ResetPassword = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const [toggleFlag, toggleContent] = useState(false);

  /**
   *
   * @param {boolean} flag change the content of reset form
   */
  const changeContent = (flag) => {
    toggleContent(flag);
  };

  return (
    <Paper elevation={3} className={classes.container}>
      <Grid container spacing={3}>
        <Hidden smDown>
          <Grid container item md={6}>
            <img src="/images/Flower.png" className={classes.flowerImg} alt="FNP" />
          </Grid>
        </Hidden>
        <Grid container item md={6} direction="column" alignItems="center">
          <img src="/images/zeus-logo.png" alt="zeus" className={classes.logo} />
          {!toggleFlag ? (
            <ResetForm title={translate("resetForm.formTitle")} changeContent={changeContent} />
          ) : (
            <ResetConfirmation
              title={translate("resetForm.successMsg")}
              body={translate("resetForm.successMsgTitle")}
              path="login"
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ResetPassword;
