/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BasePriceForm from "../BasePriceForm/BasePriceForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";

/**
 * Customer Delivery Charges view component
 *
 * @returns {React.ReactElement} view customer delivery charges
 */
const BasePriceView = () => {
  const { id } = useParams();
  const initialState = {
    modelId: "",
    geography: "",
    salesPercentage: "",
    deliveryCharges: "",
    lookBackPeriod: "Number of Days",
    fromDate: "",
    numberOfDays: "",
    ppCalculationMethod: "",
    ceilingAmount: "",
    fallBackCarrierCharges: "",
    includeDeliveryCharge: "Yes",
    currency: "",
    status: true,
    currencyOptions: [],
    isLoading: true,
  };
  const [basePriceDetails, setBasePriceDetails] = useState(initialState);

  /**
   * @function handleSuccess This function will handle the success scenario
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    const res = response?.data;
    let basePriceData;
    if (response) {
      basePriceData = {
        modelId: res?.id.trim() || "",
        geography: res?.geo.trim() || "",
        salesPercentage: res?.salesPercentage || "",
        deliveryCharges: res?.deliveryCharge || "",
        lookBackPeriod: "Number of Days",
        numberOfDays: res?.lookbackPeriod || "",
        ppCalculationMethod: res?.ppCalculationMethod || "",
        ceilingAmount: res?.ceiling || "",
        fallBackCarrierCharges: res?.fallbackCourierCharge || "",
        includeDeliveryCharge: res?.isDcInWp ? "Yes" : "No",
        currency: res?.currency,
        currencyOptions: [{ id: res.currency, name: res.currency }],
        status: res?.isEnabled,
      };
    }
    setBasePriceDetails((prevState) => ({ ...prevState, ...basePriceData }));
  };

  useCustomQueryWithStore("getOne", `${window.REACT_APP_NIFTY_SERVICE}/base-price-model/${id}`, handleSuccess);

  return <BasePriceForm initialState={basePriceDetails} mode={NIFTY_PAGE_TYPE.VIEW} pageTitle={id} />;
};
export default React.memo(BasePriceView);
