/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import { Typography } from "@material-ui/core";
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
  const { checkboxList, checkAllButton, className, onChange, label } = props;

  const [checkBoxes, setCheckBoxes] = useState(
    checkboxList.map((val) => {
      return {
        label: val.categoryName,
        value: val.categoryId,
        checked: false,
      };
    }),
  );
  const [selectAll, setSelectAll] = useState(false);

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
    setCheckBoxes([...tempArr]);
    onChange([...tempArr]);
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
    setCheckBoxes([...tempArr]);
    onChange([...tempArr]);
  };

  return (
    <div>
      <Typography className={className}>{label}</Typography>
      <FormGroup column>
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
};
CustomCheckboxArray.defaultProps = {
  checkboxList: [],
  checkAllButton: true,
  className: "",
  onChange: () => {},
  label: "",
};
export default React.memo(CustomCheckboxArray);
