/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector } from "react-redux";
import { useTranslate } from "react-admin";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import DomainDropdown from "../../../../components/DomainDropdown";
import RedirectSearchCreate from "./Create";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Redirect search page to select the domain and configuration forms
 *
 * @param {object} props all the props required by the Redirect Campaign Create
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
    { displayName: translate("redirect_campaign.create_title") },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h5" className={classes.mainTitleHeading}>
        {translate("redirect_campaign.create_title")}
      </Typography>
      <Divider variant="fullWidth" className={classes.headerClass} />
      <DomainDropdown />
      <Divider variant="fullWidth" />
      {show && <RedirectSearchCreate domain={domain} {...props} />}
    </>
  );
};

export default RedirectSearch;
