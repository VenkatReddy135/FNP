import PropTypes from "prop-types";
import React, { memo } from "react";
import get from "lodash/get";
import useStyles from "./LinkStyle";

/**
 * Component for Link Button
 *
 * @param {object} props all the props required for Link
 * @returns {React.ReactElement} returns a React component for Link.
 */
const LinkButton = (props) => {
  const { record, source, onClick, link, disable, compareKey, compareValue } = props;
  const classes = useStyles();

  /**
   * function for copying Link value
   *
   * @function  callback function
   */
  const updateLink = () => {
    if (onClick) {
      onClick(record);
    }
  };
  const sourceData = get(record, source);

  /**
   * function for disable or enable Link
   *
   * @returns {boolean} status
   */
  const getDisable = () => {
    if (compareKey && compareValue) {
      if (get(record, compareKey) === compareValue) {
        return disable;
      }
    }
    return !disable;
  };

  const value = !sourceData || getDisable();
  const unavailableLink = !sourceData && !getDisable();

  return (
    <button
      type="button"
      className={`${unavailableLink && classes.linkUnavailable} ${value ? classes.hide : classes.show}`}
      disabled={value ? !disable : disable}
      onClick={updateLink}
    >
      {link}
    </button>
  );
};

LinkButton.propTypes = {
  link: PropTypes.string.isRequired,
  record: PropTypes.objectOf(PropTypes.string).isRequired,
  source: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  compareKey: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
LinkButton.defaultProps = {
  onClick: () => {},
  disable: false,
  compareKey: "status",
  compareValue: "ACTIVE",
};
export default memo(LinkButton);
