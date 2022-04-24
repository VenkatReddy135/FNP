/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";

/**
 * Component for Payment Group List contains a simple grid with configurations for payment group settings
 *
 * @param {object} props all the props needed for Payment  Group List
 * @returns {React.ReactElement} returns payment group list
 */
const PaymentGroups = (props) => {
  const translate = useTranslate();
  const { push } = useHistory();

  /**
   *
   * @function  createHandler to redirect Create page
   *  @param {object} event onClick event.
   */
  const createHandler = (event) => {
    event.preventDefault();
    push({
      pathname: `/gucci/v1/group/create`,
    });
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
    },
  ];

  const configurationForGroupGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("payment_group_id"),
      tabPath: "/show",
    },
    { source: "categoryUrl", type: "TextField", label: translate("group_description") },
    { source: "isEnabled", type: "SwitchComp", label: translate("status"), disable: true, record: false },
  ];

  const actionButtonsForGroupGrid = [
    {
      type: "CreateButton",
      label: translate("new_group"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const paymentGroupGridTitle = translate("payment_groups");
  const paymentGroupSearchLabel = translate("search");

  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForGroupGrid}
        actionButtonsForGrid={actionButtonsForGroupGrid}
        actionButtonsForEmptyGrid={actionButtonsForGroupGrid}
        gridTitle={paymentGroupGridTitle}
        searchLabel={paymentGroupSearchLabel}
        isSmallerSearch
      />
    </>
  );
};

export default PaymentGroups;
