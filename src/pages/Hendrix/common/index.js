import React from "react";
import { Edit, Delete, Add, FileCopy } from "@material-ui/icons";

// static dropdown values
export const vendorTypes = [
  { id: "FC", name: "Fulfilment Center" },
  { id: "CR", name: "Carrier" },
];
export const operators = [
  { id: "EQUAL_TO", name: "Equal To" },
  { id: "NOT_EQUAL_TO", name: "Not Equal To" },
  { id: "CONTAINS", name: "Contains" },
  { id: "DOES_NOT_CONTAIN", name: "Does Not Contain" },
];
export const fcFieldNameArray = [
  { id: "vendorName", name: "Fulfilment Center Name" },
  { id: "vendorId", name: "Fulfilment Center ID" },
];
export const carrierFieldNameArray = [
  { id: "vendorName", name: "Carrier Name" },
  { id: "vendorId", name: "Carrier ID" },
];
export const newFcFieldNameArray = [{ id: "baseGeoId", name: "Base Geo" }];
export const allocationLogicFieldNameArray = [
  { id: "baseGeoId", name: "Base Geo" },
  { id: "configName", name: "Config Name" },
];
export const manualAllocationFieldNameArray = [
  { id: "vendorName", name: "Vendor Name" },
  { id: "configName", name: "Config Name" },
  { id: "baseGeoId", name: "Base Geo" },
];

export const menuOptions = [
  { key: `edit_rule`, Icon: <Edit /> },
  { key: `duplicate_rule`, Icon: <FileCopy /> },
  { key: `delete_rule_al`, Icon: <Delete /> },
];

export const menuRuleOptions = [{ key: `add_rule1`, Icon: <Add /> }];
/**
 * @function getNewRows to fetch new rows on scrolling down the grid
 * @param {object} pageData contains pagination details
 * @param {object} searchInput contains search inputs
 * @param {object} selectedInput contains selected dropdown values
 * @param {Function} fetchData function to fetch data
 * @param {Function} createRows to construct rows for grid
 * @param {Function} setRows function to update the state value
 * @param {string} key used to call fetchData function conditionally
 * @returns {null | object} null
 */
export const getNewRows = async (pageData, searchInput, selectedInput, fetchData, createRows, setRows, key) => {
  const { totalPages, currentPage } = pageData.current;
  if (currentPage + 1 < totalPages) {
    let payload = {};
    const { fieldName, fieldValues, operator } = searchInput;
    if (fieldName && fieldValues && operator)
      payload = { ...selectedInput, ...searchInput, page: pageData.current.currentPage + 1 };
    else payload = { ...selectedInput, page: pageData.current.currentPage + 1 };
    try {
      let resp;
      if (key) resp = await fetchData(key, payload);
      else resp = await fetchData(payload);
      const nextRows = createRows(resp.data);
      if (nextRows.length > 0) setRows((prev) => [...prev, ...nextRows]);
    } catch (err) {
      return err.response ? err.response.data : null;
    }
  }
  return null;
};

/**
 * @function bulkUpdate to make bulk update call for modified rows
 * @param {Function} toggleFlag to close the modal
 * @param {object} Rows contains the list of updated rows
 * @param {object} dataProvider used to make api call to save the changes
 * @param {string} resource contains the api url
 * @param {Function} notify function to show toast notification
 * @param {Function} translate function to translate the values
 * @param {number} TIMEOUT total amount of time to display toast notification
 * @param {Function} setShowUpdateButton function to show/hide the update button
 */
export const bulkUpdate = async (
  toggleFlag,
  Rows,
  dataProvider,
  resource,
  notify,
  translate,
  TIMEOUT,
  setShowUpdateButton,
) => {
  toggleFlag(false);
  if (Rows.current.updatedRows.length > 0) {
    const resp = await dataProvider.put(resource, { id: "", data: Rows.current.updatedRows });
    if (resp.status === "success") {
      notify(translate("config_success_message"), "info", TIMEOUT);
    } else notify(translate(resp.data.errors[0]?.message), "error", TIMEOUT);
    Rows.current.updatedRows = []; // eslint-disable-line no-param-reassign
    setShowUpdateButton(false);
  }
};

/**
 * @function validateTime to validate the time format
 * @param {number} time input time
 * @returns {string} validation message
 */
export const validateTime = (time) =>
  !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) ? "Invalid Time, Valid format is 'HH:MM'" : undefined;

/**
 * Function to set convert local date to UTC date format "mm/dd/yyyy"
 *
 * @function formatDate
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC date according to the date passed.
 */
export const formatDateConvertmonth = (date) => {
  const splitDate = date.split("-");
  if (splitDate.length === 0) return null;
  const day = splitDate[0];
  const month = splitDate[1];
  const year = splitDate[2];
  return `${month}-${day}-${year}`;
};

/**
 * Function to set convert local date to UTC date format "dd/mm/yyyy"
 *
 * @function formatDate
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC date according to the date passed.
 */
export const formatDateConvert = (date) => {
  const splitDate = date.split("-");
  if (splitDate.length === 0) return null;
  const val1 = splitDate[0];
  const val2 = splitDate[1];
  const val3 = splitDate[2];
  if (splitDate[0].length === 4) return `${val3}-${val2}-${val1}`;
  return `${val2}-${val1}-${val3}`;
};

/**
 * @function to create a payload for template api call
 * @param {*} param0 props of the payloadForTemplate
 * @returns {object} payload object
 */
export const payloadForTemplate = ({ dates, templateDropdownValues }) => {
  const { dateObject } = templateDropdownValues.find((item) => item.dateValue === dates);
  return dateObject;
};

/**
 * To fetch the template dropdown values
 *
 * @param {object} payload response
 * @param {Function} dataProvider API call
 * @param {string} resource API URL
 * @returns {*} payload object
 */
export const fetchTemplateValues = async (payload, dataProvider, resource) => {
  const { data } = await dataProvider.getData(resource, payload);
  const dateRanges = data?.data?.map((range) => {
    return {
      dateValue: range.configName
        ? `${range.configName}: ${range.fromDate} to ${range.thruDate}`
        : `${range.fromDate} to ${range.thruDate}`,
      dateObject: range,
    };
  });
  return dateRanges;
};
