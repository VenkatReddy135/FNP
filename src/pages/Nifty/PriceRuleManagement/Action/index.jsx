import React from "react";
import ActionForm from "./ActionForm";
import { DEFAULT_IN_OPERATOR, NIFTY_PAGE_TYPE } from "../../niftyConfig";

/**
 * Price Rule Management action component
 *
 * @returns {React.ReactElement} action price rule management
 */
const PriceRuleManagementAction = () => {
  const initialState = {
    percentOff: "",
    percentOffOperator: DEFAULT_IN_OPERATOR,
    flatOff: "",
    flatOffOperator: DEFAULT_IN_OPERATOR,
    fixedPrice: "",
    fixedPriceOperator: DEFAULT_IN_OPERATOR,
  };
  return <ActionForm initialState={initialState} mode={NIFTY_PAGE_TYPE.CREATE} />;
};

export default React.memo(PriceRuleManagementAction);
