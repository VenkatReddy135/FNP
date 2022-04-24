/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { SimpleForm, useTranslate, useNotify, useRedirect, useMutation } from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import { TIMEOUT, PASSWORD_CONSTRAINT_DOMAIN } from "../../../../config/GlobalConfig";
import {
  isStringNumber,
  passwordValidation,
  emailValidation,
  isSpecialChar,
  isNumber,
  isLowerCase,
  isUpperCase,
} from "../../../../utils/validationFunction";
import NewUsernameCreateForm from "./NewUsernameCreateForm";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks/HelperFunctions";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import LoaderComponent from "../../../../components/LoaderComponent";
import CustomToolbar from "../../../../components/CustomToolbar";
import { DEFAULT_INDIA_COUNTRY_CODE } from "../../PartyCreate/CreatePartyConstants";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const initialValues = {
  accessTransferLogin: "",
  confirmPassword: "",
  disabledDate: "",
  isActive: true,
  password: "",
  resetPasswordChange: true,
  username: "",
  usernameCountryCode: "+91",
  searchIdCountryCode: "+91",
};
/**
 * Component for Creating new Username for Party
 *
 * @returns {React.ReactElement} returns parent component for creating new Username
 */
const PartyNewUsername = () => {
  const translate = useTranslate();
  const classes = useStyles();
  const redirect = useRedirect();
  const notify = useNotify();
  const { id } = useParams();
  const history = useHistory();
  const [mutate] = useMutation();
  const [createObj, updateCreateObj] = useState(initialValues);
  const [transferAccess, setTransferAccess] = useState(false);
  const [transferLogin, setTransferLogin] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [rules, setRules] = useState([]);
  const [list, setList] = useState([]);
  const [accessTransferError, setAccessTransferError] = useState("");
  const [passwordConstraint, setPasswordConstraint] = useState();
  const [passwordRequirementError, setPasswordRequirementError] = useState(false);
  const [disable, setDisableCreate] = useState(false);

  /**
   * @function usernameSpecialCharValidation to validate all specialChars other than "@"
   * @param {string} value date value to be validated
   * @returns {(string | undefined)} error message or undefined
   */
  const usernameSpecialCharValidation = (value) => {
    let data;
    if (value && value.includes("@")) data = !emailValidation(value) ? translate("email_error") : undefined;
    else data = passwordValidation(value).specialChar ? translate("username_error") : undefined;
    return data;
  };
  /**
   * @param {object} response is objects of password requirement
   * @function passwordRuleSet to Show thw validation rules required for Password on UI
   */
  const passwordRuleSet = (response) => {
    const required = [];
    if (response) {
      response.numberOfCharacterClassesForPassword.forEach((item) => {
        switch (item) {
          case "uppercaseLetters":
            required.push({ title: translate("label_password_upper_alpha"), status: false, id: item });
            break;
          case "lowercaseLetters":
            required.push({ title: translate("label_password_lower_alpha"), status: false, id: item });
            break;
          case "number":
            required.push({ title: translate("label_password_number"), status: false, id: item });
            break;
          case "specialCharacters":
            required.push({ title: translate("label_password_special_char"), status: false, id: item });
            break;
          default:
            break;
        }
      });
      required.push({
        title: `Char should be in between ${response.minimumPasswordLength} to ${response.maximumPasswordLength}`,
        status: false,
        id: "charLength",
      });
    }
    setRules(required);
  };
  /**
   * @param {string} value to be checked
   * @function checkPasswordRequirement for validating password requirements
   * for number, uppercase, lowerCase, special chars and char-length if required
   */
  const checkPasswordRequirement = (value) => {
    const requirement = rules.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});
    const { lowercaseLetters, number, uppercaseLetters, specialCharacters } = requirement;
    const { minimumPasswordLength, maximumPasswordLength } = passwordConstraint;
    const data = [...rules];
    setPasswordRequirementError(false);
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      if (lowercaseLetters !== undefined && isLowerCase(code)) requirement.lowercaseLetters = true;
      else if (number !== undefined && isNumber(code)) requirement.number = true;
      else if (uppercaseLetters !== undefined && isUpperCase(code)) requirement.uppercaseLetters = true;
      else if (specialCharacters !== undefined && isSpecialChar(code)) requirement.specialCharacters = true;
    }
    if (value.length >= minimumPasswordLength && value.length <= maximumPasswordLength) requirement.charLength = true;
    const updatedNewList = data.map((item) => {
      return { ...item, status: requirement[item.id] };
    });
    if (!Object.values(requirement).every((item) => item === true)) setPasswordRequirementError(true);
    setRules(updatedNewList);
  };
  /**
   * @function handleSuccessPasswordConstraint This function will handle the after effects of success for password requirement.
   * @param {object} response is passed to the function
   */
  const handleSuccessPasswordConstraint = (response) => {
    passwordRuleSet(response.data);
    setPasswordConstraint(response.data);
  };
  useCustomQueryWithStore(
    "getDataWithoutAuth",
    `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/security/passwordConstraint/${PASSWORD_CONSTRAINT_DOMAIN}/`,
    handleSuccessPasswordConstraint,
  );
  /**
   * @function phoneNoValidation This function will validate phone number
   * @param {string} value is passed to the function
   * @returns {(string | undefined)} returns message or undefine
   */
  const phoneNoValidation = (value) => {
    if (
      isStringNumber(value) &&
      ((createObj.usernameCountryCode === DEFAULT_INDIA_COUNTRY_CODE && value.length !== 10) ||
        (createObj.usernameCountryCode !== DEFAULT_INDIA_COUNTRY_CODE && value.length > 15))
    ) {
      return translate("phone_number_error");
    }
    return undefined;
  };
  /**
   * @function handleSetCountryCodes This function will setData for country codes
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetCountryCodes = (res) => setCountryCodes(res?.data?.data);

  const resourceForCountryCodes = `${window.REACT_APP_PARTY_SERVICE}/country-codes`;
  const { loading: countryCodeLoading } = useCustomQueryWithStore(
    "getData",
    resourceForCountryCodes,
    handleSetCountryCodes,
  );
  /**
   * @function handleSuccessSubmit to handle the success Username Submission
   * @param {object} response contains data on API call
   */
  const handleSuccess = (response) => {
    redirect(`/pawri/v1/parties/search/${id}/show/usernames`);
    notify(response.data.data.message || translate("create_new_username_success_message"), "info", TIMEOUT);
  };
  /**
   * @function handleTransfer to check inactive and available usernames
   * @param {object} response contains data on API call
   */
  const handleTransfer = (response) => {
    setAccessTransferError("");
    if (response.data && response.data.status) {
      setAccessTransferError(translate("active_login_search_error"));
    } else setList([response.data]);
  };
  /**
   * @function handleFailureUsername to validate inactive and available usernames
   * @param {string} value contains loginName
   */
  const handleFailureUsername = (value) => {
    setList([]);
    if (value && passwordValidation(value).specialChar) {
      if (usernameSpecialCharValidation(value)) setAccessTransferError(translate("not_valid_login_search_error"));
      else setAccessTransferError(translate("not_available_login_search_error"));
    } else setAccessTransferError(translate("not_available_login_search_error"));
  };
  /**
   * @param {string} value to check the availability of username
   * @function exactUsernameCheck to check the transfer username status
   */
  const exactUsernameCheck = (value) => {
    setTransferLogin("");
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins/search-inactive-username`,
        payload: {
          userName: value,
        },
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess: handleTransfer }),
        onFailure: (error) =>
          onFailure({ error, notify, translate, handleFailure: () => handleFailureUsername(value) }),
      },
    );
  };
  /**
   * @function validForm for Create Party
   * @param {object} validation is passed contains objects
   * @returns {boolean} true as Form is valid
   */
  const validForm = (validation) => {
    const { searchIdCountryCode, accessTransferLogin, password, confirmPassword } = validation;
    if (transferAccess) {
      if ((!searchIdCountryCode && isStringNumber(accessTransferLogin)) || !transferLogin) {
        notify(translate("Phone_exact_username_required_error_message"), "error", TIMEOUT);
        return false;
      }
    }
    if (password && passwordRequirementError) return false;
    if (password !== confirmPassword) {
      notify(translate("password_match_fields_error_message"), "error", TIMEOUT);
      return false;
    }
    return true;
  };
  /**
   * @function postObject will return tha updated values of Post object
   * @param {object} obj contains form field values
   * @returns {object} updated object
   */
  const postObject = (obj) => {
    const {
      confirmPassword,
      disabledDate,
      isActive,
      password,
      resetPasswordChange,
      username,
      usernameCountryCode,
    } = obj;
    return {
      accessTransferLogin: transferLogin.trim(),
      confirmPassword: confirmPassword || null,
      disabledDate: disabledDate || null,
      isActive,
      password: password || null,
      resetPasswordChange,
      username: isStringNumber(username.trim())
        ? `${usernameCountryCode.replace("+", "0")}${username.trim()}`
        : `${username.trim()}`,
    };
  };
  /**
   * @param {object} response response from API
   * @function to handle errors for response other than success
   */
  const handleBadRequest = (response) => {
    setDisableCreate(false);
    notify(response.message ? response.message : translate("create_username_error"), "error", TIMEOUT);
  };
  /**
   * @function handleSubmitForm for Create New Username
   * @param {object} obj contains field values
   */
  const handleSubmitForm = (obj) => {
    const postData = postObject(obj);
    if (validForm(obj)) {
      setDisableCreate(true);
      mutate(
        {
          type: "create",
          resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins`,
          payload: {
            data: {
              dataObj: postData,
              params: { partyId: id },
            },
          },
        },
        {
          onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess, handleBadRequest }),
          onFailure: (error) => {
            setDisableCreate(false);
            onFailure({ error, notify, translate });
          },
        },
      );
    }
  };

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/usernames`,
    },
    {
      displayName: translate("label_new_username"),
    },
  ];

  const RenderTitle = useMemo(
    () => (
      <>
        <Grid container direction="row">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("label_new_username")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );
  const Toolbar = useMemo(
    () => (
      <CustomToolbar onClickCancel={() => history.goBack()} saveButtonLabel={translate("create")} disabled={disable} />
    ),
    [disable],
  );
  return (
    <>
      {countryCodeLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          {RenderTitle}
          <SimpleForm initialValues={createObj} save={handleSubmitForm} toolbar={Toolbar}>
            <NewUsernameCreateForm
              createObj={createObj}
              updateCreateObj={updateCreateObj}
              exactUsernameCheck={exactUsernameCheck}
              rules={rules}
              list={list}
              checkPasswordRequirement={checkPasswordRequirement}
              transferAccess={transferAccess}
              setTransferAccess={setTransferAccess}
              countryCodes={countryCodes}
              setTransferLogin={setTransferLogin}
              accessTransferError={accessTransferError}
              phoneNoValidation={phoneNoValidation}
              usernameSpecialCharValidation={usernameSpecialCharValidation}
            />
          </SimpleForm>
        </>
      )}
    </>
  );
};
export default PartyNewUsername;
