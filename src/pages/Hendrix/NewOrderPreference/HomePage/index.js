/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback } from "react";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import NewOrderPrefLayout from "./NewOrderPrefLayout";
import { useGeoGroups, useDeliveryMode, useProductGroup, useCountryList, useVendorList } from "../../hooks";
import { getNewRows } from "../../common";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/new-vendor-allocation-preferences`;
/**
 * Component for New Order Preference contains a Datagrid with configurations
 *
 * @returns {React.ReactElement} returns a New Order Preference List component
 */
const NewOrderPreference = () => {
  const history = useHistory();
  const { search } = useLocation();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  let selectedData = "";
  if (search) {
    const query = new URLSearchParams(search);
    const paramData = (query.get("home") || "").split("|");
    selectedData = paramData ? JSON.parse(paramData) : "";
  }
  const translate = useTranslate();
  const geography = useCountryList();
  const [geoGroup, fetchGeoGroup] = useGeoGroups();
  const [deliveryModes, fetchDeliveryMode] = useDeliveryMode();
  const [vendorIDs, fetchVendorList] = useVendorList();
  const [apiData, setApiData] = useState([]);
  const [rowsVal, setRowsVal] = useState([]);
  const [pgNames, setPgNames] = useState([]);
  const [fcId, setFcId] = useState("");
  const [selectedInput, setSelectedInput] = useState({
    deliveryMode: "",
    geoId: "",
    geoGroupId: "",
    fcId: "",
    fromDate: "",
    thruDate: "",
    vendorType: "FC", // static for dropdown api call
  });
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [columns, setcolumns] = useState([]);
  // dropDowns
  const productGroups = useProductGroup("");
  const pgNameCode = useProductGroup(""); // useState({});
  // to store updated rows
  const updatedRows = React.useRef({ rows: [] });
  // dropdown array
  const dropDownListArray = [
    {
      id: 0,
      key: translate(`key_geoId`),
      placeholder: translate(`geography_dropdown_placeholder`),
      type: "Dropdown",
      Dataset: geography,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoId : "",
    },
    {
      id: 1,
      key: translate(`key_geoGroupId`),
      placeholder: translate(`geoGroup_placeholder`),
      type: "Dropdown",
      Dataset: geoGroup,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoGroupId : "",
    },
    {
      id: 2,
      key: translate("key_deliveryMode"),
      placeholder: translate("delivery_mode"),
      type: "Dropdown",
      Dataset: deliveryModes,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.deliveryMode : "",
    },
    {
      id: 3,
      key: translate("key_fcId"),
      placeholder: translate("fc"),
      type: "Dropdown",
      Dataset: vendorIDs,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.fcId : "",
    },
  ];
  useEffect(() => {
    if (selectedInput.geoId) {
      fetchGeoGroup(selectedInput.geoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInput.geoId]);
  useEffect(() => {
    if (selectedInput.vendorType) {
      fetchDeliveryMode(selectedInput.vendorType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInput.vendorType]);
  useEffect(() => {
    if (selectedInput.geoId && selectedInput.geoGroupId && selectedInput.vendorType && selectedInput.deliveryMode) {
      fetchVendorList(selectedInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInput.geoId, selectedInput.geoGroupId, selectedInput.vendorType, selectedInput.deliveryMode]);

  /**
   * @function handleDropdown  to update state value and fetch dropdown data based on selected value
   * @param {string} key property name
   * @param {string} value selected value
   */
  const handleDropdown = useCallback(
    (key, value) => {
      if (key === "geoId") {
        fetchGeoGroup(value);
      } else if (key === "vendorType") {
        fetchDeliveryMode(value);
      }
    },
    [fetchGeoGroup, fetchDeliveryMode],
  );
  /**
   * @function to Capturing the modified rows for making bulk update
   * @param {object} prevRow vendor Id and other values
   */
  const onRowsUpdate = (prevRow) => {
    const { id, geoId, geoGroupId, deliveryMode, vendorId, baseGeoId, configName, fromDate, thruDate } = prevRow;
    const newRow = {
      id,
      geoId,
      geoGroupId,
      deliveryMode,
      vendorId,
      baseGeoId,
      configName,
      fromDate,
      thruDate,
      quotas: productGroups.map((obj) => {
        if (prevRow[obj.id] !== undefined) {
          return { pgId: obj.id, value: prevRow[obj.id] };
        }
        return { pgId: obj.id, value: null };
      }),
    };
    const index = updatedRows.current.rows.findIndex((obj) => obj.id === id);
    if (index > -1) {
      const rowCopy = [...updatedRows.current.rows];
      rowCopy.splice(index, 1);
      updatedRows.current.rows = [...rowCopy, newRow];
    } else updatedRows.current.rows = [...updatedRows.current.rows, newRow];
  };
  // to store pagination details
  const pageData = React.useRef();
  /**
   * To Fetch data based on Payload change
   *
   * @param {string} key key
   * @param {object} obj payload object
   * @returns {object} response object
   */
  const fetchData = async (key, obj = {}) => {
    let payload = {};
    if (key === "defaultSearch") {
      payload = { ...selectedInput };
    } else if (key === "filterSearch") payload = { ...selectedInput, ...searchInput };
    else payload = { ...obj };
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(`${resource}/vendor-allocation-by-date-range`, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };
  /**
   * To data change update row
   *
   * @param {object} resp display popup value
   */
  const updateRowsValue = (resp) => {
    if (resp.status === "success") notify(translate(`map_toast_success`), "info", TIMEOUT);
    else if (resp.data && resp.data.errors && resp.data.errors[0] && resp.data.errors[0].message) {
      notify(translate(resp.data.errors[0].message), "error", TIMEOUT);
    }
    updatedRows.current.rows = [];
  };
  /**
   * To fetch the data based on selected values and populate on grid
   *
   * @returns {*} null
   */
  const onViewClick = async () => {
    if (selectedInput.fromDate && selectedInput.thruDate) {
      updatedRows.current.rows = [];
      const key = "defaultSearch";
      setSearchInput({
        fieldName: "",
        fieldValues: "",
        operator: "",
      });
      try {
        const { data, totalPages, total, currentPage } = await fetchData(key);
        pageData.current = { totalPages, total, currentPage };
        setApiData(data);
        setFcId(selectedInput.fcId);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
    }
    return null;
  };

  /**
   * To perform Menu Operations based on the selected value from grid row popup
   *
   * @param {Array} rowList row values
   * @param {*} key key value
   */
  const callDetails = (rowList, key) => {
    const stateVal = {
      selectedData: rowList,
      pgNames: productGroups,
    };
    if (key === "View") {
      history.push({
        pathname: "/hendrix/new-fc-preference/productdetails/",
        search: `?compact=${JSON.stringify(stateVal)}`,
      });
    } else if (key === "Delete") {
      /**
       *Function to make delete api call and update the grid with new rows
       */
      const onDelete = async () => {
        const response = await dataProvider.delete(`${resource}/id/${rowList.id}`, "");
        if (response.status === "success") {
          const rowCopy = [...rowsVal];
          const newRows = rowCopy.filter((row) => row.id !== rowList.id);
          setRowsVal(newRows);
          notify(translate(`mapCarrier_toast_delete`), "info", TIMEOUT);
        } else if (response.data.errors) {
          notify(translate(response.data.errors[0].message), "error", TIMEOUT);
        }
      };
      if (rowList.id) {
        onDelete();
      }
    }
  };
  /**
   * To construct array of objects using response for datagrid
   *
   * @param {*} rowData row value
   *  @returns {*} returns the row data
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    return rowData
      ?.map((r) => {
        const { quotas, ...res } = r;
        const obj = quotas.reduce((a, c) => {
          return { ...a, ...{ [c.pgId]: c.value } };
        }, {});
        return { ...obj, ...res, quota: quotas };
      })
      .sort((a, b) => {
        return Number(a.vendorId.match(/(\d+)/g)) - Number(b.vendorId.match(/(\d+)/g));
      });
  };

  /**
   * To construct columns dynamically based on response
   *
   * @param {*} resData row value
   * @returns {*} returns the row data
   */
  const columnGenerator = (resData) => {
    const pgColumns = [];
    resData?.forEach((li) => {
      li.quotas.forEach((data) => {
        pgNameCode.forEach((item) => {
          if (item.id === data.pgId && !pgColumns.includes(item)) {
            pgColumns.push(item);
          }
        });
      });
    });
    return pgColumns;
  };
  useEffect(() => {
    setRowsVal(createRows(apiData));
    setPgNames(columnGenerator(apiData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  const actionMasterGridRuleButton = [
    {
      type: "Button",
      label: translate("edit_rule_newFc"),
      icon: <></>,
      variant: "outlined",
      onClick: () => {
        const stateVal = {
          fcId,
          columnsResult: columns,
          fcData: apiData,
          productGroups,
          pgNameCode,
          selectedInput,
          rowsVal,
          pagesData: pageData,
        };
        history.push({
          pathname: "/hendrix/v1/new-fc-preference/add",
          search: `?edit=${JSON.stringify(stateVal)}&update=${true}`,
        });
      },
    },
    {
      type: "Button",
      label: translate("add_new_rule"),
      icon: <></>,
      variant: "outlined",
      onClick: () => {
        const stateVal = {
          fcId,
          columnsResult: columns,
          fcData: apiData,
          productGroups,
          pgNameCode,
          selectedInput,
          rowsVal,
          pagesData: pageData,
        };
        history.push({
          pathname: "/hendrix/v1/new-fc-preference/add",
          search: `?edit=${JSON.stringify(stateVal)}`,
        });
      },
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

  /**
   * @function to fetch the filtered data based on the selected fieldValues
   * @returns {*} null/Error
   */
  const searchCall = async () => {
    updatedRows.current.rows = [];
    const payload = {
      ...searchInput,
    };
    try {
      const { data } = await fetchData("filterSearch", payload);
      if (data.length === 0) {
        setRowsVal([]);
      }
      setRowsVal(() => [...createRows(data)]);
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
  };
  useEffect(() => {
    if (selectedData) {
      const { inputVal } = selectedData;
      /**
       *Function to handle Home Page redirect and update the state values
       */
      const onRedirect = async () => {
        setSelectedInput((prev) => {
          return { ...prev, ...inputVal };
        });
        setFcId(inputVal.fcId);
        const payload = { ...inputVal };
        const resp = await fetchData("redirect", payload);
        setApiData(resp.data);
      };
      onRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @function to fetch new rows on scrolling down the grid
   * @returns {null} null/Error
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, selectedInput, fetchData, createRows, setRowsVal, "loadMore");
  };
  const gridTitle = apiData.length > 0 && fcId ? fcId : translate("neworder_title");
  return (
    <>
      <NewOrderPrefLayout
        setcolumns={setcolumns}
        rowValues={rowsVal}
        pageData={pageData}
        pgNames={pgNames}
        createRows={createRows}
        updatedRows={updatedRows}
        setRowsVal={setRowsVal}
        actionSearchButton={actionMasterGridSearchButton}
        actionMasterGridRuleButton={actionMasterGridRuleButton}
        gridTitle={gridTitle}
        updatedRowDetails={onRowsUpdate}
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
        dropDownListArray={dropDownListArray}
        onViewClick={onViewClick}
        loadMoreRows={loadMoreRows}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        selectedData={selectedData}
        handleDropdown={handleDropdown}
        callDetails={callDetails}
        updateRowsValue={updateRowsValue}
      />
    </>
  );
};

export default NewOrderPreference;
