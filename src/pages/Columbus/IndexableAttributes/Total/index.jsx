import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import useStyles from "./TotalStyles";

/**
 * Component to Calculate total of all the weightage
 *
 * @param {object} props contains data related to total and Invalid value
 * @name Total
 * @returns {React.ReactElement} Domain Dropdown.
 */
const Total = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { total, isInvalidValue } = props;

  const isInvalidCheck = total !== 100 || isInvalidValue ? classes.isInvalidColor : null;

  return (
    <Box width="40%">
      <Grid container className={classes.formHeader}>
        <Grid item xs={6}>
          <Typography variant="h6" className={`${classes.formHeaderLabel} ${isInvalidCheck}`}>
            {translate("indexable_attribute.total_weightage")}
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          <Typography data-test="total" className={`${classes.formHeaderLabel} ${isInvalidCheck}`}>
            {`${total}%`}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

Total.propTypes = {
  isInvalidValue: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
};

export default Total;
