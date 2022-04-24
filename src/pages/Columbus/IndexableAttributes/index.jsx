import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector, useDispatch } from "react-redux";
import { useTranslate } from "react-admin";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
import DomainDropdown from "../../../components/DomainDropdown";
import ConfigurationForm from "./ConfigurationForm";
import { saveFormData } from "../../../actions/columbus";
import Breadcrumbs from "../../../components/Breadcrumbs";

/**
 * Indexable Attributes page to select the domain and configuration forms
 *
 * @function IndexableAttributes
 * @returns {React.ReactElement} Indexable Attributes Page.
 */
const IndexableAttributes = () => {
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const translate = useTranslate();
  const classes = useStyles();
  const show = !!domain;
  const dispatch = useDispatch();
  const breadcrumbs = [{ displayName: translate("indexable_attribute.main_title") }];

  useEffect(() => {
    dispatch(saveFormData({ weightage: {}, capping: {}, lookBackWindow: {}, error: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h5" className={classes.mainTitleHeading}>
        {translate("indexable_attribute.main_title")}
      </Typography>
      <Divider variant="fullWidth" className={classes.headerClass} />
      <DomainDropdown />
      <Divider variant="fullWidth" />
      {show && <ConfigurationForm domain={domain} />}
    </>
  );
};

export default IndexableAttributes;
