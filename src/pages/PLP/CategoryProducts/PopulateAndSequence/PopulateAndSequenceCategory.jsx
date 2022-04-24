/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import { useParams } from "react-router-dom";
import SimpleModel from "../../../../components/CreateModal";
import LoaderComponent from "../../../../components/LoaderComponent";
import { getFormattedTimeValue, getFormattedDate } from "../../../../utils/formatDateTime";
import { TIMEOUT, shippingMethodTotal } from "../../../../config/GlobalConfig";
import PopulateAndSequenceCategoryUI from "./PopulateAndSequenceCategoryUI";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

const typeMapping = {
  "auto-sequence": "auto-sequence",
  "populate-category": "populateproduct",
};

/**
 * PopulateCategory component to Populate Category
 *
 *  @param {object} props all the props required by  Populate the Component
 * @returns {React.ReactElement} Populate Category page.
 */
const Populate = (props) => {
  const { match } = props;
  const selectedCategoryId = match.params.id;
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const { type } = useParams();
  const populateForm = {
    consideration: "",
    lookbackperiod: "",
    dateRange: "",
    fromDate: null,
    thruDate: null,
    handDelivery: "",
    courier: "",
    digital: "",
    international: "",
  };
  const [formData, setFormData] = useState(populateForm);
  const [formInitialValue, setFormInitialValue] = useState(populateForm);
  const [confirmationBox, setConfirmationBox] = useState(false);

  const loadType =
    formInitialValue.fromDate === null && formInitialValue.thruDate === null ? "loopBackPeriod" : "no_of_days";
  const [checkLoopBackType, setCheckLoopBackType] = useState(loadType);
  useEffect(() => {
    setCheckLoopBackType(
      formInitialValue.fromDate === null && formInitialValue.thruDate === null ? "loopBackPeriod" : "no_of_days",
    );
  }, [formInitialValue.fromDate, formInitialValue.thruDate]);

  /**
   *  @function handleType to update the local form data
   * @param {object} e event data for the type of the loopBackPeriod and no of days
   */
  const handleType = (e) => {
    setCheckLoopBackType(e.target.value);
  };

  /**
   *@function dialogContent
   *@param {string } message name of the action
   *@returns {React.createElement} returning uI for the Message of the Dialog
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function handleChange to update the local form data
   * @param {object} e event data for current input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * @function handleDateChange to update the date
   * @param {object} e event data for current input
   */
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const dateValue = getFormattedDate(value);
    const timeValue = getFormattedTimeValue(new Date(value));
    setFormData({ ...formData, [name]: `${dateValue}T${timeValue}` });
  };

  /**
   * @function setResponse to update the  state  object
   * @param {object} data data for response from the API
   */
  const setResponse = (data) => {
    const {
      categoryId,
      config: {
        consideration,
        fromDate,
        thruDate,
        lookbackperiod,
        deliveryModes: { courier, handDelivery, digital, international },
      },
    } = data;
    const finalObj = {
      categoryId,
      consideration: consideration || "geo",
      fromDate,
      thruDate,
      lookbackperiod,
      courier,
      handDelivery,
      digital,
      international,
    };
    setFormData({ ...finalObj });
    setFormInitialValue({ ...finalObj });
  };
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function to set the value in State
   */
  const handleSetDataSuccess = (res) => {
    setResponse(res.data);
  };

  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/categories/requests/${selectedCategoryId}?action=${typeMapping[type]}`;

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  const { handDelivery, courier, digital, international, thruDate, consideration, lookbackperiod, fromDate } = formData;
  const totalValue = handDelivery * 1 + courier * 1 + digital * 1 + international * 1;

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} res is passed to the function to show the API Message
   */
  const handleUpdateSuccess = (res) => {
    notify(res.data.message, "info", TIMEOUT);
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show/products`);
  };

  const mutationResource = `${window.REACT_APP_COLUMBUS_SERVICE}/categories/requests`;
  const checkedObj = {};
  if (checkLoopBackType === "loopBackPeriod") {
    checkedObj.lookbackperiod = lookbackperiod * 1;
  } else {
    checkedObj.fromDate = fromDate;
    checkedObj.thruDate = thruDate;
  }
  const mutationPayload = {
    data: {
      action: typeMapping[type],
      categoryId: selectedCategoryId,
      currency: "INR",
      config: {
        consideration,
        deliveryModes: {
          courier,
          digital,
          handDelivery,
          international,
        },
        ...checkedObj,
      },
    },
  };
  /**
   * @function checkFormValidation  validation for the field total and number of days in  populate and auto sequence
   * @returns {boolean} returns the validation result and displays error message
   */
  const checkFormValidation = () => {
    let error = false;
    if (totalValue !== shippingMethodTotal) {
      notify(translate("populate_category.total_error"), "error", TIMEOUT);
      error = true;
    } else if (checkLoopBackType === "loopBackPeriod" && lookbackperiod < 1) {
      notify(translate("populate_category.no_of_days_error"), "error", TIMEOUT);
      error = true;
    }
    return error;
  };
  /**
   * @function continueHandler to submit the data to the API
   */
  const continueHandler = async () => {
    if (!checkFormValidation()) {
      mutate(
        {
          type: "put",
          resource: mutationResource,
          payload: mutationPayload,
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
    }
    setConfirmationBox(false);
  };
  /**
   *@function updateFormData function called on click of edit of the form
   */
  const updateFormData = () => {
    setConfirmationBox(true);
  };
  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   */
  const cancelTagHandler = () => {
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show/products`);
  };
  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <PopulateAndSequenceCategoryUI
        updateFormData={updateFormData}
        totalValue={totalValue}
        formData={formData}
        formInitialValue={formInitialValue}
        continueHandler={continueHandler}
        cancelTagHandler={cancelTagHandler}
        handleDateChange={handleDateChange}
        setResponse={setResponse}
        handleChange={handleChange}
        handleType={handleType}
        checkLoopBackType={checkLoopBackType}
        type={type}
        selectedCategoryId={selectedCategoryId}
      />
      <SimpleModel
        dialogContent={dialogContent(translate("populate_category.popup_title"))}
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
        openModal={confirmationBox}
        handleClose={() => setConfirmationBox(false)}
        handleAction={continueHandler}
      />
    </>
  );
};
Populate.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};

Populate.defaultProps = {
  match: {},
};

export default Populate;
