/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import SimpleGrid from "../../../../../components/SimpleGrid";

/**
 * Component for Service Providers List contains a simple grid with configurations for service providers
 *
 * @param {object} props all the props needed for Service Providers List
 * @returns {React.ReactElement} returns Service Providers list
 */
const ServiceProviderList = (props) => {
  const translate = useTranslate();

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/view",
      isEditable: false,
    },
  ];

  const configurationForServiceProviderGrid = [
    {
      source: "categoryUrl",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("service_providers"),
      tabPath: "/view",
      isLink: true,
    },
    { source: "categoryName", type: "TextField", label: translate("payment_options_supported") },
    { source: "categoryType", type: "TextField", label: translate("countries_supported") },
    { source: "baseCategory", type: "TextField", label: translate("currencies_supported") },
  ];

  const serviceProviderGridTitle = translate("service_providers");
  const serviceProviderSearchLabel = translate("search");

  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
        configurationForGrid={configurationForServiceProviderGrid}
        actionButtonsForGrid={[]}
        actionButtonsForEmptyGrid={[]}
        gridTitle={serviceProviderGridTitle}
        searchLabel={serviceProviderSearchLabel}
        isSmallerSearch
      />
    </>
  );
};

export default ServiceProviderList;
