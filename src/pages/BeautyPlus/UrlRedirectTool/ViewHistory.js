/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../components/SimpleGrid";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DateAndSearchFilters from "../../../components/DateAndSearchFilters";

/**
 * Component for History List contains a simple grid with having history details that gets opened on click of view history button
 *
 * @param {object} props all the props needed for Category History List
 * @returns {React.ReactElement} returns a Category History List component
 */
const ViewHistory = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const { match } = props;
  const [state] = useState({
    sourceUrl: history?.location?.search ? new URLSearchParams(history.location.search).get("sourceUrl") : "",
    id: match?.params?.id,
  });
  const { sourceUrl, id } = state;
  const [breadcrumbsList] = useState([
    {
      displayName: translate("url_redirect_tool"),
      navigateTo: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`,
    },
    {
      displayName: id,
      navigateTo: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}/show`,
    },
    {
      displayName: translate("view_history"),
    },
  ]);

  /**
   * @function handleCloseHandler function called on click of Close button of Category View History
   */
  const handleCloseHandler = () => {
    history.goBack();
  };

  const configurationForCategoryViewHistoryGrid = [
    { source: "id", type: "TextField", label: translate("id") },
    { source: "fieldName", type: "TextField", label: translate("field_name") },
    { source: "oldValue", type: "TextField", label: translate("old_value") },
    { source: "newValue", type: "TextField", label: translate("new_value") },
    { source: "updatedBy", type: "TextField", label: translate("updated_by") },
    { source: "updatedAt", type: "CustomDateField", label: translate("modified_date") },
    { source: "comment", type: "TextField", label: translate("comments") },
  ];
  const actionButtonsForCategoryViewHistoryGrid = [
    {
      type: "Button",
      label: translate("close"),
      icon: <></>,
      onClick: handleCloseHandler,
      variant: "outlined",
    },
  ];
  const actionButtonsForEmptyViewHistoryGrid = [
    {
      type: "Button",
      label: translate("close"),
      icon: <></>,
      onClick: handleCloseHandler,
      variant: "outlined",
    },
  ];
  const historyGridTitle = translate("view_history");
  const viewHistorySearchLabel = translate("view_history_search_label");
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/history`}
        configurationForGrid={configurationForCategoryViewHistoryGrid}
        actionButtonsForGrid={actionButtonsForCategoryViewHistoryGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyViewHistoryGrid}
        gridTitle={historyGridTitle}
        searchLabel={viewHistorySearchLabel}
        sortField={{ field: "id", order: "ASC" }}
        filter={{ sourceUrl }}
        filters={<DateAndSearchFilters searchLabel={viewHistorySearchLabel} {...props} />}
      />
    </>
  );
};

ViewHistory.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};

ViewHistory.defaultProps = {
  match: {},
};
export default ViewHistory;
