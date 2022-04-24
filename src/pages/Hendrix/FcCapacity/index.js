import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTranslate, useNotify, useDataProvider } from "react-admin";
import { useLocation, useHistory } from "react-router-dom";
import FcCapacityLayout from "./Layout";
import SimpleModel from "../../../components/CreateModal";
import CommonDialogContent from "../../../components/CommonDialogContent";
import { useGeoGroups, useDeliveryMode, useCountryList } from "../hooks";
import { getNewRows, bulkUpdate } from "../common";
import { TIMEOUT } from "../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/capacities/configurations`;
/**
 * Component for FC Capacity contains a simple grid with configurations
 *
 * @returns {React.ReactElement} returns a FC Capacity component
 */
const FcCapacity = () => {
  const { search } = useLocation();
  const history = useHistory();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const geography = useCountryList();
  const [deliveryMode, fetchDeliveryMode] = useDeliveryMode("");
  const [geoGroup, fetchGeoGroup] = useGeoGroups("");
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState();
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [apiData, setApiData] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [prevPayload, setPrevPayload] = useState({});
  const [selectedInput, setSelectedInput] = useState({
    deliveryMode: "",
    geoId: "",
    geoGroupId: "",
    vendorType: "FC", // static
  });
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });

  let selectedData = "";
  if (search) {
    const query = new URLSearchParams(search);
    const paramData = (query.get("home") || "").split("|");
    selectedData = paramData ? JSON.parse(paramData) : "";
  }

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
      key: translate(`key_deliveryMode`),
      placeholder: translate("delivery_mode"),
      type: "Dropdown",
      Dataset: deliveryMode,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.deliveryMode : "",
    },
  ];

  useEffect(() => {
    fetchDeliveryMode("FC");
  }, [fetchDeliveryMode]);

  useEffect(() => {
    if (selectedInput.geoId) {
      fetchGeoGroup(selectedInput.geoId);
    }
  }, [selectedInput.geoId, fetchGeoGroup]);

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
  const fetchData = useCallback(
    async (key, obj = {}) => {
      let payload = {};
      if (key === "defaultSearch") {
        payload = { ...selectedInput };
        setPrevPayload(payload);
      } else if (key === "filterSearch") payload = { ...selectedInput, ...obj };
      else payload = { ...obj };
      const {
        data: { data, totalPages, total, currentPage },
      } = await dataProvider.getData(resource, payload);
      pageData.current = { totalPages, total, currentPage };

      return { data, totalPages, total, currentPage };
    },
    [dataProvider, selectedInput],
  );

  /**
   * @function onViewClick to fetch the data based on selected dropdown values and populate on grid
   *
   */
  const onViewClick = async () => {
    setApiData([]);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    setPrevPayload({});
    const key = "defaultSearch";
    try {
      const { data, totalPages, total, currentPage } = await fetchData(key);
      pageData.current = { totalPages, total, currentPage };
      setApiData(data);
    } catch (error) {
      notify(translate(error.response ? error.response.data.errors[0].message : null), "error", TIMEOUT);
    }
  };

  /**
   * @function createRows to construct array of objects (& sorting in ASC) using response for datagrid
   * @param {Array} rowData consists the row data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    const rowList = [];
    rowData?.map((item, key) => {
      rowList[key] = {
        id: item.id,
        fullFilmentcenterName: item.vendorName,
        fullFilmentcenterId: item.vendorId,
        configName: item.configName,
        capacity: item.capacity,
        fromDate: item.fromDate,
        thruDate: item.thruDate,
        isGlobal: item.isGlobal,
      };
      return rowList;
    });
    return rowList.sort((a, b) => {
      return Number(a.fullFilmentcenterId.match(/(\d+)/g)) - Number(b.fullFilmentcenterId.match(/(\d+)/g));
    });
  };
  /**
   * @function onUpdateCall To update dialogContents for popup based on event(bulkupdate / cell validation)
   * @param {object} param0 contains destructured values
   * @param {string} param0.title title
   * @param {boolean} param0.showButtons button bool
   * @param {string} param0.closeText closed text
   * @param {string} param0.actionText action text
   */
  const onUpdateCall = ({
    title = translate(`update_modal_message`),
    showButtons = true,
    closeText = translate(`update_deny`),
    actionText = translate(`update_confirm`),
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
   * @function loadMoreRows to fetch new rows on scrolling down the grid
   *
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, selectedInput, fetchData, createRows, setRows, "loadMore");
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setRows(createRows(apiData));
    }
    return () => {
      mounted = false;
    };
  }, [apiData]);

  /**
   * @function onRowsUpdate to Capturing the modified rows for making bulk update
   * @param {object} prevRow updated row object
   *
   */
  const onRowsUpdate = (prevRow) => {
    const { capacity, configName, isGlobal, id, fromDate, thruDate } = prevRow;
    let newRow;
    if (isGlobal)
      newRow = {
        id,
        vendorId: prevRow.fullFilmentcenterId,
        deliveryMode: prevPayload.deliveryMode,
        geoId: prevPayload.geoId,
        geoGroupId: prevPayload.geoGroupId,
        configName: prevRow.configName,
        fromDate,
        thruDate,
        capacity: prevRow.capacity,
        isGlobal,
      };
    else newRow = { capacity, configName, isGlobal, id, fromDate, thruDate };
    const index = rowRef.current.updatedRows.findIndex(
      (obj) => obj.id === prevRow.id || obj?.vendorId === prevRow?.fullFilmentcenterId,
    );
    if (index > -1) {
      const rowCopy = [...rowRef.current.updatedRows];
      rowCopy.splice(index, 1);
      rowRef.current.updatedRows = [...rowCopy, newRow];
    } else rowRef.current.updatedRows = [...rowRef.current.updatedRows, newRow];
    setShowUpdateButton(true);
  };

  /**
   * @function onDeleteCall to make delete api call and update the grid with new rows
   *
   */
  const onDeleteCall = async () => {
    toggleFlag(false);
    const res = await dataProvider.delete(`${resource}/id/${deleteId.id}`, "");
    if (res?.status === "success") {
      const rowList = rows.slice();
      const rowsFull = rowList.filter((row) => row.id !== deleteId.id);
      setRows(rowsFull);
      notify(translate("toast_delete"), "info", TIMEOUT);
      setRows(rowsFull);
    } else if (res?.errors) {
      notify(translate(res.data.errors[0]?.message), "error", TIMEOUT);
    }
    rowRef.current.updatedRows = [];
    setShowUpdateButton(false);
  };

  useEffect(() => {
    if (selectedData) {
      const { inputVal } = selectedData;
      /**
       * @function onRedirect to handle Home Page redirect and update the state values
       *
       */
      const onRedirect = async () => {
        setSelectedInput((prev) => {
          return { ...prev, ...inputVal };
        });
        const resp = await fetchData("redirect", inputVal);
        setApiData(resp.data);
        history.replace({
          search: null,
        });
      };
      onRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *
   * @function searchCall to fetch the filtered data based on the selected fieldValues
   * @returns {null | object} null/Array
   */
  const searchCall = async () => {
    const payload = {
      ...searchInput,
    };
    try {
      const { data } = await fetchData("filterSearch", payload);
      if (data && data.length === 0) {
        setRows(() => []);
      }
      setRows(() => [...createRows(data)]);
    } catch (error) {
      notify(translate(error.response ? error.response.data.errors[0].message : null), "error", TIMEOUT);
    }
    return null;
  };
  /**
   *
   * @function onBulkUpdateCall to make bulk update api call for modified rows
   *
   */
  const onBulkUpdateCall = async () => {
    await bulkUpdate(toggleFlag, rowRef, dataProvider, resource, notify, translate, TIMEOUT, setShowUpdateButton);
  };
  /**
   * @function modalAction to handle modal action based on the event
   *
   * @returns {Function} modal action handler
   */
  const modalAction = () => {
    const modalTitle = dialogObject.dialogContent.props.message;
    if (modalTitle.toLowerCase().includes("delete")) {
      return onDeleteCall();
    }
    return onBulkUpdateCall();
  };
  /**
   * @function handleModelClose to close the modal
   */
  const handleModelClose = useCallback(() => {
    toggleFlag(false);
  }, [toggleFlag]);
  return (
    <>
      <FcCapacityLayout
        rowValues={rows}
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
        dropDownListArray={dropDownListArray}
        onViewClick={onViewClick}
        loadMoreRows={loadMoreRows}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        onUpdateCall={onUpdateCall}
        setDeleteId={setDeleteId}
        setConfirmDialog={setConfirmDialog}
        toggleFlag={toggleFlag}
        updatedRowDetails={onRowsUpdate}
        showUpdateButton={showUpdateButton}
      />
      <SimpleModel
        /* eslint-disable react/jsx-props-no-spreading */
        {...dialogObject}
        openModal={importPopupFlag}
        handleClose={handleModelClose}
        handleAction={modalAction}
      />
    </>
  );
};

export default FcCapacity;
