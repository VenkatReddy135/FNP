import React from "react";
import PropertiesForm from "./PropertiesForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";

/**
 * Price Rule Management properties component
 *
 * @returns {React.ReactElement} properties price rule management
 */
const PriceRuleManagementProperties = () => {
  const initialState = {
    pricingRuleName: "",
    pricingRuleDescription: "",
    fromDate: "",
    toDate: "",
    isEnabled: true,
  };
  return <PropertiesForm initialState={initialState} mode={NIFTY_PAGE_TYPE.CREATE} />;
};

export default React.memo(PriceRuleManagementProperties);
