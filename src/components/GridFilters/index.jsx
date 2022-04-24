/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { SearchInput, Filter, useListContext } from "react-admin";
import SearchIcon from "@material-ui/icons/Search";
import { InputAdornment, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { handleInvalidCharsInNumberInput } from "../../utils/validationFunction";

/**
 * makeStyles hook of material-ui to apply style for Grid Filters component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  search: {
    width: "700px",
    "& .MuiInputBase-input": {
      padding: "6px 6px 7px",
    },
    zIndex: 2,
  },
  smallSearch: {
    width: "388px",
    padding: "6px 6px 7px",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
});

/**
 * Component for Grid Filters contains all the filters that are needed to be displayed in simple grid
 *
 * @param {*} props all the props needed for Grid filters component
 * @returns {React.ReactElement} returns a React component for Grid Filters for Simple Grid
 */
const GridFilters = (props) => {
  const {
    searchLabel,
    filterValues,
    isSearchEnabled,
    clearSearchFilter,
    resetClearSearchFilter,
    searchinputtype,
    getFilterVal,
    isSmallerSearch,
    filterGridItems,
    refineSearch,
  } = props;
  const classes = useStyles();
  const { setFilters } = useListContext();

  if (clearSearchFilter) {
    setFilters({ ...filterValues, q: "" });
    resetClearSearchFilter();
  }

  const { q } = filterValues;
  useEffect(() => {
    getFilterVal(q);
  }, [q]);

  return (
    <div className={classes.wrapper}>
      <Grid container alignItems="flex-end">
        <Grid item>
          <Grid container direction="column">
            {refineSearch && <Grid item>{refineSearch}</Grid>}
            <Grid item>
              <Filter>
                <SearchInput
                  resettable
                  helperText={false}
                  autoComplete="off"
                  focused={false}
                  source="q"
                  alwaysOn={isSearchEnabled}
                  placeholder={searchLabel}
                  variant="standard"
                  className={isSmallerSearch ? classes.smallSearch : classes.search}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <SearchIcon fontSize="small" color="disabled" mr={2} disabled />
                      </InputAdornment>
                    ),
                  }}
                  type={searchinputtype}
                  onKeyDown={searchinputtype === "number" ? handleInvalidCharsInNumberInput : null}
                />
              </Filter>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>{isSearchEnabled && filterGridItems.map((comp) => comp)}</Grid>
      </Grid>
    </div>
  );
};

GridFilters.propTypes = {
  searchLabel: PropTypes.string.isRequired,
  filterValues: PropTypes.objectOf(PropTypes.any),
  getFilterVal: PropTypes.func,
  isSearchEnabled: PropTypes.bool.isRequired,
  clearSearchFilter: PropTypes.bool,
  resetClearSearchFilter: PropTypes.func,
  searchinputtype: PropTypes.string,
  isSmallerSearch: PropTypes.bool,
  filterGridItems: PropTypes.arrayOf(PropTypes.any),
  refineSearch: PropTypes.element,
};
GridFilters.defaultProps = {
  filterValues: {},
  getFilterVal: () => {},
  clearSearchFilter: false,
  resetClearSearchFilter: () => {},
  searchinputtype: "text",
  isSmallerSearch: false,
  filterGridItems: [],
  refineSearch: null,
};
export default GridFilters;
