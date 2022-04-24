/* eslint-disable react/jsx-props-no-spreading */
/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useState, useEffect } from "react";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import { stubTrue } from "lodash";
import TextEditor from "../../../../components/DataGridtable/TextEditor";
import RuleLayout from "./RuleLayout";
import FormatterView from "../../../../components/DataGridtable/FormatterView";
import { fetchTemplateValues } from "../../common";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/new-vendor-allocation-preferences`;
const resourceDropdown = "simulator/v1/psa/baseGeoIds-on-fcId";
/**
 * Component for Creating New Rule / updating the rule
 *
 * @returns {React.ReactElement} New Order Preference component
 */
const NewRule = () => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  const isEdit = query.get("update") === "true";
  const paramData = (query.get("edit") || "").split("|");
  const { fcId, fcData, pgNameCode, selectedInput, rowsVal, productGroups, columnsResult, pagesData } = paramData
    ? JSON.parse(paramData)
    : "";
  const { geoId, geoGroupId, deliveryMode } = selectedInput;
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const [pgNames, setPgNames] = useState([]);
  const [selectedFromDate, updateFromDate] = useState([]);
  const [selectedToDate, updateToDate] = useState([]);
  const [templateDropdownValues, setTemplateDropdownValues] = useState([]);
  const [dates, setDates] = useState("");
  const [rows, setRows] = useState(isEdit ? rowsVal : []);
  const [columns, setColumns] = useState([]);
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [loadTemplateData, setLoadTemplateData] = useState(false);
  const [templateDateValues, setTemplateDateValues] = useState();
  const GridTitle = {
    RuleName: fcId,
    RuleLabel: isEdit ? "Edit Rule for" : "Add New Rule for",
    PathEndName: isEdit ? "Edit Rule" : "Add New Rule",
    Rule: isEdit ? "EDIT" : "ADD",
  };
  // to store updated rows
  const updatedRows = React.useRef({ rows: [] });
  /**
   * @function to update state values for popup
   * @param {object} param0 contains destructured values
   * @param {string} param0.title title
   * @param {boolean} param0.showButtons button bool
   * @param {string} param0.closeText closed text
   * @param {string} param0.actionText action text
   */
  const onCellValidate = ({ title = "", showButtons = true, closeText = "No", actionText = "Yes" }) => {
    const message = translate(title);
    const dialogObj = {
      dialogContent: message,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    toggleFlag(true);
  };
  /**
   * @function to Capturing the modified rows for making bulk Post
   * @param {Array} obj rows
   * @returns {Array} remove empty row
   */
  const removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => !obj[k] && obj[k] !== undefined && delete obj[k]);
    return obj;
  };
  /**
   * @function to Capturing the modified rows for making bulk Post
   * @param {Array} prevRow rows
   */
  const onRowsUpdate = (prevRow) => {
    const values = Object.keys(prevRow);
    removeEmpty(prevRow);
    const { baseGeoId } = prevRow;
    const pgArray = [...pgNames].map((item) => item.id);
    const newRow = {
      geoId,
      geoGroupId,
      deliveryMode,
      vendorId: fcId,
      baseGeoId,
      id: prevRow.id,
      quotas: values
        .filter((item) => pgArray.indexOf(item) > -1)
        .map((val) => {
          return {
            pgId: val,
            value: prevRow[val],
          };
        }),
    };
    const index = updatedRows.current.rows.findIndex((obj) => obj.id === prevRow.id);
    if (index > -1) {
      const rowCopy = [...updatedRows.current.rows];
      rowCopy.splice(index, 1);
      updatedRows.current.rows = [...rowCopy, newRow];
    } else updatedRows.current.rows = [...updatedRows.current.rows, newRow];
  };
  // to store pagination details
  const pageData = React.useRef({
    totalPages: "",
    total: "",
    currentPage: "",
    filter: false,
  });
  useEffect(() => {
    updateFromDate(isEdit ? selectedInput.fromDate : "");
    updateToDate(isEdit ? selectedInput.thruDate : "");
    /**
     * To fetch the template dropdown values
     *
     * @returns {*} null/Error
     */
    (async () => {
      const payload = {
        page: 0,
        size: 100,
      };
      try {
        const dateRanges = await fetchTemplateValues(
          payload,
          dataProvider,
          `${resource}/date-ranges/vendor-id/${fcId}`,
        );
        setTemplateDropdownValues(dateRanges);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
      return null;
    })();
    /**
     *  To Fetch data based on change
     *
     * @returns {*} null/Error
     */
    const fetchBaseGeoIds = async () => {
      const payload = {
        deliveryMode: selectedInput.deliveryMode,
        geoId: selectedInput.geoId,
        geoGroupId: selectedInput.geoGroupId,
        fcId,
      };
      try {
        const response = await dataProvider.getData(`${resourceDropdown}`, payload);
        const baseIds = response.data.map((ids) => {
          return { baseGeoId: ids, id: Math.random() * 100000 };
        });
        setRows(baseIds);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
      return null;
    };
    if (isEdit) {
      setRows(rowsVal);
      setColumns(columnsResult);
    } else {
      fetchBaseGeoIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * To Fetch data based on change
   *
   * @param {string} key key
   * @param {object} obj payload object
   * @returns {object} response object
   */
  const fetchData = async (key, obj = {}) => {
    let payload = {};
    if (key === "filterSearch") payload = { ...selectedInput, ...searchInput };
    else payload = { ...obj };
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(`${resource}/vendor-allocation-by-date-range`, payload);
    if (totalPages) pageData.current = { totalPages, total, currentPage, filter: false };
    return { data, totalPages, total, currentPage };
  };
  /**
   * To construct array of objects using response for datagrid
   *
   * @param {Array} rowData response data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (rowData.length === undefined) return [];
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
   * To get the list of PG names based on response
   *
   * @param {*} resData row value
   * @returns {*} returns the row data
   */
  const columnHeaders = (resData) => {
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
    setPgNames(pgColumns);
    return pgColumns;
  };
  /**
   * To generate columns dynamically based on response
   *
   * @param {*} headers columns dynamically
   * @returns {*} returns the row data
   */
  const columnGenerator = (headers) => {
    const defaultColumns = [
      {
        key: "baseGeoId",
        name: "Pincode",
        width: 200,
        resizable: true,
        frozen: true,
      },
    ];
    const productColumns =
      headers &&
      headers.map((col) => {
        return {
          key: col.id,
          name: col.name,
          width: 200,
          resizable: true,
          editor: (e) => TextEditor(e, onCellValidate, stubTrue),
          formatter: (p) => FormatterView(p, "", stubTrue),
          editable: true,
        };
      });
    const newColumn = productColumns ? [...defaultColumns, ...productColumns] : [];
    return newColumn;
  };
  const [mounted, setMounted] = useState(false);
  /**
   * @function to generate columns based on response
   */
  const fetchColumnsData = () => {
    if (!mounted) {
      setMounted(true);
      setColumns(columnGenerator(columnHeaders(fcData)));
      pageData.current = pagesData.current;
    }
  };
  useEffect(() => {
    fetchColumnsData();
  });
  /**
   * To update dialogContent values based on change
   *
   * @returns {*} null/Error
   */
  const onSelectingTemplate = async () => {
    toggleFlag(false);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    pageData.current.filter = false;
    const { dateObject } = templateDropdownValues.find((item) => item.dateValue === dates);
    const payload = {
      deliveryMode,
      geoId,
      geoGroupId,
      fcId,
      fromDate: dateObject.fromDate,
      thruDate: dateObject.thruDate,
    };
    try {
      const { data, totalPages, total, currentPage } = await fetchData("templatesearch", payload);
      pageData.current = { totalPages, total, currentPage };
      setColumns(columnGenerator(columnHeaders(data)));
      setRows(createRows(data));
      updatedRows.current.rows = [];
      setTemplateDateValues(dateObject);
      setLoadTemplateData(true);
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };
  /**
   * @function to fetch the filtered data based on the selected fieldValues
   * @returns {*} Filtered rows for grid
   */
  const searchCall = async () => {
    const payload = {
      ...searchInput,
    };
    updatedRows.current.rows = [];
    try {
      const { data } = await fetchData("filterSearch", payload);
      if (!loadTemplateData) pageData.current = { ...pageData.current, filter: true };
      if (data && data.length === 0) {
        setRows([]);
      }
      setRows(() => createRows(data));
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };
  /**
   * @function to construct the payload & make api call to add the new rule
   * @returns {*} null/Error
   */
  const createRowsForPayload = () => {
    const DatesObj = {
      fromDate: selectedFromDate,
      thruDate: selectedToDate,
    };
    const TemplateRows = rows.map((row) => {
      const Values = Object.keys(row);
      const { baseGeoId, id } = row;
      const pgArray = [...productGroups].map((obj) => {
        return obj.id;
      });
      const newRow = {
        id,
        geoId,
        geoGroupId,
        deliveryMode,
        vendorId: fcId,
        baseGeoId,
        quotas: Values.filter((item) => pgArray.indexOf(item) > -1).map((val) => {
          return {
            pgId: val,
            value: row[val],
          };
        }),
        ...DatesObj,
      };
      return newRow;
    });
    if (updatedRows.current.rows.length > 0) {
      const updatedRowValues = updatedRows.current.rows.map((row) => {
        return {
          ...row,
          ...DatesObj,
          quotas: row.quotas.map((quota) => {
            return {
              ...quota,
            };
          }),
        };
      });
      updatedRowValues.forEach((updatedRow) => {
        const Index = TemplateRows.findIndex((templateRow) => templateRow.id === updatedRow.id);
        if (Index > -1) TemplateRows[Index] = updatedRow;
        else TemplateRows.push(updatedRow);
      });
    }
    return TemplateRows;
  };
  /**
   * @function to validate the fields and make api call for adding new rule
   * @returns {*} null/Error
   */
  const onClickingSaveButton = async () => {
    const payload = createRowsForPayload();
    let res;
    if (payload.length > 0) {
      if (GridTitle.Rule === "ADD") {
        payload.map((val) => delete val.id);
        const removeQuota = payload.map((element) => {
          return { ...element, quotas: element.quotas.filter((subElement) => subElement.value !== null) };
        });
        const removeEmptyQuoas = removeQuota.filter((item) => item.quotas.length > 0);
        const payloadObj = { data: { dataObj: removeEmptyQuoas, params: "" } };
        res = await dataProvider.create(resource, payloadObj);
      } else if (GridTitle.Rule === "EDIT") {
        const newPayload = payload.filter((val) => val.id);
        res = await dataProvider.put(resource, {
          id: "",
          data: newPayload,
        });
      }
      if (res.data && res.status === "success") {
        notify(translate(`toast_add_success`), "info", TIMEOUT);
        setTimeout(() => {
          const stateVal = {
            inputVal: selectedInput,
            productIds: pgNames,
            fcData,
            fcID: fcId,
          };
          history.push({
            pathname: "/hendrix/v1/new-fc-preference",
            search: `?home=${JSON.stringify(stateVal)}`,
          });
        }, 3000);
      } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
        notify(translate(res.data.errors[0].message), "error", TIMEOUT);
      }
      updatedRows.current.updatedRows = [];
    }
    return null;
  };
  /**
   * @function to fetch new rows on scrolling down the grid
   * @returns {*} null/Error
   */
  const loadMoreRows = async () => {
    const { totalPages, currentPage } = pageData.current;
    const key = "loadMore";
    if (currentPage + 1 < totalPages) {
      const { fieldName, fieldValues, operator } = searchInput;
      let payload = {};
      if (loadTemplateData) {
        const datesObj = {
          fromDate: templateDateValues.fromDate,
          thruDate: templateDateValues.thruDate,
        };
        if (fieldName && fieldValues && operator)
          payload = {
            ...selectedInput,
            ...searchInput,
            ...datesObj,
            page: pageData.current.currentPage + 1,
          };
        else
          payload = {
            ...selectedInput,
            ...datesObj,
            page: pageData.current.currentPage + 1,
          };
      } else if (pageData.current && pageData.current.filter) {
        if (fieldName && fieldValues && operator)
          payload = {
            ...selectedInput,
            ...searchInput,
            page: pageData.current.currentPage + 1,
          };
        else payload = { page: pageData.current.currentPage + 1 };
      }
      try {
        const { data } = await fetchData(key, payload);
        const nextRows = createRows(data);
        if (nextRows.length > 0) setRows((prev) => [...prev, ...nextRows]);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    }
    return null;
  };
  return (
    <>
      <RuleLayout
        loadMoreRows={loadMoreRows}
        columns={columns}
        rowValues={rows}
        setRows={setRows}
        updateFromDate={updateFromDate}
        updateToDate={updateToDate}
        gridTitle={GridTitle}
        onRowsUpdate={onRowsUpdate}
        selectedInput={selectedInput}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        onUpdateCall={onClickingSaveButton}
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
        toggleFlag={toggleFlag}
        dialogObject={dialogObject}
        importPopupFlag={importPopupFlag}
        onSelectingTemplate={onSelectingTemplate}
        setDates={setDates}
        templateDropdownValues={templateDropdownValues}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default NewRule;
