import React from "react";
import PropTypes from "prop-types";
import useStyles from "../../../assets/theme/common";

/**
 * Function to convert array of string and array of object into string values to display in grid
 *
 * @name CustomSourceData
 * @param {object} props - Passing record, source and field values
 * field is name of array of objects
 * @returns {React.ReactElement} returns a List of elementary component
 */
const CustomSourceData = (props) => {
  const { record, source, field } = props;
  const classes = useStyles();
  let data;
  let value;
  if (field && record[field] !== undefined) {
    data = record[field]?.map((item, index) => {
      const keyValue = index;
      value = item[source];
      return (
        <div key={keyValue} className={classes.customSourceDataSpan}>
          {value ? (
            <>
              <span title={value}>{value}</span>
              <br />
            </>
          ) : (
            <br />
          )}
        </div>
      );
    });
  } else {
    value = record[source];
    data = value ? <span title={value.join(" , ")}>{value.join(" , ")}</span> : "";
  }
  return data;
};

CustomSourceData.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  source: PropTypes.string.isRequired,
};

export default CustomSourceData;
