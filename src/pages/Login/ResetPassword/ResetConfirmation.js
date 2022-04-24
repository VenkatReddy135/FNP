import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { Link } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import useStyles from "./reset-styles";

/**
 * Reset Password Form to enter password and confirm password
 *
 * @param {*} props for password and confirm password
 * @returns {React.ReactElement} Reset form.
 */
const ResetConfirmation = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const { title, body, path } = props;
  return (
    <>
      <Typography variant="subtitle1" className={classes.subtitle1}>
        {title}
      </Typography>
      <CheckCircleOutlinedIcon className={classes.checkedLogo} />
      <Typography variant="body2" className={classes.body2}>
        {body}
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to={`/${path}`}
        data-at-id={path}
        color="primary"
        className={classes.btnContained}
      >
        {translate("loginSectionHeader")}
      </Button>
    </>
  );
};

export default ResetConfirmation;

ResetConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};
