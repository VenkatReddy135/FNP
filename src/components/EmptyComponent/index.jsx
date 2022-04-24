import PropTypes from "prop-types";
import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useListContext, useTranslate } from "react-admin";
import { Link } from "react-router-dom";

/**
 * Custom component to render when there is no data to render on simple grid component. Can be used to empty message and customized create button
 *
 * @param {object} props all the props  for EmptyComponent
 * @param {string}props.isButtonVisible boolean for button visible
 * @param {string}props.queryValue give query value
 * @param {string}props.pathname give path name
 * @returns {React.ReactElement} returns a EmptyComponent
 */
const EmptyComponent = (props) => {
  const { pathname, queryValue, isButtonVisible = true } = props;

  const { resource } = useListContext();

  const translate = useTranslate();
  const emptyMsg = translate("emptyMessage");
  const nextButton = translate("createValue");

  return (
    <Box textAlign="center" color="gray" m={15}>
      <Typography variant="h4" paragraph>
        {emptyMsg}
      </Typography>
      {isButtonVisible && (
        <Button
          variant="outlined"
          component={Link}
          to={{
            pathname: pathname || `/${resource}/create`,
            search: queryValue,
          }}
        >
          {nextButton}
        </Button>
      )}
    </Box>
  );
};

EmptyComponent.propTypes = {
  isButtonVisible: PropTypes.string,
  queryValue: PropTypes.string,
  pathname: PropTypes.string,
};

EmptyComponent.defaultProps = {
  isButtonVisible: "",
  queryValue: "",
  pathname: "",
};

export default EmptyComponent;
