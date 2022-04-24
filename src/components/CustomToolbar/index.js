/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, SaveButton, Button, Toolbar } from "react-admin";

/**
 * CustomToolbar component
 *
 * @param {*} root0 props
 * @param {Function} root0.onClickCancel onClickCancel props called on click of cancel button
 * @param {Function} root0.onClickSubmit onClickSubmit props called on click of create/update button
 * @param {string} root0.saveButtonLabel saveButtonLabel props contains the label text to be displayed for Save button
 * @returns {React.Component} returns CustomToolbar component
 */
const CustomToolbar = ({ onClickCancel, onClickSubmit, disabled, saveButtonLabel, saveButtonIcon, ...props }) => {
  const translate = useTranslate();
  return (
    <Toolbar {...props}>
      <Button variant="outlined" size="medium" label={translate("cancel")} onClick={onClickCancel} />
      <SaveButton
        variant="contained"
        size="medium"
        label={saveButtonLabel}
        icon={saveButtonIcon}
        disabled={disabled}
        onClick={onClickSubmit}
      />
    </Toolbar>
  );
};

CustomToolbar.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  onClickSubmit: PropTypes.func,
  saveButtonLabel: PropTypes.string.isRequired,
  saveButtonIcon: PropTypes.element,
  disabled: PropTypes.bool,
};

CustomToolbar.defaultProps = {
  onClickSubmit: () => {},
  saveButtonIcon: <></>,
  disabled: false,
};

export default CustomToolbar;
