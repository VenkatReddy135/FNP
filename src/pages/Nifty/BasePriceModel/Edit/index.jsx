/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import { useTranslate, useMutation, useNotify } from "react-admin";
import { useHistory, useParams } from "react-router-dom";
import BasePriceForm from "../BasePriceForm/BasePriceForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const initialState = {
  modelId: "",
  geography: "",
  salesPercentage: "",
  deliveryCharges: "",
  lookBackPeriod: "Number of Days",
  fromDate: "",
  numberOfDays: "",
  ppCalculationMethod: "",
  ceilingAmount: "",
  fallBackCarrierCharges: "",
  includeDeliveryCharge: "Yes",
  currency: "",
  status: true,
  currencyOptions: [],
  isLoading: true,
};

/**
 * Base Price Model edit component
 *
 * @returns {React.ReactElement} edit Base Price Model
 */
const BasePriceEdit = () => {
  const { id } = useParams();
  const notify = useNotify();
  const translate = useTranslate();
  const history = useHistory();
  const [mutate] = useMutation();
  const [basePriceDetails, setBasePriceDetails] = useState(initialState);
  const basePriceResource = `${window.REACT_APP_NIFTY_SERVICE}/base-price-model/${id}`;

  /**
   * @function handleCurrencySetting update currency field value and options
   * @param {object} response api response
   */
  const handleCurrencySetting = (response) => {
    const currencyValues = [];
    response.data.data[0].currencies.forEach((currency) => {
      currencyValues.push({ id: currency.currencyId, name: currency.currencyId });
    });
    setBasePriceDetails((prev) => {
      return { ...prev, currencyOptions: currencyValues, isLoading: false };
    });
  };

  /**
   * @function handleCurrencyBadCreateRequest to handle bad request
   * @param {object} response is passed to function
   */
  const handleCurrencyBadCreateRequest = (response) => {
    setBasePriceDetails((prev) => {
      return { ...prev, isLoading: false };
    });
    notify(response.message ? response.message : translate("error_boundary_heading"), "error", TIMEOUT);
  };

  /**
   * @function getCurrencyValue  set currency
   * @param {string} val input value
   */
  const getCurrencyValue = (val) => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/geo-preference?geoIds=${val}`,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleCurrencySetting,
            handleBadRequest: handleCurrencyBadCreateRequest,
          });
        },
        onFailure: (error) => {
          setBasePriceDetails((prev) => {
            return { ...prev, isLoading: false };
          });
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function handleCountryDataSuccess This function will setData
   * @param {object} res is passed to the function
   * @param {string} val name
   */
  const handleCountryDataSuccess = (res, val) => {
    const { data } = res?.data;
    const country = data?.find(({ countryName }) => {
      return countryName === val;
    });
    getCurrencyValue(country?.countryId);
  };

  /**
   * @function getCountry to fetch country details
   * @param {string} country name
   */
  const getCountry = useCallback((country) => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: () => {
              handleCountryDataSuccess(response, country);
            },
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  /**
   * @function handleSuccess This function will handle the success scenario
   * @param {object} response is passed to the function
   */
  const handleSuccess = async (response) => {
    const responseData = response?.data;
    await getCountry(responseData?.geo);
    let basePriceData;
    if (responseData) {
      basePriceData = {
        modelId: responseData?.id.trim() || "",
        geography: responseData?.geo.trim() || "",
        salesPercentage: responseData?.salesPercentage || "",
        deliveryCharges: responseData?.deliveryCharge || "",
        lookBackPeriod: "Number of Days",
        numberOfDays: responseData?.lookbackPeriod || "",
        ppCalculationMethod: responseData?.ppCalculationMethod || "",
        ceilingAmount: responseData?.ceiling || "",
        fallBackCarrierCharges: responseData?.fallbackCourierCharge || "",
        includeDeliveryCharge: responseData?.isDcInWp ? "Yes" : "No",
        currency: responseData?.currency,
        status: responseData?.isEnabled,
      };
    }
    setBasePriceDetails((prevState) => ({ ...prevState, ...basePriceData }));
  };

  useCustomQueryWithStore("getOne", basePriceResource, handleSuccess);

  /**
   * @function handleUpdateBasePriceOnSuccess function to navigate to base price list on success
   * @param {object} response response
   */
  const handleUpdateBasePriceOnSuccess = useCallback((response) => {
    history.push(`/${window.REACT_APP_NIFTY_SERVICE}/base-price-model`);
    notify(response?.data?.message || translate("update_success_message"), "info", TIMEOUT);
  }, []);

  /**
   * @function updateBasePrice callback function for update Base Price model
   * @param {object} data campaign data
   */
  const updateBasePrice = useCallback((data) => {
    mutate(
      {
        type: "put",
        resource: basePriceResource,
        payload: {
          data: {
            ceiling: data.ceilingAmount?.trim(),
            currency: data.currency,
            deliveryCharge: data.deliveryCharges,
            fallbackCourierCharge: data.fallBackCarrierCharges,
            geo: data.geography,
            isDcInWp: data.includeDeliveryCharge === "Yes",
            isEnabled: data.status,
            lookbackPeriod: data.numberOfDays,
            ppCalculationMethod: data.ppCalculationMethod,
            salesPercentage: data.salesPercentage,
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleUpdateBasePriceOnSuccess,
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  if (basePriceDetails.isLoading) {
    return <LoaderComponent />;
  }

  return (
    <BasePriceForm
      initialState={basePriceDetails}
      onSave={updateBasePrice}
      mode={NIFTY_PAGE_TYPE.EDIT}
      pageTitle={basePriceDetails.modelId}
    />
  );
};
export default React.memo(BasePriceEdit);
