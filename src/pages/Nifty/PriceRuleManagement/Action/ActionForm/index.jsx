/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FormWithRedirect, SelectInput, NumberInput, useTranslate } from "react-admin";
import { Grid } from "@material-ui/core";
import { handleInvalidCharsInNumberInput } from "../../../../../utils/validationFunction";
import { OPERATOR_LIST, NIFTY_PAGE_TYPE } from "../../../niftyConfig";
import useNiftyStyles from "../../../niftyStyle";
import useCommonStyles from "../../../../../assets/theme/common";

/**
 * Action Form component
 *
 *  @param {object} props form data
 * @returns {React.ReactElement} create action form
 */
const ActionForm = (props) => {
  const { initialState, mode } = props;
  const translate = useTranslate();
  const niftyClasses = useNiftyStyles();
  const commonClasses = useCommonStyles();
  const [input, setInput] = useState(initialState);
  const memoizedIsCreate = useMemo(() => mode === NIFTY_PAGE_TYPE.CREATE, [mode, NIFTY_PAGE_TYPE]);

  /**
   * @function savePriceRuleManagementAction function called on click of Continue button
   * @param {object} actionObj updated input values
   */
  const savePriceRuleManagementAction = (actionObj) => {
    setInput({ ...input, ...actionObj });
  };

  return (
    <>
      <FormWithRedirect
        initialValues={initialState}
        save={savePriceRuleManagementAction}
        render={() => (
          <form>
            {memoizedIsCreate && (
              <Grid container spacing={2} wrap="nowrap" direction="row" alignItems="center">
                <Grid item>
                  <SelectInput
                    data-test-id="percentOffOperator"
                    source="percentOffOperator"
                    label={translate("operator")}
                    variant="standard"
                    margin="normal"
                    choices={OPERATOR_LIST}
                    className={`${niftyClasses.configField} ${niftyClasses.disableBorder}`}
                  />
                </Grid>
                <Grid item>
                  <NumberInput
                    source="percentOff"
                    label={translate("priceRuleManagement.percent_off")}
                    data-test-id="percentOff"
                    variant="standard"
                    margin="normal"
                    onKeyDown={handleInvalidCharsInNumberInput}
                    className={`${commonClasses.numberInputField} ${niftyClasses.basicField}`}
                    autoComplete="Off"
                  />
                </Grid>
                <Grid item>
                  <SelectInput
                    data-test-id="flatOffOperator"
                    source="flatOffOperator"
                    label={translate("operator")}
                    variant="standard"
                    margin="normal"
                    choices={OPERATOR_LIST}
                    className={`${niftyClasses.configField} ${niftyClasses.disableBorder}`}
                  />
                </Grid>
                <Grid item>
                  <NumberInput
                    source="flatOff"
                    label={translate("priceRuleManagement.flat_off")}
                    data-test-id="flatOff"
                    variant="standard"
                    margin="normal"
                    onKeyDown={handleInvalidCharsInNumberInput}
                    className={`${commonClasses.numberInputField} ${niftyClasses.basicField}`}
                    autoComplete="Off"
                  />
                </Grid>
                <Grid item>
                  <SelectInput
                    data-test-id="fixedPriceOperator"
                    source="fixedPriceOperator"
                    label={translate("operator")}
                    variant="standard"
                    margin="normal"
                    choices={OPERATOR_LIST}
                    className={`${niftyClasses.configField} ${niftyClasses.disableBorder}`}
                  />
                </Grid>
                <Grid item>
                  <NumberInput
                    source="fixedPrice"
                    label={translate("priceRuleManagement.fixed_price")}
                    data-test-id="fixedPrice"
                    variant="standard"
                    margin="normal"
                    onKeyDown={handleInvalidCharsInNumberInput}
                    className={`${commonClasses.numberInputField} ${niftyClasses.basicField}`}
                    autoComplete="Off"
                  />
                </Grid>
              </Grid>
            )}
          </form>
        )}
      />
    </>
  );
};

ActionForm.propTypes = {
  mode: PropTypes.string.isRequired,
  initialState: PropTypes.objectOf(PropTypes.any),
};
ActionForm.defaultProps = {
  initialState: {},
};

export default React.memo(ActionForm);
