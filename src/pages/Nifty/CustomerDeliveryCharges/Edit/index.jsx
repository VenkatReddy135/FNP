/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import CustomerDeliveryForm from "../CustomerDeliveryForm/CustomerDeliveryForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";

/**
 * Customer Delivery Charges edit component
 *
 * @returns {React.ReactElement} edit customer delivery charges
 */
const CustomerDeliveryChargesEdit = () => {
  const history = useHistory();
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

  /**
   * @function updateCustomerDeliveryCharges callback function to update Customer Delivery Charge
   * @param {object} data form data
   */
  const updateCustomerDeliveryCharges = useCallback((data) => {
    console.log(data);
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges`);
  });

  return (
    <CustomerDeliveryForm
      initialState={initialState}
      onSave={updateCustomerDeliveryCharges}
      mode={NIFTY_PAGE_TYPE.EDIT}
      pageTitle="con_01"
    />
  );
};

export default React.memo(CustomerDeliveryChargesEdit);
