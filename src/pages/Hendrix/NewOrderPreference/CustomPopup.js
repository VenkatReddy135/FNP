import React from "react";
import { Grid } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";

/**
 * Custom popup to navigate to Product details page
 *
 * @param {object} param0 contains destructured values
 * @param {string} param0.row title *
 * @param {string} param0.column title
 * @param {Function} CallDetails to implement the selected menu option
 * @param {boolean} isPercentage true/false
 * @returns {React.ReactElement} Popup component
 */
const CustomPopup = ({ row, column }, CallDetails, isPercentage) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { key } = column;

  /**
   * @function to set state value to null & pass the selected values to callDetails function
   * @param {Array} val value
   */
  const onEdit = (val) => {
    setAnchorEl(null);
    CallDetails(row, val);
  };

  return (
    <>
      <Grid container>
        <Grid item style={{ width: "70%" }}>
          {isPercentage && (row[key] === 0 || row[key]) ? `${row[key]}%` : row[key]}
        </Grid>
        {column.MoreVertIcon && row.CHECKED === "Y" && row.columnname === key && (
          <Grid item onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <div style={{ padding: 10 }}>
                <MenuItem onClick={() => onEdit("View")}>View</MenuItem>
              </div>
            </Menu>
          </Grid>
        )}
      </Grid>
    </>
  );
};

CustomPopup.propTypes = {
  row: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
};

export default CustomPopup;
