/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { useMutation, useTranslate, useNotify, useQueryWithStore } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import SimpleModel from "../CreateModal";
import FileImport from "./FileImport";
import LoaderComponent from "../LoaderComponent";
import useStyles from "../../assets/theme/common";
import WithProgressBar from "../ProgressBar";

/**
 *
 * @param {*} props all props
 *@function CommonImport
 * @returns {React.createElement} CommonImport
 */
const CommonImport = (props) => {
  const classes = useStyles();
  const { payload, resetImport, resource, config, ProgressBar, onUploadSuccess, acceptFileType } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [confirmDialogObject, setConfirmDialog] = useState({});
  const [url, setUrl] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();
  /**
   *Fetch selected file for import.
   *
   *@param {File} event selected file object
   * @function fetchFileName
   */
  const fetchFileName = (event) => {
    setFileObj(event);
  };

  /**
   * @param {object} dialogContentParams object containing dialog component props
   * @returns {React.createElement} dialogContent confirmation dialogs
   * @function dialogContent
   */
  const dialogContent = (dialogContentParams) => {
    const { isFileUploaded, message } = dialogContentParams;
    return (
      <DialogContent>
        {isFileUploaded ? (
          <DialogContentText className={classes.dialogContentStyle}>{message}</DialogContentText>
        ) : (
          <FileImport acceptFileType={acceptFileType} returnFileName={fetchFileName} />
        )}
      </DialogContent>
    );
  };

  useEffect(() => {
    if (ProgressBar) {
      const dialogObj = {
        dialogTitle: translate("upload_title"),
        showButtons: false,
        closeText: null,
        actionText: "",
        dialogContent: ProgressBar,
      };
      setConfirmDialog(dialogObj);
    }
  }, [ProgressBar, translate]);

  /**
   * @param {boolean} isFileUploaded checks if file is uploaded
   * @function Showpopup to open modal
   */
  function showPopup(isFileUploaded) {
    let message = "";
    if (isFileUploaded) {
      message = translate("import_success_message");
    } else {
      message = null;
    }

    const dialogContentParams = {
      isFileUploaded,
      message,
    };

    const dialogObj = {
      dialogContent: dialogContent(dialogContentParams),
      dialogTitle: !isFileUploaded ? translate("choose_file") : translate("import_req_title"),
      showButtons: true,
      showCancelButton: false,
      closeText: !isFileUploaded ? translate("btn_cancel") : null,
      actionText: !isFileUploaded ? translate("import") : translate("btn_ok"),
    };
    if (!isFileUploaded) {
      dialogObj.showCancelButton = true;
    } else {
      dialogObj.showCancelButton = false;
    }
    setConfirmDialog(dialogObj);
    setShowDialog(true);
  }

  /**
   *Function to handle toggle flag to close dialog
   *
   * @function toggleModalHandler
   */
  const toggleModalHandler = () => {
    setShowDialog(false);
    setFileObj(null);
    resetImport();
  };
  const { loading } = useQueryWithStore(
    {
      type: "getData",
      resource: `${resource}`,
      payload,
    },
    {
      onSuccess: (response) => {
        if (response?.data) {
          setUrl(response.data);
          showPopup(false);
        } else if (response && response.data.error) {
          notify(response.data.error);
        } else if (response && response.data.errors && response.data.errors[0] && response.data.errors[0].message) {
          notify(response.data.errors[0].message);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "warning"),
    },
  );
  /**
   * @function for file upload
   */
  const importHandler = () => {
    mutate(
      {
        type: "import",
        resource: url,
        payload: { fileObj, config },
      },
      {
        onSuccess: (response) => {
          if (response && response.status === 200) {
            showPopup(true);
            setFileObj(null);
            onUploadSuccess();
          }
        },
        onFailure: (error) => notify(`Error: ${error.message}`, "warning"),
      },
    );
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <SimpleModel
            {...confirmDialogObject}
            openModal={showDialog}
            handleClose={toggleModalHandler}
            handleAction={confirmDialogObject.actionText === translate("import") ? importHandler : toggleModalHandler}
            isDisable={confirmDialogObject.actionText === translate("import") && fileObj == null}
          />
        </>
      )}
    </>
  );
};
CommonImport.propTypes = {
  payload: PropTypes.objectOf(PropTypes.any).isRequired,
  resetImport: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  ProgressBar: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]).isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
  config: PropTypes.objectOf(PropTypes.any).isRequired,
  acceptFileType: PropTypes.string,
};

CommonImport.defaultProps = {
  acceptFileType: ".csv",
};

export default WithProgressBar(CommonImport);
