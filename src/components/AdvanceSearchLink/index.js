/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import useStyles from "../../assets/theme/common";
/**
 * Component for creating advance search link
 *
 * @param {object} props all the props are optional
 * @returns {React.ReactElement} returns a React component with Link.
 */
const TextField = (props) => {
  const classes = useStyles();
  const { isFilterSet, clearFilter, clearLabel, advanceSearchLabel, listingPagePath, advanceSearchPagePath } = props;

  return (
    <div className={classes.redirectLink}>
      {isFilterSet && (
        <Link className={`${classes.search} ${classes.label}`} to={listingPagePath} onClick={clearFilter}>
          {clearLabel}
        </Link>
      )}
      <Link className={`${classes.search} ${classes.label}`} to={advanceSearchPagePath}>
        {advanceSearchLabel}
      </Link>
    </div>
  );
};

TextField.propTypes = {
  isFilterSet: PropTypes.objectOf(PropTypes.any),
  clearFilter: PropTypes.func,
  clearLabel: PropTypes.string,
  advanceSearchLabel: PropTypes.string,
  listingPagePath: PropTypes.string,
  advanceSearchPagePath: PropTypes.string,
};
TextField.defaultProps = {
  isFilterSet: null,
  clearFilter: () => {},
  clearLabel: "",
  advanceSearchLabel: "",
  listingPagePath: "",
  advanceSearchPagePath: "",
};
export default TextField;
