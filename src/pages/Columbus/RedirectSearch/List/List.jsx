/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import CommonDelete from "../../../../components/CommonDelete";

/**
 * Component for redirect campaign List contains a simple grid with configurations for redirect list
 *
 * @param {object} props resource, domain name etc the props needed for redirect campaign List
 * @returns {React.ReactElement} returns a redirect campaign List component
 */
const RedirectSearchList = (props) => {
  const { domain, location } = props;
  const translate = useTranslate();
  const history = useHistory();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [campaignId, setCampaignId] = useState();
  const [clearSearchFilter, setClearSearchFilter] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  /**
   * @function createHandler
   * @param {object} event contains event related data
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns/create`,
      state: { domainId: domain },
    });
  };

  /**
   * DeleteHandler to toggle the delete dialog
   *
   * @function deleteHandler
   * @param {string} id selected campaign id to delete
   */
  const deleteHandler = (id) => {
    setCampaignId(id);
    setOpenConfirmModal(true);
  };
  const configurationForKebabMenu = [
    { id: "1", type: "Edit", leftIcon: <EditOutlinedIcon />, path: "", routeType: "", isEditable: true },
    {
      id: "2",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationForUserGrid = [
    {
      source: "campaignName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("redirect_campaign.campaign_name"),
      tabPath: "",
      isLink: false,
    },
    { source: "geoId", type: "TextField", label: translate("redirect_campaign.geo") },
    { source: "keywords", type: "TextField", label: translate("redirect_campaign.keyword"), sortable: false },
    { source: "targetUrl", type: "TextField", label: translate("url") },
    { source: "fromDate", type: "CustomDateField", label: translate("redirect_campaign.from_date") },
    { source: "thruDate", type: "CustomDateField", label: translate("redirect_campaign.through_date") },
  ];
  const actionButtonsForUserGrid = [
    {
      type: "CreateButton",
      label: translate("redirect_campaign.create_title"),
      icon: <></>,
      onClick: createHandler,
      variant: "outlined",
    },
  ];
  const redirectSearchLabel = translate("redirect_campaign.search_place_holder");

  const actionButtonsForEmptyGrid = [
    {
      type: "CreateButton",
      label: translate("redirect_campaign.create_title"),
      icon: <></>,
      onClick: createHandler,
      variant: "outlined",
    },
  ];

  return (
    <>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForUserGrid}
        actionButtonsForGrid={actionButtonsForUserGrid}
        gridTitle=""
        searchLabel={redirectSearchLabel}
        resource={`${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`}
        filter={{ domainId: domain }}
        sortField={{ field: "createdAt", order: "DESC" }}
        actionButtonsForEmptyGrid={actionButtonsForEmptyGrid}
        clearSearchFilter={clearSearchFilter}
        resetClearSearchFilter={resetClearSearchFilter}
      />
      <CommonDelete
        resource={`${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns/${campaignId}`}
        redirectPath={`/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`}
        params={{}}
        close={() => setOpenConfirmModal(false)}
        open={openConfirmModal}
        list
        deleteText={`${translate("delete_confirmation_message")} ${translate(
          "redirect_campaign.redirect_delete_text",
        )}?`}
      />
    </>
  );
};

RedirectSearchList.propTypes = {
  resource: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RedirectSearchList;
