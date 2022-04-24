/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNotify, useMutation } from "react-admin";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { TIMEOUT } from "../../config/GlobalConfig";

/**
 *
 * @param {*} props props of the Auto complete
 * @returns {React.Component} return component
 */
const AutoComplete = (props) => {
  const {
    dataId,
    label,
    apiParams,
    onChange,
    disabled,
    autoCompleteClass,
    value,
    onOpen,
    optionData,
    onInputChangeCall,
    onChangeFromParentComponent,
    optionsFromParentComponent,
    labelName,
    onOpenCall,
    required,
    errorMsg,
    clearOnBlur,
    onSearchInputChange,
    additionalFilters,
  } = props;
  const notify = useNotify();
  const [mutate] = useMutation();
  const [optionNames, setOptionsNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  let onOpenFunc;
  let err;
  if (onOpen && onChangeFromParentComponent) {
    onOpenFunc = onOpenCall;
  } else if (!onOpen) {
    onOpenFunc = null;
  }

  if (errorMsg) {
    err = errorMsg;
  } else {
    err = errorMessage;
  }

  /**
   * @function autoCompleteError checks the value of autoCompleteError onBlur
   */
  const autoCompleteError = useCallback(() => {
    if (value && Object.keys(value).length === 0 && errorMsg) {
      setErrorMessage(true);
    } else {
      setErrorMessage(false);
    }
  }, [value, errorMsg]);

  /**
   * @function handleInputChange function that updates the changed value of selected category name dropdown
   * @param {event} event to observe event
   * @param {string} newValue value key
   */
  const handleInputChange = (event, newValue) => {
    const { fieldName, type, url, sortParam, fieldId, taxonomyType } = apiParams;

    if (onSearchInputChange) {
      onSearchInputChange(newValue);
    }
    const params = {
      size: 100,
      sortParam: `${sortParam}:asc`,
      simpleSearchValue: taxonomyType === "P" ? newValue : null,
    };
    const filter = [...additionalFilters];

    if (newValue) {
      filter.push({
        fieldName,
        operatorName: "Like",
        fieldValue: newValue,
      });
    }

    if (filter.length) {
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));
      params.filter = encodedFilter;
    }
    mutate(
      {
        type,
        resource: url,
        payload: params,
      },
      {
        onSuccess: (res) => {
          const optionsNameValue = [];
          if (res.data && res.status === "success") {
            res.data.data.forEach((data) => {
              optionsNameValue.push({ id: data[fieldId], name: data[fieldName] });
            });
            setOptionsNames(optionsNameValue);
          } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
            notify(
              res.data.errors[0].field
                ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
                : `${res.data.errors[0].message}`,
            );
          }
        },
        onFailure: (error) => {
          notify(`Error: ${error.message}`, "error", TIMEOUT);
        },
      },
    );
  };
  return (
    <Autocomplete
      {...props}
      options={optionsFromParentComponent ? optionData : optionNames}
      closeIcon={false}
      data-at-id={dataId}
      id={dataId}
      disabled={disabled}
      value={value}
      getOptionLabel={(option) => option[labelName]}
      onInputChange={
        onChangeFromParentComponent
          ? onInputChangeCall
          : (event, newInputValue) => {
              handleInputChange(event, newInputValue);
            }
      }
      onOpen={
        onOpen && !onChangeFromParentComponent
          ? (event) => {
              handleInputChange(event, event.target.value);
            }
          : onOpenFunc
      }
      onChange={onChange}
      clearOnBlur={clearOnBlur}
      renderInput={(params) => {
        const { inputProps } = params;
        return (
          <div ref={params.InputProps.ref}>
            <TextField
              {...props}
              inputProps={inputProps}
              InputProps={{
                disableUnderline: disabled,
              }}
              onChange={(event) => {
                params.inputProps.onChange(event);
              }}
              onBlur={autoCompleteError}
              error={err}
              required={required}
              helperText={err ? "* Required" : null}
              label={label}
              margin="normal"
              className={autoCompleteClass}
            />
          </div>
        );
      }}
    />
  );
};

AutoComplete.propTypes = {
  dataId: PropTypes.string,
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string,
  apiParams: PropTypes.objectOf(PropTypes.any).isRequired,
  onOpen: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  autoCompleteClass: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
  optionData: PropTypes.arrayOf(PropTypes.object),
  optionsFromParentComponent: PropTypes.bool,
  onInputChangeCall: PropTypes.func,
  onOpenCall: PropTypes.func,
  onChangeFromParentComponent: PropTypes.bool,
  labelName: PropTypes.string,
  required: PropTypes.bool,
  errorMsg: PropTypes.bool,
  clearOnBlur: PropTypes.bool,
  onSearchInputChange: PropTypes.func,
  additionalFilters: PropTypes.arrayOf(PropTypes.object),
  taxonomyType: PropTypes.string,
};
AutoComplete.defaultProps = {
  labelName: "name",
  optionsFromParentComponent: false,
  required: false,
  disabled: false,
  onOpen: false,
  errorMsg: false,
  onChangeFromParentComponent: false,
  autoCompleteClass: null,
  value: {},
  optionData: [],
  dataId: "",
  clearOnBlur: true,
  onInputChangeCall: () => {},
  onChange: () => {},
  onOpenCall: () => {},
  onSearchInputChange: () => {},
  additionalFilters: [],
  taxonomyType: "",
  fieldId: "",
};

export default React.memo(AutoComplete);
