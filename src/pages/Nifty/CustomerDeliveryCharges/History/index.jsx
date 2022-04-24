/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../components/SimpleGrid";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Customer Delivery Chargers View History list
 *
 * @param {object} props all the props needed for Customer Delivery Charges View History list
 * @returns {React.ReactElement} returns history List component
 */
const CustomerDeliveryChargesViewHistory = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const historyListTitle = translate("view_history");
  const configurationForHistoryGrid = [
    {
      source: "updatedBy",
      type: "TextField",
      label: translate("user"),
      sortable: false,
      isLink: false,
    },
    {
      source: "updatedAt",
      type: "CustomDateField",
      label: translate("date_time"),
      sortable: false,
    },
    {
      source: "campaignQuery",
      type: "TextField",
      label: translate("change"),
      sortable: false,
    },
    {
      source: "name",
      type: "TextField",
      label: translate("basePriceModel.model_id"),
      sortable: false,
    },
  ];

  const breadcrumbs = [
    {
      displayName: translate("customerDeliveryCharges.customer_delivery_charges"),
      navigateTo: `/${window.REACT_APP_NIFTY_SERVICE}/customer-delivery-charges/create`,
    },
    { displayName: historyListTitle },
  ];

  /**
   * @function cancelTagHandler function called on click of Close button of View History
   * @returns {React.ReactElement} returns the previously loaded page
   */
  const handleCloseHandler = () => history.goBack();

  const actionButtonsForCategoryViewHistoryGrid = [
    {
      type: "Button",
      label: translate("close"),
      icon: <></>,
      onClick: handleCloseHandler,
      variant: "outlined",
    },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns/history`}
        gridTitle={historyListTitle}
        configurationForGrid={configurationForHistoryGrid}
        actionButtonsForGrid={actionButtonsForCategoryViewHistoryGrid}
        actionButtonsForEmptyGrid={actionButtonsForCategoryViewHistoryGrid}
        sortField={{ field: "updatedAt", order: "DESC" }}
        isSearchEnabled={false}
      />
    </>
  );
};
export default memo(CustomerDeliveryChargesViewHistory);
