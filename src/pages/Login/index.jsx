import React, { useState } from "react";

import {
  Paper,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Button,
  IconButton,
  Hidden,
  FormHelperText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslate, useLogin } from "react-admin";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import useStyles from "./login-styles";

/**
 * Login Form to enter email, password and Link for Forgot password
 *
 * @function Login
 * @returns {React.ReactElement} Login form.
 */
const Login = () => {
  const classes = useStyles();
  const login = useLogin();
  const [error, setError] = useState(false);
  const [passWordError, setPassWordError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailedMessage, setLoginFailMessage] = useState("");
  const translate = useTranslate();

  /**
   * Function to validate entered email and password is correct or not for login
   *
   * @function callLoginAPI
   */
  const callLoginAPI = async () => {
    setError(false);
    setPassWordError(false);
    try {
      await login({ userName, password });
    } catch (e) {
      setLoginFailMessage(e.message);
    }
  };

  /**
   * Function to show password in the plain or in the masked format
   *
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Function to validate the login form and update the state accordingly
   *
   * @function loginSubmitHandler
   * @param {object} event contains data of the form
   */
  const loginSubmitHandler = (event) => {
    event.preventDefault();
    callLoginAPI();
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
          <img src="/images/zeus-logo.png" alt="Zeus" className={classes.logo} />
          <Typography variant="subtitle1" color="textPrimary" className={classes.heading}>
            {translate("loginSectionHeader")}
          </Typography>
          <>
            <form onSubmit={loginSubmitHandler}>
              <FormControl className={classes.customBackground}>
                <TextField
                  required
                  error={error}
                  id="standard"
                  name="username"
                  label={translate("emailLabel")}
                  focused={false}
                  value={userName}
                  className={classes.usernameInput}
                  data-at-id="username-phone-number"
                  type="email"
                  InputProps={
                    error
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton className={classes.error}>
                                <ErrorIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : null
                  }
                  onChange={(event) => {
                    setUserName(event.target.value);
                    setError(false);
                  }}
                />
                {error ? (
                  <FormHelperText id="username-error" className={classes.error}>
                    {translate("emailError")}
                  </FormHelperText>
                ) : null}
                <TextField
                  required
                  id="standard-password-input"
                  label={translate("passwordLabel")}
                  name="value"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  focused={false}
                  className={classes.customBackground}
                  error={passWordError}
                  data-at-id="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} data-at-id="showPasswordButton">
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPassWordError(false);
                  }}
                />
                {passWordError ? (
                  <FormHelperText id="username-error" className={classes.error}>
                    {translate("passwordError")}
                  </FormHelperText>
                ) : null}
                {loginFailedMessage ? (
                  <FormHelperText id="username-error" className={classes.error}>
                    {loginFailedMessage}
                  </FormHelperText>
                ) : null}
                <Link className={classes.forgotPasswordBtn} to="/forgotpassword" data-at-id="forgotPassword">
                  {translate("forgotPasswordLink")}
                </Link>
                <Button variant="contained" className={classes.loginBtn} type="submit" data-at-id="loginButton">
                  {translate("loginButton")}
                </Button>
              </FormControl>
            </form>
          </>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Login;
