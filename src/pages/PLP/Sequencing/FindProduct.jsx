/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Chip, DialogContent, Grid, Typography } from "@material-ui/core";
import { Button, useTranslate, useNotify, useMutation, useRefresh, SimpleForm } from "react-admin";
import useStyles from "../../../assets/theme/common";
import useStylesFilter from "../ProductFilterStyle";
import SimpleModel from "../../../components/CreateModal";
import { TIMEOUT } from "../../../config/GlobalConfig";
import useSequencingStyles from "./sequencingStyles";
import { getFormattedTimeValue, getFormattedDate } from "../../../utils/formatDateTime";
import { validateToDateField } from "../../../utils/validationFunction";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";
import CustomToolbar from "../../../components/CustomToolbar";
import DateTimeInput from "../../../components/CustomDateTimeV2";
import LoaderComponent from "../../../components/LoaderComponent";

/**
 * This component Find the Product of the List
 *
 * @returns {React.ReactElement} FindProduct Component
 * @param {object} props selected category id
 */
const FindProduct = (props) => {
  const classes = useStyles();
  const classesFilter = useStylesFilter();
  const [productIds, setProductIds] = useState([]);
  const [openFindProductModal, setOpenFindProductModal] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });
  const { fromDate, toDate } = formData;
  const translate = useTranslate();
  const { findDialogWidth, btnFind, moveProductSection } = useSequencingStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const { id } = props;
  const [mutate, { loading }] = useMutation();

  /**
   * @name handleChipDelete to delete the selected product
   * @param {object} productId Selected productId
   */
  const handleChipDelete = (productId) => {
    const remainingProducts = productIds.filter((key) => key !== productId);
    setProductIds(remainingProducts);
  };

  /**
   * @function handleFindProductSuccess to handle success of the API
   * @param {object} res api res
   */
  const handleFindProductSuccess = (res) => {
    setProductIds(res.data);
  };

  /**
   * @function handleFindProduct to set the products for selected date
   *
   */
  const handleFindProduct = () => {
    setProductIds([]);
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/sequence/find/${id}`,
        payload: { fromDate, toDate },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleFindProductSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function handleProductSuccess to handle success of the API
   * @param {object} res api res
   */
  const handleProductSuccess = (res) => {
    notify(res.data?.message, "info", TIMEOUT);
    refresh();
  };

  /**
   * @name continueHandler to update the products
   */
  const continueHandler = async () => {
    if (!productIds.length) {
      notify(translate("find_product.move_products_error"), "error", TIMEOUT);
    } else {
      mutate(
        {
          type: "put",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/sequence/move/${id}`,
          payload: {
            data: productIds,
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleProductSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
      setOpenFindProductModal(false);
    }
  };

  /**
   * @function handleDateChange function to update the local state of date
   * @param {object} event event data for current input
   */
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const dateValue = getFormattedDate(value);
    const timeValue = getFormattedTimeValue(new Date(value));
    setFormData({
      ...formData,
      [name]: `${dateValue}T${timeValue}`,
    });
  };

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("find_product.to_date_error_message"));
  };

  /**
   *@function handleClose To clear the product list
   *
   */
  const handleClose = () => {
    setOpenFindProductModal(false);
    setProductIds([]);
    setFormData({
      fromDate: "",
      toDate: "",
    });
  };

  const customToolbar = (
    <CustomToolbar
      className={moveProductSection}
      onClickCancel={handleClose}
      saveButtonLabel={translate("find_product.move_products_top")}
    />
  );

  /**
   * @function dialogContent
   * @returns {React.createElement} returning ui for find product page
   * @param {string } message name of the action
   */
  const dialogContent = (message) => {
    return (
      <SimpleForm toolbar={customToolbar} save={continueHandler}>
        <DialogContent>
          <Typography
            variant="h6"
            className={`${classes.textAlignCenter} ${classesFilter.textUppercase} ${classesFilter.findProductHeading}`}
          >
            {message}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <DateTimeInput source="fromDate" label={translate("date_created")} onChange={handleDateChange} />
            </Grid>
            <Grid item xs={5}>
              <DateTimeInput
                source="toDate"
                label={translate("to_date")}
                onChange={handleDateChange}
                validate={validateToDate(formData.fromDate)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                className={btnFind}
                variant="outlined"
                data-at-id="addbtn"
                label={translate("find_product.button_find_product")}
                onClick={handleFindProduct}
                disabled={fromDate === "" || toDate === ""}
              />
            </Grid>
            {loading ? (
              <LoaderComponent />
            ) : (
              <Grid item xs={12}>
                {productIds.length > 0 && (
                  <Typography>{`${productIds.length} ${translate("find_product.products_found")}`}</Typography>
                )}
                <div className={classes.keywordChip}>
                  {productIds.map((productValue) => (
                    <Chip
                      key={productValue}
                      className={classes.chipInputInner}
                      label={productValue}
                      onDelete={() => handleChipDelete(productValue)}
                    />
                  ))}
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </SimpleForm>
    );
  };

  /**
   *@function showPopup To show pop up the Product of List
   *
   */
  const showPopup = () => {
    setOpenFindProductModal(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        data-at-id="addbtn"
        label={translate("find_product.find_products")}
        onClick={showPopup}
      />
      <SimpleModel
        dialogContent={dialogContent(translate("find_product.find_products"))}
        openModal={openFindProductModal}
        dialogClasses={{ paper: findDialogWidth }}
        handleClose={handleClose}
        handleAction={continueHandler}
      />
    </>
  );
};

FindProduct.propTypes = {
  id: PropTypes.string.isRequired,
};

export default FindProduct;
