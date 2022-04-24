/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Base Price Model List contains a simple grid with configurations for Base Price
 *
 * @param {object} props all the props needed for Base Price List
 * @returns {React.ReactElement} returns a Base Price List component
 */
const BasePriceList = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const breadcrumbs = [
    {
      displayName: translate("basePriceModel.base_price_model"),
    },
  ];

  /**
   * @function createHandler
   * @param {object} event contains event related data
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_NIFTY_SERVICE}/base-price-model/create`,
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
      leftIcon: <EditIcon />,
      path: "",
      routeType: "",
      isEditable: false,
    },
  ];

  const configurationForBasePriceMasterGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      label: translate("basePriceModel.model_id"),
      configurationForKebabMenu,
      tabPath: "/show",
      isLink: true,
    },
    {
      source: "geo",
      type: "TextField",
      label: translate("geo"),
    },
    {
      source: "salesPercentage",
      type: "TextField",
      label: translate("basePriceModel.sales_percentage"),
    },
    {
      source: "lookbackPeriod",
      type: "TextField",
      label: translate("basePriceModel.look_back_period"),
    },
    {
      source: "ceiling",
      type: "TextField",
      label: translate("basePriceModel.ceiling"),
    },
    {
      source: "fallbackCourierCharge",
      type: "TextField",
      label: translate("basePriceModel.courier_charges"),
    },
    {
      source: "deliveryCharge",
      type: "TextField",
      label: translate("basePriceModel.dc"),
    },
    {
      source: "ppCalculationMethod",
      type: "TextField",
      label: translate("basePriceModel.pp_calculation_method"),
    },
    {
      source: "isDcInWp",
      type: "TextField",
      label: translate("basePriceModel.include_dc"),
    },
    {
      source: "currency",
      type: "TextField",
      label: translate("currency"),
    },
    { source: "createdByName", type: "TextField", label: translate("created_by") },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedByName", type: "TextField", label: translate("modified_by") },
    { source: "updatedAt", type: "CustomDateField", label: translate("modified_date") },
    {
      source: "isEnabled",
      type: "SwitchComp",
      label: translate("status"),
      disable: true,
      record: false,
    },
  ];

  const actionButtonsForBasePriceMasterGrid = [
    {
      type: "CreateButton",
      label: translate("basePriceModel.new_base_price_model"),
      variant: "contained",
      icon: <></>,
      onClick: createHandler,
    },
  ];

  const basePriceTitle = translate("basePriceModel.base_price_model");
  const basePriceSearchLabel = translate("basePriceModel.base_price_search");

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_NIFTY_SERVICE}/base-price-model`}
        configurationForGrid={configurationForBasePriceMasterGrid}
        actionButtonsForGrid={actionButtonsForBasePriceMasterGrid}
        sortField={{ field: "id", order: "DESC" }}
        gridTitle={basePriceTitle}
        searchLabel={basePriceSearchLabel}
        actionButtonsForEmptyGrid={actionButtonsForBasePriceMasterGrid}
      />
    </>
  );
};

export default memo(BasePriceList);
