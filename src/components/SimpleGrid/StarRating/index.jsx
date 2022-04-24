import React from "react";
import Rating from "@material-ui/lab/Rating";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  ratingContainer: {
    marginTop: "20px",
  },
}));

/**
 * Function to convert rating values into Star rating to display in Grid
 *
 * @name StarRating
 * @param {object} props - Passing record, source
 * @returns {React.ReactElement} returns star rating component
 */
const StarRating = (props) => {
  const { record, source } = props;
  const classes = useStyles();

  return (
    <Rating className={classes.ratingContainer} data-testid="star-rating" defaultValue={record[source]} readOnly />
  );
};

StarRating.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  source: PropTypes.string.isRequired,
};
StarRating.defaultProps = {
  record: {},
};

export default StarRating;
