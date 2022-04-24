import PropTypes from "prop-types";
import React from "react";
import { BooleanInput } from "react-admin";
/**
 * Component for boolean toggle compatible with react-admin simple form
 *
 * @param {*} props all the props required for toggle
 * @returns {React.ReactElement} returns a React component for toggle
 */
const SwitchComp = (props) => {
  const { enabledForEdit, record, name } = props;
  /**
   * checker function for form enabled to edit
   *
   * @returns {boolean} check for disabled value
   */
  const disableChecker = () => {
    if (!enabledForEdit) {
      return true;
    }
    return false;
  };

  const overlayStyling = {
    pointerEvents: disableChecker() === true ? "none" : "unset",
  };

  return (
    <div style={overlayStyling}>
      <BooleanInput name={name} defaultValue={record} />
    </div>
  );
};

SwitchComp.propTypes = {
  record: PropTypes.bool,
  enabledForEdit: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

SwitchComp.defaultProps = {
  record: false,
};

export default SwitchComp;
