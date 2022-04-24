import React, { useState } from "react";
import { Grid, Typography, Box, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import useStyle from "./WeightageHeaderStyles";
import { DESC } from "../../../../config/GlobalConfig";
/**
 * Weightage header component to display headings in the form
 *
 * @name WeightageHeader
 * @param {object} props contains data related to header of the form
 * @returns {React.ReactElement} header component.
 */
const WeightageHeader = (props) => {
  const classes = useStyle();
  const translate = useTranslate();
  const [sortArrow, setSortArrow] = useState("ASC");
  const { onSortClick, isSort } = props;

  /**
   * Function to set the asc and desc arrow and send a callback to weightage component
   *
   * @name sortWeightage
   */
  const sortWeightage = () => {
    setSortArrow(sortArrow === DESC ? "ASC" : "DESC");
    onSortClick(sortArrow);
  };

  return (
    <Box width="40%">
      <Grid container className={classes.formHeader}>
        <Grid item xs={6}>
          <Typography className={classes.formHeaderLabel}>
            {translate("indexable_attribute.weightage_heading_first")}
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          <div className={classes.textIconAlign}>
            <Typography className={classes.formHeaderLabel}>
              {translate("indexable_attribute.weightage_heading_second")}
            </Typography>
            {isSort && (
              <IconButton onClick={sortWeightage} className={classes.sortIcon}>
                {sortArrow === DESC ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
              </IconButton>
            )}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

WeightageHeader.propTypes = {
  onSortClick: PropTypes.func.isRequired,
  isSort: PropTypes.bool.isRequired,
};

export default WeightageHeader;
