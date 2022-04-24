import React, { useState } from "react";
import { Grid, Button, DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import useStyle from "./CallToActionStyles";
import SimpleModel from "../../../../components/CreateModal";

/**
 * CallToAction component for Update and Reset Button
 *
 * @name CallToAction
 * @param {object} props contains data related to Weightage from
 * @returns {React.ReactElement} CallToAction component.
 */
const CallToAction = (props) => {
  const { isInvalidValue, handleUpdateAction, handleResetAction } = props;
  const translate = useTranslate();

  const [confirmData, setConfirmData] = useState({ open: false, content: "", type: "" });
  const { open, content, type } = confirmData;
  const { updateButton, resetButton } = useStyle();

  /**
   * Function to handle update confirmation modal Open
   *
   * @name handleUpdateConfirmOpen
   */
  const handleUpdateConfirmOpen = () => {
    setConfirmData({
      open: true,
      content: translate("indexable_attribute.update_confirm_message"),
      type: "update",
    });
  };

  /**
   * Function to handle Reset confirmation modal Open
   *
   * @name handleResetConfirmOpen
   */
  const handleResetConfirmOpen = () => {
    setConfirmData({ open: true, content: translate("indexable_attribute.reset_confirm_message"), type: "reset" });
  };

  /**
   * Function to handle confirmation modal close
   *
   * @name handleClose
   */
  const handleClose = () => {
    setConfirmData({ open: false, content: "", type: "" });
  };

  /**
   * Function to update or reset the configurations
   *
   * @name handleConfirm
   */
  const handleConfirm = () => {
    setConfirmData({ open: false, content: "", type: "" });
    if (type === "update") {
      handleUpdateAction();
    } else {
      handleResetAction();
    }
  };

  /**
   * @function dialogContent to display confirm messages
   * @param {string } message to display to the user
   * @returns {React.createElement} returns dialog content with message
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Button variant="contained" className={resetButton} size="large" onClick={handleResetConfirmOpen}>
            {translate("reset_button")}
          </Button>
          <Button
            variant="contained"
            className={updateButton}
            size="large"
            onClick={handleUpdateConfirmOpen}
            disabled={isInvalidValue}
            data-test="updateButton"
          >
            {translate("update")}
          </Button>
        </Grid>
      </Grid>
      {open && (
        <SimpleModel
          dialogContent={dialogContent(content)}
          dialogTitle=""
          showButtons
          openModal={open}
          handleClose={handleClose}
          handleAction={handleConfirm}
          closeText={translate("no_button_label")}
          actionText={translate("yes_button_label")}
        />
      )}
    </>
  );
};

CallToAction.propTypes = {
  isInvalidValue: PropTypes.bool.isRequired,
  handleUpdateAction: PropTypes.func.isRequired,
  handleResetAction: PropTypes.func.isRequired,
};

export default CallToAction;
