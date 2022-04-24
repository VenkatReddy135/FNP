/**
 * Function to set convert local date to UTC date format "dd/mm/yyyy"
 *
 * @function formatDate
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC date according to the date passed.
 */
export function formatDate(date) {
  const dateFormat = new Date(date).toLocaleDateString();
  return dateFormat;
}

/**
 * Function to set convert local time to UTC date format "hh:mm:ss"
 *
 * @function formatTime
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC time according to the date passed.
 */
export function formatTime(date) {
  const timeFormat = new Date(date).toLocaleTimeString();
  return timeFormat;
}

/**
 * Function to set convert local Date Time to UTC date time format "dd/mm/yyyy, hh:mm:ss"
 *
 * @function formatTime
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC time according to the date passed.
 */
export function formatDateTime(date) {
  const dateTimeFormat = new Date(date).toLocaleString();
  return dateTimeFormat;
}
/**
 *
 * @function converts date to required format
 * @param {string} dateValue string
 * @returns {string} required format
 */
export function getFormattedDateValue(dateValue) {
  return `${dateValue.getDate() < 10 ? `0${dateValue.getDate()}` : dateValue.getDate()}
  /
    ${dateValue.getMonth() + 1 < 10 ? `0${dateValue.getMonth() + 1}` : dateValue.getMonth() + 1}
    /
    ${dateValue.getFullYear()}`;
}

/**
 * @function converts time to required format
 * @param {dateVal} dateVal take input date
 * @returns {string} required format
 */
export const getFormattedTimeValue = (dateVal) => {
  const dateValue = dateVal || new Date();
  const hours = `0${dateValue.getHours()}`;
  const minutes = `0${dateValue.getMinutes()}`;
  const seconds = `0${dateValue.getSeconds()}`;
  return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
};
/**
 *
 * @function formattedDate
 * @param {string} dateVal string
 * @returns {string} required format
 */
function formatDateValue(dateVal) {
  if (dateVal) {
    const dateValue = new Date(dateVal);
    const dateFormat = dateValue ? getFormattedDateValue(dateValue) : "";
    const timeFormat = dateValue ? getFormattedTimeValue(dateValue) : "";
    return `${dateFormat} ${timeFormat}`;
  }
  return false;
}

export default formatDateValue;

/**
 * @function getFormattedDate function returns the date in YYYY-MM-DD format
 * @param {*} date record from date value that needs to be formatted
 * @returns {string} returns formatted date
 */
export const getFormattedDate = (date) => {
  if (date) {
    const splitDateAndTime = date.split("T");
    return splitDateAndTime[0];
  }
  return date;
};

/**
 * @function fetchDateString function returns the date in YYYY-MM-DD format
 * @param {*} date record from date value that needs to be formatted
 * @returns {string} returns formatted date
 */
export const fetchDateString = (date) => {
  if (date) {
    const mm = new Date(date).getMonth() + 1;
    const dd = new Date(date).getDate();
    const formattedMonth = mm < 10 ? `0${mm}` : mm;
    const formattedDay = dd < 10 ? `0${dd}` : dd;
    const formattedDate = `${new Date(date).getFullYear()}-${formattedMonth}-${formattedDay}`;
    return formattedDate;
  }
  return date;
};
/**
 * @function getNextDate function to get the Next date value for a given date
 * @param {string} date the date whose next date you want as result
 * @returns {string} returns the day by adding + 1 day to that particular date
 */
export const getNextDate = (date) => {
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() + 1);
  return previousDate.toISOString().substr(0, 10);
};

/**
 *@function pastDateValidation to validate the past date and gives message
 * @param {string} message date value to be validated
 * @returns {(string | undefined)} error message or undefined
 */
export const pastDateValidation = (message) => (value) =>
  (value && fetchDateString(new Date(value)) < fetchDateString(new Date())) ||
  (value && new Date(value).getTime() <= new Date().getTime())
    ? message
    : undefined;

/**
 * Function to set convert local date to UTC date format "dd/mm/yyyy"
 *
 * @function TformattedDateConverter
 * @param  {Date} date  object details related to button event
 * @returns {Date} string UTC date according to the date passed.
 */
export function TformattedDateConverter(date) {
  const converted = date.concat("T", getFormattedTimeValue());
  return converted;
}
