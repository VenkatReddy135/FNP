import React, { memo } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography } from "@material-ui/core";
import useStyles from "./LoaderComponentStyles";

/**
 * Component to display the loader
 * Link: https://material-ui.com/components/progress/#circular
 *
 * @name LoaderComponent
 * @returns {React.ReactElement} Loader Component.
 */
const LoaderComponent = memo((props) => {
  const { message } = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.loader}>
        <CircularProgress color="inherit" />
      </div>
      {message && <Typography className={classes.message}>{message}</Typography>}
    </>
  );
});
LoaderComponent.propTypes = {
  message: PropTypes.string,
};

LoaderComponent.defaultProps = {
  message: "",
};

export default LoaderComponent;
