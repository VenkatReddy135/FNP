/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery, useTranslate, useMutation, useRedirect, useNotify } from "react-admin";
import { Typography, Grid } from "@material-ui/core";
import PreSignedRequestForm from "./PresignedRequestForm";
import useStyles from "../../../assets/theme/common";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ImportForm from "./ImportForm";
import withProgressBar from "../../../components/ProgressBar";
import cockpitConfig from "../../../config/CockpitConfig";
import { TIMEOUT, DROPDOWN_PER_PAGE } from "../../../config/GlobalConfig";

/**
 * Component for  Import for Cockpit this component helps to Import files
 *
 * @param {object}props react props
 * @param {Function}props.onUploadSuccess this is method to get upload success status
 * @param {Function}props.onCancel this is method to get cancel success status
 * @param {string}props.cancelFileUpload This is cancel file upload
 * @param {React.ReactElement}props.ProgressBar Show Progress bar status
 * @param {any}props.config set up config
 * @returns {React.ReactElement} returns a Import component
 */
const Import = (props) => {
  const initialData = {
    selectedEntityGroup: "",
    selectedEntityName: "",
    selectedFileType: "",
  };
  const { config, onCancel, onUploadSuccess, cancelFileUpload, ProgressBar } = props;
  const [selectedImportedFile, setImportedFile] = useState("");
  const [isPresignedSuccess, setIsPreSignedSuccess] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState("");
  const [importedFileData, setImportedFileData] = useState();

  const [inputData, setInputData] = useState(initialData);

  const classes = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();

  const importTitle = translate("importTitle");
  const cancelUpload = translate("cancelUpload");
  const fileImportSuccess = translate("file_import_success");
  const errorMsg = translate("error");

  /* Api used to get the Entity Group Names Data */

  const { data: entityGroupNamesData } = useQuery(
    {
      type: "getData",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroupnames`,
    },
    {
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: importTitle,
    },
  ]);

  const entityGroupNames = useMemo(() => (entityGroupNamesData || { data: [] }).data, [entityGroupNamesData]);

  const { data: responseEntityName } = useQuery(
    {
      type: "getList",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
      payload: {
        filter: {
          entityGroupName: inputData.selectedEntityGroup,
        },
        pagination: {
          page: 1,
          perPage: DROPDOWN_PER_PAGE,
        },
        sort: {
          field: "entityGroupName",
          order: "asc",
        },
      },
    },
    {
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  const responseEntityNames = useMemo(() => responseEntityName, [responseEntityName]);

  const [requestPresigneUrl] = useMutation(
    {
      type: "getData",
      resource: `${window.REACT_APP_TUSKER_SERVICE}/presignedUrl/cockpit?`,
      payload: {
        entityGroupName: inputData.selectedEntityGroup,
        fileType: inputData.selectedFileType,
      },
    },
    {
      onSuccess: (res) => {
        const responseQueryData = res?.data;
        setPresignedUrl(responseQueryData);
        setIsPreSignedSuccess(true);
      },
      onFailure: (error) => notify(`${errorMsg}: ${error.message}`, "error", TIMEOUT),
    },
  );

  /**
   * Function to handle action when Cancel Button is clicked.
   *
   * @name onCancelImport
   */
  const onCancelImport = React.useCallback(() => {
    if (cancelFileUpload.current) cancelFileUpload.current(cancelUpload);
    setIsPreSignedSuccess(false);
    setImportedFile("");
    setImportedFileData(null);
  }, [isPresignedSuccess, inputData.selectedEntityGroup, selectedImportedFile, importedFileData]); //

  /**
   * Function to handle action when File Upload Button is clicked.
   *
   * @name onFileUpload
   * @param {object} e all the props needed for Cockpit Management List
   */
  const onFileUpload = (e) => {
    if (e.target.value === "") {
      e.target.value = "";
      return;
    }
    setImportedFile(e.target.files[0].name);
    const fileData = e.target.files[0];
    setImportedFileData(fileData);
  };

  const [uploadFile] = useMutation(
    {
      type: "import",
      resource: presignedUrl,
      payload: {
        config,
        cancelFileUpload,
        fileObj: importedFileData,
      },
    },
    {
      onSuccess: (res) => {
        redirect(`/${cockpitConfig.entityGroupsRoute}`);
        notify(res?.data?.message || fileImportSuccess, "success", TIMEOUT);
        onUploadSuccess();
      },
      onFailure: (error) => {
        notify(`${Error}: ${error.message}`, "error", TIMEOUT);
        onCancel();
      },
    },
  );

  /**
   * Function to handle action when Next Button is clicked.
   *
   * @name onImportSubmit
   */
  const onImportSubmit = React.useCallback(() => {
    uploadFile();
  }, [uploadFile]);

  /**
   * Function to check validation on Next button.
   *
   * @returns {boolean} check input fields are filled on not.
   * @name onHandleImportFileValidation
   */
  const onHandleImportFileValidation = useCallback(() => {
    return !(selectedImportedFile.length > 0);
  }, [selectedImportedFile]);

  /**
   * Function to delete the chosen file.
   *
   * @name handleImportedFileDelete
   */
  const handleImportedFileDelete = React.useCallback(() => {
    setImportedFile("");
    setImportedFileData(null);
  }, []);

  /**
   * Function to update the state of input fields dynamically
   *
   * @name handleInputChange
   * @param {object}e synthetic event
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }, []);
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid item className={classes.customMargin}>
        <Typography variant="h5" className={classes.gridStyle}>
          {importTitle}
        </Typography>
      </Grid>
      {!isPresignedSuccess ? (
        <PreSignedRequestForm
          entityGroupNamesData={entityGroupNames}
          responseEntityName={responseEntityNames}
          handleOnSubmit={requestPresigneUrl}
          fileType={inputData.selectedFileType}
          onHandlePresignedFormValidation={!(inputData.selectedEntityName && inputData.selectedFileType)}
          handleInputChange={handleInputChange}
        />
      ) : (
        <>
          <ImportForm
            setImportedFile={setImportedFile}
            selectedImportedFile={selectedImportedFile}
            fileType={inputData.selectedFileType}
            onCancelImport={onCancelImport}
            onImportSubmit={onImportSubmit}
            onFileUpload={onFileUpload}
            onHandleImportFileValidation={onHandleImportFileValidation}
            handleImportedFileDelete={handleImportedFileDelete}
          />
          {ProgressBar}
        </>
      )}
    </>
  );
};

Import.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelFileUpload: PropTypes.objectOf(PropTypes.any).isRequired,
  ProgressBar: PropTypes.element,
  config: PropTypes.objectOf(PropTypes.any).isRequired,
};
Import.defaultProps = {
  ProgressBar: null,
};

export default withProgressBar(React.memo(Import));
