/* eslint-disable react/destructuring-assignment */
import React from "react";
import { Dialog, DialogTitle, DialogActions, Button, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import CommonDialogContent from "../CommonDialogContent";
import useStyles from "../../assets/theme/common";

/**
 *
 * @param {object} props all props
 *@function SimpleModal
 * @returns {React.createElement} SimpleModal
 */
export default function SimpleModal(props) {
  const classes = useStyles();

  return (
    <Dialog
      open={props.openModal}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      classes={props.dialogClasses}
    >
      <DialogTitle id="alert-dialog-title">
        {props.dialogTitle && <span className={classes.titleStyle}>{props.dialogTitle}</span>}
        <CloseIcon
          onClick={props.handleClose}
          className={props.dialogTitle ? classes.closeStyle : classes.closeWithoutHeaderStyle}
        />
      </DialogTitle>
      <DialogContent>{props.dialogContent}</DialogContent>
      <DialogActions className={classes.actionContentStyle} disableSpacing>
        {props.showButtons ? (
          <>
            {props.showCancelButton ? (
              <Button
                variant="outlined"
                size="medium"
                className={classes.actionStyle}
                data-at-id="cancelButton"
                onClick={props.handleClose}
              >
                {props.closeText}
              </Button>
            ) : null}
            <Button
              variant="contained"
              size="medium"
              disabled={props.isDisable}
              className={classes.actionButtonStyle}
              data-at-id="actionButton"
              onClick={props.handleAction}
            >
              {props.actionText}
            </Button>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}

SimpleModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string,
  dialogContent: PropTypes.objectOf(CommonDialogContent),
  showButtons: PropTypes.bool,
  closeText: PropTypes.string,
  handleAction: PropTypes.func,
  actionText: PropTypes.string,
  isDisable: PropTypes.bool,
  dialogClasses: PropTypes.objectOf(PropTypes.any),
  showCancelButton: PropTypes.bool,
};

SimpleModal.defaultProps = {
  dialogTitle: "",
  dialogContent: {},
  showButtons: null,
  closeText: "",
  actionText: "",
  isDisable: false,
  dialogClasses: {},
  handleAction: () => {},
  showCancelButton: true,
};
