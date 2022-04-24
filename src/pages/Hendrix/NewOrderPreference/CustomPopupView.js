import React from "react";
import { useTranslate } from "react-admin";
import { Button, makeStyles } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";

/**
 * makeStyles hook of material-ui to apply style for status component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  buttonStyle: {
    width: "34px",
    height: "44px",
    borderRadius: "3px",
    padding: "6px 6px",
    marginRight: "10px",
    "&:hover": {
      background: "#DBDADA",
    },
    "&.MuiButton-root": {
      minWidth: "0px",
    },
  },
});

/** Custom popup to make delete the row
 *
 * @param {object} param0 contains destructured values
 * @param {string} param0.row title *
 * @param {Array} MenuOptions list of menu options
 * @param {Function} CallDetails to implement the selected menu option
 * @returns {React.ReactElement} Popup component
 */
const SimpleMenu = ({ row }, MenuOptions, CallDetails) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const translate = useTranslate();
  const menuList = MenuOptions ? [...MenuOptions] : [];
  /**
   * @function to update the state
   * @param {*} event event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * @function to set state value to null
   *
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * @function to set state value to null & pass the selected values to callDetails function
   * @param {*} key  selected menu item's key
   */
  const onEdit = (key) => {
    setAnchorEl(null);
    CallDetails(row, translate(key));
  };

  return (
    <div>
      <Button
        data-at-id="id"
        aria-controls="customized-menu"
        aria-haspopup="true"
        className={classes.buttonStyle}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      {row.baseGeoId}
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuList.map((item) => {
          return (
            <div key={item} style={{ padding: 10 }}>
              <div style={{ float: "left", paddingTop: 5 }}>{item.Icon}</div>
              <MenuItem onClick={() => onEdit(item.key)}>{translate(item.key)}</MenuItem>
            </div>
          );
        })}
      </Menu>
    </div>
  );
};

SimpleMenu.propTypes = {
  row: PropTypes.string.isRequired,
};

export default SimpleMenu;
