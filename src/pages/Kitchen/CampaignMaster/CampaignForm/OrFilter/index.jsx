/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  SelectInput,
  required,
  useTranslate,
  NumberInput,
} from "react-admin";
import { Box, Button, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import get from "lodash/get";
import { CAMPAIGN_FIELD_MAPPING, FIELD_TYPES } from "../campaignFieldMapping";
import BoundedCheckBoxDropdown from "../../../../../components/BoundedCheckBoxDropdown";
import { TWO_FIELD_OPERATOR } from "../frequencyMapping";
import { color } from "../../../../../config/GlobalConfig";
import { handleInvalidCharsInNumberInput } from "../../../../../utils/validationFunction";
import useCommonStyles from "../../../../../assets/theme/common";

const useStyle = makeStyles({
  formFields: {
    backgroundColor: `${color.white}`,
    "& p": {
      height: 0,
    },
  },
  boundedDropdown: {
    width: 200,
    "& .Mui-error": {
      height: 0,
    },
    "& .MuiInputBase-root": {
      paddingTop: 8,
    },
  },
  formIterator: {
    backgroundColor: `${color.white}`,
    "& li": {
      borderBottom: "none",
    },
    "& li>p": {
      display: "none",
    },
  },
  bottomBorder: {
    borderBottom: `thin dashed ${color.gray}`,
  },
});

/**
 * Component to create OR filter
 *
 * @param {object}  props create An component
 * @returns {React.ReactElement} returns Or filter component
 */
const OrFilter = memo((props) => {
  const classes = useStyle();
  const commonClasses = useCommonStyles();
  const { details, andFormId, onDelete, formData, parentForm, getListOfTagsByKey, getShippingList } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState("");
  const translate = useTranslate();

  /**
   * @function handleClick To handle kebab menu action
   * @param {object} event click event object
   * @param {string} orId selected or form id for delete
   */
  const handleClick = (event, orId) => {
    setAnchorEl(event.currentTarget);
    setDeleteId(orId);
  };

  /**
   * @function handleClose To close kebab menu
   */
  const handleClose = () => {
    setAnchorEl(null);
    setDeleteId("");
  };

  /**
   * @function deleteForm callback Function to remove OR Form
   */
  const deleteForm = () => {
    onDelete(deleteId, andFormId);
  };

  /**
   * @function getOperatorList Gives list of operator on the basis of field name
   * @param {object} data gives scoped data
   * @returns {Array} operator list
   */
  const getOperatorList = useCallback(
    (data) => {
      if (data && data.fieldName) {
        const attribute = formData.attributeList.find((attr) => attr.id === data.fieldName);
        if (attribute?.operators) {
          const operatorChoices = attribute.operators.map((operator) => {
            return {
              ...operator,
              name: operator.description,
              id: operator.name,
            };
          });
          formData.operatorList = [...operatorChoices];
          return [...operatorChoices];
        }
        return [];
      }
      return [];
    },
    [formData],
  );

  const fieldRequiredValidation = required(translate("required_field"));

  /**
   * @function validateOperandField to validate field
   * @param {string} value of operand field
   * @returns {string} validation message or undefined
   */
  const validateOperandField = (value) => {
    return !value.toString().trim().length ? translate("required_field") : undefined;
  };

  /**
   * @function getValidation to get validation for field
   * @param {string} fieldValue selected field value
   * @param {string} field field
   * @returns {Array} returns validation message
   */
  const getValidation = (fieldValue, field = true) => {
    return fieldValue && field ? [fieldRequiredValidation] : [];
  };

  /**
   * @function getRangeValidation range validation
   * @param {string} fromSource source of from field
   * @returns {string} returns validation value
   */
  const getRangeValidation = (fromSource) => (value) => {
    const toValue = parseInt(value, 10);
    const fromValue = parseInt(get(parentForm.getState().values, fromSource), 10);
    return fromValue >= toValue ? `${translate("campaign_invalid_range")} ${fromValue + 1}` : undefined;
  };

  /**
   * @function disableForm Gives value to enable/disable form
   * @returns {boolean} value for disable
   */
  const disableForm = () => !formData?.publisherId?.length;

  /**
   * @function getSingleFieldValidation to check validation.
   * @param {string} fieldName field name
   * @param {string} name name of first field
   * @returns {Array} array of validation rule
   */
  const getSingleFieldValidation = (fieldName, name) => {
    return name ? [...getValidation(fieldName), validateOperandField] : [...getValidation(fieldName)];
  };

  /**
   * @function getMappedFields to get mapped field
   * @param {object} data data related to selected field
   * @param {Function} getSource form get source function
   * @returns {React.ReactElement} returns field
   */
  const getMappedFields = (data, getSource) => {
    const { type } = data;
    switch (type) {
      case FIELD_TYPES.singleInputNumeric:
        return (
          <Box flex={1}>
            <NumberInput
              className={`${commonClasses.numberInputField} ${classes.formFields}`}
              label={translate("select_value")}
              source={getSource("fieldOperand")}
              validate={fieldRequiredValidation}
              onKeyDown={handleInvalidCharsInNumberInput}
              autoComplete="Off"
              fullWidth
            />
          </Box>
        );

      case FIELD_TYPES.doubleInput:
        return (
          <Box display="flex">
            <Box flex={1}>
              <NumberInput
                className={`${commonClasses.numberInputField} ${classes.formFields}`}
                label={translate("from_value")}
                source={getSource("fromValue")}
                validate={fieldRequiredValidation}
                onKeyDown={handleInvalidCharsInNumberInput}
                autoComplete="Off"
                fullWidth
              />
            </Box>

            <Box flex={1} ml="1em">
              <NumberInput
                className={`${commonClasses.numberInputField} ${classes.formFields}`}
                label={translate("to_value")}
                source={getSource("toValue")}
                validate={[fieldRequiredValidation, getRangeValidation(getSource("fromValue"))]}
                onKeyDown={handleInvalidCharsInNumberInput}
                autoComplete="Off"
                fullWidth
              />
            </Box>
          </Box>
        );

      case FIELD_TYPES.checkBoxList:
        return (
          <BoundedCheckBoxDropdown
            id="operator-list"
            source={getSource("fieldOperand")}
            type="select"
            label={translate("select_value")}
            options={data?.operatorList ? [...data.operatorList] : []}
            className={classes.boundedDropdown}
            validate={fieldRequiredValidation}
            showLabel={data.fieldName === "p_recipient"}
            selectAll
          />
        );

      default:
        return (
          <Box>
            <TextInput
              label={translate("select_value")}
              className={classes.formFields}
              disabled={disableForm()}
              source={getSource("fieldOperand")}
              validate={getSingleFieldValidation(data.fieldName, !!data?.fieldName)}
              key={!data.fieldName ? 1 : 0}
              autoComplete="Off"
              fullWidth
            />
          </Box>
        );
    }
  };

  /**
   * @function setTypeofValue to set type of Attribute
   * @param {object} data event of select field
   * @param {string} typeSource type of object to update
   * @param {string} operatorListSource object location to update state
   * @param {string} operatorSource  operator
   * @param {string} fieldIdSource fieldId source
   */
  const setTypeofValue = (data, typeSource, operatorListSource, operatorSource, fieldIdSource) => {
    const { value } = data.target;
    const productAttribute = formData.attributeList.find((attribute) => attribute.id === value);
    parentForm.mutators.setField(fieldIdSource, productAttribute?.productAttributeId);
    const mappingData = CAMPAIGN_FIELD_MAPPING.find((fields) => {
      if (fields.attributes.includes(productAttribute.productAttributeName)) return fields;
      return "";
    });

    if (mappingData?.type === FIELD_TYPES.doubleInput) {
      if (parentForm.getFieldState(operatorSource).value === TWO_FIELD_OPERATOR) {
        parentForm.mutators.setField(typeSource, mappingData?.type || FIELD_TYPES.single_input);
      } else {
        parentForm.mutators.setField(typeSource, FIELD_TYPES.singleInputNumeric);
      }
    } else {
      parentForm.mutators.setField(typeSource, mappingData?.type || FIELD_TYPES.default);
    }

    parentForm.mutators.setOperatorList(operatorListSource, mappingData?.options || []);

    if (mappingData?.API) {
      const currentOperatorList = parentForm.getState().values[mappingData.source];
      if (currentOperatorList?.length === 0) {
        if (mappingData?.url) {
          getShippingList(mappingData, parentForm, operatorListSource);
        } else {
          getListOfTagsByKey(mappingData, parentForm, operatorListSource);
        }
      } else {
        parentForm.mutators.setOperatorList(operatorListSource, currentOperatorList || []);
      }
    }
  };

  return (
    <ArrayInput source={details} label="">
      <SimpleFormIterator addButton={<></>} removeButton={<></>} className={classes.formIterator}>
        <FormDataConsumer>
          {({ scopedFormData, getSource }) => (
            <>
              <Box p="1em">
                <Box display="flex" alignContent="flex-start" flexDirection="row" mr="1em">
                  <Box mt="1em" className={classes.formFields}>
                    <Button
                      aria-controls="or-kabab-menu"
                      aria-haspopup="true"
                      disabled={disableForm()}
                      onClick={(event) => handleClick(event, scopedFormData.orId)}
                    >
                      <MoreVertIcon />
                    </Button>
                    <Menu
                      id="or-kabab-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          deleteForm();
                        }}
                      >
                        <DeleteIcon />
                        &nbsp;
                        {translate("delete")}
                      </MenuItem>
                    </Menu>
                  </Box>
                  <Box ml="1em" mr="1em">
                    <SelectInput
                      label={translate("select_field")}
                      className={classes.formFields}
                      source={getSource("fieldName")}
                      choices={[...formData.attributeList]}
                      disabled={disableForm()}
                      onChange={(event) => {
                        parentForm.mutators.clearOperator(
                          getSource("fieldOperand"),
                          getSource("fieldOperator"),
                          getSource("fromValue"),
                          getSource("toValue"),
                        );
                        setTypeofValue(
                          event,
                          getSource("type"),
                          getSource("operatorList"),
                          getSource("fieldOperator"),
                          getSource("fieldId"),
                        );
                      }}
                    />
                  </Box>
                  <Box mr="1em">
                    <SelectInput
                      label={translate("select_operator")}
                      className={classes.formFields}
                      source={getSource("fieldOperator")}
                      disabled={getOperatorList(scopedFormData).length === 0 || disableForm()}
                      choices={getOperatorList(scopedFormData)}
                      validate={getValidation(
                        getOperatorList(scopedFormData).length !== 0,
                        !!scopedFormData?.fieldName,
                      )}
                      onChange={() => {
                        setTypeofValue(
                          { target: { value: scopedFormData.fieldName } },
                          getSource("type"),
                          getSource("operatorList"),
                          getSource("fieldOperator"),
                        );
                      }}
                      key={getOperatorList(scopedFormData).length !== 0 ? 1 : 0}
                    />
                  </Box>
                  <Box mr="1em">{scopedFormData && getMappedFields(scopedFormData, getSource)}</Box>
                </Box>
              </Box>
              <Box ml="5em" className={`or-label ${classes.bottomBorder}`} fontWeight="fontWeightMedium">
                {translate("campaign_select_or")}
              </Box>
            </>
          )}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
});

OrFilter.propTypes = {
  details: PropTypes.arrayOf(PropTypes.object),
  andFormId: PropTypes.number,
  onDelete: PropTypes.func,
  formData: PropTypes.objectOf(PropTypes.any),
  parentForm: PropTypes.objectOf(PropTypes.any).isRequired,
  getListOfTagsByKey: PropTypes.func.isRequired,
  getShippingList: PropTypes.func.isRequired,
};

OrFilter.defaultProps = {
  details: [],
  andFormId: "",
  onDelete: () => {},
  formData: {},
};

export default OrFilter;
