/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from "react";
import { useTranslate } from "react-admin";
import { Box } from "@material-ui/core";
import SimpleGrid from "../../../../components/SimpleGrid";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for ViewChange history list
 *
 * @param {object} props all the props needed for ViewChange history list
 * @returns {React.ReactElement} returns history List component
 */
const ViewChangeHistory = (props) => {
  const translate = useTranslate();
  const historyListTitle = translate("view_history_title");
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
      label: translate("campaign_name"),
      sortable: false,
    },
  ];

  const breadcrumbs = [
    {
      displayName: translate("campaign_manager"),
      navigateTo: `/${window.REACT_APP_KITCHEN_SERVICE}/campaigns`,
    },
    { displayName: historyListTitle },
  ];

  /**  Component for Title of the Grid
   *
   * @returns {React.ReactElement} returns a React component for title
   */
  const GridTitle = () => (
    <Box component="span" color="text.secondary">
      {`${historyListTitle}`}
    </Box>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns/history`}
        gridTitle={<GridTitle />}
        configurationForGrid={configurationForHistoryGrid}
        actionButtonsForGrid={[]}
        sortField={{ field: "updatedAt", order: "DESC" }}
        isSearchEnabled={false}
      />
    </>
  );
};
export default memo(ViewChangeHistory);
