import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import Help from "../help";
import MyNotification from "../Notification";
import QuickLinks from "../quick-links";
import UserProfileMenu from "../userprofile";
import Logo from "../Logo";
import SubMenuContainer from "../../components/MegaMenu/SubMenuContainer";

const useStyles = makeStyles({
  spacer: {
    flex: 1,
  },
  appBar: {
    background: "#009D43",
    boxShadow: "0px 0px 15px #9595954D",
    border: "1px solid #E5E5E5",
    opacity: "1",
    "& .MuiToolbar-root": {
      height: "100%",
    },
    "& .MuiSvgIcon-root": {
      fill: "white",
    },
    "& .MuiListItemIcon-root": {
      paddingLeft: "15px",
    },
  },
  dashboard: {
    fontSize: "20px",
    color: "white",
    marginLeft: "31px",
    height: "50px",
    borderRadius: "4px",
  },
});

/**
 * Component for displaying the main header
 *
 * @param  {object} props object contains props like open and title
 * @param  {boolean} props.open boolean value
 * @returns {React.ReactElement} Megamenu, Logo etc.
 */
const MyAppBar = (props) => {
  const { open } = props;
  const classes = useStyles();
  const [selectedMenuItem, setSelectedMenuItem] = useState({});

  /**
   * @function handleMenuItemSelection This function will handle the after effects of success.
   * @param {object} selectedItem is passed to the function
   */
  const handleMenuItemSelection = (selectedItem) => {
    setSelectedMenuItem(selectedItem);
  };
  return (
    <AppBar title={null} open={open} className={classes.appBar}>
      <Toolbar disableGutters>
        <MegaMenu handleMenuItemSelection={handleMenuItemSelection} />
        <Logo />
        <SubMenuContainer selectedMenuItem={selectedMenuItem} />
        <span className={classes.spacer} />
        <QuickLinks />
        <MyNotification />
        <Help />
        <UserProfileMenu />
      </Toolbar>
    </AppBar>
  );
};

MyAppBar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default React.memo(MyAppBar);
