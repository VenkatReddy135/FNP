import React, { useState } from "react";
import PropTypes from "prop-types";
import { PasswordInput, SimpleForm, regex, useTranslate } from "react-admin";
import { Button, FormHelperText } from "@material-ui/core";
import AuthProvider from "../../../authServices/authProvider";
/**
 * Reset Password Form to enter password and confirm password
 *
 * @param {*} props for password and confirm password
 * @returns {React.ReactElement} Reset form.
 */
const ResetFormUI = (props) => {
  const translate = useTranslate();
  const { title, uid, passwordReg, validateMsg, classes, changeContent } = props;
  const [credentials, updateCredentials] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, updateError] = useState("");
  const validatePasswordRegex = regex(passwordReg, validateMsg);

  /**
   *
   * @returns {*} error
   */
  const validatePassword = () => {
    const errors = {};
    if (!credentials.newPassword) {
      errors.newPassword = [translate("resetForm.newPassValidationMsg")];
    }
    if (!credentials.confirmPassword) {
      errors.confirmPassword = [translate("resetForm.confirmPassValidation")];
    }
    if (credentials.newPassword !== credentials.confirmPassword) {
      errors.confirmPassword = [translate("resetForm.passMatchMsg")];
    }
    return errors;
  };

  const validationErrors = validatePassword();
  /**
   *handles on change event for password input
   *
   * @param {object} event contains input form data
   */
  const handleInputChange = (event) => {
    event.persist();
    updateCredentials(() => ({
      ...credentials,
      [event.target.name]: event.target.value,
    }));
  };

  /**
   * Function to validate new password and call reset password api
   *
   * @param {object} event capture on submit event
   */
  const resetPasswordHandler = async (event) => {
    event.preventDefault();

    const requestObj = {
      confirmPassword: credentials.confirmPassword,
      password: credentials.newPassword,
      token: uid,
    };

    const errors = validatePassword();
    if (!errors.newPassword && !errors.confirmPassword) {
      try {
        const data = await AuthProvider.resetPassword(requestObj);
        if (data && data.successCode && data.successCode === "user.request.password_changed") {
          changeContent(true);
        }
      } catch (errorMessage) {
        updateError(errorMessage.message);
      }
    } else if (errors.newPassword) {
      updateError(errors.newPassword);
    } else if (errors.confirmPassword) {
      updateError(errors.confirmPassword);
    }
  };
  return (
    <SimpleForm variant="standard" toolbar={null} validate={validatePassword} onSubmit={resetPasswordHandler}>
      <PasswordInput
        source={translate("resetForm.passLabel")}
        name="newPassword"
        className={classes.inputClass}
        data-at-id="newPassword"
        validate={validatePasswordRegex}
        value={credentials.newPassword}
        required
        focused={false}
        onChange={handleInputChange}
      />
      <PasswordInput
        source={translate("resetForm.confirmPassLabel")}
        name="confirmPassword"
        className={classes.inputClass}
        data-at-id="confirmPassword"
        validate={validatePasswordRegex}
        value={credentials.confirmPassword}
        required
        focused={false}
        onChange={handleInputChange}
      />
      <FormHelperText className={classes.errorClass}>{error}</FormHelperText>
      <Button
        type="submit"
        data-at-id="resetPassword"
        variant="contained"
        color="primary"
        disabled={validationErrors.newPassword || validationErrors.confirmPassword}
        className={classes.btnContained}
      >
        {title}
      </Button>
    </SimpleForm>
  );
};

ResetFormUI.propTypes = {
  uid: PropTypes.string.isRequired,
  passwordReg: PropTypes.string.isRequired,
  validateMsg: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default ResetFormUI;
