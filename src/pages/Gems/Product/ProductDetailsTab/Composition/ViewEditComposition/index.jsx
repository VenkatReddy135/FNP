/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import ViewEditCompositionUI from "./ViewEditCompositionUI";

/**
 * Component to render the View/Edit Page of Product Composition
 *
 * @param  {*} props  all the props required by the Product Composition - View/Edit
 * @returns {React.ReactElement} returns the View/Edit Page of Product Composition
 */
const ViewEditComposition = (props) => {
  const { match, isEditable } = props;
  return <ViewEditCompositionUI match={match} isEditable={isEditable} />;
};

ViewEditComposition.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool.isRequired,
};
export default ViewEditComposition;
