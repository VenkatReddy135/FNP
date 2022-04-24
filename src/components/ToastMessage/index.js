import React, { memo } from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { CheckCircleOutline, ErrorOutline } from "@material-ui/icons";
import useStyle from "./ToastMessageStyles";
import { color } from "../../config/GlobalConfig";

/**
 * ToastMessage component displaying the toast
 *
 * @function ToastMessage
 * @param {object} props contains data related to Toast
 * @returns {React.ReactElement} ToastMessage component.
 */
const ToastMessage = memo((props) => {
  const { open, severity, message, closeSnackbar, autoHideDuration, anchorOrigin } = props;
  const { white } = color;
  const { successAlert, errorAlert, marginTop } = useStyle();
  let customClass = "";
  let icon = null;
  if (severity === "success") {
    customClass = successAlert;
    icon = <CheckCircleOutline />;
  } else if (severity === "error") {
    customClass = errorAlert;
    icon = <ErrorOutline style={{ color: white }} />;
  }
  return (
    <Snackbar
      classes={{
        root: marginTop,
      }}
      anchorOrigin={anchorOrigin}
      open={open}
      onClose={closeSnackbar}
      autoHideDuration={autoHideDuration}
    >
      <Alert className={customClass} onClose={closeSnackbar} severity={severity} icon={icon}>
        {message}
      </Alert>
    </Snackbar>
  );
});

ToastMessage.propTypes = {
  open: PropTypes.bool.isRequired,
  severity: PropTypes.string,
  message: PropTypes.string.isRequired,
  closeSnackbar: PropTypes.func.isRequired,
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.string.isRequired,
    horizontal: PropTypes.string.isRequired,
  }),
};

ToastMessage.defaultProps = {
  anchorOrigin: { vertical: "top", horizontal: "center" },
  severity: "success",
  autoHideDuration: 6000,
};
export default ToastMessage;
