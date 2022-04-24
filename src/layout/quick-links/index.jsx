import { Button, Typography, makeStyles } from "@material-ui/core";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import React from "react";
import { MenuItemLink, useTranslate } from "react-admin";
import StyledMenu from "../../components/styled-menu";
/**
 *
 * useStyles function to apply material-ui style on Footer component
 *
 * @function useStyles
 */
const useStyles = makeStyles({
  recentVisited: {
    paddingLeft: "12px",
    fontSize: "15px",
    fontWeight: "550",
    color: "#222222",
    opacity: "1",
    marginTop: "13px",
  },
  quickLinks: {
    paddingLeft: "12px",
    fontSize: "15px",
    fontWeight: "550",
    color: "#222222",
    opacity: "1",
    marginTop: "18px",
  },
  menuItemText: {
    fontSize: "15px",
    color: "#555555",
    opacity: "1",
    padding: "12px",
    "&:hover": {
      padding: "12px",
    },
  },
  iconStyle: {
    color: "#7FCEA1",
  },
  buttonStyle: {
    height: "44px",
    width: "54px",
    borderRadius: "4px",
    "&:hover": {
      background: "#107e38",
    },
    "&.MuiButton-root": {
      minWidth: "0px",
    },
  },
});
/**
 * mock-data for quick links
 *
 * @constant recentVisitedArr
 */
const recentVisitedArr = [
  {
    title: "Catalog Management",
    id: "1",
    route: "/route1",
  },
  {
    title: "Category",
    id: "2",
    route: "/route2",
  },
];
/**
 * mock-data for quick links
 *
 * @constant quickLinksArr
 */
const quickLinksArr = [
  {
    title: "Category Tags",
    id: "1",
    route: "/route3",
  },
  {
    title: "Pricing Engine",
    id: "2",
    route: "/route4",
  },
  {
    title: "Shipping",
    id: "3",
    route: "/route5",
  },
];
/**
 *
 * @returns {React.createElement} QuickLinks
 */
const QuickLinks = () => {
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   *handle click event to set anchor
   *
   * @function handleClick
   * @param {event} event current value of anchor element
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * set anchor element to null to close the dialog
   *
   * @function handleClose
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  return (
    <>
      <Button
        data-at-id="quicklink"
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.buttonStyle}
        disabled
      >
        <InsertLinkIcon className={classes.iconStyle} />
      </Button>

      <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Typography variant="h6" className={classes.recentVisited} gutterBottom>
          {translate("recent_visited")}
        </Typography>
        {recentVisitedArr.map((recentVisited) => (
          <MenuItemLink
            to={recentVisited.route}
            key={`recent_${recentVisited.id}`}
            className={classes.menuItemText}
            data-at-id={`recent_${recentVisited.id}`}
            primaryText={recentVisited.title}
            onClick={handleClose}
          />
        ))}
        <Typography variant="h6" className={classes.quickLinks} gutterBottom>
          {translate("quick_links")}
        </Typography>
        {quickLinksArr.map((quickLinks) => (
          <MenuItemLink
            to={quickLinks.route}
            key={`quick_${quickLinks.id}`}
            className={classes.menuItemText}
            data-at-id={`quick_${quickLinks.id}`}
            primaryText={quickLinks.title}
            onClick={handleClose}
          />
        ))}
      </StyledMenu>
    </>
  );
};

export default QuickLinks;
