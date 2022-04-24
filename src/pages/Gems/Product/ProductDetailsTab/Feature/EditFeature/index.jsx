import React, { useState } from "react";
import { useTranslate } from "react-admin";
import PropTypes from "prop-types";
import { Divider, Typography, Grid } from "@material-ui/core";
import EditFeatureUI from "./EditFeatureUI";
import useStyles from "../../../../../../assets/theme/common";

/**
 * EditFeature component which will be mounted by React on a root node.
 *
 * @param {object} props required by the edit feature
 * @returns {React.ReactElement} returns a React element
 */
const EditFeature = (props) => {
  const { match } = props;
  const [isEnabled, setEnabled] = useState(true);
  /**
   *
   * @param {boolean} enabledValue to set in the state
   * @function handleIsEnabledChange to change the enable flags
   */
  const handleIsEnabledChange = (enabledValue) => {
    setEnabled(enabledValue);
  };
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Typography variant="h5" className={classes.gridStyle}>
          {translate("edit_feature")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <EditFeatureUI
        pid={match.params.pid}
        fid={match.params.fid}
        isEnabled={isEnabled}
        handleIsEnabledChange={handleIsEnabledChange}
      />
    </>
  );
};
EditFeature.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EditFeature;
