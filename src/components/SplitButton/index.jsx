/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState, memo } from "react";
import PropTypes from "prop-types";
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
import useStyles from "../../assets/theme/common";

/**
 * Component to SplitButton
 *
 * @param {object} props all the props required by component
 * @returns {React.ReactElement} returns split button component
 */
const SplitButton = memo((props) => {
  const { label, options, onSelect } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  /**
   * @function handleMenuItemClick to set index and close menu item
   * @param {string} index index of selected menu item
   */
  const handleMenuItemClick = (index) => {
    setOpen(false);
    onSelect(options[index]);
  };

  /**
   * @function handleToggle to handle toggle of menu items
   */
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  /**
   * @function handleClose To handle close event of menu item on away click
   * @param {object} event event object
   */
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
          className={classes.previewButtonShadow}
        >
          <Button onClick={handleToggle} className={classes.previewButton}>
            {label}
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? "split-button-menu" : null}
            aria-expanded={open ? "true" : null}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          className={classes.previewPopper}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper className={classes.previewButtonPaper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem key={option} onClick={() => handleMenuItemClick(index)}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
});

SplitButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  onSelect: PropTypes.func,
};

SplitButton.defaultProps = {
  label: "",
  options: [],
  onSelect: () => {},
};

export default SplitButton;
