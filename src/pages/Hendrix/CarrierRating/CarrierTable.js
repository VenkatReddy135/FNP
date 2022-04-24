import React, { useState } from "react";
import { useTranslate } from "react-admin";
import PropTypes from "prop-types";
import TableGrid from "../../../components/TableGrid";
import TextEditor from "../../../components/DataGridtable/TextEditor";
import FormatterView from "../../../components/DataGridtable/FormatterView";
import { getNewRows } from "../common";
/**
 * Component for Carrier Rating
 *
 * @param {object} props all the props{apiData, updatedRows, selectedInput, fetchData, pageData, onUpdateCall, searchInput, setShowUpdateButton} needed for component
 * @returns {React.ReactElement} returns a Carrier Rating component with datagrid
 */
const CarrierTable = (props) => {
  const {
    apiData,
    updatedRows,
    selectedInput,
    fetchData,
    pageData,
    onUpdateCall,
    searchInput,
    setShowUpdateButton,
  } = props;
  const translate = useTranslate();
  const [rows, setRows] = useState([]);

  /**
   * @function createRows To construct array of objects (& sorting in ASC) using response for datagrid
   * @param {Array} rowData Array of objects
   * @returns {Array} rows Array of objects
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    const tableRows = rowData
      ?.map((item, key) => {
        return {
          id: key,
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          deliveryMode: item.deliveryMode,
          rating: item.rating,
        };
      })
      .sort((a, b) => {
        return Number(a.vendorId.match(/(\d+)/g)) - Number(b.vendorId.match(/(\d+)/g));
      });
    return tableRows;
  };

  React.useEffect(() => {
    setRows(createRows(apiData));
  }, [apiData]);

  const columns = [
    {
      key: "vendorName",
      name: translate(`carrier_name`),
      width: 140,
      formatter: (p) => FormatterView(p),
    },
    {
      key: "vendorId",
      name: translate(`carrier_id`),
      width: 200,
      resizable: true,
      formatter: (p) => FormatterView(p),
    },
    {
      key: "rating",
      name: translate(`global_rating`),
      width: 200,
      resizable: true,
      editor: (e) => TextEditor(e, onUpdateCall),
      formatter: (p) => FormatterView(p),
      editable: true,
    },
  ];

  /**
   * @function to fetch new rows on scrolling down the grid
   * @returns {object} added new data
   *
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, selectedInput, fetchData, createRows, setRows);
  };

  /**
   * @function to Capturing the modified rows for making bulk update
   * @param {object} modifiedRow modified row
   *
   */
  const onRowsUpdate = (modifiedRow) => {
    const { vendorId, rating, deliveryMode } = modifiedRow;
    const newRow = {
      deliveryMode,
      vendorId,
      rating,
    };
    const index = updatedRows.current.updatedRows.findIndex((obj) => obj.vendorId === vendorId);
    if (index > -1) {
      const rowCopy = [...updatedRows.current.updatedRows];
      rowCopy.splice(index, 1);
      updatedRows.current.updatedRows = [...rowCopy, newRow]; // eslint-disable-line no-param-reassign
    } else updatedRows.current.updatedRows = [...updatedRows.current.updatedRows, newRow]; // eslint-disable-line no-param-reassign
    setShowUpdateButton(true);
  };
  return (
    <>
      <TableGrid
        /* eslint-disable react/jsx-props-no-spreading */
        {...props}
        columns={columns}
        updatedRowDetails={onRowsUpdate}
        rowValues={rows || []}
        loadMoreRows={loadMoreRows}
      />
    </>
  );
};

CarrierTable.propTypes = {
  apiData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchData: PropTypes.func.isRequired,
  pageData: PropTypes.objectOf(PropTypes.any).isRequired,
  updatedRows: PropTypes.objectOf(PropTypes.any).isRequired,
  onUpdateCall: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setShowUpdateButton: PropTypes.func.isRequired,
};

export default CarrierTable;
