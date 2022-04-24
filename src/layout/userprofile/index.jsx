import { Avatar, Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import React, { useState } from "react";
import StyledMenu from "../../components/styled-menu";
import Logout from "../logout";
import { useCustomQueryWithStore } from "../../utils/CustomHooks";

/**
 *
 * useStyles function to apply material-ui style on Footer component
 *
 * @function useStyles
 */
const useStyles = makeStyles({
  avatar: {
    height: "36px",
    width: "35px",
  },
  userClass: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: "9px",
  },
  rotateUp: {
    transform: "rotate(180deg)",
  },
  rotateDown: {
    transform: "rotate(0deg)",
  },
  transClass: {
    transition: "0.1s linear",
  },
  name: {
    color: "#ffffff",
  },
  userBtn: {
    color: "#FFFFFF",
    textTransform: "none",
    "&:hover": {
      background: "#107e38",
    },
  },
});
const user = {
  userName: "John Doe",
  role: "Super Admin",
};
/**
 *
 * @returns {React.createElement} QuickLinks
 */
const MyMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const classes = useStyles();
  /**
   *handle click event to set anchor
   *
   * @function handleClick
   * @param {event} event current value of anchor element
   */
  const handleOpen = (event) => {
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

  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    setUserInfo(response.data);
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_PARTY_SERVICE}/login-profiles`, handleSuccess);
  return (
    <>
      <Button className={classes.userBtn} onClick={handleOpen} data-at-id="userProfile" variant="text">
        <Avatar className={classes.avatar} component={AccountCircleIcon} />
        <Box className={classes.userClass}>
          <Typography variant="subtitle2" className={classes.name}>
            {userInfo?.partyName}
          </Typography>
          <Typography className={classes.name} variant="caption">
            {`Welcome, ${user.role}`}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          className={
            anchorEl ? `${classes.rotateUp} ${classes.transClass}` : `${classes.rotateDown} ${classes.transClass}`
          }
        />
      </Button>
      <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Logout userProfile={userInfo} />
      </StyledMenu>
    </>
  );
};

export default MyMenu;
