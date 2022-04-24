/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { useListContext, TopToolbar, CreateButton, Button } from "react-admin";
import ImportButton from "../import/ImportButton";
import useStyles from "../../assets/theme/common";

const componentsMap = {
  CreateButton,
  ImportButton,
  Button,
};
/**
 * Component for Custom actions for simple grid contains all the action buttons required to be seen in simple grid
 *
 * @param {object} props all the props needed by GridActionButtons
 * @returns {React.ReactElement} returns a custom action buttons for grid
 */
const GridActions = (props) => {
  const { actionButtonsForGrid, additionalLink } = props;
  const classes = useStyles();
  const { basePath } = useListContext();

  return (
    <>
      <TopToolbar disableGutters className={classes.toolbarStyle}>
        <div>
          {actionButtonsForGrid?.map((field, index) => {
            const buttonIndex = `${field.type}_${index}`;
            const componentType = field.type;
            const Component = componentsMap[componentType];
            return <Component key={buttonIndex} basePath={basePath} {...field} />;
          })}
        </div>
        <div>{additionalLink}</div>
      </TopToolbar>
    </>
  );
};

GridActions.propTypes = {
  actionButtonsForGrid: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.objectOf(PropTypes.any),
  additionalLink: PropTypes.element,
};

GridActions.defaultProps = {
  filters: null,
  additionalLink: <></>,
};

export default GridActions;
