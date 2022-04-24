import React from "react";
import { MenuItemLink } from "react-admin";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { makeStyles } from "@material-ui/core/styles";

/**
 *
 * useStyles function to apply material-ui style on Footer component
 *
 * @function useStyles
 */
const useStyles = makeStyles(
  {
    helpIcon: {
      width: "54px",
      height: "44px",
      borderRadius: "4px",
      color: "#ffffff",
    },
    active: {
      background: "#107e38",
    },
  },
  { name: "RaMenuItemLink" },
);

/**
 * Help component in the AppBar
 *
 * @returns {React.createElement} Help.jxs
 */
const Help = () => {
  const classes = useStyles();
  return (
    <MenuItemLink
      to="/help"
      leftIcon={<HelpOutlineIcon />}
      primaryText={null}
      activeClassName={classes.active}
      sidebarIsOpen
      disableGutters
      className={classes.helpIcon}
      data-at-id="help"
      disabled
    />
  );
};

export default Help;
