import React from "react";
import { Delete } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { SelectColumn } from "react-data-grid";
import TableGrid from "../../../components/TableGrid";
import PopupView from "../../../components/DataGridtable/PopupView";
import { menuOptions } from "../common";

/**
 * Component for Showing Datagrid based on values
 *
 * @param {object} props props for addList table component
 * @param {Array} props.rows  table rows
 * @param {Function} props.setRows  function to update rows state value
 * @param {Function} props.setFilteredVendors function to filter the vendors on delete
 * @param {Function} props.setDeleteAll to delete all the rows from state
 * @param {Function} props.setShowUpdateButton to show the Update button
 * @returns {React.ReactElement} returns datagrid
 */
const AllocationTable = ({ rows, setRows, setFilteredVendors, setDeleteAll, setShowUpdateButton }) => {
  const translate = useTranslate();
  const [checkedRows, setCheckedRows] = React.useState("");

  /**
   * @function onDeleteCall to implement the delete functionality
   * @param {Array} row rows list
   *
   */
  const onDeleteCall = (row) => {
    if (checkedRows && [...checkedRows].includes(row.id)) {
      const newRow = rows.filter((oldRow) => oldRow.id !== row.id);
      setRows(() => newRow);
      const vendors = newRow.map((item) => item.id);
      setFilteredVendors(vendors);
      setShowUpdateButton(true);
    }
  };
  /**
   * @function onAllDeleteCall to delete all the rows
   * @param {object} e event object
   *
   */
  const onAllDeleteCall = (e) => {
    if (e.allRowsSelected) {
      setRows([]);
      setDeleteAll(true);
    }
  };
  /**
   * @function onAllDeleteCall popup icon to delete all the rows
   * @param {object} e event object
   * @returns {object | null} popup object/null
   */
  const VerticalHeader = (e) => {
    return e.allRowsSelected
      ? PopupView({ row: { id: "deleteAll" } }, [{ key: "am_delete_all", Icon: <Delete /> }], () => onAllDeleteCall(e))
      : null;
  };
  /**
   * @function Verticalrows popup icon to delete single row
   * @param {object} e event object
   * @returns {object | null} popup object/null
   */
  const Verticalrows = (e) => {
    return e.row.CHECKED === "Y" && checkedRows && [...checkedRows].includes(e.row.id)
      ? PopupView(
          e,
          menuOptions.filter((item) => translate(item.key) === "Delete"),
          onDeleteCall,
        )
      : null;
  };
  const columns = [
    SelectColumn,
    {
      key: "icon",
      name: "",
      width: 50,
      headerRenderer: VerticalHeader,
      formatter: Verticalrows,
    },

    {
      key: "FC Name",
      name: translate(`am_fc_name`),
      width: 400,
      resizable: true,
    },
    {
      key: "FC ID",
      name: translate(`am_fc_id`),
      width: 400,
      resizable: true,
      sortable: true,
      sortDescendingFirst: true,
    },
  ];

  return (
    <>
      <TableGrid
        columns={columns}
        rowValues={rows}
        rowKeyGetter={(row) => row.id}
        updatedRowDetails={() => null}
        setCheckedRows={setCheckedRows}
      />
    </>
  );
};

AllocationTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  setRows: PropTypes.func.isRequired,
  setFilteredVendors: PropTypes.func.isRequired,
  setDeleteAll: PropTypes.func.isRequired,
  setShowUpdateButton: PropTypes.func.isRequired,
};

export default AllocationTable;
