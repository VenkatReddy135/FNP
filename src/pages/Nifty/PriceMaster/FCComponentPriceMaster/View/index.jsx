/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import FCComponentPriceMasterForm from "../FCComponentPriceMasterForm";

/**
 * FC-Component Price Master view component
 *
 * @returns {React.ReactElement} view FC-Component Price Master
 */
const FCComponentPriceMasterView = () => {
  const initialState = {
    fulFillmentGeo: "INDIA",
    fcGroupName: "Delhi Flower Vendor",
    fcGroupId: "FC_0021",
    componentName: "Red-Roses",
    price: "50",
    currency: "INR",
    status: true,
    fromDate: "2022-01-12",
    toDate: "2022-05-12",
    currencyOptions: [],
  };

  /**
   * @function deleteFCComponentPriceMaster callback function to delete FC Component Price Master
   * @param {object} data form data
   */
  const deleteFCComponentPriceMaster = useCallback((data) => {
    console.log(data);
  });

  return (
    <FCComponentPriceMasterForm
      initialState={initialState}
      mode="view"
      pageTitle="Delhi Flower Vendor"
      handleAction={deleteFCComponentPriceMaster}
    />
  );
};

export default React.memo(FCComponentPriceMasterView);
