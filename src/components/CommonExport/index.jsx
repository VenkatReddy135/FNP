/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useNotify, useQueryWithStore, useTranslate } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import SimpleModel from "../CreateModal";
import LoaderComponent from "../LoaderComponent";
import useStyles from "../../assets/theme/common";

/**
 *
 * @param {*} props all props
 *@function CommonExport
 * @returns {React.createElement} CommonExport
 */
const CommonExport = (props) => {
  const { resourceVal, payload, resetVal } = props;
  const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmDialogObject, setConfirmDialog] = useState({});

  /**
   * @param {object} dialogContentParams object for dialog content
   * @returns {React.createElement} dialogContent confirmation dialogs
   * @function dialogContent
   */
  const dialogContent = (dialogContentParams) => {
    const { message } = dialogContentParams;
    return (
      <DialogContent>
        <DialogContentText className={classes.dialogContentStyle}>{message}</DialogContentText>
      </DialogContent>
    );
  };
  /**
   * Function to handle set dialog message for Dialog to show message
   *
   * @param {object} showPopupParams object containing exportFlag, action and isSubmitted flag
   * @function showPopup
   */
  const showPopup = (showPopupParams) => {
    const { message } = showPopupParams;
    const dialogContentParams = {
      message,
    };
    const dialogObj = {
      dialogContent: dialogContent(dialogContentParams),
      dialogTitle: translate("btn_export_req"),
      showButtons: true,
      actionText: translate("btn_ok"),
      showCancelButton: false,
    };
    setConfirmDialog(dialogObj);
    setShowDialog(true);
  };

  const { loading } = useQueryWithStore(
    {
      type: "getData",
      resource: resourceVal,
      payload,
    },
    {
      onSuccess: (response) => {
        if (response && response.data && response.data.message) {
          const showPopupParams = {
            message: response.data.message,
          };
          showPopup(showPopupParams);
        } else if (response && response.data && response.data.error) {
          notify(response.data.error);
        } else if (response && response.data.errors && response.data.errors[0] && response.data.errors[0].message) {
          notify(response.data.errors[0].message);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "warning"),
    },
  );
  /**
   *Function to handle toggle flag to close dialog
   *
   * @function toggleModalHandler
   */
  const toggleModalHandler = () => {
    setShowDialog(false);
    resetVal();
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleModel
          {...confirmDialogObject}
          openModal={showDialog}
          handleClose={toggleModalHandler}
          handleAction={toggleModalHandler}
        />
      )}
    </>
  );
};

CommonExport.propTypes = {
  resourceVal: PropTypes.string.isRequired,
  payload: PropTypes.objectOf(PropTypes.any).isRequired,
  resetVal: PropTypes.func.isRequired,
};

export default CommonExport;
