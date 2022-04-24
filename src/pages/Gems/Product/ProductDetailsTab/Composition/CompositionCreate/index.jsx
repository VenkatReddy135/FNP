/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useTranslate } from "react-admin";
import useStyles from "../../../../../../assets/theme/common";
import CreateCompositionUI from "./CreateCompositionUI";

/**
 * Component for create composition
 *
 * @param {*} props all the props needed for create composition
 * @returns {React.ReactElement} returns a create composition component
 */
const CompositionCreate = (props) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Typography variant="h5" className={classes.gridStyle}>
          {translate("new_composition")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <CreateCompositionUI {...props} />
    </>
  );
};
export default CompositionCreate;
