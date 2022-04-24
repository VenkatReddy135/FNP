import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import RatingPgFCLayout from "./RatingPgFcLayout";
import TextEditor from "../../../components/DataGridtable/TextEditor";
import FormatterView from "../../../components/DataGridtable/FormatterView";
import SimpleModel from "../../../components/CreateModal";
import CommonDialogContent from "../../../components/CommonDialogContent";
import { vendorTypes, getNewRows, bulkUpdate } from "../common";
import { useCountryList, useGeoGroups, useDeliveryMode } from "../hooks";
import { TIMEOUT } from "../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/pg-rating-configs`;

/**
 * Component for Rating PG Specific
 *
 * @returns {React.ReactElement} returns a Rating PG Specific component with datagrid
 */
const RatingPg = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const geography = useCountryList();
  const [geoGroup, fetchGeoGroup] = useGeoGroups();
  const [deliveryModes, fetchDeliveryModes] = useDeliveryMode();
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const [selectedInput, setSelectedInput] = useState({
    deliveryMode: "",
    geoId: "",
    geoGroupId: "",
    vendorType: "",
  });
  const [apiData, setApiData] = useState([]);
  const [rows, setRows] = useState([]);
  const [pgNames, setPgNames] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: "", table: false });
  const [vendorDetail, setVendorDetail] = useState({});
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  // dropdown array
  const dropDownListArray = [
    { id: 0, key: "geoId", placeholder: translate("geography"), type: "Dropdown", Dataset: geography },
    { id: 1, key: "vendorType", placeholder: translate("fc_carrier"), type: "Dropdown", Dataset: vendorTypes },
    { id: 2, key: "geoGroupId", placeholder: translate("geo_group"), type: "Dropdown", Dataset: geoGroup },
    { id: 3, key: "deliveryMode", placeholder: translate("delivery_mode"), type: "Dropdown", Dataset: deliveryModes },
  ];

  /**
   * @function callData to fetch the data based on selected dropdown values and populate on grid
   *
   */
  const handleDropdown = useCallback(
    (key, value) => {
      if (key === "geoId") {
        fetchGeoGroup(value);
      } else if (key === "vendorType") {
        fetchDeliveryModes(value);
      }
      return null;
    },
    [fetchGeoGroup, fetchDeliveryModes],
  );

  // to store pagination details
  const pageData = useRef();
  // to store updated rows
  const rowRef = useRef({ updatedRows: [] });

  /**
   * @function fetchData to fetch data based on Payload change
   * @param {string} key string value
   * @param {object} obj object for payload
   * @returns {object} containing response data.
   *
   */
  const fetchData = async (key, obj = {}) => {
    let payload = {};
    if (key === "defaultSearch") {
      payload = { ...selectedInput };
    } else if (key === "filterSearch") payload = { ...vendorDetail, ...searchInput };
    else payload = { ...obj };
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(resource, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };

  /**
   * @function onViewClick to fetch the data based on selected dropdown values and populate on grid
   *
   */
  const onViewClick = async () => {
    setStatus({ loading: true, error: "", table: false });
    setApiData([]);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    rowRef.current.updatedRows = [];
    setVendorDetail({ vendorType: "" });
    const payload = { ...selectedInput };
    const key = "defaultSearch";
    try {
      const { data, totalPages, total, currentPage } = await fetchData(key);
      pageData.current = { totalPages, total, currentPage };
      setVendorDetail(payload);
      setApiData(data);
      setStatus((currentStatus) => {
        return { ...currentStatus, loading: false, table: true };
      });
    } catch (error) {
      setStatus({ loading: false, error: { error }, table: false });
      notify(translate(error.errors[0]?.message), "error", TIMEOUT);
    }
  };

  /**
   * @function createRows to construct array of objects (& sorting in ASC) using response for datagrid
   * @param {Array} rowData consists the row data
   * @returns {object} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    return rowData
      ?.map((r) => {
        const { ratings, ...res } = r;
        const obj = ratings.reduce((a, c) => {
          return { ...a, ...{ [c.pgName]: c.value } };
        }, {});
        return { ...obj, ...res };
      })
      .sort((a, b) => {
        return Number(a.vendorId.match(/(\d+)/g)) - Number(b.vendorId.match(/(\d+)/g));
      });
  };

  useEffect(() => {
    let mounted = true;
    // To construct a list of column from response
    const pgHeader = [];
    apiData?.forEach((li) => {
      li.ratings.forEach((data) => {
        if (data.pgName && !pgHeader.includes(data.pgName)) {
          pgHeader.push(data.pgName);
        }
      });
    });
    if (mounted) {
      setRows(createRows(apiData));
      setPgNames(pgHeader);
    }
    return () => {
      mounted = false;
    };
  }, [apiData]);

  /**
   * @function onUpdateCall To update dialogContents for popup based on event(bulkupdate / cell validation)
   * @param {object} param0 contains destructured values
   * @param {string} param0.title title
   * @param {boolean} param0.showButtons button bool
   * @param {string} param0.closeText closed text
   * @param {string} param0.actionText action text
   */
  const onUpdateCall = ({
    title = translate("update_config"),
    showButtons = true,
    closeText = translate("btn_cancel"),
    actionText = translate("btn_accept"),
  }) => {
    const dialogObj = {
      dialogContent: <CommonDialogContent message={title} />,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    toggleFlag(true);
  };

  /**
   * @function onRowsUpdate to Capturing the modified rows for making bulk update
   * @param {Array} param0 vendor Id and other values
   * @param {string} param0.vendorId  vendor id chnages
   */
  const onRowsUpdate = ({ vendorId, ...rest }) => {
    const originalIndex = apiData.findIndex((obj) => obj.vendorId === vendorId);
    const originalObj = apiData[originalIndex];
    const newRow = {
      deliveryMode: vendorDetail.deliveryMode,
      vendorId,
      vendorType: vendorDetail.vendorType,
      geoGroupId: vendorDetail.geoGroupId,
      geoId: vendorDetail.geoId,
      ratings: originalObj?.ratings.map((val) => {
        return { pgId: val.pgId, value: rest[val.pgName] };
      }),
    };
    const index = rowRef.current.updatedRows.findIndex((obj) => obj.vendorId === vendorId);
    if (index > -1) {
      const rowCopy = [...rowRef.current.updatedRows];
      rowCopy.splice(index, 1);
      rowRef.current.updatedRows = [...rowCopy, newRow];
    } else rowRef.current.updatedRows = [...rowRef.current.updatedRows, newRow];
    setShowUpdateButton(true);
  };

  /**
   * @function loadMoreRows to fetch new rows on scrolling down the grid
   * @returns {null} null/Error
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, vendorDetail, fetchData, createRows, setRows, "loadMore");
  };

  // default columns
  const defaultColumns = [
    {
      key: "vendorName",
      name: `${vendorDetail?.vendorType === "CR" ? "Carrier" : "Fulfilment Center"} Name`,
      width: 200,
      resizable: true,
      frozen: true,
      formatter: (p) => FormatterView(p),
    },
    {
      key: "vendorId",
      name: `${vendorDetail?.vendorType === "CR" ? "Carrier" : "Fulfilment Center"} ID`,
      width: 200,
      resizable: true,
      frozen: true,
      formatter: (p) => FormatterView(p),
    },
  ];

  // columns generated dynamically based on response
  const productColumns =
    pgNames &&
    pgNames.map((col) => {
      return {
        key: col,
        name: col,
        resizable: true,
        width: 150,
        formatter: (p) => FormatterView(p),
        editor: (e) => TextEditor(e, onUpdateCall),
      };
    });

  const columns = productColumns ? [...defaultColumns, ...productColumns] : [];

  /**
   *
   * @function searchCall to fetch the filtered data based on the selected fieldValues
   * @returns {null | Array} null/Array
   */
  const searchCall = async () => {
    const payload = {
      ...searchInput,
    };
    try {
      const { data } = await fetchData("filterSearch", payload);
      if (data && data.length === 0) {
        setRows([]);
      }
      setRows(createRows(data));
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
  };

  const categoryGridTitle = translate("rating_pg_title");

  /**
   *
   * @function onBulkUpdateCall to make bulk update api call for modified rows
   *
   */
  const onBulkUpdateCall = async () => {
    await bulkUpdate(toggleFlag, rowRef, dataProvider, resource, notify, translate, TIMEOUT, setShowUpdateButton);
  };

  /**
   * @function handleModelClose to close the modal
   */
  const handleModelClose = useCallback(() => {
    toggleFlag(false);
  }, [toggleFlag]);
  return (
    <>
      <RatingPgFCLayout
        columns={columns}
        rows={rows}
        gridTitle={categoryGridTitle}
        onUpdate={onUpdateCall}
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        dropDownListArray={dropDownListArray}
        onViewClick={onViewClick}
        showUpdateButton={showUpdateButton}
        status={status}
        vendorDetail={vendorDetail}
        updatedRowDetails={onRowsUpdate}
        loadMoreRows={loadMoreRows}
        handleDropdown={handleDropdown}
      />

      <SimpleModel
        /* eslint-disable react/jsx-props-no-spreading */
        {...dialogObject}
        openModal={importPopupFlag}
        handleClose={handleModelClose}
        handleAction={onBulkUpdateCall}
      />
    </>
  );
};

export default RatingPg;
