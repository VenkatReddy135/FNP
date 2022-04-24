import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslate, useNotify, useDataProvider } from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import Layout from "./Layout";
import SimpleModel from "../../../components/CreateModal";
import CommonDialogContent from "../../../components/CommonDialogContent";
import { vendorTypes, bulkUpdate, getNewRows } from "../common";
import { useCountryList, useGeoGroups, useDeliveryMode, useProductGroup } from "../hooks";
import { TIMEOUT } from "../../../config/GlobalConfig";

const resourceFc = `${window.REACT_APP_HENDRIX_SERVICE}/allocation-rules/fcs`;
const resourceCarriers = `${window.REACT_APP_HENDRIX_SERVICE}/allocation-rules/carriers`;

/**
 * Component for AllocationLogic
 *
 * @returns {React.ReactElement} returns a AllocationLogic component with datagrid
 */
const AllocationLogicList = () => {
  const history = useHistory();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { search } = useLocation();
  let selectedData = "";
  if (search) {
    const query = new URLSearchParams(search);
    const paramData = (query.get("home") || "").split("|");
    selectedData = paramData ? JSON.parse(atob(paramData)) : "";
  }
  const translate = useTranslate();
  const geography = useCountryList();
  const pgGroup = useProductGroup();
  const [geoGroup, fetchGeoGroup] = useGeoGroups("");
  const [deliveryModes, fetchDeliveryModes] = useDeliveryMode("");
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const [selectedInput, setSelectedInput] = useState({
    pgId: "",
    geoId: "",
    geoGroupId: "",
    vendorType: "",
    deliveryMode: "",
  });
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [vendor, setVendor] = useState();
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  // dropdown array
  const dropDownListArray = [
    {
      id: 0,
      key: translate("key_geoId"),
      placeholder: translate("geography_dropdown_placeholder"),
      type: "Dropdown",
      Dataset: geography,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoId : "",
    },
    {
      id: 1,
      key: translate("key_vendorType"),
      placeholder: translate("fc_carrier_placeholder"),
      type: "Dropdown",
      Dataset: vendorTypes,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.vendorType : "",
    },
    {
      id: 2,
      key: translate("key_geoGroupId"),
      placeholder: translate("geoGroup_placeholder"),
      type: "Dropdown",
      Dataset: geoGroup,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoGroupId : "",
    },
    {
      id: 3,
      key: translate("key_deliveryMode"),
      placeholder: translate("delivery_mode"),
      type: "Dropdown",
      Dataset: deliveryModes,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.deliveryMode : "",
    },
    {
      id: 4,
      key: translate("key_pgId"),
      placeholder: translate("productGroup_placeholder"),
      type: "Dropdown",
      Dataset: pgGroup,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.pgId : "",
    },
  ];

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
        fetchDeliveryModes(value);
      }
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
    } else if (key === "redirect") {
      payload = obj;
    } else if (key === "filterSearch") payload = { ...selectedInput, ...obj };
    else payload = { ...obj };
    const vendorApiKey = payload.vendorType === "FC" ? resourceFc : resourceCarriers;
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(vendorApiKey, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };
  /**
   * @function createRows to construct array of objects (& sorting in ASC) using response for datagrid
   * @param {Array} rowData consists the row data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    return rowData.sort((a, b) => {
      return Number(a.baseGeoId.match(/(\d+)/g)) - Number(b.baseGeoId.match(/(\d+)/g));
    });
  };

  /**
   * @function onViewClick to fetch the data based on selected dropdown values and populate on grid
   * @returns {null | object} null
   */
  const onViewClick = async () => {
    setRows([]);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    rowRef.current.updatedRows = [];
    const key = "defaultSearch";
    try {
      const { data, totalPages, total, currentPage } = await fetchData(key);
      pageData.current = { totalPages, total, currentPage };
      setVendor(selectedInput.vendorType);
      setRows(createRows(data));
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
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
    title = translate("update_modal_message"),
    showButtons = true,
    closeText = translate("update_deny"),
    actionText = translate("update_confirm"),
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
   * @function deleteModalHandler to make delete api call and update the grid with new rows
   */
  const deleteModalHandler = async () => {
    toggleFlag(false);
    const vendorType = vendor === "FC" ? "FC" : "CR";
    const res = await dataProvider.delete(
      `${window.REACT_APP_HENDRIX_SERVICE}/allocation-rules/id/${deleteId.id}?vendorType=${vendorType}`,
      { id: deleteId.id },
    );
    if (res?.status === "success") {
      const rowList = rows.slice();
      const rowsFull = rowList.filter((row) => row.id !== deleteId.id);
      setRows(rowsFull);
      notify(translate("mapCarrier_toast_delete"), "info", TIMEOUT);
      setRows(rowsFull);
    } else if (res?.errors) {
      notify(translate(res.data.errors[0]?.message), "error", TIMEOUT);
    }
    rowRef.current.updatedRows = [];
    setShowUpdateButton(false);
  };

  /**
   * @function loadMoreRows to fetch new rows on scrolling down the grid
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, selectedInput, fetchData, createRows, setRows, "loadMore");
  };

  /**
   * @function onRowsUpdate to Capturing the modified rows for making bulk update
   * @param {object} prevRow updated row object
   */
  const onRowsUpdate = (prevRow) => {
    if (prevRow.id) {
      const { baseGeoId, configName, geoGroupId, geoId, pgId, deliveryMode, fromDate, id, thruDate } = prevRow;
      let newRow = {};
      const commonFields = {
        baseGeoId,
        configName,
        fromDate,
        thruDate,
        geoGroupId,
        geoId,
        pgId,
        deliveryMode,
        id,
      };
      if (vendor === "FC") {
        newRow = {
          factorCapacityDone: prevRow.factorCapacityDone,
          factorDistance: prevRow.factorDistance,
          factorFCRating: prevRow.factorFCRating,
          factorManualRating: prevRow.factorManualRating,
          factorPrice: prevRow.factorPrice,
          ...commonFields,
        };
      } else if (vendor === "CR") {
        newRow = {
          factorLeadHours: prevRow.factorLeadHours,
          factorShippingPrice: prevRow.factorShippingPrice,
          factorCarrierRating: prevRow.factorCarrierRating,
          factorManualRating: prevRow.factorManualRating,
          ...commonFields,
        };
      }
      const index = rowRef.current.updatedRows.findIndex((obj) => obj.id === prevRow.id);
      if (index > -1) {
        const rowCopy = [...rowRef.current.updatedRows];
        rowCopy.splice(index, 1);
        rowRef.current.updatedRows = [...rowCopy, newRow];
      } else rowRef.current.updatedRows = [...rowRef.current.updatedRows, newRow];
      setShowUpdateButton(true);
    }
  };

  /**
   * @function onBulkUpdateCall to make bulk update api call for modified rows
   */
  const onBulkUpdateCall = async () => {
    const resource = selectedInput.vendorType === "FC" ? resourceFc : resourceCarriers;
    await bulkUpdate(toggleFlag, rowRef, dataProvider, resource, notify, translate, TIMEOUT, setShowUpdateButton);
  };

  /**
   * @function searchCall to fetch the filtered data based on the selected fieldValues
   * @returns {null | object} null/Array
   */
  const searchCall = async () => {
    try {
      const { data } = await fetchData("filterSearch", searchInput);
      if (data && data.length === 0) setRows([]);
      else setRows(createRows(data));
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
  };

  /**
   * @function modalAction to handle modal action based on the event
   */
  const modalAction = () => {
    const modalTitle = dialogObject.dialogContent.props.message;
    if (modalTitle.toLowerCase().includes("delete")) deleteModalHandler();
    else onBulkUpdateCall();
  };

  useEffect(() => {
    if (selectedData) {
      const { inputVal } = selectedData;
      /**
       * @function onRedirect to handle Home Page redirect and update the state values
       */
      const onRedirect = async () => {
        fetchDeliveryModes(inputVal.vendorType);
        fetchGeoGroup(inputVal.geoId);
        setSelectedInput((prev) => {
          return { ...prev, ...inputVal };
        });
        setVendor(inputVal.vendorType);
        const resp = await fetchData("redirect", inputVal);
        setRows(createRows(resp.data));
        history.replace({ search: null });
      };
      onRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * @function handleModelClose to close the modal
   */
  const handleModelClose = useCallback(() => {
    toggleFlag(false);
  }, [toggleFlag]);
  return (
    <>
      <Layout
        rows={rows}
        dropDownListArray={dropDownListArray}
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
        showUpdateButton={showUpdateButton}
        onViewClick={onViewClick}
        updatedRowDetails={onRowsUpdate}
        onUpdateCall={onUpdateCall}
        setDeleteId={setDeleteId}
        setConfirmDialog={setConfirmDialog}
        toggleFlag={toggleFlag}
        loadMoreRows={loadMoreRows}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        handleDropdown={handleDropdown}
        vendor={vendor}
        pgGroup={pgGroup}
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

export default AllocationLogicList;
