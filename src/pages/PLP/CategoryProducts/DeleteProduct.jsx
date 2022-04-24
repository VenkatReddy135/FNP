/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation, useRefresh, useUnselectAll } from "react-admin";
import { DialogContent, TextareaAutosize, DialogContentText } from "@material-ui/core";
import SimpleModel from "../../../components/CreateModal";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";
import useStyles from "../../../assets/theme/common";

/**
 * DeleteProduct component to delete product for category
 *
 * @param {object} props props of category
 * @returns {React.ReactElement} Product Listing page.
 */
const DeleteProduct = (props) => {
  const { id, productId, openModal, setOpenModalClose } = props;
  const translate = useTranslate();
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll();
  const classes = useStyles();
  const [deleteMessage, setDeleteMessage] = useState("");

  /**
   * @function handleDeleteProductSuccess to handle success of the API
   * @param {object} res api response
   */
  const handleDeleteProductSuccess = (res) => {
    refresh();
    notify(res.data.message, "info", TIMEOUT);
    unselectAll(`${window.REACT_APP_COLUMBUS_SERVICE}/categories/products`);
  };

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   */
  const deleteHandler = async () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/remove/${id}`,
        payload: {
          data: {
            message: deleteMessage,
            productIdList: productId,
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleDeleteProductSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    setOpenModalClose(false);
  };

  /**
   * @function handleComment function to add the comment message
   *
   * @param {object} event added message
   */
  const handleComment = (event) => {
    setDeleteMessage(event.target.value);
  };

  /**
   * @function closeDeleteModal function to close delete modal
   */
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setOpenModalClose(false);
  };

  /**
   * @function dialogContent
   * @returns {React.createElement} returning ui for find product page
   */
  const dialogContent = useMemo(() => {
    const productText =
      productId.length === 1
        ? translate("delete_products.selected_product")
        : translate("delete_products.selected_products");
    return (
      <>
        <DialogContent>
          <DialogContentText>{`${translate("delete_selected")} ${productId.length} ${productText}`}</DialogContentText>
        </DialogContent>
        <TextareaAutosize
          placeholder={translate("comments")}
          className={classes.textAreaAutoSize}
          onChange={handleComment}
        />
      </>
    );
  }, [productId]);

  return (
    <>
      <SimpleModel
        dialogContent={dialogContent}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("save")}
        openModal={openModal}
        handleClose={closeDeleteModal}
        handleAction={deleteHandler}
        isDisable={!deleteMessage}
      />
    </>
  );
};

DeleteProduct.propTypes = {
  id: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  productId: PropTypes.arrayOf(PropTypes.any).isRequired,
  setOpenModalClose: PropTypes.func.isRequired,
};

export default DeleteProduct;
