/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import ComponentPriceRuleManagerForm from "../ComponentPriceRuleManagerForm";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

/**
 * Component Price Rule Manager create component
 *
 * @returns {React.ReactElement} create Component Price Rule Manager
 */
const ComponentPriceRuleManagerCreate = () => {
  const history = useHistory();
  const initialState = {
    ruleName: "",
    fulfillmentGeo: "",
    FCGroupId: "",
    ruleAppliedOn: "Component Names",
    componentValues: "",
    overrideType: "Flat Amount Update",
    overrideValue: "",
    fromDate: "",
    toDate: "",
    currency: "",
    state: "Pending",
    currencyOptions: [],
  };

  /**
   * @function createPriceRule  callback function to create Component Price Rule Manager
   * @param {object} data form data
   */
  const createPriceRule = useCallback((data) => {
    console.log(data);
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/price-master`);
  });

  return (
    <ComponentPriceRuleManagerForm initialState={initialState} onSave={createPriceRule} mode={NIFTY_PAGE_TYPE.CREATE} />
  );
};

export default React.memo(ComponentPriceRuleManagerCreate);
