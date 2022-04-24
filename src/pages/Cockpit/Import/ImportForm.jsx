import React from "react";
import { useTranslate } from "react-admin";
import PropTypes from "prop-types";
import { InputLabel, Button, Grid, Chip } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";

/**
 * Component for  Import for Cockpit
 *
 * @param {object} props all the props required by Import Form
 * @param {string} props.selectedImportedFile get selected imported file
 * @param {string} props.fileType get file type
 * @param {Function} props.onCancelImport Function to handle action when Cancel Button is clicked.
 * @param {Function} props.onImportSubmit Function to handle action when Next Button is clicked.
 * @param {Function} props.onFileUpload Function to handle action when File Upload Button is clicked.
 * @param {Function} props.onHandleImportFileValidation Function to check validation on Next button.
 * @param {Function} props.handleImportedFileDelete Function to delete the chosen file.
 * @returns {React.ReactElement} returns a Import component
 */
const ImportForm = ({
  selectedImportedFile,
  fileType,
  onCancelImport,
  onImportSubmit,
  onFileUpload,
  onHandleImportFileValidation,
  handleImportedFileDelete,
}) => {
  const classes = useStyles();

  const translate = useTranslate();
  const importTitle = translate("importTitle");
  const cancel = translate("cancel");
  const choose = translate("choose");
  const selectFileToImport = translate("select_file_to_import");
  return (
    <>
      <Grid>
        <Grid item container justify="space-around" alignItems="flex-start" md={8}>
          <Grid
            item
            container
            direction="row"
            className={classes.customMargin}
            justify="flex-start"
            alignItems="flex-start"
            xs
          >
            <InputLabel id="select_file">{selectFileToImport}</InputLabel>
            <Button variant="outlined" component="label">
              {choose}
              <input
                id="select_file"
                type="file"
                value=""
                hidden
                onChange={(e) => onFileUpload(e)}
                accept={`.${fileType}`}
              />
            </Button>
            {selectedImportedFile.length > 0 ? (
              <Chip label={selectedImportedFile} onDelete={handleImportedFileDelete} />
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Grid item container direction="row" md={3} className={classes.customMargin}>
          <Grid item container direction="row" justify="flex-start" alignItems="flex-start" xs>
            <Button data-at-id="btnLogout" variant="outlined" onClick={onCancelImport} size="small">
              {cancel}
            </Button>
          </Grid>
          <Grid item container direction="row" justify="flex-start" alignItems="flex-start" xs>
            <Button
              data-at-id="btnLogout"
              variant="outlined"
              onClick={onImportSubmit}
              size="small"
              disabled={onHandleImportFileValidation()}
            >
              {importTitle}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

ImportForm.propTypes = {
  selectedImportedFile: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  onCancelImport: PropTypes.func.isRequired,
  onImportSubmit: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onHandleImportFileValidation: PropTypes.func.isRequired,
  handleImportedFileDelete: PropTypes.func.isRequired,
};

export default React.memo(ImportForm);
