import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

/**
 * FormatterView  component used to format the row fields
 *
 * @param {object} param0 contains destructured values
 * @param {object} param0.row selected row
 * @param {object} param0.column selected column
 * @param {Function} onMenuClick function to navigate to product details page on click
 * @param {boolean} isPercentage true/false
 * @returns {React.ReactElement} Formatter component
 */
const FormatterView = ({ row, column }, onMenuClick, isPercentage) => {
  const { key } = column;
  return (
    <>
      <Grid container>
        <Grid item style={{ width: "70%" }}>
          {isPercentage && (row[key] === 0 || row[key]) ? `${row[key]}%` : row[key]}
        </Grid>
        {column.MoreVertIcon && row.CHECKED === "Y" && row.columnname === key && (
          <Grid item onClick={onMenuClick}>
            <MoreVertIcon />
          </Grid>
        )}
      </Grid>
    </>
  );
};

FormatterView.propTypes = {
  row: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
};

export default FormatterView;
