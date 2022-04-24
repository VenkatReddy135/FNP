import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import PropTypes from "prop-types";
import React from "react";
import { useTranslate, useNotify, useRedirect, useRefresh, useDelete } from "react-admin";
import useStyles from "../../assets/theme/common";
import { TIMEOUT } from "../../config/GlobalConfig";

/**
 * Common delete component can be used for the delete functionality on the list and view pages
 *
 * @param {*} props all the props needed for Common Delete component
 * @returns {React.createElement} returns the CommonDelete dialog
 */
const CommonDelete = (props) => {
  const { resource, deleteText, redirectPath, params, open, close, list } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();

  const [deleteHandler] = useDelete(resource, params, null, {
    onSuccess: (res) => {
      if (res.data && res.status === "success" && list) {
        notify(res.data.message || translate("delete_success_message"), "info", TIMEOUT);
        refresh();
      } else if (res.data && res.status === "success") {
        redirect(redirectPath);
        notify(res.data.message || translate("delete_success_message"), "info", TIMEOUT);
      } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
        notify(
          res.data.errors[0].field
            ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
            : res.data.errors[0].message,
          "error",
          TIMEOUT,
        );
        refresh();
      }
      close();
    },
    onFailure: (error) => {
      close();
      notify(`Error: ${error.message}`, "error", TIMEOUT);
    },
  });

  return (
    <Dialog open={open} onClose={close} className={classes.container}>
      <DialogTitle id="alert-dialog-title">
        <CloseIcon onClick={close} className={classes.closeWithoutHeaderStyle} />
      </DialogTitle>
      <DialogContent className={classes.contentStyle}>
        <DeleteIcon />
        <DialogContentText className={classes.dialogContentStyle}>{deleteText}</DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actionContentStyle} disableSpacing>
        <Button
          variant="outlined"
          size="medium"
          className={classes.actionStyle}
          data-at-id="cancelButton"
          onClick={close}
        >
          {translate("commondelete_cancel")}
        </Button>
        <Button
          variant="contained"
          size="medium"
          className={classes.actionButtonStyle}
          data-at-id="actionButton"
          onClick={deleteHandler}
        >
          {translate("commondelete_delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CommonDelete.propTypes = {
  resource: PropTypes.string.isRequired,
  deleteText: PropTypes.string.isRequired,
  redirectPath: PropTypes.string,
  params: PropTypes.objectOf(PropTypes.any),
  open: PropTypes.bool.isRequired,
  list: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

CommonDelete.defaultProps = {
  redirectPath: "",
  params: {},
  list: false,
};

export default React.memo(CommonDelete);
