/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, memo } from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import { required, FormDataConsumer, SelectInput, useTranslate } from "react-admin";
import { FIELD_TYPES, TIME_OPTIONS, CAMPAIGN_FREQUENCY_MAPPING } from "../frequencyMapping";

/**
 * @function getValidator Get Validator based on flag provided
 * @param {boolean} validate flag for validation
 * @param {Function} requiredValidation validation message
 * @returns {Array} returns validation
 */
function getValidator(validate, requiredValidation) {
  return validate ? [requiredValidation] : [];
}

/**
 * Component for Frequency setting
 *
 * @param {object} props frequency component
 * @returns {React.ReactElement} returns frequency component
 */
const FrequencySetter = memo((props) => {
  const { parentForm } = props;
  const translate = useTranslate();
  const fieldRequiredValidation = required(translate("required_field"));

  /**
   * @function getUpdatedDetails to get updated form data
   * @param {object} data data of frequency
   * @returns {object} disabled fields object
   */
  const getUpdatedDetails = (data) => {
    const type = String(data.type).toLowerCase();
    if (type) {
      return {
        disableRepeat: CAMPAIGN_FREQUENCY_MAPPING[type].disableRepeat,
        disableTime: CAMPAIGN_FREQUENCY_MAPPING[type].disableTime,
        repeatOptions: [
          ...CAMPAIGN_FREQUENCY_MAPPING[type].options.map((repeatDetails) => ({
            id: `${repeatDetails}`,
            name: `${repeatDetails}`,
          })),
        ],
      };
    }
    return {
      disableRepeat: true,
      disableTime: true,
      repeatOptions: [],
    };
  };

  const frequencyTypeMapping = useMemo(
    () => [
      ...Object.values(CAMPAIGN_FREQUENCY_MAPPING).map((frequencyType) => ({
        id: frequencyType.value,
        name: frequencyType.label,
      })),
    ],
    [],
  );

  return (
    <>
      <Box display="flex" flexDirection="row">
        <FormDataConsumer>
          {({ formData }) => (
            <>
              <Box mt="1.8em" mr="1em">
                {translate("set_frequency_label")}
              </Box>
              <Box mr="1em">
                <SelectInput
                  source={FIELD_TYPES.type}
                  label={translate("type_label")}
                  choices={frequencyTypeMapping}
                  onChange={() => {
                    parentForm.mutators.clearRepeatAndTime();
                    parentForm.resetFieldState("repeat");
                    parentForm.resetFieldState("time");
                  }}
                  validate={fieldRequiredValidation}
                />
              </Box>
              <Box mt="1.8em" mr="1em">
                {translate("repeat")}
              </Box>
              <Box mr="1em">
                <SelectInput
                  source={FIELD_TYPES.repeat}
                  label={translate("when_label")}
                  choices={[...getUpdatedDetails(formData).repeatOptions]}
                  disabled={getUpdatedDetails(formData).disableRepeat}
                  validate={getValidator(!getUpdatedDetails(formData).disableRepeat, fieldRequiredValidation)}
                  key={getUpdatedDetails(formData).disableRepeat ? 1 : 0}
                />
              </Box>
              <Box mt="1.8em" mr="1em">
                {translate("time_label")}
              </Box>
              <Box>
                <SelectInput
                  source="time"
                  label={translate("time")}
                  choices={[...TIME_OPTIONS]}
                  disabled={getUpdatedDetails(formData).disableTime}
                  validate={getValidator(!getUpdatedDetails(formData).disableTime, fieldRequiredValidation)}
                  key={getUpdatedDetails(formData).disableTime ? 1 : 0}
                />
              </Box>
            </>
          )}
        </FormDataConsumer>
      </Box>
    </>
  );
});

FrequencySetter.propTypes = {
  parentForm: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FrequencySetter;
