import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
/**
 * Component for CustomDateField contains a date field conversion
 *
 * @param {*} props all the props needed for CustomDateField
 * @returns {string} returns formatted date
 */
const CustomDateField = (props) => {
  const { record, source, externalStyle } = props;
  let date = null;

  /**
   *
   * @function converts date to required format
   * @param {*} dateValue string
   * @returns {string} required format
   */
  function getFormattedDateValue(dateValue) {
    return `${dateValue.getDate() < 10 ? `0${dateValue.getDate()}` : dateValue.getDate()}
    /
     ${dateValue.getMonth() + 1 < 10 ? `0${dateValue.getMonth() + 1}` : dateValue.getMonth() + 1}
     /
     ${dateValue.getFullYear()}`;
  }

  /**
   *
   * @function converts time to required format
   * @param {*} dateValue string
   * @returns {string} required format
   */
  function getFormattedTimeValue(dateValue) {
    const hours = `0${dateValue.getHours()}`;
    const minutes = `0${dateValue.getMinutes()}`;
    const seconds = `0${dateValue.getSeconds()}`;
    return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
  }
  /**
   *
   * @function formattedDate
   * @param {*} dateVal string
   * @returns {string} required format
   */
  function formattedDate(dateVal) {
    if (dateVal) {
      const dateValue = new Date(dateVal);
      const dateFormat = dateValue ? getFormattedDateValue(dateValue) : "";
      const timeFormat = dateValue ? getFormattedTimeValue(dateValue) : "";
      return `${dateFormat} ${timeFormat}`;
    }
    return false;
  }
  date = formattedDate(get(record, source));
  let updatedDate = date;
  if (externalStyle && externalStyle(record)) {
    updatedDate = <div style={externalStyle(record)}>{date}</div>;
  }
  return updatedDate;
};

CustomDateField.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  source: PropTypes.string.isRequired,
  externalStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

CustomDateField.defaultProps = {
  record: {},
  externalStyle: false,
};

export default React.memo(CustomDateField);
