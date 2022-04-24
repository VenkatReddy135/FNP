/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { MenuItemLink } from "react-admin";

/**
 * Component for Mega Menu contains icon for mega menu and and dropdown list of all menus
 *
 * @param {object} props component props
 * @param {string} props.label component props
 * @param {string} props.anchor component props
 * @param {Array} props.subElements component props
 * @returns {React.Component} React component for Mega menu
 */
const SubMenu = (props) => {
  const { label = "", anchor = "", subElements = [] } = props;
  const isExpandable = subElements && subElements.length > 0;

  const MenuItemChildren = isExpandable ? (
    <List component="ul">
      {subElements.map((item) => (
        <SubMenu {...item} key={item?.label} />
      ))}
    </List>
  ) : null;

  const MenuItemRoot = (
    <>
      <MenuItemLink primaryText={label} to={anchor} />
      {MenuItemChildren}
    </>
  );

  return (
    <List component="li" key={label}>
      {MenuItemRoot}
    </List>
  );
};

SubMenu.propTypes = {
  anchor: PropTypes.string,
  subElements: PropTypes.arrayOf({}),
  label: PropTypes.string,
};

SubMenu.defaultProps = {
  anchor: "",
  subElements: [],
  label: "",
};

export default SubMenu;
