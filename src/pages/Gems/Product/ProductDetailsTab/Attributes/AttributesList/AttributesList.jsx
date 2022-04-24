/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../../../components/SimpleGrid";
import useStyles from "../../../../../../assets/theme/common";
import CommonDelete from "../../../../../../components/CommonDelete";
import { useBoolean } from "../../../../../../utils/CustomHooks";

/**
 * Component for Product Attribute List with a customizable grid and configurations for Attribute Listing
 *
 * @param {*} props all the props needed for Product Attribute List
 * @param {string} props.id attribute id
 * @param {object} props.history is used for routing
 * @returns {React.ReactElement} returns a Product Attribute List component
 */
const AttributesList = (props) => {
  const { id, history } = props;
  const classes = useStyles();
  const translate = useTranslate();
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
      routeType: "/edit",
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
  const configurationForAttributesGrid = [
    {
      source: "attributeType.name",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("attribute_type"),
    },
    { source: "attributeName", type: "TextField", label: translate("attribute_name") },
    { source: "attributeValue", type: "NumberField", label: translate("attribute_value") },
    { source: "isEnabled", type: "SwitchComp", label: translate("is_enabled"), disable: true, record: false },
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
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GEMS_SERVICE}products/attributes/${id}/create`,
    });
  };

  const actionButtonsForAttributesGrid = [
    {
      type: "CreateButton",
      label: translate("associate_attribute"),
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
  const actionButtonsForEmptyAttributesGrid = [
    {
      type: "CreateButton",
      label: translate("associate_attribute"),
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

  const attributeGridTitle = translate("attributes");
  const attributesSearchLabel = translate("search");

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForAttributesGrid}
        actionButtonsForGrid={actionButtonsForAttributesGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyAttributesGrid}
        gridTitle={attributeGridTitle}
        resource={`${window.REACT_APP_GEMS_SERVICE}products/attributes`}
        searchLabel={attributesSearchLabel}
        isSearchEnabled={false}
        filter={{ productId: id }}
        sortField={{ field: "id", order: "ASC" }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GEMS_SERVICE}products/attributes/${attributeId}`}
        deleteText={`${translate("delete_attribute_message")}`}
        close={setOpenDialog.off}
        open={openDialog}
        list
      />
    </div>
  );
};
AttributesList.propTypes = {
  id: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any),
};

AttributesList.defaultProps = {
  id: "",
  history: {},
};
export default AttributesList;
