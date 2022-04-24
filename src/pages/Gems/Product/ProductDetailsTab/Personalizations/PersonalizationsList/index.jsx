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
import { useBoolean } from "../../../../../../utils/CustomHooks";

/**
 * Component for Product Personalization List with a customizable grid and configurations for Personalization Listing
 *
 * @param {object} props all the props needed for Product Personalization List
 * @returns {React.ReactElement} returns a Product Personalization List component
 */
const ProductPersonalizationListing = (props) => {
  const { id } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const [openDialog, setOpenDialog] = useBoolean(false);
  const [attributeId, setAttributeId] = useState("");

  /**
   * DeleteHandler to set association id and toggle the dialog
   *
   * @function deleteHandler
   * @param {string} record id
   */
  const deleteHandler = (record) => {
    setAttributeId(record);
    setOpenDialog.on();
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: `/compositionId=${id}/show`,
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: `/compositionId=${id}`,
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
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("product_attribute_id"),
    },
    { source: "contentType", type: "TextField", label: translate("content_type") },
    { source: "isRequired", type: "BooleanField", label: translate("personalization_required") },
    { source: "label", type: "TextField", label: translate("label") },
    { source: "minimumQuantity", type: "TextField", label: translate("minimum_quantity_allowed") },
    { source: "maximumQuantity", type: "TextField", label: translate("maximum_quantity_allowed") },
    { source: "createdBy", type: "TextField", label: translate("createdBy") },
    { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
    { source: "updatedBy", type: "TextField", label: translate("lastModifiedBy") },
    { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
  ];

  /**
   * @function handleClick
   *
   * @param {object} event event
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GEMS_SERVICE}products/personalizations/${id}/create`,
    });
  };

  const actionButtonsForFeatureListGrid = [
    {
      type: "CreateButton",
      label: translate("new_attribute"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const actionButtonsForEmptyCompositionsGrid = [
    {
      type: "CreateButton",
      label: translate("new_attribute"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForCompositionsGrid}
        actionButtonsForGrid={actionButtonsForFeatureListGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyCompositionsGrid}
        gridTitle={translate("personalizations")}
        resource={`${window.REACT_APP_GEMS_SERVICE}products/personalizations`}
        isSearchEnabled={false}
        filter={{ productId: id }}
        sortField={{ field: "id", order: "ASC" }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GEMS_SERVICE}products/personalizations/${attributeId}`}
        deleteText={`${translate("delete_success_personalization")}`}
        close={setOpenDialog.off}
        open={openDialog}
        list
      />
    </div>
  );
};
ProductPersonalizationListing.propTypes = {
  id: PropTypes.string.isRequired,
};

ProductPersonalizationListing.propTypes = {
  id: PropTypes.string.isRequired,
};
export default ProductPersonalizationListing;
