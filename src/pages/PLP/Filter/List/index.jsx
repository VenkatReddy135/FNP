/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslate } from "react-admin";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import TagDropdown from "../../../../components/DomainDropdown";
import PLPFiltersList from "./List";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * PLP Filters page to select the domain and configuration forms
 *
 * @param {object} props all the props required by the PLP Filters list List
 * @function PLPFilters
 * @returns {React.ReactElement} PLP Filters list Page.
 */
const PLPFilters = (props) => {
  const { geo } = useSelector((state) => state.TagDropdownData.geoData);
  const classes = useStyles();
  const translate = useTranslate();
  const show = !!geo;
  const breadcrumbs = [{ displayName: translate("plp_global_filter.main_title") }];

  const filterHeading = useMemo(
    () => (
      <>
        <Typography variant="h5" className={classes.mainTitleHeading}>
          {translate("plp_global_filter.main_title")}
        </Typography>
        <Divider variant="fullWidth" className={classes.headerClass} />
      </>
    ),
    [],
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {filterHeading}
      <TagDropdown tagType="geoData" />
      {show && <PLPFiltersList geo={geo} {...props} />}
    </>
  );
};

export default PLPFilters;
