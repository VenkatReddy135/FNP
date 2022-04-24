import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import React from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import useStyles from "../../assets/theme/common";
/**
 * Component for creating Refine Search search link
 *
 * @param {object} props all the props are optional
 * @returns {React.ReactElement} returns a React component with Link.
 */
const RefineSearchButton = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { refineSearchHandler } = props;

  return (
    <div onClick={refineSearchHandler} aria-hidden="true" className={classes.refineButtonStyle}>
      <ArrowBackIosIcon />
      <span>{translate("refine_search_button")}</span>
    </div>
  );
};

RefineSearchButton.propTypes = {
  refineSearchHandler: PropTypes.func,
};
RefineSearchButton.defaultProps = {
  refineSearchHandler: () => {},
};
export default RefineSearchButton;
