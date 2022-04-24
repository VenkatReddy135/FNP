/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../../../components/SimpleGrid";
import DateAndSearchFilters from "../../../../../../components/DateAndSearchFilters";
import Breadcrumbs from "../../../../../../components/Breadcrumbs";

/**
 * Component for History List contains a simple grid with having history details that gets opened on click of view history button
 *
 * @param {object} props all the props needed for Category History List
 * @returns {React.ReactElement} returns a History List component
 */
const ViewHistory = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const { match } = props;
  const tagId = match.params.id;

  /**
   * @function handleCloseHandler function called on click of Close button of Category View History
   */
  const handleCloseHandler = () => {
    history.goBack();
  };
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    {
      displayName: tagId,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show`,
    },
    { displayName: translate("view_history") },
  ];

  const configurationForCategoryViewHistoryGrid = [
    { source: "section", type: "TextField", label: translate("entityName") },
    { source: "fieldName", type: "TextField", label: translate("field_name") },
    { source: "oldValue", type: "TextField", label: translate("old_value") },
    { source: "newValue", type: "TextField", label: translate("new_value") },
    { source: "updatedByName", type: "TextField", label: translate("updated_by") },
    { source: "updatedAt", type: "CustomDateField", label: translate("modified_date") },
    { source: "action", type: "TextField", label: translate("action") },
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
  const historyGridTitle = translate("view_history");
  const viewHistorySearchLabel = translate("view_history_search_label");
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/tags/history`}
        configurationForGrid={configurationForCategoryViewHistoryGrid}
        actionButtonsForGrid={actionButtonsForCategoryViewHistoryGrid}
        gridTitle={historyGridTitle}
        searchLabel={viewHistorySearchLabel}
        sortField={{ field: "updatedAt", order: "DESC" }}
        filters={<DateAndSearchFilters searchLabel={viewHistorySearchLabel} {...props} />}
        filter={{ tagId: match?.params?.id }}
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
