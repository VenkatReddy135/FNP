/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, TextField } from "@material-ui/core";
import { useListContext, useTranslate, useNotify, useMutation } from "react-admin";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash/debounce";
import { DEBOUNCE_INTERVAL } from "../../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks";

/**
 * Component for PLP filter List contains a simple grid with configurations for PLP filter list
 *
 * @param {object} props all the props needed for plp Filters component
 * @returns {React.ReactElement} returns a PLP filter List component
 */
const FilterSearchInput = (props) => {
  const { searchLabel, geo } = props;
  const notify = useNotify();
  const [mutate] = useMutation();
  const translate = useTranslate();
  const { filterValues, setFilters } = useListContext();
  const [productTypeOption, setProductTypeOption] = useState([]);

  useEffect(() => {
    setFilters({ ...filterValues, productType: "" });
  }, []);

  /**
   * Function to call the action for updating selected Product type
   *
   * @name handleProductChangeType
   * @param {string} newValue contains Product type value
   */
  const handleProductChangeType = (newValue) => {
    setFilters({ ...filterValues, productType: newValue && newValue.productTypeId });
  };

  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res get the response the API
   */
  const handleSuccess = (res) => {
    setProductTypeOption(res.data.data);
  };

  /**
   * @function handleInputChange function that updates the changed value of selected product type
   * @param {string} newValue contains value product value
   */
  const handleInputChange = (newValue) => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`,
        payload: {
          productType: newValue,
          size: 100,
          sortParam: "productTypeId:ASC",
          page: 0,
          geo,
        },
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
    <>
      <Grid item xs={6}>
        <Autocomplete
          options={productTypeOption}
          source="productType"
          getOptionLabel={(option) => option.filterId}
          onInputChange={inputChangeWithDebounce}
          onOpen={(event) => {
            if (productTypeOption?.length === 0) handleInputChange(event.target.value);
          }}
          onChange={(e, newValue) => {
            handleProductChangeType(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={searchLabel}
              label=""
              margin="normal"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon fontSize="small" color="disabled" mr={2} disabled />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
    </>
  );
};

FilterSearchInput.propTypes = {
  searchLabel: PropTypes.string.isRequired,
  geo: PropTypes.string.isRequired,
};

export default memo(FilterSearchInput);
