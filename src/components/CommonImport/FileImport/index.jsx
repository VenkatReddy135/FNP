import React, { useState } from "react";
import { Button, useTranslate } from "react-admin";
import { Chip, Grid, Divider, Box, FormHelperText } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../../assets/theme/common";

/**
 *
 * @param {*} props all props
 *@function CommonImport
 * @returns {React.createElement} CommonImport
 */
const FileImport = (props) => {
  const { acceptFileType } = props;
  const fileInput = React.createRef();
  const [fileName, setFileName] = useState(null);
  const [helperText, setHelperText] = useState("");
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function handleFileOpen Function to process selected file from the file system.
   * @param {*} event event having the file value
   */
  const handleFileOpen = (event) => {
    const regex = new RegExp(`${acceptFileType}`);
    if (event.target.value && !regex.test(event.target.value)) {
      setHelperText(`${translate("import_error_msg")}${acceptFileType}`);
      fileInput.current.value = null;
      setFileName(null);
      props.returnFileName(null);
    } else if (fileInput.current.value) {
      setHelperText("");
      setFileName(fileInput.current.files[0]);
      props.returnFileName(fileInput.current.files[0]);
    }
  };

  /**
   *Function to open file system on button click.
   *
   * @function openFileSelectHandler
   */
  const openFileSelectHandler = () => {
    fileInput.current.value = null;
    fileInput.current.click();
  };

  /**
   *Function to delete selected file
   *
   * @function handleDelete
   */
  const handleDelete = () => {
    setFileName(null);
    props.returnFileName(null);
  };

  return (
    <>
      <FormHelperText className={classes.importErrorMsg}>{helperText}</FormHelperText>
      <Grid container direction="row">
        <Box className={classes.containerStyle}>
          <input type="file" id="file-name" ref={fileInput} onChange={handleFileOpen} accept={acceptFileType} hidden />
          {fileName ? <Chip label={fileName.name} onDelete={handleDelete} className={classes.chipStyle} /> : null}
          <Divider variant="fullWidth" className={classes.fileContainerStyle} />
        </Box>
        <Button
          variant="outlined"
          className={classes.btnMargin}
          size="small"
          label={translate("choose_file_btn")}
          onClick={openFileSelectHandler}
        />
      </Grid>
    </>
  );
};
FileImport.propTypes = {
  returnFileName: PropTypes.func.isRequired,
  acceptFileType: PropTypes.string.isRequired,
};

export default FileImport;
