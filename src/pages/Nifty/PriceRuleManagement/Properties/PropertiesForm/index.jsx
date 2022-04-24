/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { FormWithRedirect, TextInput, DateInput, BooleanInput, useTranslate, regex, required } from "react-admin";
import { makeStyles, Grid } from "@material-ui/core";
import { NIFTY_PAGE_TYPE, priceRuleNameRegex } from "../../../niftyConfig";
import useNiftyStyles from "../../../niftyStyle";
import useCommonStyles from "../../../../../assets/theme/common";
import { minValue } from "../../../../../utils/validationFunction";

const useStyles = makeStyles(() => ({
  priceRuleDescriptionField: {
    width: "550px",
  },
}));

/**
 * Properties Form component
 *
 *  @param {object} props form data
 * @returns {React.ReactElement} create Properties form
 */
const PropertiesForm = (props) => {
  const { initialState, mode } = props;
  const translate = useTranslate();
  const niftyClasses = useNiftyStyles();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [input, setInput] = useState(initialState);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode, NIFTY_PAGE_TYPE]);
  const validationMessage = translate("priceRuleManagement.pricing_rule_name_validation");
  const [PropertiesObj, updatePropertiesObj] = useState(initialState);
  const validatePriceRuleName = regex(priceRuleNameRegex, validationMessage);
  const requiredValidate = required();

  /**
   *@function handleFromDateChange function called on change of From date in Properties Page
   *@param {string} event event called on change of From date
   */
  const handleFromDateChange = useCallback(
    (event) => {
      updatePropertiesObj({
        ...PropertiesObj,
        fromDate: event.target.value,
      });
    },
    [PropertiesObj],
  );
  /**
   *@function handleToDateChange function called on change of To date in Properties page
   *@param {string} event event called on change of To date
   */
  const handleToDateChange = useCallback(
    (event) => {
      updatePropertiesObj({
        ...PropertiesObj,
        toDate: event.target.value,
      });
    },
    [PropertiesObj],
  );
  /**
   * @function savePriceRuleManagementProperties function called on click of Continue button
   * @param {object} propertiesObj updated input values
   */
  const savePriceRuleManagementProperties = (propertiesObj) => {
    setInput({ ...input, ...propertiesObj });
  };

  return (
    <>
      <FormWithRedirect
        initialValues={initialState}
        save={savePriceRuleManagementProperties}
        render={() => (
          <form>
            {memoizedIsCreate && (
              <>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="flex-start"
                  className={commonClasses.customMargin}
                  justify="space-between"
                  md={8}
                >
                  <Grid item container md>
                    <TextInput
                      source="pricingRuleName"
                      label={translate("priceRuleManagement.pricing_rule_name")}
                      data-test-id="PricingRuleName"
                      validate={[validatePriceRuleName, requiredValidate]}
                      autoComplete="off"
                      variant="standard"
                      margin="normal"
                      className={`${niftyClasses.basicField}`}
                    />
                  </Grid>
                  <Grid item container md>
                    <TextInput
                      source="pricingRuleDescription"
                      label={translate("priceRuleManagement.pricing_rule_description")}
                      data-test-id="PricingRuleDescription"
                      validate={[validatePriceRuleName, requiredValidate]}
                      autoComplete="off"
                      variant="standard"
                      margin="normal"
                      className={`${classes.priceRuleDescriptionField}`}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  alignItems="flex-start"
                  justify="space-between"
                  className={commonClasses.customMargin}
                  md={9}
                >
                  <Grid item container md>
                    <DateInput
                      source="fromDate"
                      data-test-id="fromDate"
                      label={translate("priceRuleManagement.start_date")}
                      margin="normal"
                      variant="standard"
                      onChange={handleFromDateChange}
                      validate={requiredValidate}
                      className={`${niftyClasses.basicField}`}
                    />
                  </Grid>
                  <Grid item md>
                    <DateInput
                      source="toDate"
                      data-test-id="toDate"
                      label={translate("priceRuleManagement.end_date")}
                      margin="normal"
                      variant="standard"
                      onChange={handleToDateChange}
                      validate={minValue(
                        PropertiesObj.fromDate,
                        translate("priceRuleManagement.end_date_validation_message"),
                      )}
                      className={`${niftyClasses.basicField}

                }`}
                    />
                  </Grid>
                  <Grid item md>
                    <BooleanInput
                      source="isEnabled"
                      data-test-id="isEnabled"
                      label={translate("is_enabled")}
                      className={`${niftyClasses.basicSwitchButton} ${niftyClasses.disableBorder}}`}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </form>
        )}
      />
    </>
  );
};

PropertiesForm.propTypes = {
  mode: PropTypes.string.isRequired,
  initialState: PropTypes.objectOf(PropTypes.any),
};
PropertiesForm.defaultProps = {
  initialState: {},
};

export default React.memo(PropertiesForm);
