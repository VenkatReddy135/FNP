/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Notification } from "react-admin";
import { TIMEOUT } from "../../config/GlobalConfig";

/**
 * Component for Notification snackbar
 *
 * @param {*} props all the props required
 * @returns {React.ReactElement} returns a React component
 */
const MyNotification = (props) => (
  <Notification {...props} autoHideDuration={TIMEOUT} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
);

export default MyNotification;
