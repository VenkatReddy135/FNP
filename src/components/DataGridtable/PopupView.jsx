import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { useTranslate } from "react-admin";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";

/**
 * makeStyles hook of material-ui to apply style for status component
 *
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

/** PopupView component used to display menu options in popup
 *
 * @param {object} param0 contains destructured values
 * @param {string} param0.row title *
 * @param {Array} menuOptions list of menu options
 * @param {Function} onNavigate to implement the selected menu option
 * @param {Array} menuRuleOptions list of menu options
 * @returns {React.ReactElement} Popup component
 */
const PopupView = ({ row }, menuOptions, onNavigate, menuRuleOptions) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const translate = useTranslate();
  const menuList = !row.id || (row.isGlobal !== undefined && row.isGlobal) ? menuRuleOptions : menuOptions;

  /**
   * @function handleClick to capture the selected value
   * @param {object} event event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * @function handleClose to close the popup
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * @function onMenuClick to update based on the change
   * @param {string} key selected menu option's key
   */
  const onMenuClick = (key) => {
    setAnchorEl(null);
    onNavigate(row, translate(key));
  };

  return (
    <>
      <Button
        data-at-id="id"
        aria-controls="customized-menu"
        aria-haspopup="true"
        className={classes.buttonStyle}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuList &&
          menuList.map((item) => {
            return (
              <div key={item} style={{ padding: 10 }}>
                <div style={{ float: "left", paddingTop: 5 }}>{item.Icon}</div>
                <MenuItem onClick={() => onMenuClick(item.key)}>{translate(item.key)}</MenuItem>
              </div>
            );
          })}
      </Menu>
    </>
  );
};

PopupView.propTypes = {
  row: PropTypes.string.isRequired,
};

export default PopupView;
