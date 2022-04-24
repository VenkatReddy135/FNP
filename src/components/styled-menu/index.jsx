import { Menu } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

/**
 *
 * StyledMenu function to apply material-ui style on Menu material-ui component
 *
 * @function StyledMenu
 */
const StyledMenu = withStyles({
  paper: {
    backgroundColor: "#FFFFFF",
  },
})((props) => {
  const { anchorEl, id, classes, keepMounted, onClose, open, children } = props;
  return (
    <>
      <Menu
        elevation={3}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
      {/* // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      /> */}
    </>
  );
});

export default StyledMenu;
