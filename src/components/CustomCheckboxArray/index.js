/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import { Typography, Grid } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

/**
 * Component for creating checkbox array
 *
 * @param {*} props all the props are optional
 * @returns {React.ReactElement} returns a React component with checkbox array.
 */
const CustomCheckboxArray = (props) => {
  const translate = useTranslate();
  const { checkboxList, checkAllButton, className, onChange, label, row, defaultValue, edit, gridSize } = props;

  const [checkBoxes, setCheckBoxes] = useState(
    checkboxList.map((val) => {
      return {
        label: val.label,
        value: val.value,
        checked: false,
      };
    }),
  );
  const [selectAll, setSelectAll] = useState(false);

  /**
   * handle on CheckboxResponse
   *
   * @param {Array} values of the checkbox
   */
  const processCheckboxResult = (values) => {
    const result = [];
    setCheckBoxes([...values]);
    values.forEach((items) => {
      if (items.checked) {
        result.push(items.value);
      }
    });
    onChange([...result]);
  };

  /**
   * handle on CheckboxEvent
   *
   * @param {number} val index of the checkbox
   */
  const handleCheckboxEvent = (val = null) => {
    const tempArr = checkBoxes;
    if (val !== null) {
      tempArr[val] = { ...tempArr[val], checked: !tempArr[val].checked };
    }
    const listForUpdate = tempArr.filter((item) => item.checked);
    if (listForUpdate.length === checkBoxes.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    processCheckboxResult([...tempArr]);
  };

  /**
   * handle all checkbox
   *
   */
  const handleAll = () => {
    const isAll = !selectAll;
    const tempArr = checkBoxes.map((item) => {
      return { ...item, checked: isAll };
    });
    setSelectAll(isAll);
    processCheckboxResult([...tempArr]);
  };

  useEffect(() => {
    checkBoxes.forEach((val, index) => {
      if (defaultValue.includes(val.value)) {
        handleCheckboxEvent(index);
      }
    });
  }, [defaultValue]);

  if (!edit) {
    return (
      <Grid item {...gridSize}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h6">{defaultValue.join(", ")}</Typography>
      </Grid>
    );
  }

  return (
    <div>
      <Typography className={className}>{label}</Typography>
      <FormGroup row={row}>
        {checkAllButton && (
          <FormControlLabel
            key="all"
            control={<Checkbox key="all" name={translate("all")} onChange={handleAll} checked={selectAll} />}
            label={translate("all")}
          />
        )}

        {checkBoxes.map((item, index) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                key={item}
                name={item.label}
                onChange={() => {
                  handleCheckboxEvent(index);
                }}
                checked={item.checked}
              />
            }
            label={item.label}
          />
        ))}
      </FormGroup>
    </div>
  );
};

CustomCheckboxArray.propTypes = {
  checkboxList: PropTypes.arrayOf(PropTypes.any),
  checkAllButton: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  row: PropTypes.bool,
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  edit: PropTypes.bool,
  gridSize: PropTypes.objectOf(PropTypes.any),
};
CustomCheckboxArray.defaultProps = {
  checkboxList: [],
  checkAllButton: true,
  className: "",
  onChange: () => {},
  label: "",
  row: true,
  defaultValue: [],
  edit: false,
  gridSize: { xs: 12 },
};
export default React.memo(CustomCheckboxArray);
