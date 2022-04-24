import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../styles";

/**
 * To update dialogContent values based on change
 *
 * @param {*} param0 props of the TemplateComponent
 * @returns {React.Component} return component
 */
const TemplateComponent = ({ setDates, templateDropdownValues }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <>
      <FormControl className={classes.templateDropdown}>
        <InputLabel>Template</InputLabel>
        <Select
          value={selectedDate}
          onChange={({ target: { value } }) => {
            setSelectedDate(value);
            setDates(value);
          }}
          MenuProps={{ classes: { paper: classes.select } }}
        >
          {templateDropdownValues?.map(({ dateValue }) => {
            return <MenuItem value={dateValue}>{dateValue}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </>
  );
};

TemplateComponent.propTypes = {
  templateDropdownValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  setDates: PropTypes.func.isRequired,
};

export default TemplateComponent;
