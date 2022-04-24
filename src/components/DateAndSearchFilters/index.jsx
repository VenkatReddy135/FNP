import PropTypes from "prop-types";
import React, { useState } from "react";
import { SearchInput, Filter, useTranslate, useListContext, Button } from "react-admin";
import SearchIcon from "@material-ui/icons/Search";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateTimeInput from "../CustomDateTimeV2";
import { getFormattedTimeValue, getFormattedDate } from "../../utils/formatDateTime";
import { validateToDateField } from "../../utils/validationFunction";
/**
 * makeStyles hook of material-ui to apply style for Date and Search Filters component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  search: {
    width: "400px",
    "& .MuiInputBase-input": {
      padding: "6px 6px 7px",
    },
  },
  clear: {
    paddingTop: "50px",
    textTransform: "capitalize",
    marginRight: "auto",
    color: "#000000",
    "&:hover": {
      backgroundColor: "#fafafa",
    },
  },
  filterStyle: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  fieldSize: {
    maxWidth: "250px",
  },
});

/**
 * Component for Date and Search Filters contains all the filters that are needed to be displayed in simple grid
 *
 * @param {object} props all the props needed for Date and Search Filters component
 * @returns {React.ReactElement} returns a React component for Date and Search Filters for Simple Grid
 */
const DateAndSearchFilters = (props) => {
  const { searchLabel } = props;

  const classes = useStyles();
  const translate = useTranslate();
  const { filterValues, setFilters } = useListContext();

  const [state, setState] = useState({
    isReset: false,
    fromDateError: "",
    toDateError: "",
    commonErrorMessage: translate("to_date_validation_message"),
  });
  const { isReset, fromDateError, toDateError, commonErrorMessage } = state;

  /**
   *@function handleFromDateChange function called on change of From date in View History Page
   *@param {object} event event called on change of From date
   */
  const handleFromDateChange = (event) => {
    const dateValue = getFormattedDate(event.target.value);
    const timeValue = getFormattedTimeValue(new Date(event.target.value));
    const tempTime = `${dateValue}T${timeValue}`;
    let error = "";
    if (filterValues?.toDate) {
      error = validateToDateField(tempTime, filterValues?.toDate, commonErrorMessage);
    }
    if (!error) {
      setFilters({ ...filterValues, fromDate: tempTime });
      setState((prevState) => ({ ...prevState, fromDateError: "", toDateError: "" }));
    } else {
      setState((prevState) => ({ ...prevState, fromDateError: commonErrorMessage }));
    }
    setState((prevState) => ({ ...prevState, isReset: false }));
  };

  /**
   *@function handleToDateChange function called on change of To date in View History Page
   *@param {object} event event called on change of From date
   */
  const handleToDateChange = (event) => {
    const dateValue = getFormattedDate(event.target.value);
    const timeValue = getFormattedTimeValue(new Date(event.target.value));
    const tempTime = `${dateValue}T${timeValue}`;
    let error = "";
    if (filterValues?.fromDate) {
      error = validateToDateField(filterValues?.fromDate, tempTime, commonErrorMessage);
    }
    if (!error) {
      setFilters({ ...filterValues, toDate: tempTime });
      setState((prevState) => ({ ...prevState, toDateError: "", fromDateError: "" }));
    } else {
      setState((prevState) => ({ ...prevState, toDateError: commonErrorMessage }));
    }
    setState((prevState) => ({ ...prevState, isReset: false }));
  };

  /**
   *@function isFiltersApplied function called on to check if any stock filter exist
   *@returns {boolean} true/false
   */
  const isFiltersApplied = () => {
    if (filterValues?.fromDate || filterValues?.toDate || filterValues?.q) {
      return true;
    }
    return false;
  };

  /**
   *@function handleClear function called on to delete stock filters
   */
  const handleClear = () => {
    const { fromDate, toDate, q, ...rest } = filterValues;
    setFilters({ ...rest });
    setState((prevState) => ({ ...prevState, isReset: true, fromDateError: "", toDateError: "" }));
  };

  return (
    <>
      <Filter className={classes.filterStyle}>
        <DateTimeInput
          className={classes.fieldSize}
          label={translate("from_date")}
          source="fromDate"
          onChange={handleFromDateChange}
          alwaysOn
          resetSignal={isReset}
          throwError={fromDateError}
        />
        <DateTimeInput
          className={classes.fieldSize}
          label={translate("to_date")}
          source="toDate"
          onChange={handleToDateChange}
          alwaysOn
          resetSignal={isReset}
          throwError={toDateError}
        />
        <SearchInput
          source="q"
          placeholder={searchLabel}
          alwaysOn
          resettable
          helperText={false}
          autoComplete="off"
          focused={false}
          variant="standard"
          className={classes.search}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <SearchIcon fontSize="small" color="disabled" mr={2} disabled />
              </InputAdornment>
            ),
          }}
        />
      </Filter>
      <div className={classes.filterStyle}>
        {isFiltersApplied() && <Button className={classes.clear} onClick={handleClear} label={translate("clear")} />}
      </div>
    </>
  );
};

DateAndSearchFilters.propTypes = {
  searchLabel: PropTypes.string.isRequired,
};

export default DateAndSearchFilters;
