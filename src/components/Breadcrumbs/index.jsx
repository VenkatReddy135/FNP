import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Breadcrumbs } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "./BreadcrumbStyles";

/**
 * Component for showing the breadcrumbs
 *
 * @param {object} props contains breadcrumbs structure
 * @returns {React.ReactElement} returns a breadcrumb component with all the links and names
 */
const CustomBreadCrumbs = (props) => {
  const { breadcrumbs } = props;
  const classes = useStyles();

  return (
    <Box className={classes.breadcrumbContainer}>
      <Breadcrumbs
        separator={
          <img src="/images/double-arrow.svg" alt="double-arrow" height={8} width={8} className={classes.arrow} />
        }
        aria-label="breadcrumbs"
      >
        {breadcrumbs.map((bread) =>
          bread?.navigateTo ? (
            <Link key={bread.navigateTo} to={bread.navigateTo}>
              {bread.displayName}
            </Link>
          ) : (
            <Typography className={classes.landingPage} key={bread.displayName}>
              {bread.displayName}
            </Typography>
          ),
        )}
      </Breadcrumbs>
    </Box>
  );
};

CustomBreadCrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CustomBreadCrumbs;
