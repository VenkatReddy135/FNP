/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslate, TextInput } from "react-admin";
import { Grid, Typography } from "@material-ui/core";
import { shippingMethodTotal } from "../../../../config/GlobalConfig";
import useStyles from "./PopulateSequenceCategoryStyle";

/**
 * PopulateCategory component to Populate Category and Shipping method Component
 *
 * @param {object} props  props for the required for the Component
 * @returns {React.ReactElement} Shipping Method table.
 */
const ShippingDistribution = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { shippingLabelData, formData, totalValue, handleChange } = props;
  return (
    <>
      <Grid container alignItems="center" flexDirection="row">
        <Grid item xs={3}>
          <Typography variant="subtitle2">{translate("populate_category.shipping_method_distribution")}</Typography>
        </Grid>
        <>
          {Object.keys(shippingLabelData).map((key, index) => {
            return (
              <>
                {index !== 0 ? <Grid item xs={3} /> : null}
                <Grid item xs={2} className={classes.alignShipping}>
                  <Typography variant="caption" className={classes.shippingTitle}>
                    {shippingLabelData[key]}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextInput
                    name={key}
                    source={key}
                    variant="outlined"
                    value={formData[key]}
                    defaultValue={formData[key]}
                    onChange={handleChange}
                    label=""
                    type="number"
                    helperText=""
                    className={classes.formInputWidth}
                    max={10}
                    min={1}
                    InputProps={{
                      inputProps: {
                        className: `${classes.textCenter} ${formData[key] < 0 ? classes.errorHighlight : ""}`,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5} />
              </>
            );
          })}
        </>
      </Grid>
      <Grid container alignItems="center" spacing={5}>
        <Grid item xs={3} />
        <Grid item xs={2}>
          <Typography
            variant="subtitle2"
            className={`${classes.textUppercase} ${totalValue !== 10 ? classes.errorHighlight : ""} ${
              classes.totalLabelAlign
            }`}
          >
            {translate("total")}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            variant="subtitle2"
            className={`${classes.alignTotal} ${totalValue !== shippingMethodTotal ? classes.errorHighlight : ""}`}
          >
            {totalValue}
          </Typography>
        </Grid>
        <Grid item xs={5} />
      </Grid>
    </>
  );
};
ShippingDistribution.propTypes = {
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  shippingLabelData: PropTypes.objectOf(PropTypes.any).isRequired,
  totalValue: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default memo(ShippingDistribution);
