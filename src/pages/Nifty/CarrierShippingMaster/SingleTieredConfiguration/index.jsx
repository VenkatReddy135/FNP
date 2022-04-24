import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import { BooleanInput, NumberInput, required, useTranslate } from "react-admin";
import { handleInvalidCharsInNumberInput } from "../../../../utils/validationFunction";
import useCommonStyles from "../../../../assets/theme/common";
import SwitchComp from "../../../../components/switch";
import { positiveValidate, NIFTY_PAGE_TYPE } from "../../niftyConfig";
import useNiftyStyles from "../../niftyStyle";

/**
 * Single Tiered Configuration component
 *
 * @param {object}  props properties of a component
 * @returns {React.ReactElement} returns Single Tiered Configuration
 */
const SingleTieredConfiguration = (props) => {
  const { mode, formRef } = props;
  const translate = useTranslate();
  const niftyClasses = useNiftyStyles();
  const commonClasses = useCommonStyles();
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode]);
  return (
    <>
      <Grid
        container
        item
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        className={commonClasses.customMargin}
        md={6}
      >
        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
          <NumberInput
            source="singleTieredConfig.rate"
            label={translate("carrierShippingPriceMaster.rate")}
            data-test-id="rate"
            validate={[required(), positiveValidate(translate("carrierShippingPriceMaster.positive_validation"))]}
            className={commonClasses.numberInputField}
            onKeyDown={handleInvalidCharsInNumberInput}
            autoComplete="Off"
            variant="standard"
            margin="normal"
            disabled={memoizedIsView}
          />
        </Grid>
        <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
          {memoizedIsView ? (
            <>
              <Typography variant="caption">{translate("carrierShippingPriceMaster.is_enabled")}</Typography>
              <Grid item className={commonClasses.disableButton}>
                <SwitchComp disable record={formRef?.getState().values.singleTieredConfig.isEnabled} />
              </Grid>
            </>
          ) : (
            <BooleanInput
              data-test-id="isEnabled"
              label={translate("carrierShippingPriceMaster.is_enabled")}
              source="singleTieredConfig.isEnabled"
              className={niftyClasses.basicSwitchButton}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

SingleTieredConfiguration.propTypes = {
  mode: PropTypes.string,
  formRef: PropTypes.objectOf(PropTypes.any),
};

SingleTieredConfiguration.defaultProps = {
  mode: "",
  formRef: null,
};
export default React.memo(SingleTieredConfiguration);
