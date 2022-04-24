/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useTranslate, useNotify, useMutation } from "react-admin";
import { FormControl, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import debounce from "lodash/debounce";
import { setTagValue, getTagListSuccess } from "../../actions/domain";
import useStyles from "./DomainDropdown-styles";
import { FILTER_TAG_OPERATOR_LIKE, DEBOUNCE_INTERVAL } from "../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../utils/CustomHooks";
import tagConfig from "./config";

/**
 *
 * Tag Dropdown component to select the Tag for configurations
 *
 * @function TagDropdown
 * @param {object} props return props for Tag dropdown
 * @returns {React.ReactElement} Tag Dropdown.
 */
const TagDropdown = (props) => {
  const { tagType } = props;
  const translate = useTranslate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const tagData = useSelector((state) => state.TagDropdownData[tagType]);
  const { label, reduxKey, resource, apiLabel, apiValue, sortParam, size, extraCondition, encryption } = tagConfig[
    tagType
  ];
  const selectedValue = tagData[reduxKey];
  const notify = useNotify();
  const [mutate] = useMutation();

  // To get label of selected tag
  let currentTagName = "";
  if (tagData.list) {
    const searchedList = tagData.list.find((item) => item[apiValue] === selectedValue);
    currentTagName = searchedList ? searchedList[apiLabel] : selectedValue;
  }
  const [localTagObject, setLocalTagValue] = useState({ [apiValue]: selectedValue, [apiLabel]: currentTagName });

  /**
   * Function to call the action for updating selected tag
   *
   * @name handleChange
   * @param {string} newValue contains Geo value
   */
  const handleChange = (newValue) => {
    dispatch(setTagValue({ tagType, value: newValue && newValue[apiValue] }));
    setLocalTagValue({ [apiValue]: newValue && newValue[apiValue], [apiLabel]: newValue && newValue[apiLabel] });
  };

  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res get the response the API
   */
  const handleSuccess = (res) => {
    dispatch(getTagListSuccess({ tagType, list: res.data?.data || [] }));
  };

  /**
   * @function getTagWiseParam to get params details for API
   * @param {string} newValue searched value
   * @returns {object} param for API
   */
  const getTagWiseParam = (newValue) => {
    const params = {
      size,
      sortParam,
    };
    const filter = [];
    if (extraCondition) {
      filter.push(extraCondition);
    }
    if (newValue) {
      filter.push({
        fieldName: apiLabel,
        operatorName: FILTER_TAG_OPERATOR_LIKE,
        fieldValue: newValue,
      });
    }
    if (filter.length) {
      params.filter =
        encryption === "encode" ? encodeURIComponent(JSON.stringify(filter)) : btoa(JSON.stringify(filter));
    }
    return params;
  };

  /**
   * @function handleInputChange function that updates the changed value of selected domain
   * @param {string} newValue value key
   */
  const handleInputChange = (newValue) => {
    const params = getTagWiseParam(newValue);
    mutate(
      {
        type: "getOne",
        resource,
        payload: params,
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  const inputChangeWithDebounce = debounce((event, newInputValue) => {
    handleInputChange(newInputValue);
  }, DEBOUNCE_INTERVAL);

  return (
    <FormControl required className={classes.formControl}>
      <Autocomplete
        options={tagData.list || []}
        closeIcon={false}
        getOptionLabel={(option) => option[apiLabel]}
        value={localTagObject}
        onInputChange={inputChangeWithDebounce}
        onOpen={(event) => {
          if (tagData.list?.length === 0) handleInputChange(event.target.value);
        }}
        onChange={(e, newValue) => {
          handleChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} required label={label} margin="normal" />}
      />
    </FormControl>
  );
};

TagDropdown.propTypes = {
  tagType: PropTypes.string,
};
TagDropdown.defaultProps = {
  tagType: "domainData",
};
export default TagDropdown;
