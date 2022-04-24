/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";

import ServiceProviderViewUI from "./ServiceProviderViewUI";

/**
 * Component for Service Provider View contains functional page for service provider UI.
 *
 * @param {object} props all the props needed for Service Provider details.
 * @returns {React.ReactElement} returns Service Provider Details.
 */
const ServiceProviderView = (props) => {
  const { match } = props;
  const { id } = match.params;

  return <ServiceProviderViewUI {...props} id={id} />;
};

ServiceProviderView.propTypes = {
  id: PropTypes.string.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ServiceProviderView;
