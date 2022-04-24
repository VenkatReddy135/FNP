/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useNotify, useTranslate } from "react-admin";
import BasePriceForm from "../BasePriceForm/BasePriceForm";
import { NIFTY_PAGE_TYPE } from "../../niftyConfig";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";

/**
 * Customer Delivery Charges edit component
 *
 * @returns {React.ReactElement} edit customer delivery charges
 */
const BasePriceCreate = () => {
  const history = useHistory();
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();
  const [initialState, setInitialState] = useState({
    geography: "",
    salesPercentage: "",
    deliveryCharges: "",
    lookBackPeriod: "Number of Days",
    ppCalculationMethod: "",
    ceilingAmount: "",
    fallBackCarrierCharges: "",
    includeDeliveryCharge: "Yes",
    currency: "",
    status: true,
    currencyOptions: [],
  });

  /**
   * @function handleCreateBasePriceMode function to navigate on Base Price Model list and to notify
   * @param {object} res is passed to function
   */
  const handleCreateBasePriceMode = useCallback((res) => {
    history.goBack();
    notify(res?.data?.message || translate("basePriceModel.add_model_success_message"), "info", TIMEOUT);
  }, []);

  /**
   * @function createBasePrice callback function to create Base Price Model
   * @param {object} data form data
   */
  const createBasePrice = useCallback((data) => {
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_NIFTY_SERVICE}/base-price-model`,
        payload: {
          data: {
            dataObj: {
              ceiling: data?.ceilingAmount.trim(),
              currency: data?.currency,
              deliveryCharge: data?.deliveryCharges,
              fallbackCourierCharge: data?.fallBackCarrierCharges,
              geo: typeof data?.geography === "object" ? data.geography?.name : data.geography,
              isDcInWp: data?.includeDeliveryCharge === "Yes",
              isEnabled: data?.status,
              lookbackPeriod: data?.numberOfDays,
              ppCalculationMethod: data?.ppCalculationMethod,
              salesPercentage: data?.salesPercentage,
            },
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleCreateBasePriceMode,
          });
        },
        onFailure: (error) => {
          setInitialState(data);
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  return <BasePriceForm initialState={initialState} onSave={createBasePrice} mode={NIFTY_PAGE_TYPE.CREATE} />;
};

export default React.memo(BasePriceCreate);
