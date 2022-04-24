import React from "react";
import CustomerDeliveryForm from "../CustomerDeliveryForm/CustomerDeliveryForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";

/**
 * Customer Delivery Charges view component
 *
 * @returns {React.ReactElement} view Customer Delivery Charges
 */
const CustomerDeliveryChargesView = () => {
  const initialState = {
    domain: "fnp.com",
    geo: "India",
    configurationCode: "con_01",
    geoGroup: "Mumbai",
    shippingMethodName: "Morning Delivery",
    productType: ["100-flowers-stems"],
    timeSlot: ["9pm-10pm", "10pm-11pm"],
    customerDeliveryCharges: 50,
    currency: "INR",
    isEnabled: true,
    currencyOptions: [{ id: "INR", name: "INR" }],
  };
  return <CustomerDeliveryForm initialState={initialState} mode={NIFTY_PAGE_TYPE.VIEW} pageTitle="con_01" />;
};

export default React.memo(CustomerDeliveryChargesView);
