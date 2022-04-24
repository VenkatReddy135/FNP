/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import ComponentPriceRuleManagerForm from "../ComponentPriceRuleManagerForm";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

/**
 * Component Price Rule Manager edit component
 *
 * @returns {React.ReactElement} edit Component Price Rule Manager
 */
const ComponentPriceRuleManagerEdit = () => {
  const initialState = {
    ruleName: "Abc123",
    fulfillmentGeo: "INDIA",
    FCGroupId: ["FC_123"],
    ruleAppliedOn: "Component Names",
    componentValues: ["flowers"],
    fromDate: "2021-06-10T21:32:36",
    toDate: "2021-09-30T21:32:36",
    overrideType: "Flat Amount Update",
    overrideValue: "10",
    currency: "INR",
    state: "Pending",
    currencyOptions: [],
  };

  /**
   * @function editPriceRule callback function to update Component Price Rule Manager
   * @param {object} data form data
   */
  const editPriceRule = useCallback((data) => {
    console.log(data);
  });

  return (
    <ComponentPriceRuleManagerForm
      initialState={initialState}
      onSave={editPriceRule}
      mode={NIFTY_PAGE_TYPE.EDIT}
      pageTitle="rule_1"
    />
  );
};

export default React.memo(ComponentPriceRuleManagerEdit);
