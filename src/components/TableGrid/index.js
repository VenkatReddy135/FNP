import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";

/**
 * Component to render Datagrid
 *
 * @param {object} props params required for grid
 * @returns {React.ReactElement} Datagrid.
 */
const TableGrid = (props) => {
  const { columns, currentRow, rowValues, updatedRowDetails, loadMoreRows, setCheckedRows } = props;
  const [rows, setRows] = useState(rowValues);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [getargs, setargs] = useState();
  const [UpdatedRow, setUpdatedRow] = useState();
  const rowRef = React.useRef([]);

  useEffect(() => {
    setRows(rowValues);
  }, [rowValues]);

  // to capture the specific row values which we choose for modifying(manual allocation)
  useEffect(() => {
    if (typeof currentRow === "function") {
      currentRow(rows);
    }
  }, [currentRow, rows]);

  // to capture the selected rows (Allocation manager)
  useEffect(() => {
    setCheckedRows(selectedRows);
  }, [setCheckedRows, selectedRows]);

  /**
   * @function to handle the changes made on row values
   * @param {object} row row value
   *
   */
  const onCellUpdate = (row) => {
    if (rowRef.current?.length > 0) {
      rowRef.current.map((newRow) => updatedRowDetails(newRow));
      rowRef.current = [];
    } else {
      updatedRowDetails(row);
    }
  };

  /**
   * @function to indicate the scrollbar position
   * @param {*} event event
   * @returns {boolean} true/false
   */
  const isAtBottom = (event) => {
    const { target } = event;
    return target.clientHeight + target.scrollTop === target.scrollHeight;
  };

  /**
   * @function to handle the scroll event
   * @param {*} event event
   *
   */
  const handleScroll = async (event) => {
    if (!isAtBottom(event)) return;
    await loadMoreRows();
  };

  /**
   * @function to copy the cell value to following cells vertically on dragging
   * @param {*} all props required
   * @returns {Array} newRows
   */
  const handleFill = ({ columnKey, sourceRow, targetRows }) => {
    const newRows = targetRows.map((row) => ({ ...row, [columnKey]: sourceRow[columnKey] }));
    rowRef.current = newRows;
    return newRows;
  };

  /**
   * @function to copy the cell value to other cells individually
   * @param {*} all props required
   * @returns {object} target row
   */
  const handlePaste = ({ sourceColumnKey, sourceRow, targetColumnKey, targetRow }) => {
    return { ...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey] };
  };

  /**
   * @function to add the selection of cells
   * @returns {object} selected object
   */
  const setSelection = () => {
    return {
      topLeft: { idx: 0, rowIdx: 0 },
      bottomRight: { idx: 1, rowIdx: 2 },
      startCell: { idx: 0, rowIdx: 0 },
      cursorCell: { idx: 1, rowIdx: 2 },
      isDragging: true,
    };
  };

  /**
   * @function to set the property value when the cell is checked
   * @param {object} args args
   */
  const onselectedcellchange = (args) => {
    if (getargs === undefined) {
      rows[0].CHECKED = "";
    } else if (rows[getargs]) {
      rows[getargs].CHECKED = "";
    }
    rows[args.rowIdx].CHECKED = "Y";
    rows[args.rowIdx].columnname = columns[args.idx].key;
    setargs(args.rowIdx);
    setUpdatedRow(args.rowIdx);
  };

  return (
    <div style={{ width: "100%" }}>
      <DndProvider backend={HTML5Backend}>
        <ReactDataGrid
          /* eslint-disable react/jsx-props-no-spreading */
          {...props}
          style={{ height: "500px", textAlign: "center" }}
          columns={columns}
          rows={rows}
          onFill={handleFill}
          onPaste={handlePaste}
          onRowsChange={(div) => {
            setRows(div);
            onCellUpdate(div[UpdatedRow]);
          }}
          rowHeight={60}
          minHeight={500}
          enableCellSelect
          enableCellDragAndDrop
          onSelectedCellChange={onselectedcellchange}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          cellRangeSelection={{
            onStart: setSelection,
          }}
          onScroll={handleScroll}
          className="fill-grid"
        />
      </DndProvider>
    </div>
  );
};

TableGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  props: PropTypes.objectOf(PropTypes.any).isRequired,
  currentRow: PropTypes.func.isRequired,
  updatedRowDetails: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func,
  setCheckedRows: PropTypes.func,
};

TableGrid.defaultProps = {
  loadMoreRows: () => null,
  setCheckedRows: () => null,
};

export default TableGrid;
