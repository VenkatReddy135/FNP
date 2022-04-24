/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../../components/CommonDelete";
import useStyles from "../../../../../../assets/theme/common";

/**
 * Component for Product Composition List with a customizable grid and configurations for Composition Listing
 *
 * @param {*} props all the props needed for Product Composition List
 * @returns {React.ReactElement} returns a Product Composition List component
 */
const ProductCompositionListing = (props) => {
  const { id } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const [state, setState] = useState({
    deleteModal: false,
    selectedId: null,
  });
  const { deleteModal, selectedId } = state;

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} rowId selected id to delete
   */
  const deleteHandler = (rowId) => {
    setState((prevState) => ({ ...prevState, selectedId: rowId, deleteModal: true }));
  };

  /**
   * @function closeDeletePopup
   */
  const closeDeletePopup = () => {
    setState((prevState) => ({ ...prevState, selectedId: null, deleteModal: false }));
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      customUrl: `${window.REACT_APP_GEMS_SERVICE}products/composition/${id}/show`,
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      customUrl: `${window.REACT_APP_GEMS_SERVICE}products/composition/${id}/edit`,
      isEditable: true,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationForCompositionsGrid = [
    {
      source: "compositionProduct.skuCode",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("sku_code"),
    },
    { source: "compositionProduct.id", type: "TextField", label: translate("product_id") },
    { source: "compositionProduct.name", type: "TextField", label: translate("product_name") },
    { source: "quantity", type: "NumberField", label: translate("product_quantity") },
    { source: "suggestedMarkupPercentage", type: "NumberField", label: translate("suggested_markup_percentage") },
    { source: "createdByName", type: "TextField", label: translate("createdBy") },
    { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
    { source: "updatedByName", type: "TextField", label: translate("lastModifiedBy") },
    { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
  ];

  /**
   * @function createHandler
   *
   * @param {*} event event
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GEMS_SERVICE}products/composition/${id}/create`,
    });
  };

  const actionButtonsForCompositionsGrid = [
    {
      type: "CreateButton",
      label: translate("new_composition"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
    {
      type: "Button",
      label: translate("export"),
      icon: <></>,
      variant: "outlined",
    },
  ];
  const actionButtonsForEmptyCompositionsGrid = [
    {
      type: "CreateButton",
      label: translate("new_composition"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
    {
      type: "Button",
      label: translate("export"),
      icon: <></>,
      variant: "contained",
    },
  ];

  const compositionGridTitle = translate("composition");

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForCompositionsGrid}
        actionButtonsForGrid={actionButtonsForCompositionsGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyCompositionsGrid}
        gridTitle={compositionGridTitle}
        resource={`${window.REACT_APP_GEMS_SERVICE}products/compositions`}
        isSearchEnabled={false}
        filter={{ productId: id }}
        sortField={{ field: "compositionProduct.id", order: "ASC" }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GEMS_SERVICE}products/compositions/${selectedId}`}
        deleteText={translate("composition_delete_message")}
        close={closeDeletePopup}
        open={deleteModal}
        list
      />
    </div>
  );
};
ProductCompositionListing.propTypes = {
  id: PropTypes.string.isRequired,
};

ProductCompositionListing.propTypes = {
  id: PropTypes.string.isRequired,
};
export default ProductCompositionListing;
