import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { TextField, Button, FormControl, FormHelperText } from "@material-ui/core";
import AuthProvider from "../../../authServices/authProvider";
import useStyles from "./forgot-password-styles";

/**
 *
 * Forgot password Form to enter email id to get reset link in the email
 *
 * @function ForgotPasswordForm
 * @returns {React.ReactElement} Forgot Password form.
 * @param {*} toggleContent props of the Forgot Password
 */
const ForgotPasswordForm = ({ toggleContent }) => {
  const classes = useStyles();
  const [userName, updateUserName] = useState(null);
  const [error, showHideErrorMessage] = useState("");
  const translate = useTranslate();

  /**
   * Function to validate the email id in the forgot password form and call forgot password API
   *
   * @param {object} event contains data of the form
   */
  const sendLinkHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await AuthProvider.forgotPassword({ userName });
      if (data && data.successCode && data.successCode === "user.request.sent_reset_password_link") {
        toggleContent(true);
      }
    } catch (errorMessage) {
      showHideErrorMessage(errorMessage.message);
    }
  };

  /**
   * Function to validate email id on change of value
   *
   * @param {object} event contains data of the form
   */
  const usernameHandler = (event) => {
    const currentUserName = event.target.value;
    updateUserName(currentUserName);
    if (!currentUserName) {
      showHideErrorMessage(translate("forgotForm.emailError"));
    } else {
      showHideErrorMessage("");
    }
  };

  return (
    <form onSubmit={sendLinkHandler}>
      <FormControl className={classes.customBackground}>
        <TextField
          type="email"
          required
          id="standard-basic"
          name="username"
          className={classes.inputClass}
          data-at-id="userName"
          error={userName === ""}
          label={translate("forgotForm.emailLabel")}
          size="small"
          autoComplete="off"
          focused={false}
          onChange={(event) => usernameHandler(event)}
        />
        <FormHelperText id="my-helper-text" className={classes.errorClass}>
          {error}
        </FormHelperText>
        <Button type="submit" variant="contained" color="primary" className={classes.btnContained}>
          {translate("forgotForm.buttonText")}
        </Button>
      </FormControl>
    </form>
  );
};
ForgotPasswordForm.propTypes = {
  toggleContent: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
