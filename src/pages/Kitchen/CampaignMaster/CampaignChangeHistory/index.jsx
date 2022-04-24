/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from "react";
import { useTranslate } from "react-admin";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import SimpleGrid from "../../../../components/SimpleGrid";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for Change history list
 *
 * @param {object} props all the props needed for ViewChange history list
 * @returns {React.ReactElement} returns history List component
 */
const CampaignChangeHistory = (props) => {
  const { id } = useParams();
  const translate = useTranslate();
  const [title, setTitle] = useState("");
  const historyListTitle = translate("history_grid_title");

  /**
   * @function handleSuccess This function will handle the success scenario
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    setTitle(response?.data?.campaign.name);
  };

  useCustomQueryWithStore("getOne", `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/${id}`, handleSuccess, {
    payload: { id },
  });

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
  ];

  const breadcrumbs = [
    {
      displayName: translate("campaign_manager"),
      navigateTo: `/${window.REACT_APP_KITCHEN_SERVICE}/campaigns`,
    },
    { displayName: translate("view_history_title") },
  ];

  /**
   * @function gridTitle function is used to create the title for the grid
   * @returns {React.ReactElement} returns a React component for title
   */
  const GridTitle = () => (
    <>
      <Box component="span" color="text.secondary">
        {`${historyListTitle}: `}
      </Box>
      {title}
    </>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns/history/${id}`}
        gridTitle={<GridTitle />}
        configurationForGrid={configurationForHistoryGrid}
        actionButtonsForGrid={[]}
        sortField={{ field: "updatedAt", order: "DESC" }}
        isSearchEnabled={false}
      />
    </>
  );
};
export default memo(CampaignChangeHistory);
