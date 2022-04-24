import PropTypes from "prop-types";
import React from "react";
import { useTranslate } from "react-admin";
import { Typography } from "@material-ui/core";
import GridActions from "../GridActionButtons";
import useStyles from "../../assets/theme/common";

/**
 * Component for displaying message and actions buttons when there is no record present on the Simple grid
 *
 * @param {*} props all the props required by EmptyPage component
 * @returns {React.ReactElement} returns a React component for Empty Page
 */
const EmptyPage = (props) => {
  const { actionButtonsForEmptyGrid, additionalLink } = props;
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <div className={classes.emptyRecords}>
        <Typography variant="h5" paragraph>
          {translate("no_results_found")}
        </Typography>
      </div>
      {actionButtonsForEmptyGrid ? (
        <GridActions actionButtonsForGrid={actionButtonsForEmptyGrid} additionalLink={additionalLink} />
      ) : null}
    </>
  );
};

EmptyPage.propTypes = {
  actionButtonsForEmptyGrid: PropTypes.arrayOf(PropTypes.object),
  additionalLink: PropTypes.element,
};
EmptyPage.defaultProps = {
  actionButtonsForEmptyGrid: null,
  additionalLink: <></>,
};

export default React.memo(EmptyPage);
