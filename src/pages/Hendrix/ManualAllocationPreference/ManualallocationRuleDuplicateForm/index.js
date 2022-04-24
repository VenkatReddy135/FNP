import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import PageHeader from "../../../../components/PageHeader";
import Modal from "../../../../components/CreateModal";
import { useBaseGeoId } from "../../hooks";
import DuplicateList from "./DuplicateList";
import { formatDateConvert, formatDateConvertmonth } from "../../common";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences`;
/**
 * Component for implement duplicate rule
 *
 * @returns {React.ReactElement} returns a new List
 */
const DuplicateRule = () => {
  const dataProvider = useDataProvider();
  const history = useHistory();
  const notify = useNotify();
  const location = useLocation();
  const translate = useTranslate();
  const query = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const paramData = (query.get("duplicate") || "").split("|");
  const { inputs, pgArray, editData } = paramData ? JSON.parse(atob(paramData)) : "";
  const [showModal, setModalOpen] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const [selectedFromDate, updateFromDate] = useState(
    editData.fromDate ? formatDateConvertmonth(editData.fromDate) : "",
  );
  const [selectedToDate, updateToDate] = useState(editData.thruDate ? formatDateConvertmonth(editData.thruDate) : "");
  const [configName, setConfigName] = useState(editData.configName ? editData.configName : "");
  const [pincodeGroup, setPincodeGroup] = useState([]);
  const [getproductGroup, setProductGroup] = useState([]);
  const [rows, setRows] = useState([]);
  const [singleTableRow, setSingleTableRow] = useState();
  const [headerRuleName, setHeaderRuleName] = useState({
    configName: "",
    productGroup: "",
    pincode: "",
  });
  const [initialQuotasState, setInitialQuotasState] = useState(true);
  const [initialQuotas, setInitialQuotas] = useState([]);
  const [previousQuota, setpreviousQuota] = useState([]);
  const baseGeoIds = useBaseGeoId(inputs);

  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const refQuotas = useRef({ storeQuota: [] });
  const modifiedQuotas = useRef({ quotas: editData.quota || [] });
  const pageData = useRef({ totalPages: "", total: "", currentPage: "", filter: false });
  /**
   * To construct array of objects (& sorting in ASC) using response for datagrid
   *
   * @param {Array} rowData response data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    const tableRows = rowData
      ?.map((data) => {
        return {
          vendorId: data.vendorId,
          value: data.value || data.value === 0 ? `${data.value}%` : "",
          vendorName: data.vendorName,
        };
      })
      .sort((a, b) => {
        return Number(a.vendorId.match(/(\d+)/g)) - Number(b.vendorId.match(/(\d+)/g));
      });
    const prevQuota = rowData?.map((data) => {
      return { vendorId: data.vendorId, value: data.value };
    });
    setpreviousQuota(prevQuota);
    return tableRows;
  };

  /**
   * @function onPincodeChange to update the Pincode values on change
   *  @param {object} e event object
   * @returns {null} null
   */
  const onPincodeChange = (e) => setPincodeGroup(e.target.value);
  /**
   * @function onProductGroupChange to update the Productgroup values on change
   * @param {object} e event object
   * @returns {null} null
   */
  const onProductGroupChange = (e) => setProductGroup(e.target.value);

  useEffect(() => {
    if (location && editData) {
      setSingleTableRow(editData);
    }
    let payload = {};
    const commonFields = {
      baseGeoId: editData.baseGeoId,
      pgId: editData.pgId,
      id: editData.id,
      vendorType: editData.vendorType,
    };
    payload = { ...searchInput, ...commonFields };

    /**
     * @function to fetch Initial field values for Add Rule Page
     * @param data
     * @returns responseData id
     */
    (async () => {
      try {
        const {
          data: { data, totalPages, total, currentPage },
        } = await dataProvider.getData(`${resource}/configs/id/${editData.id}`, payload);
        setRows(createRows(data[0].quota));
        pageData.current = { totalPages, total, currentPage, filter: true };
        // }
      } catch (err) {
        return err.response ? err.response.data : null;
      }
      return null;
    })();
    setHeaderRuleName({
      configName: editData.configName || "",
      productGroup: editData.pgId || "",
      pincode: editData.baseGeoId || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /**
   * @function to construct the payload & trigger duplicate rule api call
   */
  const onButtonClick = async () => {
    const storedQuota = modifiedQuotas.current.quotas.filter((item) => item.value !== "" && item.value !== null);
    const payload = {
      configName,
      fromDate: selectedFromDate && formatDateConvert(selectedFromDate),
      sourceRuleId: singleTableRow.id && singleTableRow.id,
      thruDate: selectedToDate && formatDateConvert(selectedToDate),
      vendorType: singleTableRow.vendorType,
      applyToBaseGeoIds: pincodeGroup.length > 0 ? pincodeGroup : "",
      applyToPgIds: getproductGroup.length > 0 ? getproductGroup : "",
      quotas: storedQuota,
    };
    const payloadObj = { data: { dataObj: payload, params: "" } };
    const res = await dataProvider.create(`${resource}/_duplicate`, payloadObj);
    if (res.status === "success") {
      notify(translate(`map_toast_success`), "info", TIMEOUT);
      setTimeout(() => {
        const stateObj = { inputVal: inputs, productIds: editData.pgId, pgArray };
        const encodedObj = btoa(JSON.stringify(stateObj));
        history.push({
          pathname: "/hendrix/v1/manualallocation",
          search: `?home=${encodedObj}`,
        });
      }, TIMEOUT);
    } else if (res.message) {
      notify(translate(res.message), "error", TIMEOUT);
    }
  };

  /**
   * update the fromDate & toDate and ruleName based on changes
   *
   * @param {object} data array of attribute data
   * @param {object} key contains filed from data
   * @returns {Array} updated sort fields
   */
  const onChangeStateValues = (data, key) => {
    if (key === "configName" && data) {
      setConfigName(data.target.value);
    }
    return null;
  };

  /**
   * @function to Capturing the modified quotas to construct payload
   * @param {Array} qu quota data
   *
   */
  const createQuota = (qu) => {
    const { quotas } = modifiedQuotas.current;
    qu.forEach((quota) => {
      const index = quotas.findIndex((q) => q.vendorId === quota.vendorId);
      if (index > -1) modifiedQuotas.current.quotas[index] = quota;
      else modifiedQuotas.current.quotas = [...modifiedQuotas.current.quotas, quota];
    });
  };

  /**
   * @function to Capturing the modified rows for making update call
   * @param {Array} quota quota data
   *
   */
  const quotaHandle = (quota) => {
    if (quota) {
      const quotaArr = [];
      quota?.forEach((value) => {
        const obj = {};
        obj.vendorId = value.vendorId;
        const remValue = value.value.replace(/[^\d.-]/g, "");
        obj.value = remValue;
        quotaArr.push(obj);
      });
      if (quotaArr.length > 0) createQuota(quotaArr);
      const res = quotaArr.filter((item1) => !initialQuotas.some((item2) => item2.vendorId === item1.vendorId));
      refQuotas.current.storeQuota = res.length === 0 ? previousQuota : res;
      if (initialQuotasState) {
        setInitialQuotas(quota);
        setInitialQuotasState(false);
      }
    }
  };

  /**
   * @function to fetch the filtered data based on the selected fieldValues
   * @param {object} e event object
   * @param {Array} nextRowsPayload payload
   * @returns {*} Filtered rows for grid
   */
  const searchCall = async (e, nextRowsPayload) => {
    if (e.stopPropagation) e.stopPropagation();
    let payload = {};
    const commonFields = {
      id: editData.id,
      vendorType: inputs.vendorType,
    };
    if (nextRowsPayload) payload = { ...nextRowsPayload, ...commonFields };
    else payload = { ...searchInput, ...commonFields };
    try {
      const {
        data: { data, totalPages, total, currentPage },
      } = await dataProvider.getData(`${resource}/configs/id/${editData.id}`, payload);
      pageData.current = { totalPages, total, currentPage, filter: true };
      setRows(createRows(data[0].quota));
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };

  return (
    <>
      <PageHeader
        header={{
          ruleLabel: translate(`mapCarrier_duplicateRule`),
          ruleName: `${headerRuleName.configName}`,
        }}
      />
      <DuplicateList
        rowValues={rows}
        pageData={pageData}
        baseGeoIds={baseGeoIds}
        onButtonClick={onButtonClick}
        editList={editData}
        updateFromDate={updateFromDate}
        updateToDate={updateToDate}
        quotaHandle={quotaHandle}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        onChangeStateValues={onChangeStateValues}
        setConfirmDialog={setConfirmDialog}
        setModalOpen={setModalOpen}
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
        onPincodeChange={onPincodeChange}
        onProductGroupChange={onProductGroupChange}
        pgArray={pgArray}
      />
      <Modal
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...dialogObject}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={showModal}
        handleClose={() => setModalOpen(false)}
        handleAction={() => setModalOpen(false)}
      />
    </>
  );
};

export default DuplicateRule;
