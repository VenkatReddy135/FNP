/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PromotionDataLayout from "../PromotionDataLayout";

/**
 *
 * @function PromotionEdit Component used to show new fields based on selected form.
 * @param {object} props required props for the component
 * @returns {React.Component} return react component.
 */
const PromotionEdit = (props) => {
  return <PromotionDataLayout edit {...props} data-testid="promotion_edit" />;
};
export default PromotionEdit;
