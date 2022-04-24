/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { Button, useTranslate } from "react-admin";
import { Grid, DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import useStyles from "../../../assets/theme/common";
import useStylesProduct from "../ProductFilterStyle";
import SimpleModel from "../../../components/CreateModal";
import AutoPopulate from "./AutoPopulate";

/**
 * ProductList component to display filter
 *
 * @param {object} props props for product filter button
 * @returns {React.ReactElement} Product filter Page.
 */
const ProductFilter = (props) => {
  const {
    id,
    sequenceUpdateHandler,
    sequenceData,
    handleSuppressedproduct,
    hideSuppressdProducts,
    clearSequenceData,
    isProductSelected,
  } = props;
  const translate = useTranslate();
  const classes = useStyles();
  const [openModel, setOpenModel] = useState({ open: false, content: "", type: "", page: "" });
  const { open, content, type, page } = openModel;
  const classesProduct = useStylesProduct();
  const { productButton } = classesProduct;
  const history = useHistory();
  /**
   * @function handleAutoSequence
   *
   */
  const handleAutoSequence = () => {
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/products/${id}/category/auto-sequence`,
      state: { categoryId: id },
    });
  };
  /**
   * @function handleAddCategory
   *
   */
  const handleAddCategory = () => {
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/products/${id}/AddProduct/add-product-category`,
    });
  };

  /**
   * @function dialogContent
   * @param {string } message name of the action
   * @returns {React.createElement} returning ui for update button
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   *@function showHideSuppressed open modal
   */
  const showHideSuppressed = () => {
    let contentMessage = hideSuppressdProducts
      ? translate("show_suppressed_confirm")
      : translate("hide_suppressed_confirm");
    if (sequenceData.length > 0) {
      contentMessage = `${translate("discard_message_confirmation")} ${contentMessage} `;
    }
    setOpenModel({ open: true, content: contentMessage, type: "suppressed" });
  };

  /**
   *@function showPopup open modal
   */
  const showPopup = () => {
    setOpenModel({
      open: true,
      content: translate("update_message"),
      type: "update",
    });
  };

  /**
   * Function to handle confirmation modal close
   *
   * @name handleCloseConfirmModel
   */
  const handleCloseConfirmModel = () => {
    setOpenModel(false);
  };
  /**
   * @function handlePopulateCategory to redirect to respective page
   *
   */
  const handlePopulateCategory = () => {
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/products/${id}/category/populate-category`,
    });
  };

  /**
   * @function redirectPage to redirect to respective page
   *  @param {string} currentPage get the current page
   *
   */
  const redirectPage = (currentPage) => {
    switch (currentPage) {
      case "populate":
        handlePopulateCategory();
        break;
      case "add_products_to_category":
        handleAddCategory();
        break;
      case "auto_sequence_category":
        handleAutoSequence();
        break;
      default:
        handlePopulateCategory();
    }
  };
  /**
   * @function checkSequenceDiscard to check the sequence value is changed
   * @param {string} currentPage get the current page
   *
   */
  const checkSequenceDiscard = (currentPage) => {
    if (sequenceData.length > 0) {
      setOpenModel({
        open: true,
        content: translate("discard_message"),
        type: "discard",
        page: currentPage,
      });
    } else {
      redirectPage(currentPage);
    }
  };

  /**
   * @name handleConfirm Function to handle confirmation modal
   *
   */
  const handleConfirm = () => {
    if (type === "update") {
      sequenceUpdateHandler();
    } else if (type === "suppressed") {
      handleSuppressedproduct();
    } else if (type === "discard") {
      redirectPage(page);
    }
    setOpenModel((prevState) => ({
      ...prevState,
      open: false,
    }));
  };
  const buttonLabelMessage = hideSuppressdProducts
    ? translate("show_suppressed_products")
    : translate("hide_suppressed_products");

  const autoPopulate = useMemo(() => {
    return (
      <AutoPopulate
        sequenceData={sequenceData}
        id={id}
        clearSequenceData={clearSequenceData}
        isProductSelected={isProductSelected}
      />
    );
  }, [sequenceData, id, isProductSelected]);

  return (
    <>
      <Grid container>
        <Grid item xs={10} className={classes.gridButtonContainer}>
          {autoPopulate}
          <Button
            variant="outlined"
            onClick={() => checkSequenceDiscard("populate")}
            label={translate("product_list.populate")}
            className={productButton}
            disabled={isProductSelected}
          />
          <Button
            variant="outlined"
            label={buttonLabelMessage}
            onClick={showHideSuppressed}
            className={productButton}
            disabled={isProductSelected}
          />
          <Button
            variant="outlined"
            onClick={() => checkSequenceDiscard("add_products_to_category")}
            label={translate("product_list.add_products_to_category")}
            className={productButton}
            disabled={isProductSelected}
          />
          <Button
            variant="outlined"
            onClick={() => checkSequenceDiscard("auto_sequence_category")}
            label={translate("product_list.auto_sequence_category")}
            className={productButton}
            disabled={isProductSelected}
          />
        </Grid>
        <Grid item xs={2} className={classes.textAlignRight}>
          <Button
            variant="contained"
            label={translate("update")}
            onClick={showPopup}
            disabled={sequenceData?.length === 0}
            className={productButton}
          />
        </Grid>
      </Grid>
      <SimpleModel
        dialogContent={dialogContent(content)}
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
        openModal={open}
        handleClose={handleCloseConfirmModel}
        handleAction={handleConfirm}
      />
    </>
  );
};
ProductFilter.propTypes = {
  sequenceData: PropTypes.arrayOf(PropTypes.object).isRequired,
  sequenceUpdateHandler: PropTypes.func.isRequired,
  hideSuppressdProducts: PropTypes.bool.isRequired,
  handleSuppressedproduct: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  clearSequenceData: PropTypes.func.isRequired,
  isProductSelected: PropTypes.bool.isRequired,
};
export default ProductFilter;
