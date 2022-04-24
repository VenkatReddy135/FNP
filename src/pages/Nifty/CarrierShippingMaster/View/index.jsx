/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import CarrierShippingMasterForm from "../CarrierShippingForm";
import { NIFTY_PAGE_TYPE, INITIAL_SHIPPING_CONFIG } from "../../niftyConfig";

/**
 * Carrier Shipping Master component
 *
 * @returns {React.ReactElement} view carrier shipping master
 */
const CarrierShippingMasterView = () => {
  const initialState = {
    configurationCode: "abc",
    geo: "India",
    carrierName: "Carrier1",
    shippingRateTypeConfig: "Single Tiered",
    isEnabled: true,
    shippingRateType: "Flat Rate",
    fulfillmentCenter: "Center1",
    shippingMethodName: "Morning Delivery",
    currency: "USD",
    originGeo: "USA",
    uomTypes: "Box Size",
    uomValues: "Actual",
    geoGroup: ["delhi-ecda=[110011,110012]", "mumbai-ecda=[110011,110012]"],
    timeSlot: ["testStats"],
    currencyOptions: [{ id: "USD", name: "USD" }],
    singleTieredConfig: {
      rate: "500",
      isEnabled: true,
    },
    metric: "",
    configList: [{ ...INITIAL_SHIPPING_CONFIG }],
  };

  /**
   * @function updateShippingRate callback function to update Shipping Rate
   * @param {object} data form data
   */
  const updateShippingRate = useCallback((data) => {
    console.log(data);
  });

  return (
    <CarrierShippingMasterForm
      initialState={initialState}
      mode={NIFTY_PAGE_TYPE.VIEW}
      handleAction={updateShippingRate}
      pageTitle="Blue Dart"
    />
  );
};

export default React.memo(CarrierShippingMasterView);
