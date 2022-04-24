import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import { useInput } from "react-admin";
import ReactJson from "react-json-view";

/**
 * Component for  JsonEditorField editing/displaying for input type json
 *
 * @param {object} props contains data related to JsonEditorFields
 * @param {string} props.label This contains the label of the fields which are coming dynamically
 * @param {object} props.jsonObj  This is Json type data structure which initializes as an empty object
 * @param {number} props.collapseValue This field is used to set the collapse value of the Object
 * @param {boolean} props.disabled This is used to set any field disable. It is a boolean type
 * @returns {React.ReactElement} returns a React component with Link.
 */
const JsonEditorField = (props) => {
  const { jsonObj = {}, label, collapseValue = 2, disabled } = props;
  const {
    input: { value, onChange },
  } = useInput(props);

  /**
   * Function to update the Json Object.
   *
   * @param {object} updatedSrc to update data
   */
  const change = (updatedSrc) => {
    const updatedValue = updatedSrc;
    onChange(updatedValue);
  };

  /**
   * Function to update the Json Object.
   *
   * @param {object} e to change object
   * @returns {React.Component} return boolean value.
   */
  const updateValue = (e) => {
    if (disabled) {
      return false;
    }
    return change(e.updated_src);
  };

  const src = { ...jsonObj, ...value };

  return (
    <Grid style={{ marginTop: "100px", marginBottom: "20px" }}>
      <ReactJson
        name={label}
        collapsed={collapseValue}
        src={src}
        onEdit={updateValue}
        onAdd={updateValue}
        onDelete={updateValue}
        quotesOnKeys={false}
      />
    </Grid>
  );
};
JsonEditorField.propTypes = {
  label: PropTypes.string,
  jsonObj: PropTypes.arrayOf(PropTypes.object),
  collapseValue: PropTypes.number,
  disabled: PropTypes.bool,
};

JsonEditorField.defaultProps = {
  label: "",
  jsonObj: [{}],
  collapseValue: null,
  disabled: false,
};
export default JsonEditorField;
