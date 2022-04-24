/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";

/**
 * Component for Domain Settings List contains a simple grid with configurations for domain settings
 *
 * @param {object} props all the props needed for Domain Settings List
 * @returns {React.ReactElement} returns domain settings list
 */
const DomainSettingsList = (props) => {
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
      pathname: `/gucci/v1/domain/create`,
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

  const configurationForDomainGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("domain"),
      tabPath: "/show",
    },
    { source: "categoryUrl", type: "TextField", label: translate("geo") },
    { source: "categoryName", type: "TextField", label: translate("channel") },
    { source: "categoryType", type: "TextField", label: translate("delivery_country") },
    { source: "baseCategory", type: "TextField", label: translate("settlement") },
    { source: "workflowStatus", type: "Status", label: translate("group_ID") },
    { source: "isEnabled", type: "SwitchComp", label: translate("status"), disable: true, record: false },
  ];

  const actionButtonsForDomainGrid = [
    {
      type: "CreateButton",
      label: translate("new_mapping"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const domainGridTitle = translate("domain_settings");
  const domainSearchLabel = translate("search");

  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForDomainGrid}
        actionButtonsForGrid={actionButtonsForDomainGrid}
        actionButtonsForEmptyGrid={actionButtonsForDomainGrid}
        gridTitle={domainGridTitle}
        searchLabel={domainSearchLabel}
        isSmallerSearch
      />
    </>
  );
};

export default DomainSettingsList;
