/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  BooleanInput,
  RadioButtonGroupInput,
  PasswordInput,
  AutocompleteInput,
  useTranslate,
  CheckboxGroupInput,
  required,
} from "react-admin";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, FormHelperText, TextField } from "@material-ui/core";
import debounce from "lodash/debounce";
import useStyles from "../../../../assets/theme/common";
import { DEBOUNCE_INTERVAL } from "../../../../config/GlobalConfig";
import { isStringNumber } from "../../../../utils/validationFunction";
import NewUsernameStyles from "./NewUsernameStyles";
import DateTimeInput from "../../../../components/CustomDateTimeV2";

/**
 * @param {*} props all the props required
 * @returns {React.ReactElement} returns a create new Username Form
 */
const NewUsername = (props) => {
  const classes = useStyles();
  const {
    createObj,
    updateCreateObj,
    exactUsernameCheck,
    rules,
    transferAccess,
    setTransferAccess,
    setTransferLogin,
    countryCodes,
    list,
    accessTransferError,
    usernameSpecialCharValidation,
    checkPasswordRequirement,
    phoneNoValidation,
  } = props;
  const style = NewUsernameStyles();
  const translate = useTranslate();
  const [showCountryCodeLoginId, setShowCountryCodeLoginId] = useState(false);
  const [showCountryCodeSearchId, setShowCountryCodeSearchId] = useState(false);
  const [loginIsUsername, setLoginIsUsername] = useState(false);

  /**
   * @function handleChange for transfer access, password and confirm password
   * @param {event} event value of selected field
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    const { password, searchIdCountryCode } = createObj;
    if (name === "accessTransferLogin") {
      setShowCountryCodeSearchId(isStringNumber(value));
      const data = isStringNumber(value) ? `${searchIdCountryCode.replace("+", "0")}${value}` : `${value}`;
      exactUsernameCheck(data);
    }
    checkPasswordRequirement(name === "password" ? value : password);
    updateCreateObj((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * @function handleUsername for username field
   * @param {event} event value of selected field
   */
  const handleUsername = (event) => {
    const { name, value } = event.target;
    const typedIsNumber = isStringNumber(value);
    const asUsername = !typedIsNumber && !value.includes("@") && value;
    checkPasswordRequirement(asUsername ? createObj.password : "");
    setShowCountryCodeLoginId(typedIsNumber);
    setLoginIsUsername(asUsername);
    updateCreateObj((prevState) => ({
      ...prevState,
      [name]: value,
      confirmPassword: asUsername ? createObj.confirmPassword : "",
      password: asUsername ? createObj.password : "",
      resetPasswordChange: asUsername ? createObj.resetPasswordChange : true,
    }));
  };
  /**
   * @function onUsernameChange function to set the selected value from drop down
   * @param {event} event contains event data on Input change
   * @param {object} newValue contains the value to set from party Id field state
   */
  const onUsernameChange = (event, newValue) => {
    if (newValue && !newValue.status) {
      setTransferLogin(newValue.id);
    }
  };
  /**
   * @function onAutoCompleteInputChange function fetches the party list based on search value
   * @param {event} event contains event data on Input change
   * @param {string} newInputValue contains the character value for search on input change
   */
  const onAutoCompleteInputChange = (event, newInputValue) => {
    const obj = { target: { name: "", value: "" } };
    obj.target.name = "accessTransferLogin";
    obj.target.value = newInputValue;
    handleChange(obj);
  };

  /**
   * @function inputChangeWithDebounce implements debounce on multiple events for Transfer access
   */
  const inputChangeWithDebounce = debounce((event, newInputValue) => {
    onAutoCompleteInputChange(event, newInputValue);
  }, DEBOUNCE_INTERVAL);

  /**
   * @function handleEvent to Create New Username to handle autocomplete inputs
   * @param {string} name contains name of source
   * @param {string} event contains value of target source
   */
  const handleEvent = (name, event) => {
    if (name === "searchIdCountryCode") {
      setTransferLogin("");
      exactUsernameCheck(`${event.replace("+", "0")}${createObj.accessTransferLogin}`);
    }
    updateCreateObj((prevState) => ({ ...prevState, [name]: event }));
  };

  /**
   * @param {Array} rule contains Array of object validation lists
   * @function PasswordRule for Password Validation messages
   * @returns {React.ReactElement} List of Validation messages with their styles
   */
  const PasswordRule = (rule) => {
    return rule.map((item) => (
      <p className={item.status ? style.ruleActive : style.ruleInactive} key={`${item.id}`}>
        {item.title}
      </p>
    ));
  };
  /**
   * @param {string} value contains input of confirmPassword
   * @function passwordMatch to validate the password and confirm password
   * @returns {string | undefined} matchError Error message for confirm Password
   */
  const passwordMatch = (value) => {
    const { password, confirmPassword } = createObj;
    const error = value && password !== confirmPassword ? translate("password_match_error") : undefined;
    return error;
  };

  return (
    <>
      <Grid container direction="row" spacing={6}>
        {showCountryCodeLoginId && (
          <Grid item md={1}>
            <AutocompleteInput
              source="usernameCountryCode"
              label={translate("code")}
              choices={countryCodes}
              optionText="code"
              optionValue="code"
              className={classes.autoCompleteCode}
              validate={required(translate("required"))}
              onChange={(e) => handleEvent("usernameCountryCode", e)}
            />
          </Grid>
        )}
        <Grid item>
          <TextInput
            source="username"
            label={translate("label_username")}
            className={classes.textInputField}
            validate={[required(translate("helper_login_required")), usernameSpecialCharValidation, phoneNoValidation]}
            helperText={!createObj.username ? translate("helper_login_required") : ""}
            onChange={handleUsername}
          />
        </Grid>
        <Grid item>
          <FormHelperText>{translate("label_status")}</FormHelperText>
          <BooleanInput label="" source="isActive" className={classes.textInputField} />
        </Grid>
        <Grid item md={3}>
          <DateTimeInput
            source="disabledDate"
            label={translate("label_disable_date")}
            className={classes.customDateTimeInput}
          />
        </Grid>
        <Grid container direction="row" spacing={6} className={style.alignment}>
          <Grid item>
            <CheckboxGroupInput
              source="accessTransfer"
              choices={[{ id: true, name: translate("label_transfer_checkbox") }]}
              onChange={() => setTransferAccess(!transferAccess)}
            />
          </Grid>
          {transferAccess && (
            <>
              {showCountryCodeSearchId && (
                <Grid item md={1}>
                  <AutocompleteInput
                    source="searchIdCountryCode"
                    label={translate("code")}
                    choices={countryCodes}
                    optionText="code"
                    optionValue="code"
                    className={classes.autoCompleteCode}
                    validate={required(translate("required"))}
                    onChange={(e) => handleEvent("searchIdCountryCode", e)}
                  />
                </Grid>
              )}
              <Grid item>
                <Autocomplete
                  getOptionLabel={(option) => {
                    const countryCode = createObj.searchIdCountryCode.replace("+", "0");
                    const transferUsername = option.loginName.replace(countryCode, "");
                    const label = isStringNumber(option.loginName) ? [transferUsername] : [option.loginName];
                    return `${label}`;
                  }}
                  onInputChange={inputChangeWithDebounce}
                  className={classes.autoCompleteItem}
                  disableClearable
                  freeSolo
                  onChange={onUsernameChange}
                  options={list}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      helperText={createObj.accessTransferLogin ? accessTransferError : ""}
                      error={!!createObj.accessTransferLogin && !!accessTransferError}
                      label={translate("label_search_login")}
                      required
                      FormHelperTextProps={{
                        className: classes.helperTextAlign,
                      }}
                      margin="dense"
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid container direction="row" spacing={8} className={style.alignment}>
          {loginIsUsername ? (
            <>
              <Grid item>
                <RadioButtonGroupInput
                  source="resetPasswordChange"
                  label={translate("label_require_password_change")}
                  choices={[
                    { id: true, name: translate("yes_option_require_password_change") },
                    { id: false, name: translate("no_option_require_password_change") },
                  ]}
                />
              </Grid>
              <Grid item className={classes.label}>
                <PasswordInput
                  source="password"
                  label={translate("label_password")}
                  onChange={handleChange}
                  className={classes.textInputField}
                  validate={required(translate("helper_password_requirement"))}
                />
                <div className={style.password}>{PasswordRule(rules)}</div>
              </Grid>
              <Grid item>
                <PasswordInput
                  source="confirmPassword"
                  label={translate("label_confirm_password")}
                  validate={[required(translate("helper_password_requirement")), passwordMatch]}
                  onChange={handleChange}
                  className={classes.textInputField}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

NewUsername.propTypes = {
  createObj: PropTypes.objectOf(PropTypes.any).isRequired,
  updateCreateObj: PropTypes.func.isRequired,
  exactUsernameCheck: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(PropTypes.any).isRequired,
  transferAccess: PropTypes.bool.isRequired,
  setTransferAccess: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTransferLogin: PropTypes.func.isRequired,
  accessTransferError: PropTypes.string.isRequired,
  usernameSpecialCharValidation: PropTypes.func.isRequired,
  checkPasswordRequirement: PropTypes.func.isRequired,
  phoneNoValidation: PropTypes.func.isRequired,
};

export default React.memo(NewUsername);
