/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import FCComponentPriceMasterForm from "../FCComponentPriceMasterForm";

/**
 * FC-Component Price Master edit component
 *
 * @returns {React.ReactElement} edit FC-Component Price Master
 */
const FCComponentPriceMasterEdit = () => {
  const initialState = {
    fulFillmentGeo: "INDIA",
    fcGroupName: "Delhi Flower Vendor",
    fcGroupId: "FC_0021",
    componentName: "Red-Roses",
    price: "50",
    currency: "INR",
    currencyOptions: [],
    status: true,
    fromDate: "2022-01-12",
    toDate: "",
  };

  /**
   * @function updateFCComponentPriceMaster callback function to update FC Component Price Master
   * @param {object} data form data
   */
  const updateFCComponentPriceMaster = useCallback((data) => {
    console.log(data);
  });

  return (
    <FCComponentPriceMasterForm
      initialState={initialState}
      mode="edit"
      pageTitle="Delhi Flower Vendor"
      handleAction={updateFCComponentPriceMaster}
    />
  );
};

export default React.memo(FCComponentPriceMasterEdit);
