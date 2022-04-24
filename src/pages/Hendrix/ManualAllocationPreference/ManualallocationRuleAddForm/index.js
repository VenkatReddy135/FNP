import React, { useState, useEffect, useRef } from "react";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import ManualList from "./ManualList";
import Modal from "../../../../components/CreateModal";
import TemplateComponent from "../../common/TemplateComponent";
import { payloadForTemplate, fetchTemplateValues, formatDateConvertmonth, formatDateConvert } from "../../common";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences`;
const resourceTempleates = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences/date-ranges`;
/**
 * Component for Add New rule
 *
 * @returns {React.ReactElement} returns a New rule
 */
const RulePage = () => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  const checkEdit = query.get("edit") === "true";
  const paramData = (query.get("add") || "").split("|");
  const { inputs, pgArray, editData } = paramData ? JSON.parse(atob(paramData)) : "";
  const [selectedFromDate, updateFromDate] = useState(
    checkEdit && editData.fromDate ? formatDateConvertmonth(editData.fromDate) : "",
  );
  const [selectedToDate, updateToDate] = useState(checkEdit ? formatDateConvertmonth(editData.thruDate) : "");
  const [rows, setRows] = useState([]);
  const [configName, setConfigName] = useState(checkEdit ? editData.configName : "");
  const [singleTableRow, setSingleTableRow] = useState();
  const [headerRuleName, setHeaderRuleName] = useState({
    productGroup: "",
    pincode: "",
  });
  const [templateDropdownValues, setTemplateDropdownValues] = useState([]);
  const [dates, setDates] = useState("");
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");

  const refQuotas = useRef({ storeQuota: [] });
  const templateId = useRef({ id: "" });
  // to store pagination details
  const pageData = useRef({ totalPages: "", total: "", currentPage: "", filter: false });

  /**
   * To construct array of objects (& sorting in ASC) using response for datagrid
   *
   * @param {*} rowData response data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    const tableRows = rowData
      ?.map((data) => {
        return {
          vendorId: data.vendorId,
          value: data.value,
          vendorName: data.vendorName,
        };
      })
      .sort((a, b) => {
        return Number(a.vendorId.match(/(\d+)/g)) - Number(b.vendorId.match(/(\d+)/g));
      });
    return tableRows;
  };
  useEffect(() => {
    if (location && editData) {
      setSingleTableRow(editData);
    }
    const payload = {
      baseGeoId: editData.baseGeoId,
      pgId: editData.pgId,
      vendorType: editData.vendorType,
    };
    if (!checkEdit) {
      /**
       * @function to fetch Initial field values for Add Rule Page
       * @param data
       * @returns responseData
       */
      (async () => {
        try {
          const {
            data: { data, totalPages, total, currentPage },
          } = await dataProvider.getData(`${resource}/configs`, payload);
          setRows(createRows(data));
          pageData.current = { totalPages, total, currentPage, filter: true };
        } catch (err) {
          return err.response ? err.response.data : null;
        }
        return null;
      })();
    } else setRows(createRows(editData.quota));
    setHeaderRuleName({
      productGroup: editData.pgId || "",
      pincode: editData.baseGeoId || "",
    });
    /**
     * @function To fetch the template dropdown values
     *
     */
    (async () => {
      try {
        const dateRanges = await fetchTemplateValues(payload, dataProvider, resourceTempleates);
        // const dateRanges = await fetchTemplateValues({ ...payload, dataProvider, size: 100 });
        setTemplateDropdownValues(dateRanges);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
      return null;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /**
   * @function to validate the fields and make api call to add new rule
   *
   */
  const onButtonClick = async () => {
    const storedQuota = refQuotas.current.storeQuota.filter((item) => item.value !== "" && item.value !== null);
    const commonFields = {
      configName,
      fromDate: selectedFromDate && formatDateConvert(selectedFromDate),
      quotas: storedQuota && storedQuota,
      thruDate: selectedToDate && formatDateConvert(selectedToDate),
    };
    const addRulePayload = {
      baseGeoId: singleTableRow && singleTableRow.baseGeoId,
      deliveryMode: singleTableRow && singleTableRow.deliveryMode,
      geoGroupId: singleTableRow && singleTableRow.geoGroupId,
      geoId: singleTableRow && singleTableRow.geoId,
      pgId: singleTableRow && singleTableRow.pgId,
      vendorId: singleTableRow && singleTableRow.vendorId,
      vendorType: singleTableRow && singleTableRow.vendorType,
      ...commonFields,
    };
    const payloadObj = { data: { dataObj: addRulePayload, params: "" } };
    let res = "";
    if (checkEdit && editData.id) {
      res = await dataProvider.put(`${resource}/id/${editData.id}`, {
        id: "",
        data: commonFields,
      });
    } else res = await dataProvider.create(resource, payloadObj);
    if (res.status === "success") {
      notify(translate(`map_toast_success`), "info", TIMEOUT);
      setTimeout(() => {
        const stateVal = { inputVal: inputs, productIds: editData.pgId, pgArray };
        const encodedObj = btoa(JSON.stringify(stateVal));
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
   * @function to show template dropdown values
   *
   */
  const onTemplateCall = () => {
    const dialogObj = {
      dialogTitle: translate(`mapCarrier_selectTemplate`),
      dialogContent: <TemplateComponent templateDropdownValues={templateDropdownValues} setDates={setDates} />,
      showButtons: true,
      showTitle: true,
      closeText: translate(`mapCarrier_deny`),
      actionText: translate(`mapCarrier_confirm`),
    };
    setConfirmDialog(dialogObj);
    setModalOpen(true);
  };

  /**
   * @function to fetch the configuration data based on selected template
   *
   * @returns {*} returns the validation result and displays error message
   */
  const onSelectingTemplate = async () => {
    setModalOpen(false);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    pageData.current.filter = false;
    const payload = {
      ...payloadForTemplate({ dates, templateDropdownValues }),
      baseGeoId: editData.baseGeoId,
      pgId: editData.pgId,
      vendorType: editData.vendorType,
    };
    try {
      const res = await dataProvider.getData(`${resource}/quotas-date-ranges`, payload);
      if (res.status === "success") {
        const { data } = res;
        setRows(createRows(data.data[0].quota));
        templateId.current.id = data.data[0].id;
      } else {
        setRows([]);
        templateId.current.id = "";
      }
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };

  /**
   * @function to Capturing the modified rows for making update call
   * @param {Array} quota quota data
   *
   */
  const quotaHandle = (quota) => {
    if (quota) {
      const quotaArr = [];
      quota.forEach((val) => {
        const obj = {};
        obj.vendorId = val.vendorId;
        obj.value = val.value;
        quotaArr.push(obj);
      });
      refQuotas.current.storeQuota = quotaArr;
    }
  };

  /**
   * @function to fetch the filtered data based on the selected fieldValues
   * @param {object} e event object
   * @param {Array} nextRowsPayload payload
   * @returns {*} Filtered rows for grid
   */
  const searchCall = async (e, nextRowsPayload) => {
    const newId = templateId.current.id ? templateId.current.id : singleTableRow.id;
    let responseData;
    if (!newId) {
      const commonFields = {
        baseGeoId: editData.baseGeoId,
        pgId: inputs.pgId,
        vendorType: inputs.vendorType,
      };

      let addRuleSearchPayload = {};
      if (nextRowsPayload) addRuleSearchPayload = { ...nextRowsPayload, ...commonFields };
      else addRuleSearchPayload = { ...searchInput, ...commonFields };
      try {
        responseData = await dataProvider.getData(`${resource}/configs`, addRuleSearchPayload);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    } else {
      let payload = {};
      const commonFields = {
        id: newId,
        vendorType: inputs.vendorType,
      };
      if (nextRowsPayload) payload = { ...nextRowsPayload, ...commonFields };
      else payload = { ...searchInput, ...commonFields };
      try {
        responseData = await dataProvider.getData(`${resource}/configs/id/${newId}`, payload);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    }
    const {
      data: { data, totalPages, total, currentPage },
    } = responseData;
    pageData.current = { totalPages, total, currentPage, filter: true };
    if (!newId) {
      if (nextRowsPayload) setRows((prev) => [...prev, ...createRows(data)]);
      else setRows(createRows(data));
    } else if (newId) {
      if (nextRowsPayload) setRows((prev) => [...prev, ...createRows(data[0].quota)]);
      else setRows(createRows(data[0].quota));
    }
    return null;
  };

  return (
    <>
      <PageHeader
        header={{
          ruleLabel: checkEdit ? translate(`mapCarrier_editRuleTitle`) : translate(`mapCarrier_addRuleTitle`),
          ruleName: checkEdit
            ? `${configName} for ${inputs.pgId} at ${headerRuleName.pincode}`
            : headerRuleName.pincode,
        }}
        pathName={translate(`mapCarrier_addPathName`)}
        pathEndName={translate(`mapCarrier_addPathEndName`)}
        buttonName={translate(`mapCarrier_saveButton`)}
      />
      <ManualList
        rowValues={rows}
        pageData={pageData}
        onButtonClick={onButtonClick}
        editList={editData}
        updateFromDate={updateFromDate}
        updateToDate={updateToDate}
        onTemplateCall={onTemplateCall}
        quotaHandle={quotaHandle}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchCall={searchCall}
        onChangeStateValues={onChangeStateValues}
        setConfirmDialog={setConfirmDialog}
        setModalOpen={setModalOpen}
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
      />
      <Modal
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...dialogObject}
        openModal={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleAction={() => {
          setModalOpen(false);
          onSelectingTemplate();
        }}
      />
    </>
  );
};
export default RulePage;
