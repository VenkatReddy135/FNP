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
const CustomerDeliveryChargesCreate = () => {
  const history = useHistory();
  const initialState = {
    domain: "",
    geo: "",
    configurationCode: "",
    geoGroup: "",
    shippingMethodName: "",
    productType: [],
    timeSlot: [],
    customerDeliveryCharges: "",
    currency: "",
    isEnabled: true,
    currencyOptions: [],
  };

  /**
   * @function createCustomerDeliveryCharges callback function to create Customer Delivery Charge
   * @param {object} data form data
   */
  const createCustomerDeliveryCharges = useCallback((data) => {
    console.log(data);
    history.goBack();
  });

  return (
    <CustomerDeliveryForm
      initialState={initialState}
      onSave={createCustomerDeliveryCharges}
      mode={NIFTY_PAGE_TYPE.CREATE}
    />
  );
};

export default React.memo(CustomerDeliveryChargesCreate);
