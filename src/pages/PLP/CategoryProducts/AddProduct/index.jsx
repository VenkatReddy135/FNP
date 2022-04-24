/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation, useRedirect } from "react-admin";
import { Typography, Divider, DialogContent, DialogContentText } from "@material-ui/core";
import { getFormattedTimeValue, getFormattedDate, formatDateTime } from "../../../../utils/formatDateTime";
import { validateToDateField } from "../../../../utils/validationFunction";
import useStyles from "../../../../assets/theme/common";
import SimpleModel from "../../../../components/CreateModal";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import AddProductUI from "./AddProductUI";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * AddProductCategory component to Populate Category
 *
 *  @param {object} props all the props required by Add Category page
 * @returns {React.ReactElement} Add Category page.
 */
const AddProductCategory = (props) => {
  const { match } = props;
  const { id } = match.params;
  const translate = useTranslate();
  const classes = useStyles();
  const [mutate] = useMutation();
  const notify = useNotify();
  const redirect = useRedirect();
  const [product, setNewProduct] = useState([]);
  const [confirmationBox, setConfirmationBox] = useState(false);
  const [productData, setProductData] = useState({
    productId: "",
    sequence: "",
    thruDate: null,
    fromDate: new Date(),
  });
  const tableHeading = {
    ProductName: `${translate("product_name_id")}`,
    Sequence: `${translate("sequence")}`,
    FromDate: `${translate("from_date")}`,
    ThroughDate: `${translate("through_date")}`,
    UpdatedStamp: `${translate("last_updated_stamp")}`,
    CreatedBy: `${translate("created_by")}`,
    LastUpdatedBy: `${translate("last_updated_by")}`,
  };
  /**
   * @function handleChange to update the local state
   * @param {object} e event data for current input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  /**
   * @function handleDateChange to update the date
   * @param {object} e event data for current input
   */
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const dateValue = getFormattedDate(value);
    const timeValue = getFormattedTimeValue(new Date(value));
    setProductData({ ...productData, [name]: `${dateValue}T${timeValue}` });
  };

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    if (fromDateSelected === null) {
      return false;
    }
    return validateToDateField(fromDateSelected, value, translate("redirect_campaign.to_date_error_message"));
  };

  /**
   * @function handleManageSequence To manage the sequence on enter click
   * @param {object} e info of the current product
   */
  const handleManageSequence = (e) => {
    const { name, value } = e.target;
    const elementsIndex = product.findIndex((element) => element.productId === name);
    const updatedProducts = [...product];
    updatedProducts[elementsIndex] = { ...updatedProducts[elementsIndex], sequence: value * 1 };
    setNewProduct(updatedProducts);
  };

  /**
   *@function dialogContent
   *@param {string } message name of the action
   *@returns {React.createElement} returning ui for hide and show suppressed product page
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} res is passed to the function
   */
  const handleUpdateSuccess = (res) => {
    const matchProduct = res.data?.data;
    const elementsIndex = product.findIndex((element) => element.productId === matchProduct.productId);
    if (elementsIndex < 0) {
      const elementSequence = product.findIndex((element) => element.sequence === matchProduct.sequence);
      if (elementSequence < 0) {
        setNewProduct((prevState) => [...prevState, matchProduct]);
      } else {
        const ProductData = [...product, matchProduct];
        const filterProductData = ProductData.reduce((accumulator, productObj) => {
          const tempObj = { ...productObj };
          if (productObj.sequence >= matchProduct.sequence && productObj.productId !== matchProduct.productId) {
            tempObj.sequence = productObj.sequence + 1;
          }
          return [...accumulator, { ...tempObj }];
        }, []);
        filterProductData.sort((a, b) => {
          return a.sequence - b.sequence;
        });
        setNewProduct(filterProductData);
      }
    } else {
      notify(translate("add_category.product_exist"), "error", TIMEOUT);
    }
  };

  /**
   * @function continueHandler function called to get  data to show  in the table
   */
  const continueHandler = async () => {
    const { fromDate, productId, sequence, thruDate } = productData;
    if (!productId || !sequence || !fromDate) {
      notify(translate("fill_required_field"), "error", TIMEOUT);
    } else {
      mutate(
        {
          type: "create",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/product/categoryproductlist`,
          payload: {
            data: {
              params: { extraHeaders: { "Accept-Language": "en" } },
              dataObj: {
                fromDate,
                categoryId: id,
                productId,
                sequence,
                thruDate,
              },
            },
          },
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
  };

  /**
   * @function handleUpdateTableSuccess This function will handle Success on Update
   * @param {object} res is passed to the function
   */
  const handleUpdateTableSuccess = (res) => {
    notify(res.data?.data?.message, "info", TIMEOUT);
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/show/products`);
  };
  /**
   * @function handleAddCategory function called to update value in sequence filled
   */
  const handleAddCategory = async () => {
    const invalidSequence = product.find(({ sequence }) => sequence < 1);
    if (invalidSequence) {
      notify(translate("add_category.error_sequence"), "error", TIMEOUT);
    } else {
      let productObj = {};
      if (product) {
        productObj = product.reduce((accumulator, { fromDate, productId, sequence, thruDate }) => {
          return [...accumulator, { fromDate, productId, sequence, thruDate }];
        }, []);
      }
      mutate(
        {
          type: "create",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/product/${id}`,
          payload: {
            data: {
              dataObj: productObj,
            },
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleUpdateTableSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
      setConfirmationBox(false);
    }
  };
  /**
   *@function updateFormData function called on click of edit
   */
  const updateFormData = () => {
    setConfirmationBox(true);
  };

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   */
  const cancelTagHandler = () => {
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/show/products`);
  };
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/show`,
    },
    {
      displayName: translate("products"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/show/products`,
    },
    { displayName: translate("add_category.add_product_title") },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h5" className={classes.pageTitleHeading}>
        {translate("add_category.heading_tittle")}
        <span className={classes.mainTitleHeading}>{`[${translate("id")}:${id}]`}</span>
      </Typography>
      <Divider variant="fullWidth" className={classes.headerClass} />
      <AddProductUI
        tableHeading={tableHeading}
        handleManageSequence={handleManageSequence}
        formatDateTime={formatDateTime}
        productData={productData}
        product={product}
        cancelTagHandler={cancelTagHandler}
        updateFormData={updateFormData}
        continueHandler={continueHandler}
        validateToDate={validateToDate}
        handleDateChange={handleDateChange}
        handleChange={handleChange}
      />
      <SimpleModel
        dialogContent={dialogContent(translate("add_category.modal_title"))}
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
        openModal={confirmationBox}
        handleClose={() => setConfirmationBox(false)}
        handleAction={handleAddCategory}
      />
    </>
  );
};
AddProductCategory.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};

AddProductCategory.defaultProps = {
  match: {},
};

export default AddProductCategory;
