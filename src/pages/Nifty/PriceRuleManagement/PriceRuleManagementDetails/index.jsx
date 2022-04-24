import React, { useState, useCallback } from "react";
import { useTranslate } from "react-admin";
import { Chip, Divider, Grid, Typography } from "@material-ui/core";
import useCommonStyles from "../../../../assets/theme/common";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Stepper from "../../../../components/Stepper";
import PriceRuleManagementProperties from "../Properties";
import PriceRuleManagementAction from "../Action";

/**
 * Price Rule Management Details component
 *
 * @returns {React.ReactElement} price rule management details
 */
const PriceRuleManagementDetails = () => {
  const translate = useTranslate();
  const commonClasses = useCommonStyles();
  const [stepCount, setStepCount] = useState(0);

  const breadcrumbs = [
    {
      displayName: translate("priceRuleManagement.price_rule_management"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/price-rule-management`,
    },
    { displayName: translate("priceRuleManagement.new_price_rule") },
  ];

  const priceRuleSteps = [<PriceRuleManagementProperties />, <PriceRuleManagementAction />];

  const priceRuleLabels = [
    <Chip label={translate("priceRuleManagement.properties")} href="#chip" variant="outlined" />,
    <Chip label={translate("priceRuleManagement.action")} href="#chip" variant="outlined" />,
  ];

  /**
   * @function handleNextStepCount function to set next step count
   * @param {event} event next step count
   */
  const handleNextStepCount = useCallback((event) => {
    setStepCount(event + 1);
  }, []);

  /**
   * @function handlePrevStepCount function to set previous step count
   * @param {event} event step count
   */
  const handlePrevStepCount = useCallback((event) => {
    setStepCount(event - 1);
  }, []);

  console.log(stepCount);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item className={commonClasses.gridStyle}>
        <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
          {translate("priceRuleManagement.new_price_rule")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" />
      <Stepper
        StepsArray={priceRuleSteps}
        LabelsArray={priceRuleLabels}
        prev={translate("prev")}
        next={translate("next")}
        create={translate("create")}
        createData={() => {}}
        isDisable={false}
        handleNextSteps={handleNextStepCount}
        handlePrevSteps={handlePrevStepCount}
      />
    </>
  );
};

export default React.memo(PriceRuleManagementDetails);
