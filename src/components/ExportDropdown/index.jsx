import React, { memo, useState, useCallback } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import get from "lodash/get";
import FormControl from "@material-ui/core/FormControl";
import useStyles from "./ExportStyles";

/**
 * Component for Export Dropdown
 *
 * @param {object} props all the props required for Export Dropdown
 * @returns {React.ReactElement} returns a React component for Export Dropdown.
 */
const ExportDropdown = (props) => {
  const { data, record, disable, label, onChange, compareKey, compareValue } = props;
  const [option, setOption] = useState("");
  const classes = useStyles();

  /**
   * function for onChange select value
   *
   * @param {object} event DOM object for onChange event
   * @function callback function
   */
  const update = (event) => {
    setOption(option);
    if (onChange) {
      onChange(record, event);
    }
  };

  /**
   * function for disable or enable Dropdown
   *
   * @function getDisable to get disable flag
   * @returns {boolean} status
   */
  const getDisable = () => {
    if (compareKey && compareValue) {
      if (get(record, compareKey) === compareValue) {
        return disable;
      }
    }
    return !disable;
  };

  const options = data.data;
  const value = getDisable();

  /**
   * function to render options of Dropdown
   *
   * @function renderOptions to render option list
   * @returns {React.ReactElement} status
   */
  const renderOptions = useCallback(() => {
    return options.map((item) => {
      return (
        <MenuItem className={classes.item} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  }, [options, classes]);

  return (
    <FormControl className={classes.formControl} disabled={value ? !disable : disable}>
      <Select
        displayEmpty
        disableUnderline
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
          disableScrollLock: true,
          PopoverClasses: {
            root: classes.popover,
          },
        }}
        IconComponent={KeyboardArrowDownIcon}
        value={option}
        className={classes.show}
        onChange={update}
        classes={{
          disabled: classes.disabled,
          root: classes.root,
          nativeInput: classes.input,
          icon: classes.arrowIcon,
        }}
      >
        <MenuItem value="" style={{ display: "none" }}>
          {label.toUpperCase()}
        </MenuItem>
        {renderOptions()}
      </Select>
    </FormControl>
  );
};
ExportDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.string).isRequired,
  disable: PropTypes.bool,
  onChange: PropTypes.func,
  record: PropTypes.objectOf(PropTypes.string),
  compareKey: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
ExportDropdown.defaultProps = {
  onChange: () => {},
  record: {},
  disable: false,
  compareKey: "status",
  compareValue: "ACTIVE",
};
export default memo(ExportDropdown);
