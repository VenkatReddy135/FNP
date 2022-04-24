/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { Grid, Typography } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import GenericRadioGroup from "../../../../../../components/RadioGroup";
import SwitchComp from "../../../../../../components/switch";

/**
 * Component to render the ProductConfigurations for GEMS create product
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const ProductConfigurations = (props) => {
  const { formData = {} } = props;
  const {
    isPerishable,
    isReusable,
    isBreakable,
    isSearchable,
    isIncludeInFeed,
    isIncludeInSitemap,
    isLocationTracking,
  } = formData;
  const classes = useStyles();
  const translate = useTranslate();

  const options = [
    { id: true, name: "Yes" },
    { id: false, name: "No" },
  ];

  return (
    <>
      <Grid className={classes.listStyle}>
        <Typography data-testid="product_configurations" variant="h4">
          {translate("product_configurations")}
        </Typography>
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          <Grid container data-testid="is_enabled" direction="column">
            <Typography variant="caption">{translate("isEnabled")}</Typography>
            <SwitchComp disable={false} onChange={() => {}} />
          </Grid>
        </Grid>
        <Grid item data-testid="is_perishable" xs={4}>
          <GenericRadioGroup
            name="isPerishable"
            label={translate("is_perishable")}
            source="isPerishable"
            choices={options}
            editable
            displayText={isPerishable ? "YES" : "NO"}
          />
        </Grid>
        <Grid item data-testid="is_reusable" xs={4}>
          <GenericRadioGroup
            name="isReusable"
            label={translate("is_reusable")}
            source="isReusable"
            choices={options}
            editable
            displayText={isReusable ? "YES" : "NO"}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item data-testid="is_breakable" xs={4}>
          <GenericRadioGroup
            name="isBreakable"
            label={translate("is_breakable")}
            source="isBreakable"
            choices={options}
            editable
            displayText={isBreakable ? "YES" : "NO"}
          />
        </Grid>
        <Grid item data-testid="is_searchable" xs={4}>
          <GenericRadioGroup
            name="isSearchable"
            label={translate("is_searchable")}
            source="isSearchable"
            choices={options}
            editable
            displayText={isSearchable ? "YES" : "NO"}
          />
        </Grid>
        <Grid item data-testid="include_in_product_feed" xs={4}>
          <GenericRadioGroup
            name="isIncludeInFeed"
            label={translate("include_in_product_feed")}
            source="isIncludeInFeed"
            choices={options}
            editable
            displayText={isIncludeInFeed ? "YES" : "NO"}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item data-testid="include_in_product_sitemap" xs={4}>
          <GenericRadioGroup
            name="isIncludeInSitemap"
            label={translate("include_in_product_sitemap")}
            source="isIncludeInSitemap"
            choices={options}
            editable
            displayText={isIncludeInSitemap ? "YES" : "NO"}
          />
        </Grid>
        <Grid item data-testid="is_location_tracking" xs={4}>
          <GenericRadioGroup
            name="isLocationTracking"
            label={translate("location")}
            source="isLocationTracking"
            choices={options}
            editable
            displayText={isLocationTracking ? "YES" : "NO"}
          />
        </Grid>
      </Grid>
    </>
  );
};

ProductConfigurations.propTypes = {
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(ProductConfigurations);
