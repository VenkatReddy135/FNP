import PropTypes from "prop-types";
import React from "react";
import { Switch } from "@material-ui/core";
import get from "lodash/get";

/**
 * Component for boolean switch for displaying enabled/disabled field.
 *
 * @param {*} props all the props required for switch
 * @returns {React.ReactElement} returns a React component for switch.
 */
const SwitchComp = (props) => {
  const { disable, record, compareKey, trueValue, onChange } = props;
  /**
   * function for updating switch value
   *
   * @returns {Function} a callback function
   * @param {object} event DOM object for onChange event
   */
  const updateSwitch = (event) => {
    return onChange ? onChange(event.target.checked, record) : null;
  };

  /**
   * function for initial value of status field
   *
   * @returns {object} returns value
   */
  const getInitialValue = () => {
    return get(record, compareKey) === trueValue;
  };
  if (typeof record === "object") {
    return (
      <Switch
        checked={getInitialValue()}
        data-at-id="switch"
        color="default"
        disabled={disable}
        onChange={updateSwitch}
      />
    );
  }
  return <Switch checked={record} data-at-id="switch" color="default" disabled={disable} onChange={updateSwitch} />;
};

SwitchComp.propTypes = {
  record: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  disable: PropTypes.bool,
  compareKey: PropTypes.string,
  trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func,
};
SwitchComp.defaultProps = {
  onChange: () => {},
  compareKey: "isEnabled",
  trueValue: true,
  disable: false,
};
export default React.memo(SwitchComp);
