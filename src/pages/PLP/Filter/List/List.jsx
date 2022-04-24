/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../components/SimpleGrid";
import Create from "./Create";
import FilterSearchInput from "./FilterSearchInput/index";

/**
 * Component for PLP filter List contains a simple grid with configurations for PLP filter list
 *
 * @param {object} props resource, geo name etc the props needed for PLP filter List
 * @returns {React.ReactElement} returns a PLP filter List component
 */
const PLPFilterList = (props) => {
  const { geo, location } = props;
  const translate = useTranslate();
  const [clearSearchFilter, setClearSearchFilter] = useState(false);
  const [openCreateFilterModel, setOpenCreateFilterModel] = useState(false);
  const configurationForKebabMenu = [];

  /**
   * @function resetClearSearchFilter
   * To reset clearSearchFilter value to false
   */
  const resetClearSearchFilter = () => {
    setClearSearchFilter(false);
  };

  useEffect(() => {
    if (location.search !== "") {
      setClearSearchFilter(true);
    }
  }, [geo]);

  /**
   * @function createHandler To open a create modal
   *
   * @param {object} e event data for create button
   */
  const createHandler = (e) => {
    e.preventDefault();
    setOpenCreateFilterModel(true);
  };

  const configurationForGrid = [
    {
      source: "filterId",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("plp_global_filter.filter_id"),
      tabPath: "",
      isLink: true,
      isAnchorLink: true,
    },
    { source: "isEnabled", type: "SwitchComp", label: translate("status"), disable: true },
    { source: "createdAt", type: "CustomDateField", label: translate("created_date") },
    { source: "updatedAt", type: "CustomDateField", label: translate("last_updated_date") },
    { source: "createdBy", type: "TextField", label: translate("created_by") },
    { source: "updatedBy", type: "TextField", label: translate("last_updated_by") },
  ];
  const actionButtonsForGrid = [
    {
      type: "CreateButton",
      label: translate("plp_global_filter.create"),
      icon: <></>,
      onClick: createHandler,
      variant: "outlined",
    },
  ];

  const filterSearchLabel = translate("plp_global_filter.search_filter");
  return (
    <>
      <Create
        geo={geo}
        openCreateFilterModel={openCreateFilterModel}
        setOpenCreateFilterModel={setOpenCreateFilterModel}
      />
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForGrid}
        actionButtonsForGrid={actionButtonsForGrid}
        gridTitle=""
        searchLabel={filterSearchLabel}
        resource={`${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`}
        filter={{ geo }}
        sortField={{ field: "filterId", order: "ASC" }}
        actionButtonsForEmptyGrid={actionButtonsForGrid}
        clearSearchFilter={clearSearchFilter}
        resetClearSearchFilter={resetClearSearchFilter}
        filters={<FilterSearchInput searchLabel={filterSearchLabel} {...props} />}
      />
    </>
  );
};

PLPFilterList.propTypes = {
  resource: PropTypes.string.isRequired,
  geo: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PLPFilterList;
