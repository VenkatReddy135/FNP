import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

/**
 * The component renders an input field which is used for entering number value on list page.
 *
 * @param {object} props all the props needed for CustomGridInputField component
 * @returns {React.ReactElement} returns a React component for input field.
 */
const CustomGridInputField = (props) => {
  const { updatedInputCallback, record, column, inputType, uniqueValue, inputClass } = props;
  const recordValue = record[column];
  const [inputValue, setInputValue] = useState(recordValue);

  useEffect(() => {
    setInputValue(recordValue);
  }, [recordValue]);

  /**
   * @function onChange function called on text field input change
   * @param {object} event object onChange
   */
  const onChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    updatedInputCallback(event.target);
  };
  return (
    <>
      <TextField
        type={inputType}
        name={record[uniqueValue]}
        value={inputValue}
        InputProps={{
          inputProps: { min: 0, className: `${inputClass}` },
        }}
        variant="outlined"
        onChange={onChange}
      />
    </>
  );
};

CustomGridInputField.propTypes = {
  record: PropTypes.oneOfType([PropTypes.object]),
  updatedInputCallback: PropTypes.func.isRequired,
  column: PropTypes.string.isRequired,
  uniqueValue: PropTypes.string.isRequired,
  inputClass: PropTypes.string,
  inputType: PropTypes.string,
};
CustomGridInputField.defaultProps = {
  record: {},
  inputType: "",
  inputClass: "",
};

export default CustomGridInputField;
