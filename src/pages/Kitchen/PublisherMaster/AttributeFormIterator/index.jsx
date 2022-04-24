/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback, memo } from "react";
import { useTranslate, useRedirect } from "react-admin";
import { Box, Button, Typography, Divider, Checkbox, Switch, TextField } from "@material-ui/core";
import usePublisherMasterStyles from "../publisherMasterStyle";
import useCommonStyles from "../../../../assets/theme/common";
import AutoComplete from "../../../../components/AutoComplete";
import { removeExtraSpaces } from "../../../../utils/helperFunctions";

const FLAG_VALUES = ["aliasChecked", "fieldStatus"];

/**
 * Component for AttributeRow
 *
 * @param {object} props all the props required for AttributeRow component
 * @returns {React.ReactElement} returns AttributeRow component
 */
const AttributeRow = memo((props) => {
  const classes = usePublisherMasterStyles();
  const commonClasses = useCommonStyles();
  const translate = useTranslate();
  const { onChange, value, record, onBlur } = props;
  const { aliasError, fieldDisplayName, alias, fieldStatus, aliasChecked } = value;

  /**
   * @function updateField Function called on change of attribute fields
   * @param {object} e form data
   */
  const updateField = (e) => {
    const { name, value: val, checked } = e.target;
    if (FLAG_VALUES.includes(name)) {
      onChange(checked, name, record);
    } else {
      onChange(val, name, record);
    }
  };

  return (
    <div>
      <Box display="flex" className={classes.attributeRowStyle}>
        <Box display="flex" minWidth="240px" maxWidth="241px" alignItems="center">
          <Typography className={(classes.attributeNameStyle, `${!fieldStatus ? classes.disabledAttribute : ""}`)}>
            {fieldDisplayName}
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" alignItems="center" minWidth="100px">
          <Switch name="fieldStatus" checked={fieldStatus} onChange={updateField} color="primary" />
        </Box>
        <Box display="flex" minWidth="200px" ml="3em">
          {!!fieldStatus && (
            <>
              <Box display="flex" className={classes.checkboxStyle}>
                <Checkbox name="aliasChecked" checked={aliasChecked} onChange={updateField} />
              </Box>
              {!aliasChecked && (
                <Box display="flex" alignItems="flex-end" className={classes.textFieldStyle}>
                  <TextField
                    error={!!aliasError}
                    helperText={aliasError}
                    required
                    label={translate("alias")}
                    autoComplete="off"
                    variant="standard"
                    name="alias"
                    value={alias.trimStart()}
                    onChange={updateField}
                    onBlur={onBlur}
                  />
                </Box>
              )}
              {!!aliasChecked && (
                <Box display="flex" alignItems="center" ml="1em">
                  <Typography variant="caption" className={commonClasses.italicFontStyle}>
                    {translate("same_as_campaign_field")}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      <Divider variant="fullWidth" />
    </div>
  );
});
AttributeRow.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  record: PropTypes.string.isRequired,
  value: PropTypes.objectOf(PropTypes.any).isRequired,
};

/**
 * Component for AttributeFormIterator
 *
 * @param {object} props all the props required for AttributeFormIterator component
 * @returns {React.ReactElement} returns AttributeFormIterator component
 */
const AttributeFormIterator = (props) => {
  const { publisherData, publisherName, buttonLabel, onSave } = props;
  const translate = useTranslate();
  const redirect = useRedirect();
  const [publisher, setPublisher] = useState({
    attributeData: publisherData,
    validatePublisherName: false,
    duplicateAlias: {},
  });
  const [publisherNameDetails, setPublisherNameDetails] = useState({
    id: publisherName.id || null,
    name: publisherName.name,
  });
  const classes = usePublisherMasterStyles();

  useEffect(() => {
    setPublisher((prevState) => ({ ...prevState, attributeData: publisherData }));
    setPublisherNameDetails((prevState) => ({
      ...prevState,
      id: publisherName.id || null,
      name: publisherName.name,
    }));
  }, [publisherData, publisherName]);

  /**
   * @function checkForSpace called to check for space
   * @param {string} aliasName contains alias Name
   * @returns {boolean} whether validation is true or false
   */
  const checkForSpace = (aliasName) => {
    return /\s/.test(aliasName);
  };

  /**
   * @function checkDuplicateName called to check duplicates of Alias Field
   * @param {string} id contains id
   * @param {string} aliasName contains alias field value
   * @returns {boolean} whether validation is true or false
   */
  const checkDuplicateName = (id, aliasName) => {
    let attributeNames = [];
    Object.keys(publisher.attributeData).forEach((attributeId) => {
      const attribute = publisher.attributeData[attributeId];
      attributeNames = [...attributeNames, attribute.fieldDisplayName.toLowerCase()];
      if (!!attribute.alias && id !== attributeId) {
        attributeNames = [...attributeNames, attribute.alias.toLowerCase().trim()];
      }
    });
    return attributeNames.includes(aliasName);
  };

  /**
   * @function removeDuplicateError Function called to remove duplicate error message
   * @param {object} attribute contains object
   * @param {string} id contains id
   */
  const removeDuplicateError = (attribute, id) => {
    const currentAliasName = attribute[id].alias || "";
    const aliasPresent = Object.values(publisher.duplicateAlias).filter((value) => value.aliasValue !== "");
    const duplicateCount = aliasPresent?.length
      ? aliasPresent.filter((value) => {
          return value.aliasValue === currentAliasName.trim().toLowerCase();
        })
      : "";
    const duplicateFieldName = Object.keys(publisher.attributeData).map((attributeId) => {
      const attributeData = publisher.attributeData[attributeId];
      return attributeData.fieldDisplayName.toLowerCase();
    });
    const check = duplicateFieldName.includes(currentAliasName.trim().toLowerCase());
    const checkSpace = checkForSpace(currentAliasName.trim());
    if (duplicateCount?.length === 2 && !check && !checkSpace) {
      Object.keys(publisher.duplicateAlias).forEach((attributeId) => {
        const alias = publisher.attributeData[attributeId].alias || "";
        if (alias.trim().toLowerCase() === currentAliasName.trim().toLowerCase()) {
          setPublisher((prevState) => {
            return {
              ...prevState,
              attributeData: {
                ...prevState.attributeData,
                [attributeId]: { ...prevState.attributeData[attributeId], aliasError: "" },
                [id]: { ...prevState.attributeData[id], aliasError: "" },
              },
            };
          });
        }
      });
    }
  };

  /**
   * @function attributeAliasBlur called on blur of alias field
   * @param {string} id contains id
   */
  const attributeAliasBlur = (id) => {
    let duplicateAlias = { ...publisher.duplicateAlias };
    let currentAttribute = { ...publisher.attributeData[id], aliasError: "" };
    const currentName = publisher.attributeData[id].alias.toLowerCase().trim();
    const isDuplicate = currentName ? checkDuplicateName(id, currentName) : false;
    const isSpacePresent = checkForSpace(currentName);
    if (!publisher.attributeData[id].alias.toLowerCase().trim() || isDuplicate || isSpacePresent) {
      const isDuplicateCheck = isDuplicate ? translate("alias_should_be_unique") : translate("required_field");
      currentAttribute = {
        ...publisher.attributeData[id],
        aliasError: isSpacePresent ? translate("invalid_alias") : isDuplicateCheck,
      };
    }
    const aliasNames = Object.values(publisherData).filter((data) => !!data.alias);
    const existAliasNames = Object.assign(
      {},
      ...aliasNames.map((item) => ({
        [item.productAttributeFieldId]: { aliasValue: item.alias.toLowerCase().trim() },
      })),
    );
    duplicateAlias = { [id]: { aliasValue: currentName } };
    setPublisher((prevState) => ({
      ...prevState,
      duplicateAlias: duplicateAlias ? { ...prevState.duplicateAlias, ...duplicateAlias, ...existAliasNames } : {},
      attributeData: {
        ...prevState.attributeData,
        [id]: { ...currentAttribute },
      },
    }));
  };

  /**
   * @function onChange Function called on change of attribute row
   * @param {(string|boolean)} valueData contains changed field data
   * @param {string} name contains the changed field information
   * @param {string} record contains id of changed attribute row
   */
  const onChange = (valueData, name, record) => {
    let resetValues = {};
    let changedAttribute = { [record]: { ...publisher.attributeData[record], [name]: valueData } };
    if (FLAG_VALUES[1] === name) {
      removeDuplicateError(changedAttribute, record);
      resetValues = {
        aliasError: "",
        aliasChecked: true,
        alias: "",
      };
    } else if (FLAG_VALUES[0] === name) {
      removeDuplicateError(changedAttribute, record);
      resetValues = {
        aliasError: "",
        alias: "",
      };
    }
    changedAttribute = {
      [record]: {
        ...changedAttribute[record],
        ...resetValues,
      },
    };
    setPublisher((prevState) => {
      const state = { ...prevState };
      delete state.duplicateAlias[record];
      return {
        ...state,
        attributeData: { ...state.attributeData, ...changedAttribute },
        duplicateAlias: {
          ...state.duplicateAlias,
        },
      };
    });
  };

  /**
   * @function handlePublisherNameChange function called on click of publisher name field
   * @param {object} event event called on click of publisher name field
   */
  const handlePublisherNameChange = useCallback((event, newValue) => {
    if (newValue) {
      setPublisherNameDetails(newValue);
    }
  }, []);

  /**
   * @function handleBlur function called on blur of publisher name field
   * @param {object} e event called on click of publisher name field
   */
  const handleBlur = useCallback((e, newValue) => {
    if (newValue?.name) {
      setPublisher((prevState) => ({ ...prevState, validatePublisherName: false }));
    } else {
      setPublisher((prevState) => ({ ...prevState, validatePublisherName: true }));
    }
  }, []);

  /**
   * @function handleSubmit Function called on click of Add
   */
  const handleSubmit = () => {
    let productAttributeFieldsArray = Object.values(publisher.attributeData);
    productAttributeFieldsArray = productAttributeFieldsArray.map((attributeField) => ({
      ...attributeField,
      alias: attributeField.alias.trim(),
    }));
    const updatedPublisherName = publisherNameDetails.name ? removeExtraSpaces(publisherNameDetails.name) : "";
    const requestData = {
      publisherConfigs: [...productAttributeFieldsArray],
      publisherName: updatedPublisherName,
      publisherId: publisherNameDetails.id || null,
    };
    const checkValidation = Object.keys(publisher.attributeData).map((attributeId) => {
      let isValidate = false;
      if (
        (!publisher.attributeData[attributeId].aliasChecked && !publisher.attributeData[attributeId].alias.trim()) ||
        !!publisher.attributeData[attributeId].aliasError
      ) {
        attributeAliasBlur(attributeId);
        isValidate = true;
      }
      return isValidate;
    });
    if (!checkValidation.includes(true) && updatedPublisherName.length) {
      onSave(requestData);
    } else if (!updatedPublisherName.length) {
      setPublisher((prevState) => ({ ...prevState, validatePublisherName: true }));
    }
  };

  /**
   * @function cancelHandler function called on click of cancel button
   * @param {object} event event called on click of cancel
   */
  const cancelHandler = (event) => {
    event.preventDefault();
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/publishers`);
  };

  const nameValue = !publisherNameDetails.name ? "" : encodeURIComponent(publisherNameDetails.name);

  const apiParams = {
    fieldName: "name",
    type: "getData",
    url: `${window.REACT_APP_PARTY_SERVICE}/parties/name?partyName=${nameValue}`,
    sortParam: "name",
    fieldId: "id",
  };

  return (
    <>
      <Box display="flex" pt="1em" pb="2em">
        <AutoComplete
          dataId="publisherName"
          label={translate("publisher_name")}
          autoCompleteClass={classes.errorTextStyle}
          onOpen
          onChange={(e, newValue) => {
            const newVal = newValue === null ? {} : newValue;
            handlePublisherNameChange(e, newVal);
          }}
          onBlur={(e, newValue) => {
            const newVal = newValue === null ? {} : newValue;
            handleBlur(e, newVal);
          }}
          apiParams={apiParams}
          value={publisherNameDetails}
          required
          errorMsg={publisher.validatePublisherName && !publisherNameDetails.name?.trim()}
          clearOnBlur={false}
          onSearchInputChange={(value) => {
            if (publisherNameDetails.name !== value) {
              setPublisherNameDetails(() => {
                return { id: null, name: value };
              });
            }
          }}
        />
      </Box>
      <Divider variant="fullWidth" />
      <Box display="flex" justifyContent="flex-start" m={2}>
        <Box minWidth="240px" textAlign="center">
          <Typography variant="subtitle2">{translate("product_attribute_fields")}</Typography>
        </Box>
        <Box minWidth="100px" textAlign="center">
          <Typography variant="subtitle2">{translate("status")}</Typography>
        </Box>
        <Box minWidth="200px" textAlign="center">
          <Typography variant="subtitle2">{translate("alias")}</Typography>
        </Box>
      </Box>
      <Divider variant="fullWidth" />
      {Object.keys(publisher.attributeData).map((val) => (
        <AttributeRow
          record={val}
          key={val}
          onChange={onChange}
          value={publisher.attributeData[val]}
          onBlur={() => attributeAliasBlur(val)}
        />
      ))}
      <Divider variant="fullWidth" />
      <Box mb="2em" mt="2em">
        <Button variant="outlined" data-at-id="cancelButton" onClick={cancelHandler}>
          {translate("cancel")}
        </Button>
        <Button variant="contained" color="default" className={classes.saveButtonStyle} onClick={handleSubmit}>
          {buttonLabel}
        </Button>
      </Box>
    </>
  );
};

AttributeFormIterator.propTypes = {
  publisherData: PropTypes.objectOf(PropTypes.any).isRequired,
  publisherName: PropTypes.objectOf(PropTypes.any).isRequired,
  onSave: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default memo(AttributeFormIterator);
