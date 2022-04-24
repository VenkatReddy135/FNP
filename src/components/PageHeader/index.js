import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import useStyles from "./pageHeaderStyles";

/**
 * Component for view the PathName and Page header
 *
 * @param {object} props all the props needed for pathName and Page Header
 * @returns {React.ReactElement} returns a pathName and Page Header
 */
const PageHeader = (props) => {
  const { header, buttonName, onUpdateClick, enableButton } = props;
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.pageHeadContainer}>
        <Box>
          <Box className={classes.pageHeader}>
            <Typography variant="" component="">
              {header.ruleLabel && `${header.ruleLabel}   : `}
            </Typography>
            <Typography variant="" component="" className={classes.headingColor}>
              {header.ruleName}
            </Typography>
          </Box>
        </Box>
        <Box>
          {enableButton && (
            <Button variant="contained" onClick={onUpdateClick} className={classes.buttonStyle}>
              {buttonName}
            </Button>
          )}
        </Box>
      </Box>
      <Divider variant="fullWidth" />
    </Box>
  );
};

PageHeader.propTypes = {
  enableButton: PropTypes.bool,
  header: PropTypes.objectOf(PropTypes.any).isRequired,
  buttonName: PropTypes.string.isRequired,
  onUpdateClick: PropTypes.func,
};

PageHeader.defaultProps = {
  enableButton: false,
  onUpdateClick: () => null,
};

export default PageHeader;
