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
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";

/**
 * Component for Product tag List with a customizable grid and configurations for tag Listing
 *
 * @param {object} props all the props needed for Product tag List
 * @param {string} props.id product id from route
 * @returns {React.ReactElement} returns a Product tag List component
 */
const ProductTagListing = (props) => {
  const { id } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const [openModal, toggleModal] = useState(false);
  const [state, setState] = useState({
    tagtypes: {},
  });
  const { tagtypes } = state;

  /**
   * @function deleteHandler function called on click of delete icon of Kebab Menu
   */
  const deleteHandler = () => {
    toggleModal(true);
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
      source: "tag.tagName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("tag_name"),
    },
    {
      source: "tag.tagType",
      type: "FunctionField",
      label: translate("tag_type"),
      render: (record) => `${tagtypes[record.tag.tagType]}`,
    },
    { source: "relevancyWeightage.name", type: "TextField", label: translate("relevancy_weightage") },
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
  const handleClick = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GEMS_SERVICE}composition/${id}/create`,
    });
  };

  const actionButtonsForFeatureListGrid = [
    {
      type: "CreateButton",
      label: translate("associate_tag"),
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
      label: translate("associate_tag"),
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

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetDataSuccess = (response) => {
    if (response?.data?.data) {
      const tagTypeVal = {};
      response.data.data.forEach((val) => {
        const { tagTypeId, tagTypeName } = val;
        tagTypeVal[tagTypeId] = tagTypeName;
      });
      setState((prevState) => ({ ...prevState, tagtypes: { ...tagTypeVal } }));
    }
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GALLERIA_SERVICE}/tag-types`, handleSetDataSuccess);
  const tagManagementSearchLabel = translate("search");

  return (
    <div className={classes.containerWrapper}>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForCompositionsGrid}
        actionButtonsForGrid={actionButtonsForFeatureListGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyCompositionsGrid}
        gridTitle={translate("tags")}
        resource={`${window.REACT_APP_GEMS_SERVICE}products/tags`}
        searchLabel={tagManagementSearchLabel}
        filter={{ productId: id }}
        sortField={{ field: "id", order: "ASC" }}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`}
        deleteText={`${translate("delete_confirmation_message")} ${translate("composition_msg")}`}
        close={() => toggleModal(false)}
        open={openModal}
        list
      />
    </div>
  );
};
ProductTagListing.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductTagListing;
