/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import ProductPropertiesUI from "./ProductPropertiesUI";
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";
/**
 * Component to render the ProductProperties for GEMS create product
 *
 * @param {object} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const ProductProperties = (props) => {
  const [state, setState] = useState({
    lengthArray: [],
    weightArray: [],
    volumeArray: [],
    countryArray: [],
  });
  /**
   * @function handleLengthDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleLengthDataSuccess = (res) => {
    const { data } = res?.data;
    const lengthArray = data.map(({ uomId }) => {
      return { id: uomId, name: uomId };
    });
    setState((prev) => {
      return { ...prev, lengthArray };
    });
  };

  const lengthPayload = { uomType: "length" };
  const lengthResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms`;
  useCustomQueryWithStore("getData", lengthResource, handleLengthDataSuccess, {
    payload: lengthPayload,
  });

  /**
   * @function handleWeightDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleWeightDataSuccess = (res) => {
    const { data } = res?.data;
    const weightArray = data.map(({ uomId }) => {
      return { id: uomId, name: uomId };
    });
    setState((prev) => {
      return { ...prev, weightArray };
    });
  };

  const weightPayload = { uomType: "weight" };
  const weightResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms`;
  useCustomQueryWithStore("getData", weightResource, handleWeightDataSuccess, {
    payload: weightPayload,
  });

  /**
   * @function handleVolumeDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleVolumeDataSuccess = (res) => {
    const { data } = res?.data;
    const volumeArray = data.map(({ uomId }) => {
      return { id: uomId, name: uomId };
    });
    setState((prev) => {
      return { ...prev, volumeArray };
    });
  };

  const volumePayload = { uomType: "volume" };
  const volumeResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms`;
  useCustomQueryWithStore("getData", volumeResource, handleVolumeDataSuccess, {
    payload: volumePayload,
  });

  /**
   * @function handleCountryDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleCountryDataSuccess = (res) => {
    const { data } = res?.data;
    const countryArray = data.map(({ countryName }) => {
      return { id: countryName, name: countryName };
    });
    setState((prev) => {
      return { ...prev, countryArray };
    });
  };

  const countryResource = `${window.REACT_APP_TIFFANY_SERVICE}/countries`;
  useCustomQueryWithStore("getData", countryResource, handleCountryDataSuccess);
  return (
    <>
      <ProductPropertiesUI {...props} state={state} />
    </>
  );
};

export default ProductProperties;
