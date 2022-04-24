/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from "react";
import { LinearProgress, Box, Typography } from "@material-ui/core";

/**
 * Component for Progress Bar
 *
 * @param {React.ReactElement} WrappedComponent Wrapped Component
 * @returns {React.ReactElement} returns a HOC
 */
const WithProgressBar = (WrappedComponent) => {
  return function Component(props) {
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const cancelFileUpload = useRef(null);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        if (percent < 100) {
          setUploadPercentage(percent);
        }
      },
    };

    /**
     * Function to handle upload percentage on successful file upload.
     *
     * This function can be called in onSuccess of useMuation from 'react-admin'
     *
     * @name onSuccess
     */
    const onSuccess = () => {
      setUploadPercentage(100);
    };

    /**
     * Function to handle upload percentage on cancellation of file upload by user.
     *
     * This function can be called in onFailure of useMuation from 'react-admin'
     *
     * @name onCancel
     */
    const onCancel = () => {
      setUploadPercentage(0);
    };

    const ProgressBar = uploadPercentage > 0 && uploadPercentage < 100 && (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(uploadPercentage)}%`}</Typography>
        </Box>
      </Box>
    );

    return (
      <div>
        <WrappedComponent
          config={config}
          cancelFileUpload={cancelFileUpload}
          onUploadSuccess={onSuccess}
          onCancel={onCancel}
          ProgressBar={ProgressBar}
          {...props}
        />
      </div>
    );
  };
};

export default WithProgressBar;
