/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useNotify, useMutation, useInput, useTranslate } from "react-admin";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Checkbox, makeStyles, Chip } from "@material-ui/core";
import { debounce, isEmpty, isEqual, has, isArray } from "lodash";
import useGlobalStyles from "../../assets/theme/common";
import { DEBOUNCE_INTERVAL, FILTER_TAG_OPERATOR_LIKE } from "../../config/GlobalConfig";
import { onFailure, onSuccess } from "../../utils/CustomHooks";

const MAX_LIST_SIZE = 100;

const useStyles = makeStyles(() => ({
  root: {
    width: 250,
  },
  inputRoot: {
    paddingTop: 2,
    paddingRight: "5px !important",
  },
  tag: {
    maxWidth: "calc(100% - 165px)",
  },
}));

const SELECT_ALL_OPTION = { id: "all", name: "All" };

/**
 *
 * @param {*} props props of the Auto complete
 * @returns {React.Component} return component
 */
const CustomAutoComplete = (props) => {
  const {
    dataId,
    label,
    apiParams,
    disabled,
    autoCompleteClass,
    labelName,
    multipleSelect,
    limitTags,
    onSearchInputChange,
    clearOnBlur,
    additionalFilter,
    defaultOptions,
    selectAll,
    rootClass,
  } = props;
  const notify = useNotify();
  const classes = useStyles();
  const data = useInput(props);
  const [mutate] = useMutation();
  const translate = useTranslate();
  const globalClasses = useGlobalStyles();
  const [inputState, setInputState] = useState("");
  const [tagLimit] = useState(limitTags);
  const [optionNames, setOptionsNames] = useState(
    selectAll ? [SELECT_ALL_OPTION, ...defaultOptions] : [...defaultOptions],
  );
  const input = data && data?.input;
  const meta = data && data?.meta;
  const { value, onChange, onBlur } = input || {};
  const [getVal, setVal] = useState(value);
  const [defaultValues, setDefaultValues] = useState(multipleSelect ? [] : {});
  const [allSelected, setAllSelected] = useState(false);
  const { touched, name, error } = meta || {};
  const { isRequired } = data;

  const memoizedError = useMemo(() => !!(touched && error), [touched, error]);
  const memoizedClasses = useMemo(() => ({
    root: rootClass || classes.root,
    tag: classes.tag,
    inputRoot: classes.inputRoot,
  }));
  const defaultValueType = useMemo(() => {
    const values = isEmpty(defaultValues) ? defaultOptions : defaultValues;
    if (isArray(values)) {
      if (!isEmpty(defaultOptions)) {
        return isEmpty(values) ? typeof defaultOptions[0] === "object" : typeof values[0] === "object";
      }
      return isEmpty(values) ? true : typeof values[0] === "object";
    }
    return values && typeof values === "object";
  }, [defaultValues, defaultOptions]);

  useEffect(() => {
    let initValues = value || {};
    if (!isEmpty(initValues)) {
      initValues = multipleSelect ? [...initValues] : initValues;
    }
    setDefaultValues(initValues);
  }, []);

  /**
   * @function getOptionName function to get option name
   * @param {object} option option value
   * @returns {string|object} either plain string or object
   */
  const getOptionName = useCallback(
    (option) => {
      if (has(option, labelName)) {
        return option[labelName];
      }
      return multipleSelect ? option || [] : option;
    },
    [multipleSelect],
  );

  const memoizedSelectAllValue = useMemo(() => {
    return defaultValueType ? SELECT_ALL_OPTION : getOptionName(SELECT_ALL_OPTION);
  }, [defaultValueType]);

  useEffect(() => {
    setOptionsNames(selectAll ? [memoizedSelectAllValue, ...defaultOptions] : [...defaultOptions]);
  }, [defaultOptions]);

  useEffect(() => {
    if (value.length === defaultOptions.length && multipleSelect && selectAll) {
      setVal([memoizedSelectAllValue, ...value]);
    } else {
      setVal(value);
    }
  }, [value, defaultOptions, multipleSelect, selectAll, memoizedSelectAllValue]);

  /**
   * @function handleListUpdate function to navigate on campaign list and to notify
   * @param {object} res is passed to function
   */
  const handleListUpdate = useCallback((res) => {
    const { fieldName, fieldId } = apiParams;
    const optionsNameValue = [];
    const isObject = typeof res?.data?.data[0] === "object";
    res?.data?.data?.forEach((details) => {
      optionsNameValue.push({
        id: isObject ? details[fieldId] : details,
        name: isObject ? details[fieldName] : details,
      });
    });
    setOptionsNames([...optionsNameValue]);
  }, []);

  /**
   * @function handleInputChange function that updates the changed value of selected category name dropdown
   * @param {event} event to observe event
   * @param {string} newValue value key
   */
  const handleInputChange = debounce((event, newValue) => {
    const exactValue = newValue?.trim();

    if (onSearchInputChange) {
      onSearchInputChange(exactValue, event);
    }

    if (defaultOptions.length || selectAll) {
      return;
    }

    const { fieldName, type, url, sortParam } = apiParams;
    const params = {
      size: MAX_LIST_SIZE,
      sortParam: `${sortParam}:asc`,
    };
    let filter = [
      {
        fieldName,
        operatorName: FILTER_TAG_OPERATOR_LIKE,
        fieldValue: exactValue,
      },
      ...additionalFilter,
    ];
    if (exactValue === "") {
      filter = additionalFilter.length ? additionalFilter : null;
    }
    if (filter) {
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
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleListUpdate,
          });
        },
        onFailure: (errors) => {
          onFailure({ error: errors, notify, translate });
        },
      },
    );
  }, DEBOUNCE_INTERVAL);

  /**
   * @function getListExcludingAllOption function to return selected option excluding all option.
   * @param {Array} list array of selected options
   * @returns {Array} list of selected options
   */
  const getListExcludingAllOption = (list) =>
    list?.filter((selectedOpt) => {
      return defaultValueType ? selectedOpt.name !== SELECT_ALL_OPTION.name : selectedOpt !== SELECT_ALL_OPTION.name;
    });

  /**
   * @function getAllSelections function that returns selected values and if select all selection based on input
   * @param {*} selections values of current selections
   * @param {string} reason reason of selection/remove
   * @returns {*} updated values of selections
   */
  const getAllSelections = (selections, reason = "") => {
    let currentValue = selections;

    if (multipleSelect) {
      const totalSelections = optionNames.length - 1;
      const isSelectAll = currentValue?.indexOf(memoizedSelectAllValue) !== -1;

      if ((isSelectAll || currentValue.length === totalSelections) && selectAll && reason === "select-option") {
        const selectedOptions = optionNames?.map((val) => (defaultValueType ? val : getOptionName(val)));
        currentValue = getListExcludingAllOption(selectedOptions);
        setAllSelected(true);
      } else {
        if (allSelected) {
          if (currentValue?.indexOf(memoizedSelectAllValue) !== -1) {
            currentValue = getListExcludingAllOption(currentValue);
          } else {
            currentValue = [];
          }
        } else {
          currentValue = currentValue?.map((details) => (defaultValueType ? details : getOptionName(details)));
        }
        setAllSelected(false);
      }
    } else {
      currentValue = defaultValueType ? currentValue : getOptionName(currentValue);
    }
    return currentValue;
  };

  /**
   * @function handleChangeValue function that updates the changed value of selected category name dropdown
   * @param {event} event to observe event
   * @param {*} currentValue value
   */
  const handleChangeValue = useCallback((event, values, reason) => {
    const selections = getAllSelections(values, reason);
    setInputState("");
    onChange({
      ...event,
      target: { ...event.target, value: selections },
    });
  });

  /**
   * @param {*} option props of the Auto complete
   * @param {boolean} option.selected checked
   * @param {boolean} option.selected.selected checkedValue
   * @returns {React.Component} return component
   */
  const optionRenderer = (option, { selected }) => {
    const selectAllProps =
      getOptionName(option) === SELECT_ALL_OPTION.name // To control the state of 'select-all' checkbox
        ? { checked: allSelected }
        : {};
    return (
      <>
        <Checkbox style={{ marginRight: 8 }} checked={selected} {...selectAllProps} />
        {`${getOptionName(option)}`}
      </>
    );
  };

  /**
   * @function getCurrentValue function to get current value
   * @param {object} option option value
   * @returns {string|object} either plain string or object
   */
  const getCurrentValue = useCallback(
    (currentValue) => {
      if (multipleSelect) {
        if (isArray(currentValue)) {
          return currentValue;
        }
        return [];
      }
      return currentValue;
    },
    [multipleSelect],
  );

  /**
   * @param {*} params props of the Auto complete
   * @returns {React.Component} return component
   */
  const optionInput = (params) => {
    const { inputProps, InputProps } = params;

    return (
      <div ref={InputProps.ref}>
        <TextField
          {...params}
          onChange={(event) => {
            setInputState(event.target.value);
            inputProps.onChange(event);
          }}
          onBlur={(event) => {
            if (clearOnBlur) {
              setInputState("");
            }
            onBlur(event);
          }}
          error={memoizedError}
          helperText={memoizedError && translate(error)}
          required={isRequired}
          label={label}
          margin="normal"
          disabled={disabled}
          className={`${globalClasses.autoCompleteClass} ${autoCompleteClass}`}
          name={name}
        />
      </div>
    );
  };

  /**
   * @param {Array} val list of tags to render
   * @param {Function} getTagProps function to get tag properties
   * @returns {React.Component} return component
   */
  const tagRenderer = (val, getTagProps) => {
    const list = val?.filter((optionDetails) => getOptionName(optionDetails) !== SELECT_ALL_OPTION.name);
    return list?.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        title={getOptionName(option)}
        label={getOptionName(option)}
        key={option?.id || `${getOptionName(option)}${index}`}
        size="small"
      />
    ));
  };

  // eslint-disable-next-line require-jsdoc
  const selectAllTagRenderer = (val, getTagProps) => {
    const indexOfSelectAll = val?.indexOf(memoizedSelectAllValue);
    return (
      <Chip
        {...getTagProps({ index: indexOfSelectAll })}
        title={SELECT_ALL_OPTION.name}
        label={SELECT_ALL_OPTION.name}
        key={SELECT_ALL_OPTION.id}
        size="small"
      />
    );
  };

  /**
   * @function getOptionLabel function that returns option label
   * @param {object|string} option object or string as an option
   * @returns {string} option label string
   */
  const getOptionLabel = (option) => getOptionName(option);

  /**
   * @function onInputChange function that handles input change event
   * @param {object} event object containing event details
   * @param {object} newInputValue select option object
   */
  const onInputChange = useCallback((event, newInputValue) => {
    handleInputChange(event, newInputValue);
  });

  /**
   * @function onOpen function that handles input change event
   * @param {object} event object containing event details
   */
  const onOpen = useCallback((event) => {
    handleInputChange(event, event?.target?.value);
  });

  /**
   * @function getMultiSelectProps function that returns multiple select props
   * @returns {object} returns props object only for multiple selection
   */
  const getMultiSelectProps = () => {
    return multipleSelect
      ? {
          getOptionSelected: (option, val) => {
            const defaults = defaultValueType ? defaultOptions : defaultOptions.map((opt) => getOptionName(opt));
            if (multipleSelect && selectAll && isEqual(value, defaults)) {
              setAllSelected(true);
            }
            return has(val, labelName) ? isEqual(option, val) : isEqual(getOptionName(option), val);
          },
          renderOption: optionRenderer,
          disableCloseOnSelect: true,
          renderTags: allSelected ? selectAllTagRenderer : tagRenderer,
          multiple: true,
          limitTags: tagLimit,
          inputValue: inputState,
        }
      : {
          getOptionSelected: (option, val) => {
            return has(val, labelName) ? isEqual(option, val) : isEqual(getOptionName(option), val);
          },
          inputValue: inputState || getOptionName(value),
        };
  };

  return (
    <>
      <Autocomplete
        options={optionNames}
        closeIcon={false}
        data-at-id={dataId}
        id={dataId}
        value={getCurrentValue(getVal)}
        getOptionLabel={getOptionLabel}
        onInputChange={onInputChange}
        onOpen={onOpen}
        renderInput={optionInput}
        disabled={disabled}
        onChange={handleChangeValue}
        clearOnBlur={clearOnBlur}
        classes={memoizedClasses}
        {...getMultiSelectProps()}
      />
    </>
  );
};

CustomAutoComplete.propTypes = {
  dataId: PropTypes.string,
  label: PropTypes.string.isRequired,
  apiParams: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
  autoCompleteClass: PropTypes.string,
  labelName: PropTypes.string,
  multipleSelect: PropTypes.bool,
  limitTags: PropTypes.number,
  onSearchInputChange: PropTypes.func,
  clearOnBlur: PropTypes.bool,
  additionalFilter: PropTypes.arrayOf(PropTypes.object),
  defaultOptions: PropTypes.arrayOf(PropTypes.object),
  selectAll: PropTypes.bool,
  rootClass: PropTypes.string,
};

CustomAutoComplete.defaultProps = {
  labelName: "name",
  disabled: false,
  multipleSelect: false,
  autoCompleteClass: null,
  apiParams: {},
  dataId: "",
  limitTags: 2,
  onSearchInputChange: () => {
    /* comment */
  },
  clearOnBlur: true,
  additionalFilter: [],
  defaultOptions: [],
  selectAll: false,
  rootClass: "",
};

export default React.memo(CustomAutoComplete);
