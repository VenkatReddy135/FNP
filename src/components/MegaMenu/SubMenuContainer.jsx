/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { Divider, Typography, Link, List, Grid } from "@material-ui/core";
import useStyles from "./subMenuStyles";
import SubMenu from "./SubMenu";

/**
 * Component for Mega Menu contains icon for mega menu and and dropdown list of all menus
 *
 * @param {object} props component props
 * @param {object} props.selectedMenuItem object conataining selected submenu data
 * @returns {React.Component} React component for Mega menu
 */
const SubMenuContainer = (props) => {
  const { selectedMenuItem = {} } = props || {};
  const { subElements = [], label } = selectedMenuItem || {};

  const subMenuClass = useStyles();
  const translate = useTranslate();

  return (
    <>
      <Divider className={subMenuClass.verticalDivider} orientation="vertical" flexItem />
      <Typography variant="h6" className={subMenuClass.title}>
        {label || translate("dashboard")}
      </Typography>

      <Divider className={subMenuClass.arrowDivider} orientation="vertical" flexItem />
      {Boolean(subElements.length) && (
        <Grid className={subMenuClass.nav}>
          <List component="li">
            <Link to="/" underline="none">
              {translate("menu")}
            </Link>
            <List component="ul">
              {subElements.map((item) => (
                <SubMenu {...item} key={item.label} />
              ))}
            </List>
          </List>
        </Grid>
      )}
    </>
  );
};

SubMenu.propTypes = {
  selectedMenuItem: PropTypes.shape({}),
};

SubMenu.defaultProps = {
  selectedMenuItem: {},
};

export default SubMenuContainer;
