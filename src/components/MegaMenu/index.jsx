import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MenuItemLink } from "react-admin";
import AppsIcon from "@material-ui/icons/Apps";
import KitchenIcon from "@material-ui/icons/Kitchen";
import { withStyles, Menu, Button, Grid, makeStyles } from "@material-ui/core";
import DomainOutlinedIcon from "@material-ui/icons/DomainOutlined";
import HomeIcon from "@material-ui/icons/Home";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import Rating from "@material-ui/icons/RateReview";
import { useLocation } from "react-router-dom";
import { useCustomQueryWithStore } from "../../utils/CustomHooks";
import URL_DICTIONARY from "./urlMappings";

/**
 * makeStyles hook of material-ui to apply style for every link in the dropdown menu
 *
 * @function
 * @name useSidebarStyles
 */
const useSidebarStyles = makeStyles({
  root: {
    zIndex: 9999,
    margin: "0 4px",
  },
  span: {
    wordBreak: "break-word",
    whiteSpace: "initial",
    width: "70px",
    display: "inline-block",
  },
  sidebarMenu: {
    paddingTop: "35px",
    width: "134px",
    height: "135px",
    background: "#EEEEEE",
    textAlign: "center",
    letterSpacing: "0.14px",
    color: "#555555",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",

    "&:hover": {
      background: "#009D43",
      color: "#FFFFFF",
      "& .MuiListItemIcon-root": {
        color: "#FFFFFF",
      },
    },
  },
});

/**
 * makeStyles hook of material-ui to apply style for mega menu button
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  iconStyle: {
    color: "white",
  },
  buttonStyle: {
    height: "44px",
    width: "54px",
    borderRadius: "4px",
    "&:hover": {
      background: "#107e38",
    },
  },
});

const ICON_CONFIG = {
  domainIcon: <DomainOutlinedIcon />,
  "home-icon": <HomeIcon />,
  configIcon: <DonutLargeIcon />,
  "kitchen-icon": <KitchenIcon />,
  rateReview: <Rating />,
};

/**
 * withStyles hook of material-ui to apply style for mega dropdown
 *
 * @function
 * @name StyledMenu
 */
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    background: "#FFFFFF",
    borderRadius: "3px",
    opacity: "1",
    height: "auto",
    minHeight: "152px",
    maxHeight: "600px",
    width: "auto",
    maxWidth: "1006px",
  },
})((props) => {
  const { anchorEl, id, classes, keepMounted, onClose, open, children } = props;
  return (
    <Menu
      elevation={3}
      getContentAnchorEl={null}
      anchorReference="anchorPosition"
      anchorPosition={{
        left: -16,
        top: 70,
      }}
      anchorEl={anchorEl}
      id={id}
      classes={classes}
      keepMounted={keepMounted}
      onClose={onClose}
      open={open}
    >
      {children}
    </Menu>
  );
});

/**
 * Component for Mega Menu contains icon for mega menu and and dropdown list of all menus
 *
 * @param {object} props component props
 * @param {Function} props.handleMenuItemSelection function to update the sub menus
 * @returns {React.Component} React component for Mega menu
 */
const MegaMenu = (props) => {
  const location = useLocation();
  const { pathname } = location || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const { handleMenuItemSelection } = props;
  const [megaMenu, setMegaMenu] = useState([]);

  useEffect(() => {
    const selectedMenu = megaMenu.filter(({ name, anchor, subElements }) => {
      let getMenu = pathname.includes(anchor);
      const urlMapping = URL_DICTIONARY[name] || [];
      const mappedURl = urlMapping.find((item) => pathname?.includes(item));
      if (mappedURl) {
        return mappedURl;
      }
      if (getMenu) {
        return getMenu;
      }
      getMenu = subElements?.find((item) => pathname?.includes(item.anchor));
      return getMenu;
    });
    handleMenuItemSelection(...selectedMenu);
  });

  /**
   * Function to update the state of current clicked element
   *
   * @function handleClick
   * @param  {string} event object details related to button event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Function to update the state for closing mega menu
   *
   * @function handleClose
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  const sidebarClasses = useSidebarStyles();

  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    setMegaMenu(response?.data?.subElements);
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_MEGAMENU_SERVICE}navigation`, handleSuccess);

  return (
    <>
      <Button
        data-at-id="switchMenu"
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.buttonStyle}
      >
        <AppsIcon className={classes.iconStyle} />
      </Button>
      <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Grid container className={sidebarClasses.root} spacing={1}>
          {megaMenu.map((sideBarItems) => (
            <Grid item md="auto" key={`switchMenuItemsGird_${sideBarItems.id}`}>
              <MenuItemLink
                to={sideBarItems.anchor}
                primaryText={sideBarItems.label}
                className={sidebarClasses.sidebarMenu}
                leftIcon={ICON_CONFIG[sideBarItems.icon] || ICON_CONFIG["home-icon"]}
                sidebarIsOpen
                key={`switchMenuItems_${sideBarItems.label}`}
                data-testid={sideBarItems.label}
                onClick={handleClose}
              />
            </Grid>
          ))}
        </Grid>
      </StyledMenu>
    </>
  );
};

MegaMenu.propTypes = {
  handleMenuItemSelection: PropTypes.func,
};

MegaMenu.defaultProps = {
  handleMenuItemSelection: () => {},
};

export default MegaMenu;
