import PropTypes from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";
import useStyles from "./UrlComponent";

/**
 *
 * @param {string} path url as string
 * @param {Array} record array
 * @returns {string} returns a dynamic string with replaced params
 */
const generatePathWithDynamicResources = (path, record) => {
  let pathArr = path.split(new RegExp(/([:]*\/)/));
  pathArr = pathArr.map((item) => {
    if (item.startsWith(":")) {
      return record[item.split(":")[1]];
    }
    return item;
  });
  return pathArr.join("");
};
/**
 *
 * @param {string} path url as string
 * @param {Array} record array
 * @returns {string} a query string
 */
const generateQueryWithDynamicResources = (path, record) => {
  return Object.keys(path)
    .map((key) => `${key}=${record[path[key]]}`)
    .join("&");
};

/**
 * Component for creating url component
 *
 * @param {object} props all the props required for UrlComponent
 * @returns {React.ReactElement} returns a React component with Link.
 */
const UrlComponent = (props) => {
  const { record, source, customPath, basePathValue, customPathSource, customQuerySource } = props;

  const classes = useStyles();

  const value = record && record[source];

  if (value == null) {
    return null;
  }

  const linkValue =
    record && (customPathSource ? generatePathWithDynamicResources(customPathSource, record) : record[source]);

  const queryValue = record && customQuerySource && generateQueryWithDynamicResources(customQuerySource, record);

  return (
    <Link
      className={classes.urlComponent}
      to={{
        pathname: customPath || (basePathValue ? `/${basePathValue}/${linkValue}` : `/${linkValue}`),
        search: queryValue,
      }}
    >
      {value}
    </Link>
  );
};

UrlComponent.propTypes = {
  record: PropTypes.objectOf(PropTypes.string),
  source: PropTypes.string,
  customPath: PropTypes.string,
  basePathValue: PropTypes.string,
  customPathSource: PropTypes.string,
  customQuerySource: PropTypes.objectOf(PropTypes.string),
};

UrlComponent.defaultProps = {
  record: {},
  customPath: "",
  source: "",
  basePathValue: "",
  customPathSource: "",
  customQuerySource: {},
};

export default UrlComponent;
