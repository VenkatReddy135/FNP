/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import propTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import useStyles from "../../styles";

const options = ["View : Compact", "View : Calendar"];

/**
 * Component for SplitButton / dropdown button
 *
 * @param {*} props all the props needed for component
 * @returns {React.ReactElement} returns a Split Button with two options
 */
const SplitButton = ({ handleMenuItemClick, selectedIndex }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const classes = useStyles();

  /**
   * function for handling changes
   *
   * @param {object} event event
   * @param {number} index key
   */
  const handleChange = (event, index) => {
    handleMenuItemClick(event, index);
    setOpen(false);
  };

  /**
   * function to open the dropdown
   *
   */
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  /**
   * function to close the dropdown
   *
   *  @param {object} event event object
   *
   */
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid item className={classes.newFcdropdown}>
      <ButtonGroup ref={anchorRef} aria-label="split button">
        <Button className={classes.splitButtonWrapper}>{options[selectedIndex]}</Button>
        <Button className={classes.splitButtonWrapper} onClick={handleToggle}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className={classes.splitButtonPaper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleChange(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
};

SplitButton.propTypes = {
  handleMenuItemClick: propTypes.func.isRequired,
  selectedIndex: propTypes.number.isRequired,
};

export default SplitButton;
