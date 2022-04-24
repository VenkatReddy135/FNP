import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@material-ui/data-grid";

import cockpitConfig from "../../../config/CockpitConfig";

/**
 * @function gridPropsAreEqual Method invokes DisplayGrid Component renders.
 * @param {object}prevProp previous props value.
 * @param {object}nextProp next props value.
 * @returns {boolean} to render the component or not.
 */
function gridPropsAreEqual(prevProp, nextProp) {
  return (
    JSON.stringify(prevProp.rowData) === JSON.stringify(nextProp.rowData) && prevProp.columnData === nextProp.columnData
  );
}

/**
 * DisplayGrid Component used to display the data in tabular format
 *
 * @param {object} props all the props needed for Export
 * @param {object}props.columnData set column name
 * @param {object}props.rowData get search result
 * @param {Function}props.onRowSelected handle row selection
 * @returns {React.ReactElement} returns a Export component
 */
const DisplayGrid = ({ rowData, columnData, onRowSelected }) => {
  return (
    <>
      <DataGrid
        state={{
          keyboard: {
            cell: null,
            columnHeader: null,
            isMultipleKeyPressed: false,
          },
        }}
        rows={rowData}
        columns={columnData}
        pageSize={cockpitConfig.pageSize}
        onRowSelected={onRowSelected}
        hideFooterSelectedRowCount
        autoHeight
      />
    </>
  );
};

DisplayGrid.propTypes = {
  columnData: PropTypes.arrayOf(PropTypes.object),
  rowData: PropTypes.arrayOf(PropTypes.object),
  onRowSelected: PropTypes.func,
};

DisplayGrid.defaultProps = {
  rowData: [{}],
  columnData: [{}],
  onRowSelected: () => {},
};

export default React.memo(DisplayGrid, gridPropsAreEqual);
