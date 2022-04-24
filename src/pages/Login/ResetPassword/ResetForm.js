import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { Typography, Box } from "@material-ui/core";
import { AccountCircleOutlined } from "@material-ui/icons";

import useStyles from "./reset-styles";
import { PASSWORD_CONSTRAINT_DOMAIN } from "../../../config/GlobalConfig";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import ResetFormUI from "./ResetFormUI";

/**
 * Reset Password Form to enter password and confirm password
 *
 * @param {*} props for password and confirm password
 * @returns {React.ReactElement} Reset form.
 */
const ResetForm = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { title, changeContent } = props;
  const [passwordReg, updatePasswordReg] = useState("");
  const [validateMsg, updateValidationMsg] = useState("");
  const queryParams = window.location.href?.split("?")[1];
  const params = queryParams?.split("&");
  const uid = params ? params[0]?.split("token=")[1] : "";
  const username = params ? params[1]?.split("loginName=")[1] : "";

  /**
   *sets password validation rules
   *
   * @param {Array} rules contains input form data
   * @returns {object}  returns a object containing validation message to be displayed and regex for validation.
   */
  const setPasswordValidations = (rules) => {
    let validationMsg = `${translate("resetForm.passLength")} ${rules.minimumPasswordLength} - ${
      rules.maximumPasswordLength
    } ${translate("resetForm.characters")}`;
    let passwordRegex = "";
    rules.numberOfCharacterClassesForPassword.map((rule) => {
      switch (rule) {
        case "uppercaseLetters":
          validationMsg += translate("resetForm.uppercase");
          passwordRegex += `(?=.*?[A-Z])`;
          break;
        case "lowercaseLetters":
          validationMsg += translate("resetForm.lowercase");
          passwordRegex += `(?=.*?[a-z])`;
          break;
        case "number":
          validationMsg += translate("resetForm.number");
          passwordRegex += `(?=.*?[0-9])`;
          break;
        case "specialCharacters":
          validationMsg += translate("resetForm.specialChar");
          passwordRegex += `(?=.*?[#?!@$%^&*-])`;
          break;
        default:
          break;
      }
      return validationMsg;
    });
    passwordRegex += `.{${rules.minimumPasswordLength},${rules.maximumPasswordLength}}$`;
    const reg = new RegExp(`^${passwordRegex}`);
    return { validationMsg, passRegex: reg };
  };

  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    const rulesObj = setPasswordValidations(response.data);
    updatePasswordReg(rulesObj.passRegex);
    updateValidationMsg(rulesObj.validationMsg);
  };

  useCustomQueryWithStore(
    "getDataWithoutAuth",
    `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/security/passwordConstraint/${PASSWORD_CONSTRAINT_DOMAIN}/`,
    handleSuccess,
  );

  return (
    <>
      <Typography variant="subtitle1" className={classes.subtitle1}>
        {title}
      </Typography>
      <Box className={classes.boxClass}>
        <AccountCircleOutlined className={classes.userIconClass} />
        <Typography variant="caption" className={classes.caption}>
          {username}
        </Typography>
      </Box>
      <ResetFormUI
        changeContent={(event) => changeContent(event)}
        title={title}
        classes={classes}
        uid={uid}
        passwordReg={passwordReg}
        validateMsg={validateMsg}
      />
    </>
  );
};

ResetForm.propTypes = {
  title: PropTypes.string.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default ResetForm;
