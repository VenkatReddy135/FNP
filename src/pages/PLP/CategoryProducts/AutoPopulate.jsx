/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation, useRefresh } from "react-admin";
import { Checkbox, FormControl, Select, MenuItem, DialogContent, DialogContentText } from "@material-ui/core";
import LoaderComponent from "../../../components/LoaderComponent";
import { TIMEOUT, color } from "../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
import productStyles from "../ProductFilterStyle";
import SimpleModel from "../../../components/CreateModal";

/**
 * AutoPopulate checkbox functionality
 *
 * @param {object} props AutoPopulate Checkbox functionality
 * @returns {React.ReactElement} Filter Listing page.
 */
const AutoPopulate = (props) => {
  const { sequenceData, id, clearSequenceData, isProductSelected } = props;
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const autoPopulateProduct = productStyles();
  const {
    productDropdown,
    inActiveDropdown,
    textUppercase,
    checkboxAlign,
    populateLabel,
    optionColor,
    disabledOptionColor,
  } = autoPopulateProduct;
  const frequencyData = [
    { key: "weekly", label: translate("weekly") },
    { key: "monthly", label: translate("monthly") },
    { key: "fortnight", label: translate("fortnight") },
    { key: "daily", label: translate("daily") },
  ];
  const [confirmationBox, setConfirmationBox] = useState(false);
  const [autoPopulateForm, setAutoPopulateForm] = useState({ frequency: "", isEnabled: false });
  const { frequency, isEnabled } = autoPopulateForm;
  const [localAutoPopulateValue, setLocalAutoPopulateValue] = useState({
    isEnabledLocal: isEnabled,
    frequencyLocal: frequency,
  });
  const { isEnabledLocal, frequencyLocal } = localAutoPopulateValue;
  const { orange, gray } = color;
  let message = translate("product_list.configuration_message");
  if (sequenceData.length) {
    message = `${translate("discard_message_confirmation")} ${message} `;
  }

  /**
   *@function dialogContent
   *@param {string } messageDialog message description
   *@returns {React.createElement} returning uI for the Message of the dialog
   */
  const dialogContent = (messageDialog) => {
    return (
      <DialogContent>
        <DialogContentText>{messageDialog}</DialogContentText>
      </DialogContent>
    );
  };
  const dialogObject = {
    dialogContent: dialogContent(message),
  };
  /**
   * Function to handle confirmation modal close
   *
   * @name handleCloseConfirmModel
   */
  const handleCloseConfirmModel = () => {
    setConfirmationBox(false);
    setLocalAutoPopulateValue((prevState) => ({
      ...prevState,
      isEnabledLocal: isEnabled,
      frequencyLocal: frequency,
    }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function to set the value in State
   */
  const handleSetDataSuccess = (res) => {
    setAutoPopulateForm(res.data);
    setLocalAutoPopulateValue((prevState) => ({
      ...prevState,
      isEnabledLocal: res.data?.isEnabled,
      frequencyLocal: res.data?.frequency,
    }));
  };

  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/autopopulate/${id}`;
  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} res is passed to the function to show the API Message
   */
  const handleSuccess = (res) => {
    notify(res.data?.message, "info", TIMEOUT);
    clearSequenceData();
    refresh();
  };
  /**
   * @function continueHandler to submit the data to the API
   */
  const continueHandler = async () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/autopopulate/${id}?currency=INR`,
        payload: {
          data: {
            frequency: frequencyLocal,
            isEnabled: !frequencyLocal ? false : isEnabledLocal,
          },
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
    setConfirmationBox(false);
  };

  /**
   *@function  handleCheckboxChange to check the autoPopulate checkbox is checked or not
   * @param {object} event checked event
   */
  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    if (!checked) {
      setLocalAutoPopulateValue((prevState) => ({
        ...prevState,
        isEnabledLocal: checked,
        frequencyLocal: "",
      }));
      setConfirmationBox(true);
    } else {
      setLocalAutoPopulateValue((prevState) => ({ ...prevState, isEnabledLocal: checked }));
    }
  };

  /**
   *@function handlePopulateChange to check the Dropdown on the weekly or monthly
   * @param {object} event change event
   */
  const handlePopulateChange = (event) => {
    setLocalAutoPopulateValue((prevState) => ({ ...prevState, frequencyLocal: event.target.value }));
    setConfirmationBox(true);
  };
  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <span>
        <Checkbox
          checked={isEnabledLocal}
          onChange={handleCheckboxChange}
          classes={{ root: checkboxAlign }}
          style={isProductSelected ? { color: gray } : { color: orange }}
          iconStyle={{ fill: orange }}
          disabled={isProductSelected}
        />
        <span className={populateLabel}>{translate("product_list.auto_populate")}</span>
        <FormControl className={productDropdown} disabled={isProductSelected}>
          <Select
            displayEmpty
            value={frequencyLocal}
            onChange={handlePopulateChange}
            name="selectedFrequency"
            defaultValue=""
            className={`${productDropdown} ${!isEnabledLocal ? inActiveDropdown : ""}`}
            classes={{ select: !isProductSelected ? optionColor : disabledOptionColor }}
          >
            <MenuItem value="" className={optionColor}>
              <span className={textUppercase}>{translate("frequency")}</span>
            </MenuItem>
            {frequencyData.map(({ key, label }) => (
              <MenuItem key={key} value={key} className={optionColor}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </span>
      <SimpleModel
        {...dialogObject}
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
        openModal={confirmationBox}
        handleClose={handleCloseConfirmModel}
        handleAction={continueHandler}
      />
    </>
  );
};
AutoPopulate.propTypes = {
  sequenceData: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  clearSequenceData: PropTypes.func.isRequired,
  isProductSelected: PropTypes.bool.isRequired,
};
export default AutoPopulate;
