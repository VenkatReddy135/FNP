/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormHelperText,
  ListItemText,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Input,
  Select,
  Chip,
  Grid,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/ClearOutlined";
import { useTranslate, useInput } from "react-admin";
import useStyles from "../../assets/theme/common";

/**
 * Component to BoundedCheckBox
 *
 * @param {object} props all the props required by component
 * @returns {React.ReactElement} returns bounded check list component
 */
const BoundedCheckBoxDropdown = memo((props) => {
  const { id, disabled, label, options, className, selectAll, showLabel, deletable, deletedItemArray } = props;
  const {
    input: { name, value, onChange, ...rest },
    meta: { touched, error },
    isRequired,
  } = useInput(props);
  const memoizedIsAllSelected = useMemo(() => options.length && value.length === options.length, [options, value]);
  const translate = useTranslate();
  const classes = useStyles();
  const memoizedError = useMemo(() => !!(touched && error), [touched, error]);
  const memoizedOptions = useMemo(
    () =>
      options &&
      options.map((choice) => (
        <MenuItem key={choice.id} value={choice.name}>
          <Checkbox checked={value.indexOf(choice.name) > -1} />
          <ListItemText primary={showLabel ? choice.label : choice.name} />
        </MenuItem>
      )),
    [options, value, showLabel],
  );

  useEffect(() => {
    const event = {
      target: {
        name,
        value: [...deletedItemArray],
      },
    };
    if (deletedItemArray.length) {
      onChange(event);
    }
  }, [JSON.stringify(deletedItemArray)]);

  /**
   * @function handleChange to handle on change event
   * @param {object} event handle change event object
   */
  const handleChange = (event) => {
    if (selectAll) {
      const currentValue = event?.target?.value;
      if (currentValue[currentValue.length - 1] === "all") {
        const allOptions = options.map((opt) => opt.name);
        const allValues = value.length === options.length ? [] : allOptions;
        onChange({ ...event, target: { ...event.target, value: [...allValues] } });
        return;
      }
      onChange({
        ...event,
        target: { ...event.target, value: [...currentValue] },
      });
    } else {
      onChange(event);
    }
  };

  /**
   * @function valueRender render display value fo selected options
   * @param {Array} selectedValues selected options values
   * @returns {Array} updated select options to display
   */
  const valueRender = (selectedValues) => {
    let displayValues = [...selectedValues];
    if (showLabel) {
      displayValues = selectedValues.map((val) => {
        const selectedOpt = options.find((opt) => {
          return opt.name === val && opt;
        });
        if (selectedOpt) return selectedOpt.label;
        return val.toString().replace(/for\s/gi, "").trim();
      });
    }
    return displayValues.join(", ");
  };

  /**
   * @function handleChipDelete to handle on change event
   * @param {object} event handle change event object
   * @param {object} deletedItem handle change event object
   *
   */
  const handleChipDelete = (event, deletedItem) => {
    const modifiedArray = value.filter((i) => i !== deletedItem);
    onChange({
      ...event,
      target: { ...event.target, value: [...modifiedArray] },
    });
  };

  /**
   * @function chipRender render display value fo selected options
   * @param {Array} selectedValues selected options values
   * @returns {Array} updated select options to display
   */
  const chipRender = (selectedValues) => {
    return (
      <Grid container>
        {selectedValues.map((item) => (
          <Chip
            disabled={disabled}
            key={item}
            label={item}
            clickable
            deleteIcon={<CancelIcon onMouseDown={(event) => event.stopPropagation()} />}
            className={classes.chipGap}
            onDelete={(e) => handleChipDelete(e, item)}
          />
        ))}
      </Grid>
    );
  };

  return (
    <FormControl error={memoizedError} required={isRequired} margin="dense">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        id={id}
        value={value || []}
        input={<Input />}
        disabled={disabled}
        className={className}
        renderValue={!deletable ? valueRender : chipRender}
        error={!!(touched && error)}
        helperText={touched && error}
        required={isRequired}
        onChange={handleChange}
        variant="standard"
        margin="dense"
        fullWidth
        multiple
        {...rest}
      >
        {selectAll && (
          <MenuItem key="all" value="all">
            <Checkbox
              checked={memoizedIsAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
        )}
        {memoizedOptions}
      </Select>
      {memoizedError && <FormHelperText>{translate(error)}</FormHelperText>}
    </FormControl>
  );
});

BoundedCheckBoxDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  selectAll: PropTypes.bool,
  showLabel: PropTypes.bool,
  deletable: PropTypes.bool,
  deletedItemArray: PropTypes.arrayOf(PropTypes.string),
};

BoundedCheckBoxDropdown.defaultProps = {
  disabled: false,
  label: "",
  options: [],
  className: "",
  selectAll: false,
  showLabel: false,
  deletable: false,
  deletedItemArray: [],
};

export default BoundedCheckBoxDropdown;
