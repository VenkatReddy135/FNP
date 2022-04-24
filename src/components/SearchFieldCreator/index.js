/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import { TextField, Grid, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import PropTypes from "prop-types";
import useStyles from "../../assets/theme/common";

/**
 * Advanced search tool
 *
 * @param {object} props component props
 * @returns {React.Component} //return component
 */
const SearchFieldCreator = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const {
    columnList,
    operatorList,
    onSubmit,
    fieldItem,
    selectedColumn,
    selectedOperator,
    searchValue,
    handleChange,
  } = props;

  return (
    <Grid container direction="column" justify="space-between" className={classes.gridStyle}>
      <Grid item onChange={handleChange} onClick={handleChange}>
        <FormControl className={classes.formControl}>
          <InputLabel>{translate("column_name")}</InputLabel>
          <Select name="selectedColumn" value={selectedColumn}>
            {columnList?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>{translate("operator")}</InputLabel>
          <Select name="selectedOperator" value={selectedOperator}>
            {operatorList?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField name="searchValue" label={translate("keyword")} value={searchValue} />
        </FormControl>
        <FormControl className={classes.formControl}>
          {!fieldItem ? (
            <AddBoxIcon
              fontSize="large"
              onClick={onSubmit}
              className={`${classes.categoryMarginTop} ${classes.iconCursorPointer}`}
            />
          ) : (
            <DeleteOutlineIcon
              fontSize="large"
              onClick={onSubmit}
              className={`${classes.categoryMarginTop} ${classes.iconCursorPointer}`}
            />
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

SearchFieldCreator.propTypes = {
  columnList: PropTypes.arrayOf(Object),
  operatorList: PropTypes.arrayOf(Object),
  onSubmit: PropTypes.func,
  fieldItem: PropTypes.bool,
  selectedColumn: PropTypes.string,
  selectedOperator: PropTypes.string,
  searchValue: PropTypes.string,
  handleChange: PropTypes.func,
};
SearchFieldCreator.defaultProps = {
  columnList: [],
  operatorList: [],
  onSubmit: () => {},
  fieldItem: false,
  selectedColumn: "",
  selectedOperator: "",
  searchValue: "",
  handleChange: () => {},
};

export default React.memo(SearchFieldCreator);
