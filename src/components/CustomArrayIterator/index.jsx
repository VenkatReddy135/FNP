import React from "react";
import PropTypes from "prop-types";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { IconButton, Select, MenuItem, TextField, InputLabel, FormControl } from "@material-ui/core";
import useStyles from "../../assets/theme/common";

/**
 * CustomArrayIterator component can be used where you want iterate on an array of objects which has the  delete functionality
 *
 * @param {*} props all the props needed for CustomArrayIterator component
 * @returns {React.createElement} returns the CustomArrayIterator component
 */
const CustomArrayIterator = (props) => {
  const {
    index,
    optionsData,
    isDisabled,
    selectInputLabel,
    deleteClick,
    isDisplayDeleteButton,
    handleSelectInputChange,
    handleTextInputChange,
    textInputLabel,
    selectInputValue,
    textInputValue,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.arrayIterator}>
      <FormControl>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          {selectInputLabel}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="standard"
          disabled={isDisabled}
          className={classes.selectItem}
          value={optionsData.length > 0 ? selectInputValue : ""}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          onChange={(event) => handleSelectInputChange(event, index)}
        >
          {optionsData.map((option) => {
            return (
              <MenuItem value={option.id} key={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        value={textInputValue}
        focused={false}
        fullWidth
        disabled={isDisabled}
        label={textInputLabel}
        title={textInputValue}
        margin="normal"
        className={classes.textFieldItem}
        onChange={(event) => handleTextInputChange(event, index)}
      />
      <IconButton
        style={{ color: "#FF9212", strokeWidth: "1", display: isDisplayDeleteButton ? "block" : "none" }}
        onClick={() => deleteClick(index)}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </div>
  );
};

CustomArrayIterator.propTypes = {
  optionsData: PropTypes.arrayOf(PropTypes.any).isRequired,
  isDisabled: PropTypes.bool,
  selectInputLabel: PropTypes.string.isRequired,
  textInputLabel: PropTypes.string.isRequired,
  deleteClick: PropTypes.func,
  isDisplayDeleteButton: PropTypes.bool,
  handleSelectInputChange: PropTypes.func,
  handleTextInputChange: PropTypes.func,
  index: PropTypes.number.isRequired,
  selectInputValue: PropTypes.string,
  textInputValue: PropTypes.string,
};

CustomArrayIterator.defaultProps = {
  isDisabled: false,
  handleTextInputChange: () => {},
  handleSelectInputChange: () => {},
  deleteClick: () => {},
  isDisplayDeleteButton: false,
  selectInputValue: "",
  textInputValue: "",
};

export default CustomArrayIterator;
