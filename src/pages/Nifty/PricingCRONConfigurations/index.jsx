import React from "react";
import Grid from "@material-ui/core/Grid";

/**
 * Pricing CRON Configurations component
 *
 * @returns {React.ReactElement} pricing CRON configurations details
 */
const PricingCRONConfigurations = () => {
  return (
    <>
      <Grid container spacing={2} data-test-id="form-container">
        <div>PricingCRONConfigurations page</div>
      </Grid>
    </>
  );
};

export default React.memo(PricingCRONConfigurations);
