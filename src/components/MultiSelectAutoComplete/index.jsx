/* eslint-disable react/jsx-props-no-spreading */
import { TextField, Typography, Grid } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import debounce from "lodash/debounce";
import { isArray, isPlainObject } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { useInput, useMutation, useNotify } from "react-admin";
import { DEBOUNCE_INTERVAL, TIMEOUT } from "../../config/GlobalConfig";
import useStyles from "./style";

/**
 * @function MultiSelectAutoComplete To select multiple item using autocomplete
 * @param {*} props props of the Auto complete
 * @returns {React.Component} return component
 */
const MultiSelectAutoComplete = (props) => {
  const {
    dataId,
    label,
    apiParams,
    onChange,
    disabled,
    autoCompleteClass,
    edit,
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
    limitTags,
    emptySearch,
  } = props;

  const notify = useNotify();
  const [mutate] = useMutation();

  const [optionNames, setOptionsNames] = useState([]);
  const [filter, setFilter] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);
  const [currentFieldName, setCurrentFieldName] = useState("");

  const data = useInput(props);

  const [customValue, setCustomValue] = useState(
    isArray(data?.input?.value)
      ? data.input.value.map((item) =>
          isPlainObject(item) ? { id: item.id, name: item.name } : { id: item, name: item },
        )
      : [],
  );

  const classes = useStyles();

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
    if (required && data?.input?.value.length === 0 && customValue.length === 0) {
      setErrorMessage(true);
    } else {
      setErrorMessage(false);
    }
  }, [customValue, required, data]);

  /**
   * @function handleInputChange function that updates the changed value of selected category name dropdown
   * @param {event} event to observe event
   * @param {string} newValue value key
   */
  const handleInputChange = (event, newValue) => {
    if (!emptySearch && !event?.target?.value) {
      return;
    }
    if (!apiParams) return;

    const { fieldName, type, url, sortParam, fieldId, localSearch, searchParams, formatterFunction, size } = apiParams;
    if (onSearchInputChange) {
      onSearchInputChange(newValue);
    }
    if (localSearch) {
      setFilter(true);
    } else {
      setFilter(false);
    }
    if (fieldName === currentFieldName && localSearch && optionNames.length !== 0) {
      return;
    }
    setCurrentFieldName(fieldName);
    const params = {
      ...(size && { size }),
      ...(sortParam && { sortParam: `${sortParam}:asc` }),
      ...(!localSearch && { [searchParams || "simpleSearchValue"]: newValue }),
    };
    mutate(
      {
        type,
        resource: url,
        payload: params,
      },
      {
        onSuccess: (res) => {
          if (res.data && res.status === "success") {
            const options = res.data?.data?.map((item) => ({
              id: item[fieldId],
              name: formatterFunction ? formatterFunction(item) : item[fieldName],
            }));
            setOptionsNames(options);
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

  const handleInputChangeWithDebounce = debounce((event, newInputValue) => {
    handleInputChange(event, newInputValue);
  }, DEBOUNCE_INTERVAL);

  const filterOptions = createFilterOptions({
    stringify: (option) => option[labelName],
  });

  if (!edit) {
    return (
      <Grid md={12}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h6">{customValue.map((item) => item.name).join("; ")}</Typography>
      </Grid>
    );
  }
  return (
    <Autocomplete
      data-testid="MultiSelectAutoComplete"
      multiple
      limitTags={limitTags}
      options={optionsFromParentComponent ? optionData : optionNames}
      closeIcon={false}
      data-at-id={dataId}
      id={dataId}
      value={customValue || []}
      getOptionLabel={(option) => option[labelName]}
      filterOptions={filter ? filterOptions : (options) => options}
      onInputChange={
        onChangeFromParentComponent
          ? onInputChangeCall
          : (event, newInputValue) => {
              handleInputChangeWithDebounce(event, newInputValue);
            }
      }
      onOpen={
        onOpen && !onChangeFromParentComponent
          ? (event) => {
              handleInputChangeWithDebounce(event, event.target.value);
            }
          : onOpenFunc
      }
      onChange={(e, newValue) => {
        setCustomValue(newValue);
        onChange(e, newValue);
      }}
      clearOnBlur={clearOnBlur}
      renderInput={(params) => {
        return (
          <div ref={params.InputProps.ref}>
            <TextField
              {...params}
              onChange={(event) => {
                params.inputProps.onChange(event);
              }}
              onBlur={autoCompleteError}
              error={err}
              required={required}
              helperText={err ? "* Required" : null}
              label={label}
              margin="normal"
              disabled={disabled}
              className={`${autoCompleteClass}  ${classes.multiAutoComplete}`}
            />
          </div>
        );
      }}
    />
  );
};
MultiSelectAutoComplete.propTypes = {
  edit: PropTypes.bool,
  limitTags: PropTypes.number,
  dataId: PropTypes.string,
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  apiParams: PropTypes.objectOf(PropTypes.any).isRequired,
  onOpen: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  autoCompleteClass: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
  optionData: PropTypes.objectOf(PropTypes.any),
  optionsFromParentComponent: PropTypes.bool,
  onInputChangeCall: PropTypes.func,
  onOpenCall: PropTypes.func,
  onChangeFromParentComponent: PropTypes.bool,
  labelName: PropTypes.string,
  required: PropTypes.bool,
  errorMsg: PropTypes.bool,
  clearOnBlur: PropTypes.bool,
  onSearchInputChange: PropTypes.func,
  emptySearch: PropTypes.bool,
};
MultiSelectAutoComplete.defaultProps = {
  edit: true,
  limitTags: 3,
  labelName: "name",
  optionsFromParentComponent: false,
  required: false,
  disabled: false,
  onOpen: false,
  errorMsg: false,
  onChangeFromParentComponent: false,
  autoCompleteClass: null,
  value: [],
  optionData: [],
  dataId: "",
  clearOnBlur: true,
  onInputChangeCall: () => {},
  onChange: () => {},
  onOpenCall: () => {},
  onSearchInputChange: () => {},
  emptySearch: true,
};
export default React.memo(MultiSelectAutoComplete);
