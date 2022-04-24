/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../../../components/SimpleGrid";
import CommonDelete from "../../../../../../components/CommonDelete";
import useStyles from "../../../../../../assets/theme/common";
import { useBoolean } from "../../../../../../utils/CustomHooks";

/**
 * Component for Product Composition List with a customizable grid and configurations for Composition Listing
 *
 * @param {*} props all the props needed for Product Composition List
 * @returns {React.ReactElement} returns a Product Composition List component
 */
const ProductFeaturesListing = (props) => {
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
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      customUrl: `${window.REACT_APP_GEMS_SERVICE}products/features/${id}/edit`,
      isEditable: true,
    },
    {
      id: "2",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationForCompositionsGrid = [
    {
      source: "featureType.name",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("feature_type_name"),
    },
    { source: "featureValue.value", type: "TextField", label: translate("feature_value") },
    { source: "isEnabled", type: "SwitchComp", label: translate("isEnabled"), disable: true, record: false },
    { source: "createdBy", type: "TextField", label: translate("createdBy") },
    { source: "createdAt", type: "CustomDateField", label: translate("createdDate") },
    { source: "updatedBy", type: "TextField", label: translate("lastModifiedBy") },
    { source: "updatedAt", type: "CustomDateField", label: translate("lastModifiedDate") },
  ];

  /**
   * @function createHandler
   *
   * @param {*} event event
   */
  const handleClick = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GEMS_SERVICE}products/features/${id}/associatefeatures`,
    });
  };

  const actionButtonsForFeatureListGrid = [
    {
      type: "CreateButton",
      label: translate("associate_feature"),
      icon: <></>,
      variant: "outlined",
      onClick: handleClick,
    },
    {
      type: "Button",
      label: translate("exportTitle"),
      icon: <></>,
      variant: "outlined",
    },
  ];

  const actionButtonsForEmptyCompositionsGrid = [
    {
      type: "CreateButton",
      label: translate("associate_feature"),
      icon: <></>,
      variant: "outlined",
      onClick: handleClick,
    },
    {
      type: "Button",
      label: translate("export"),
      icon: <></>,
      variant: "contained",
    },
  ];

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForCompositionsGrid}
        actionButtonsForGrid={actionButtonsForFeatureListGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyCompositionsGrid}
        gridTitle={translate("features")}
        resource={`${window.REACT_APP_GEMS_SERVICE}products/features`}
        isSearchEnabled={false}
        filter={{ productId: id }}
        sortField={{ field: "id", order: "ASC" }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GEMS_SERVICE}products/features/${attributeId}`}
        deleteText={`${translate("delete_feature_success")}`}
        close={setOpenDialog.off}
        open={openDialog}
        list
      />
    </div>
  );
};
ProductFeaturesListing.propTypes = {
  id: PropTypes.string.isRequired,
};

ProductFeaturesListing.propTypes = {
  id: PropTypes.string.isRequired,
};
export default ProductFeaturesListing;
