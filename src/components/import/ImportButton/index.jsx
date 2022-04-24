/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { makeStyles, withStyles, ButtonGroup, Button, Menu, MenuItem } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useHistory } from "react-router-dom";

/**
 * withStyles hook of material-ui to apply style for Import Button Dropdown
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
    width: "150px",
    marginLeft: "25px",
  },
})((props) => (
  <Menu
    elevation={3}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

/**
 * makeStyles hook of material-ui to apply style for Import & Export button
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  menuItemText: {
    color: "#555555",
    opacity: "100%",
  },
  rotateUp: {
    transform: "rotate(180deg)",
  },
  rotateDown: {
    transform: "rotate(0deg)",
  },
  transition: {
    transition: "0.5s ease",
  },
});

/**
 * Component for Import button with an Expand icon, on click of Expand Icon opens a dialog of menu items
 *
 * @param {object} props all the props needed for Import Button component
 * @returns {React.ReactElement} returns Import button with Expand Icon
 */
const ImportButton = ({ ...props }) => {
  const { onClick, configurationForExpandMenu, resource } = props;
  const anchorRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const history = useHistory();

  /**
   * Function to update the state of current clicked expand icon element
   *
   * @function handleMenuItemClick
   * @param  {string} event object details related to button event
   */
  const handleMenuItemClick = (event) => {
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

  /**
   * Function that performs the action depending on the option clicked
   *
   * @param {object}e  used dependency to get the targeted data set.
   * @function handleItemEvent
   */
  const handleItemEvent = (e) => {
    const endPoint = e.target.dataset.atId;
    history.push({
      pathname: `/${resource}${endPoint}`,
    });
    handleClose();
  };

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" className={classes.btngrpStyle}>
        <Button data-at-id="importbtn" className={classes.titleStyle} onClick={onClick}>
          IMPORT
        </Button>
        <Button className={classes.titleStyle} size="small" data-at-id="splitbtn" onClick={handleMenuItemClick}>
          <ArrowDropDownIcon
            data-at-id="arrowicon"
            className={
              anchorEl ? `${classes.rotateUp} ${classes.transition}` : `${classes.rotateDown} ${classes.transition}`
            }
          />
        </Button>
      </ButtonGroup>
      <StyledMenu id="split-button-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {configurationForExpandMenu.map((option, index) => {
          const itemKey = `option_${index}`;
          return (
            <MenuItem
              className={classes.menuItemText}
              key={itemKey}
              data-at-id={option.value}
              onClick={handleItemEvent}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};

ImportButton.propTypes = {
  onClick: PropTypes.func,
  configurationForExpandMenu: PropTypes.arrayOf(PropTypes.object),
  resource: PropTypes.string,
};
ImportButton.defaultProps = {
  onClick: () => {},
  configurationForExpandMenu: [{}],
  resource: "",
};

export default ImportButton;
