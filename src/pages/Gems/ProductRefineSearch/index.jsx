/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useTranslate } from "react-admin";
import useStyles from "../../../assets/theme/common";
import ProductSearchUI from "./ProductRefineSearchUI";

/**
 * Component for Product Management search
 *
 * @returns {React.ReactElement} returns a Product Management search component
 */
const ProductManagementSearch = () => {
  const translate = useTranslate();
  const classes = useStyles();
  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item md={5} xs={3}>
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("product_management")}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <ProductSearchUI />
    </>
  );
};

export default React.memo(ProductManagementSearch);
