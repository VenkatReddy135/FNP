import { Badge, makeStyles } from "@material-ui/core";
import NotificationImportantOutlined from "@material-ui/icons/NotificationImportantOutlined";
import React from "react";
import { MenuItemLink } from "react-admin";

const useStyles = makeStyles(
  {
    notificationIcon: {
      width: "54px",
      height: "44px",
      borderRadius: "4px",
      "&:hover": {
        background: "#107e38",
      },
    },
    active: {
      background: "#107e38",
    },
    iconStyle: {
      color: "white",
    },
  },
  { name: "MenuItemLink" },
);

/**
 * Component is the show notification.
 *
 * @returns {React.createElement} Notification component in the AppBar
 */
const MyNotification = () => {
  const classes = useStyles();

  /**
   * @constant
   * @type {React.createElement} Notification Icon with default badge of 3.
   * @default
   */
  const notificationIcon = (
    <Badge color="error">
      <NotificationImportantOutlined className={classes.iconStyle} />
    </Badge>
  );
  return (
    <MenuItemLink
      to="/notification"
      leftIcon={notificationIcon}
      primaryText={null}
      sidebarIsOpen
      disableGutters
      className={classes.notificationIcon}
      activeClassName={classes.active}
      data-at-id="notification"
      disabled
    />
  );
};

export default MyNotification;
