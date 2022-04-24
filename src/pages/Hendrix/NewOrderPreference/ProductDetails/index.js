/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { useTranslate, useDataProvider } from "react-admin";
import { useLocation } from "react-router-dom";
import ProductDetailLayout from "./ProductDetailLayout";
import CustomPopup from "../CustomPopup";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/new-vendor-allocation-preferences`;

/**
 * Component for rendering all FCs for selected FC Id & Product-group
 *
 * @param {*} props all the props needed
 * @returns {React.ReactElement} returns a component
 */
const ProductDetails = (props) => {
  const { search } = useLocation();
  const dataProvider = useDataProvider();
  const query = React.useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);
  const paramData = (query.get("compact") || "").split("|");
  const { selectedData, pgNames } = paramData ? JSON.parse(paramData) : "";
  const { geoGroupId, deliveryMode, geoId, baseGeoId, columnname } = selectedData;
  const translate = useTranslate();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [dateRanges, setDateRanges] = useState({
    fromDate: "",
    thruDate: "",
  });
  const [vendorData, setVendorData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [payLoad, setPayload] = useState({
    payloadObject: {},
    pathVal: "",
  });
  const [compactView, setCompactView] = useState(false);
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const pgName = pgNames.filter((item) => item.id === columnname);
  // to store pagination details
  const pageData = React.useRef();
  /**
   * To Fetch data based on Payload change
   *
   * @param {string} key & obj
   * @param {object} initialParam event object
   * @param {string} path path name
   * @param {object} params event object
   *  @returns {*} returns the validation result and displays error message
   */
  const fetchData = async (key, initialParam = {}, path = "vendor-allocation-by-pg", params) => {
    let payload = {};
    if (key === "first") {
      payload = initialParam;
    } else if (key === "filter") payload = { ...payLoad.payloadObject, ...searchInput };
    else payload = { ...payLoad.payloadObject, ...params };
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(`${resource}/${path}`, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };

  useEffect(() => {
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    /**
     * @function to fetch data from  vendor-allocation-by-pg api and show grid with compact view
     * @returns {*} rows for the compact view grid
     */
    const fetchVendorData = async () => {
      const vendorParam = {
        deliveryMode,
        geoId,
        geoGroupId,
        pgId: columnname,
        baseGeoId,
        size: 100,
      };
      const key = "first";
      const path = "vendor-allocation-by-pg";
      try {
        const { data, totalPages, total, currentPage } = await fetchData(key, vendorParam, path);
        pageData.current = { totalPages, total, currentPage };
        setVendorData(data);
        setPayload({
          payloadObject: vendorParam,
          pathVal: path,
        });
      } catch (err) {
        return err.response ? err.response.data : null;
      }
      return null;
    };
    fetchVendorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactView]);

  /**
   * To construct array of objects using response for datagrid
   *
   * @param {Array} rowData response data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (rowData.length === undefined) return [];
    return rowData.map((row) => {
      const { quotas, ...res } = row;
      const quotaObj = quotas[0];
      const existingDateRange = `${res.fromDate} to ${res.thruDate}`;
      const obj = {
        [existingDateRange]: quotaObj.value || quotaObj.value === 0 ? `${quotaObj.value}%` : "",
        pg: columnname,
      };
      return { ...obj, ...res };
    });
  };

  /**
   * To construct column headers based on response for compact view
   *
   * @param {*} res  column headers
   * @returns {Array} columns
   */
  const dateRangeColumns = (res) => {
    const rangeColumns = [];
    res.forEach((data) => {
      if (data.fromDate && data.thruDate) {
        const ranges = `${data.fromDate} to ${data.thruDate}`;
        if (!rangeColumns.includes(ranges)) rangeColumns.push(ranges);
      }
    });
    return rangeColumns;
  };

  /**
   * To construct column based on date-range response for compact view
   *
   * @param {*} s date-range respons
   * @returns {Array} columns
   */
  const columnGenerator = (s) => {
    const defaultColumns = [
      {
        key: "vendorName",
        name: "Fulfilment Center Name",
        width: 200,
        resizable: true,
        frozen: true,
      },
      {
        key: "vendorId",
        name: "Fulfilment Center ID",
        width: 200,
        resizable: true,
        frozen: true,
      },
    ];
    const productColumns =
      s &&
      s.map((col) => {
        return {
          key: col,
          name: col,
          width: 200,
          resizable: true,
          formatter: (p) => CustomPopup(p),
        };
      });
    const newColumn = productColumns ? [...defaultColumns, ...productColumns] : [];
    return newColumn;
  };

  useEffect(() => {
    if (selectedData) {
      setRows(createRows(vendorData));
      setColumns(columnGenerator(dateRangeColumns(vendorData)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorData]);
  /**
   * @function to fetch data for calendar view
   * @returns {*} null/Error
   */
  const fetchCalendarData = async () => {
    const { fromDate, thruDate } = dateRanges;
    if (fromDate && thruDate) {
      setSearchInput({
        fieldName: "",
        fieldValues: "",
        operator: "",
      });
      const payloadObj = {
        baseGeoId,
        pgId: columnname,
        deliveryMode,
        geoId,
        geoGroupId,
        ...dateRanges,
      };
      const path = "calendar-view";
      const key = "first";
      try {
        const { data, totalPages, total, currentPage } = await fetchData(key, payloadObj, path);
        pageData.current = { totalPages, total, currentPage };
        setCalendarData(data);
        setPayload({
          payloadObject: payloadObj,
          pathVal: path,
        });
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    }
    return null;
  };

  /**
   * To construct rows with response data for calendar view datagrid
   *
   * @param {Array} rowData response data
   * @returns {Array} rows
   */
  const calendarRows = (rowData) => {
    if (rowData === undefined) return [];
    return rowData?.map((r) => {
      const { quota, ...res } = r;
      const obj = quota.reduce((a, c) => {
        return { ...a, ...{ [c.date]: c.value && `${c.value}%` } };
      }, {});
      return { ...obj, ...res };
    });
  };
  useEffect(() => {
    setRows(calendarRows(calendarData));
    const selectedMonth = [];
    calendarData.forEach((calData) => {
      calData.quota.forEach((dateVal) => {
        if (!selectedMonth.includes(dateVal.date)) {
          selectedMonth.push(dateVal.date);
        }
      });
    });
    // default columns for calendar view
    const defaultDateColumns = [
      {
        key: "vendorName",
        name: "Fulfilment Center Name",
        width: 200,
        resizable: true,
        frozen: true,
      },
      {
        key: "vendorId",
        name: "Fulfilment Center ID",
        width: 200,
        resizable: true,
        frozen: true,
      },
    ];
    // columns generated dynamically based on response for calendar view datagrid
    const dateColumns =
      selectedMonth &&
      selectedMonth.map((col) => {
        return {
          key: col,
          name: col,
          width: 180,
          resizable: true,
          formatter: (p) => CustomPopup(p),
        };
      });
    const newCol = dateColumns ? [...defaultDateColumns, ...dateColumns] : [];
    setColumns(newCol);
    setShowTable(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  const actionMasterGridViewButton = [
    {
      type: "Button",
      label: translate("view"),
      icon: <></>,
      variant: "outlined",
      onClick: fetchCalendarData,
    },
  ];
  const actionMasterGridSearchButton = [
    {
      type: "Button",
      label: translate("search"),
      icon: <></>,
      variant: "outlined",
    },
  ];
  const GridTitle = `${pgName[0].name} at ${baseGeoId}`;
  /**
   * @function to fetch the filtered data based on the selected fieldValues
   * @returns {Array} Filtered rows for grid
   */
  const searchCall = async () => {
    try {
      const { data } = await fetchData("filter", {}, payLoad.pathVal);
      if (data && data.length === 0) setRows([]);
      if (payLoad.pathVal.includes("calendar")) setRows(calendarRows(data));
      else {
        setRows(() => [...createRows(data)]);
      }
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };
  /**
   * @function to fetch new rows on scrolling down the grid
   * @returns {*} null/Error
   */
  const loadMoreRows = async () => {
    const { totalPages, currentPage } = pageData.current;
    if (currentPage + 1 < totalPages) {
      const key = "loadMore";
      let payload = {};
      const { fieldName, fieldValues, operator } = searchInput;
      if (fieldName && fieldValues && operator) payload = { ...searchInput, page: pageData.current.currentPage + 1 };
      else payload = { page: pageData.current.currentPage + 1 };
      try {
        const { data } = await fetchData(key, {}, payLoad.pathVal, payload);
        let nextRows;
        if (payLoad.pathVal.includes("calendar")) {
          nextRows = calendarRows(data);
        } else {
          nextRows = createRows(data);
        }
        if (nextRows.length > 0) setRows((prev) => [...prev, ...nextRows]);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    }
    return null;
  };
  return (
    <>
      <ProductDetailLayout
        {...props}
        ColumnResult={columns}
        RowResult={rows}
        actionViewButton={actionMasterGridViewButton}
        actionSearchButton={actionMasterGridSearchButton}
        gridTitle={GridTitle}
        showTable={showTable}
        setShowTable={setShowTable}
        updatedRowDetails={() => ""}
        loadMoreRows={loadMoreRows}
        fetchData={fetchData}
        fetchCalendarData={fetchCalendarData}
        payLoad={payLoad}
        setCalendarData={setCalendarData}
        setVendorData={setVendorData}
        setCompactView={setCompactView}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        setDateRanges={setDateRanges}
      />
    </>
  );
};

export default ProductDetails;
