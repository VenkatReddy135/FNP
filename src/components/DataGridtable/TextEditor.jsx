import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    fontFamily: "inherit",
    width: "100%",
    height: "100%",
  },
});
/**
 * @function autoFocusAndSelect to focus on select and focus on the cell
 * @param {object} input input value
 *
 */
const autoFocusAndSelect = (input) => {
  input?.focus();
  input?.select();
};

/**
 * Component to display the grid cell and validate the inputs
 *
 * @param {object} param0 props required for TextEditor
 * @param {object} param0.row selected row
 * @param {object} param0.column selected column
 * @param {Function} param0.onRowChange to capture the updated values
 * @param {Function} param0.onClose to close
 * @param {Function} updateCall to open the modal
 * @param {boolean} validate used to indicate the validation
 * @returns  {React.ReactElement} TextEditor component
 */
const TextEditor = ({ row, column, onRowChange, onClose }, updateCall, validate) => {
  const classes = useStyles();
  /**
   * @function handleChange to validate the input values in datagrid cell
   * @param {object} e target object
   * @returns {null | string}  error message if the input value doesn't match the condition
   */
  const handleChange = (e) => {
    if (e.target.baseURI.includes("ratingpg") || e.target.baseURI.includes("carrierrating")) {
      const val = Number(e.target.value);
      if (val > 0 && val < 6) {
        return onRowChange({ ...row, [column.key]: e.target.value });
      }
      return updateCall({ title: "Please provide a value between 1-5.", showButtons: false, closeText: "OK" });
    }
    if (
      e.target.baseURI.includes("new-fc-preference") ||
      (e.target.baseURI.includes("manualallocation") && validate) ||
      (e.target.baseURI.includes("allocationlogic") && validate)
    ) {
      const val = Number(e.target.value);
      if (val > 0 && val < 101) {
        return onRowChange({ ...row, [column.key]: e.target.value });
      }
      return updateCall({ title: "Please provide a value between 1 & 100.", showButtons: false, closeText: "OK" });
    }
    if (e.target.baseURI.includes("fccapacity") && validate) {
      const val = Number(e.target.value);
      if (val > 0) {
        return onRowChange({ ...row, [column.key]: e.target.value });
      }
      return updateCall({ title: "Please provide a numeric value above 0.", showButtons: false, closeText: "OK" });
    }
    return onRowChange({ ...row, [column.key]: e.target.value });
  };

  return (
    <input
      className={classes.root}
      ref={autoFocusAndSelect}
      value={row[column.key] || ""}
      onChange={(event) => handleChange(event)}
      onBlur={() => onClose(true)}
    />
  );
};

TextEditor.propTypes = {
  row: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  onRowChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TextEditor;
