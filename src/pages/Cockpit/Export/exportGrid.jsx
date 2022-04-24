import React from "react";
import { Typography, Grid, Button, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import useStyles from "../../../assets/theme/common";
import DisplayGrid from "./DisplayGrid";
/**
 * Export Grid Component used to perform export functionality based on the filter in datagrid Data
 *
 * @param {object} props all the props needed for Export
 * @param {object}props.columnData set column name
 * @param {object}props.rowData get search result
 * @param {string}props.searchInput to search the elements in Grid.
 * @param {Function}props.onRowSelected handle row selection
 * @param {Function}props.handleExport Trigger when Export button is clicked
 * @param {Function}props.setSearchInput set search input
 * @param {Function}props.handleSearch Method used to search for attribute code in the data grid.
 * @returns {React.ReactElement} returns a Export component
 */
const ExportGrid = (props) => {
  const { columnData, rowData, onRowSelected, handleExport, setSearchInput, handleSearch, searchInput } = props;

  const translate = useTranslate();
  const exportTitle = translate("export");
  const search = translate("search");
  const exportDataGridDescription = translate("exportDataGridDescription");

  const classes = useStyles();

  return (
    <Grid item md={12}>
      <Typography>{exportDataGridDescription}</Typography>
      <Grid container justify="space-between" xs={12} alignItems="flex-end" className={classes.headerClass}>
        <Grid container alignItems="flex-end" xs={9} className={classes.textInputWrap}>
          <Grid item xs={6}>
            <TextField
              label={search}
              type="search"
              focused={searchInput}
              name="search"
              value={searchInput}
              onChange={setSearchInput}
              className={classes.textInputWrap}
            />
          </Grid>
          <Button onClick={handleSearch} variant="outlined" className={classes.helperTextAlign}>
            {search}
          </Button>
        </Grid>
        <Button onClick={handleExport} variant="contained" size="medium">
          {exportTitle}
        </Button>
      </Grid>
      <DisplayGrid rowData={rowData} columnData={columnData} onRowSelected={onRowSelected} />
    </Grid>
  );
};

ExportGrid.propTypes = {
  columnData: PropTypes.arrayOf(PropTypes.object),
  rowData: PropTypes.arrayOf(PropTypes.object),
  onRowSelected: PropTypes.func,
  handleExport: PropTypes.func,
  setSearchInput: PropTypes.func,
  handleSearch: PropTypes.func,
  searchInput: PropTypes.string,
};

ExportGrid.defaultProps = {
  rowData: [{}],
  columnData: [{}],
  onRowSelected: () => {},
  handleExport: () => {},
  setSearchInput: () => {},
  handleSearch: () => {},
  searchInput: "",
};

export default React.memo(ExportGrid);
