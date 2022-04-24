/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector } from "react-redux";
import { useTranslate } from "react-admin";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import DomainDropdown from "../../../../components/DomainDropdown";
import RedirectSearchEdit from "./Edit";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Redirect search page to select the domain and configuration forms
 *
 * @param {object} props all the props required by the Redirect Campaign Edit
 * @function RedirectSearch
 * @returns {React.ReactElement} Redirect Search Page.
 */
const RedirectSearch = (props) => {
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const translate = useTranslate();
  const classes = useStyles();
  const show = !!domain;
  const breadcrumbs = [
    {
      displayName: translate("redirect_campaign.redirect_search_title"),
      navigateTo: `/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`,
    },
    { displayName: "" },
  ];
  const [breadcrumbsData, setBreadcrumbsData] = useState(breadcrumbs);

  /**
   * @function getCampaignName to show selected campaign value in breadcrumb
   * @param {string} name to set campaignName
   */
  const getCampaignName = (name) => {
    const breadcrumb = [...breadcrumbsData];
    breadcrumb[1].displayName = name;
    setBreadcrumbsData(breadcrumb);
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsData} />
      <Typography variant="h5" className={classes.mainTitleHeading}>
        {translate("redirect_campaign.edit_title")}
      </Typography>
      <Divider variant="fullWidth" className={classes.headerClass} />
      <DomainDropdown />
      <Divider variant="fullWidth" />
      {show && <RedirectSearchEdit domain={domain} getCampaignName={getCampaignName} {...props} />}
    </>
  );
};

export default RedirectSearch;
