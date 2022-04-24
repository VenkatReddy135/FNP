/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";
import FCComponentPriceMasterForm from "../FCComponentPriceMasterForm";

/**
 * FC-Component Price Master create component
 *
 * @returns {React.ReactElement} create FC-Component Price Master
 */
const FCComponentPriceMasterCreate = () => {
  const initialState = {
    fulFillmentGeo: "",
    fcGroupName: "",
    fcGroupId: "",
    componentName: "",
    price: "",
    currency: "",
    status: true,
    fromDate: "",
    toDate: "",
    currencyOptions: [],
  };

  /**
   * @function createFCComponentPriceMaster callback function to update FC Component Price Master
   * @param {object} data form data
   */
  const createFCComponentPriceMaster = useCallback((data) => {
    console.log(data);
  });

  return (
    <FCComponentPriceMasterForm
      initialState={initialState}
      mode={NIFTY_PAGE_TYPE.CREATE}
      handleAction={createFCComponentPriceMaster}
    />
  );
};

export default React.memo(FCComponentPriceMasterCreate);
