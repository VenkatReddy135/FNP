/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PromotionDataLayout from "../PromotionDataLayout";

/**
 *
 * @function PromotionShow Component used to show new fields based on selected form.
 * @param {object} props required props for the component
 * @returns {React.Component} return react component.
 */
const PromotionShow = (props) => {
  return <PromotionDataLayout edit={false} {...props} data-testid="promotion_show" />;
};
export default PromotionShow;
