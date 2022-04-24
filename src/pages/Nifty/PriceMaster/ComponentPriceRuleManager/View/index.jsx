import React from "react";
import ComponentPriceRuleManagerForm from "../ComponentPriceRuleManagerForm";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

/**
 * Component Price Rule Manager view component
 *
 * @returns {React.ReactElement} view Component Price Rule Manager
 */
const ComponentPriceRuleManagerView = () => {
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

  return <ComponentPriceRuleManagerForm initialState={initialState} mode={NIFTY_PAGE_TYPE.VIEW} pageTitle="rule_1" />;
};

export default React.memo(ComponentPriceRuleManagerView);
