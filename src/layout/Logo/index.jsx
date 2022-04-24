import React from "react";
import { MenuItemLink } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  logo: {
    height: "43px",
    width: "119px",
    paddingRight: "15px",
    opacity: "1",
    background: "transparent 0% 0% no-repeat padding-box",
  },
});

/**
 * Component returns application logo image.
 *
 * @returns {React.createElement} Logo image in the AppBar
 */
const HeaderLogoImage = () => {
  const classes = useStyles();
  return <img src="/images/HeaderLogo.png" alt="logo" className={classes.logo} />;
};

/**
 * Component which renders the application Logo.
 *
 * @returns {React.createElement} Logo component in the AppBar
 */
const Logo = () => {
  return (
    <MenuItemLink
      to="/"
      leftIcon={<HeaderLogoImage />}
      primaryText={false}
      sidebarIsOpen
      data-at-id="logo"
      disableGutters
    />
  );
};

export default Logo;
