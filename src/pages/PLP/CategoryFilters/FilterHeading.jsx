import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid } from "@material-ui/core";
import { useTranslate } from "react-admin";
import formatDateValue from "../../../utils/formatDateTime";
import filterStyle from "../Filter/FilterStyle";
import useStyles from "../../../assets/theme/common";

/**
 * Component to render the Filter Heading Page of PLP filter
 *
 * @param {object} props all the props required by the Filter Heading Page of PLP filter
 * @returns {React.ReactElement} returns the Filter Heading Page of PLP filter
 */
const FilterHeading = (props) => {
  const { id, categoryName, categoryUrl, hasOverride, isEnabled, isOverride, inheritedFrom, updatedAt } = props;
  const translate = useTranslate();
  const filterClasses = filterStyle();
  const classes = useStyles();

  return (
    <>
      <Grid item xs={4}>
        {categoryName && (
          <Typography variant="h4" className={filterClasses.categoryFilterHeading}>
            {`${categoryName} [${translate("id")}:${id}]`}
          </Typography>
        )}
        {categoryUrl && (
          <Typography variant="h4" className={filterClasses.categoryFilterHeading}>
            {`${categoryUrl} `}
          </Typography>
        )}
        {hasOverride && isEnabled && !isOverride && (
          <>
            <Typography variant="h6" className={classes.secondaryHeading}>
              {`${translate("plp_global_filter.inherited_from")} ${inheritedFrom}`}
            </Typography>
            <Typography variant="h6" className={classes.secondaryText}>
              {translate("plp_global_filter.use_override_config")}
            </Typography>
          </>
        )}
        {isOverride && (
          <>
            <Typography variant="h6" className={classes.secondaryHeading}>
              {translate("plp_global_filter.overridden_config_msg")}
            </Typography>
            <Typography variant="h6" className={classes.secondaryText}>
              {formatDateValue(updatedAt)}
            </Typography>
          </>
        )}
      </Grid>
    </>
  );
};

FilterHeading.propTypes = {
  id: PropTypes.string.isRequired,
  categoryName: PropTypes.string,
  categoryUrl: PropTypes.string.isRequired,
  hasOverride: PropTypes.bool.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isOverride: PropTypes.bool.isRequired,
  inheritedFrom: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
};

FilterHeading.defaultProps = {
  categoryName: "",
};

export default FilterHeading;
