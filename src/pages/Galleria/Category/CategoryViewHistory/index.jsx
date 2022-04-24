/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../components/SimpleGrid";
import DateAndSearchFilters from "../../../../components/DateAndSearchFilters";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component for History List contains a simple grid with having history details that gets opened on click of view history button
 *
 * @param {*} props all the props needed for Category History List
 * @returns {React.ReactElement} returns a Category History List component
 */
const ViewHistory = (props) => {
  const translate = useTranslate();
  const history = useHistory();
  const selectedCategoryId = localStorage.getItem("selectedCategoryId");

  /**
   * @function cancelTagHandler function called on click of Close button of Category View History
   * @returns {React.ReactElement} returns the previously loaded component
   */
  const handleCloseHandler = () => history.goBack();

  const configurationForCategoryViewHistoryGrid = [
    { source: "section", type: "TextField", label: translate("entity") },
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
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: selectedCategoryId,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show`,
    },
    { displayName: translate("view_history") },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/history`}
        configurationForGrid={configurationForCategoryViewHistoryGrid}
        actionButtonsForGrid={actionButtonsForCategoryViewHistoryGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyViewHistoryGrid}
        gridTitle={historyGridTitle}
        searchLabel={viewHistorySearchLabel}
        filter={{ categoryId: selectedCategoryId }}
        sortField={{ field: "updatedAt", order: "DESC" }}
        filters={<DateAndSearchFilters searchLabel={viewHistorySearchLabel} {...props} />}
      />
    </>
  );
};

export default ViewHistory;
