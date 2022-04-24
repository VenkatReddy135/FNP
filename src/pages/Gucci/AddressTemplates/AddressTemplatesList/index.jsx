/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import CommonDelete from "../../../../components/CommonDelete";
import useStyles from "../../../../assets/theme/common";

/**
 * Component for Address templates list functionality which lists address templates of various countries
 *
 * @param {*} props all the props needed for Address Templates List
 * @returns {React.ReactElement} returns a Address Templates List
 */
const AddresTemplatesList = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const addressTemplateGridTitle = translate("address_templates_configuration");
  const addressTemplateSearchLabel = translate("search");
  const [openModal, toggleModal] = useState(false);

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
      routeType: "/show",
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "/edit",
      isEditable: true,
    },
    {
      type: translate("delete"),
      leftIcon: <DeleteOutlineOutlinedIcon />,
      onClick: deleteHandler,
      id: "3",
      path: "",
      routeType: "",
    },
  ];
  const configurationForAddressTemplatesGrid = [
    {
      source: "categoryName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("country"),
      tabPath: "",
      isLink: false,
    },
    { source: "categoryType", type: "TextField", label: translate("last_updated_by") },
  ];
  const actionButtonsForAddressTemplatesListGrid = [
    {
      type: "CreateButton",
      label: translate("new_custom_template"),
      icon: <></>,
      variant: "outlined",
    },
  ];
  const actionButtonsForAddressTemplatesEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("new_custom_template"),
      icon: <></>,
      variant: "outlined",
    },
  ];

  return (
    <>
      <div className={classes.containerWrapper}>
        <SimpleGrid
          {...props}
          resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
          configurationForGrid={configurationForAddressTemplatesGrid}
          actionButtonsForGrid={actionButtonsForAddressTemplatesListGrid}
          actionButtonsForEmptyGrid={actionButtonsForAddressTemplatesEmptyGrid}
          gridTitle={addressTemplateGridTitle}
          searchLabel={addressTemplateSearchLabel}
          isSmallerSearch
        />
      </div>
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`}
        deleteText={`${translate("delete_confirmation_message")} ${translate("template_label")}${translate(
          "question_mark",
        )}`}
        close={() => toggleModal(false)}
        open={openModal}
        list
      />
    </>
  );
};
export default AddresTemplatesList;
