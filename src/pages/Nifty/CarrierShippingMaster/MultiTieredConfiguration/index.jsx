import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Grid, IconButton, Typography } from "@material-ui/core";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  BooleanInput,
  NumberInput,
  required,
  SelectInput,
  useTranslate,
} from "react-admin";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { handleInvalidCharsInNumberInput } from "../../../../utils/validationFunction";
import useCommonStyles from "../../../../assets/theme/common";
import SwitchComp from "../../../../components/switch";
import { OPERATOR_LIST, NIFTY_PAGE_TYPE, positiveValidate, rangeValidate } from "../../niftyConfig";
import useNiftyStyles from "../../niftyStyle";

const requiredValidate = required();

/**
 * Shipping Rate Type Configuration component
 *
 * @param {object}  props create An component
 * @returns {React.ReactElement} edit/update shipping rate types
 */
const MultiTieredConfiguration = (props) => {
  const { sourceName, addConfig, deleteConfig, formRef, mode } = props;
  const classes = useNiftyStyles();
  const translate = useTranslate();
  const commonClasses = useCommonStyles();
  const memoizedIsView = useMemo(() => mode === NIFTY_PAGE_TYPE.VIEW, [mode]);

  return (
    <>
      <Grid container justify="flex-start" alignItems="center">
        <Grid item>
          <SelectInput
            data-test-id="metric"
            source="metric"
            label={translate("Metric")}
            variant="standard"
            margin="normal"
            choices={[
              { id: "pounds", name: "Pounds" },
              { id: "grams", name: "Grams" },
              { id: "kilograms", name: "Kilograms" },
            ]}
            className={`${classes.configField} ${classes.disableBorder}`}
            validate={[requiredValidate]}
            disabled={memoizedIsView}
          />
        </Grid>
      </Grid>
      <Grid container wrap="nowrap">
        <Grid item>
          <ArrayInput source={sourceName} label="">
            <SimpleFormIterator addButton={<></>} removeButton={<></>} className={classes.formIterator}>
              <FormDataConsumer>
                {({ scopedFormData, getSource }) => (
                  <Grid container spacing={2} wrap="nowrap" direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <SelectInput
                        data-test-id="fromOperator"
                        source={getSource("fromOperator")}
                        label={translate("operator")}
                        variant="standard"
                        margin="normal"
                        choices={OPERATOR_LIST}
                        className={`${classes.configField} ${classes.disableBorder}`}
                        disabled={memoizedIsView}
                      />
                    </Grid>
                    <Grid item>
                      <NumberInput
                        validate={[
                          requiredValidate,
                          positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                        ]}
                        source={getSource("fromRange")}
                        label={translate("carrierShippingPriceMaster.range_from")}
                        variant="standard"
                        margin="normal"
                        autoComplete="off"
                        className={`${classes.configField} ${commonClasses.numberInputField}`}
                        onKeyDown={handleInvalidCharsInNumberInput}
                        disabled={memoizedIsView}
                        data-test-id="fromRange"
                      />
                    </Grid>
                    <Grid item>
                      <SelectInput
                        data-test-id="toOperator"
                        source={getSource("toOperator")}
                        label={translate("operator")}
                        variant="standard"
                        margin="normal"
                        choices={OPERATOR_LIST}
                        className={`${classes.configField} ${classes.disableBorder}`}
                        disabled={memoizedIsView}
                      />
                    </Grid>
                    <Grid item>
                      <NumberInput
                        validate={[
                          requiredValidate,
                          positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                          rangeValidate(
                            formRef,
                            translate("carrierShippingPriceMaster.rate_range_validation"),
                            getSource("fromRange"),
                          ),
                        ]}
                        source={getSource("toRange")}
                        label={translate("carrierShippingPriceMaster.range_to")}
                        variant="standard"
                        margin="normal"
                        autoComplete="off"
                        className={`${classes.configField} ${commonClasses.numberInputField}`}
                        onKeyDown={handleInvalidCharsInNumberInput}
                        disabled={memoizedIsView}
                        data-test-id="toRange"
                      />
                    </Grid>
                    <Grid item>
                      <NumberInput
                        validate={[
                          requiredValidate,
                          positiveValidate(translate("carrierShippingPriceMaster.positive_validation")),
                        ]}
                        source={getSource("rate")}
                        label={translate("carrierShippingPriceMaster.rate")}
                        variant="standard"
                        margin="normal"
                        autoComplete="off"
                        className={`${classes.configField} ${commonClasses.numberInputField}`}
                        onKeyDown={handleInvalidCharsInNumberInput}
                        disabled={memoizedIsView}
                        data-test-id="rate"
                      />
                    </Grid>
                    <Grid item>
                      {memoizedIsView ? (
                        <>
                          <Typography variant="caption" noWrap>
                            {translate("carrierShippingPriceMaster.is_enabled")}
                          </Typography>
                          <Grid item className={commonClasses.disableButton}>
                            <SwitchComp disable record={scopedFormData.status} />
                          </Grid>
                        </>
                      ) : (
                        <BooleanInput
                          data-test-id="status"
                          label={translate("carrierShippingPriceMaster.is_enabled")}
                          source={getSource("status")}
                          className={classes.configSwitch}
                        />
                      )}
                    </Grid>
                    {!memoizedIsView && (
                      <Grid item>
                        <IconButton
                          data-at-id="delete_button"
                          onClick={() => {
                            deleteConfig(formRef, scopedFormData);
                          }}
                          disabled={formRef.getState().values.configList.length === 1}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                )}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </Grid>
        {!memoizedIsView && (
          <div style={{ padding: "25px 0px 0px 25px" }}>
            <Grid container item direction="row" justify="flex-start" alignItems="flex-start">
              <IconButton data-at-id="add_button" onClick={() => addConfig(formRef)}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </Grid>
          </div>
        )}
      </Grid>
    </>
  );
};

MultiTieredConfiguration.propTypes = {
  sourceName: PropTypes.string.isRequired,
  deleteConfig: PropTypes.func,
  addConfig: PropTypes.func,
  formRef: PropTypes.objectOf(PropTypes.any),
  mode: PropTypes.string,
};

MultiTieredConfiguration.defaultProps = {
  deleteConfig: () => {},
  addConfig: () => {},
  formRef: null,
  mode: "",
};

export default React.memo(MultiTieredConfiguration);
