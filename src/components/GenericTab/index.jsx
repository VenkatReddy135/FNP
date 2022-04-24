/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { TabbedShowLayout, Tab, TabbedShowLayoutTabs } from "react-admin";
import { makeStyles } from "@material-ui/core";

/**
 * makeStyles hook of material-ui to apply style for tabs
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles(() => ({
  activeClass: {
    color: "#009D43",
  },
}));

/**
 * Generic tab layout
 *
 * @param {*} props tabs details
 *
 * @returns {React.Component} React component for generic tab
 */
const GenericTab = (props) => {
  const classes = useStyles();
  const { tabArray, isScrollable } = props;
  const [elementValue, setElementValue] = useState("");

  let variantScrollable = {};
  if (isScrollable) {
    variantScrollable = {
      variant: "scrollable",
    };
  }
  return (
    <>
      <TabbedShowLayout {...props} tabs={<TabbedShowLayoutTabs {...variantScrollable} />}>
        {tabArray.map((element) => {
          return (
            <Tab
              key={element.key}
              className={`${elementValue === element.path ? classes.activeClass : null}`}
              label={element.title}
              onClick={() => setElementValue(element.path)}
              path={element.path}
            >
              <element.componentToRender {...props} />
            </Tab>
          );
        })}
      </TabbedShowLayout>
    </>
  );
};

GenericTab.propTypes = {
  tabArray: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  isScrollable: PropTypes.bool,
};

GenericTab.defaultProps = {
  isScrollable: false,
};

export default React.memo(GenericTab);
