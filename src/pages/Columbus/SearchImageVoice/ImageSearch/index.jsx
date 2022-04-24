import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector } from "react-redux";
import { useTranslate } from "react-admin";
import { useLocation } from "react-router-dom";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import DomainDropdown from "../../../../components/DomainDropdown";
import SearchImage from "../ToggleSearch";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Image search to select the domain and attribute name
 *
 * @function ImageSearch
 * @returns {React.ReactElement} Redirect Search Page.
 */
const ImageSearch = () => {
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const translate = useTranslate();
  const classes = useStyles();
  const location = useLocation();
  const resourceName = location.pathname === "/columbus/image-search" ? "imagesearch" : "voicesearch";
  const show = !!domain;
  const breadcrumbs = [
    {
      displayName:
        resourceName === "imagesearch"
          ? translate("image_voice_search.image_title")
          : translate("image_voice_search.voice_title"),
    },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h5" className={classes.mainTitleHeading}>
        {resourceName === "imagesearch"
          ? translate("image_voice_search.image_title")
          : translate("image_voice_search.voice_title")}
      </Typography>
      <Divider variant="fullWidth" className={classes.headerClass} />
      <DomainDropdown />
      <Divider variant="fullWidth" />
      {show && <SearchImage domainId={domain} attributeName={resourceName} />}
    </>
  );
};

export default ImageSearch;
