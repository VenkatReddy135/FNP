/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleShowLayout } from "react-admin";
import { useHistory } from "react-router-dom";
import TagRelationList from "../../TagRelation/TagRelationList/TagRelationList";
import GenericTabComponent from "../../../../../components/GenericTab";
import TopHeaderWithStatus from "../../../../../components/TopHeaderWithStatus/index";
import TagDetails from "./TagDetails";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import useStyles from "../../../../../assets/theme/common";
/**
 * Component for Category Details page to display generic tabs
 *
 * @param {*} props all the props needed for Category Details
 * @returns {React.ReactElement} CategoryDetailsreturns a Category Details Component
 */
const TagView = (props) => {
  const translate = useTranslate();
  const { match } = props;
  const history = useHistory();
  const classes = useStyles();
  const [enableValue, setEnableValue] = useState(false);
  const tagId = match.params.id;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: tagId },
  ];
  /**
   * @param {boolean} event value for category isEnabled, true or false.
   * @function getEnableVal
   */
  const getEnableVal = useCallback((event) => {
    setEnableValue(event);
  }, []);

  /**
   * @function toggleEnableVal
   */
  const toggleEnableVal = () => {
    setEnableValue(!enableValue);
  };

  /**
   * @function onViewHistoryClickHandler
   *
   */
  const onViewHistoryClickHandler = () => {
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/history`,
    });
  };

  const categoryTabArray = [
    {
      key: "details",
      title: "Tag Details",
      path: "",
      componentToRender: TagDetails,
    },
    {
      key: "tag_relation",
      title: "Tag Relation",
      path: "relations",
      componentToRender: TagRelationList,
    },
  ];
  const actionButtonsForGrid = [
    {
      type: "Button",
      label: translate("view_history"),
      variant: "outlined",
      onClick: onViewHistoryClickHandler,
    },
  ];
  return (
    <>
      <SimpleShowLayout {...props}>
        <Breadcrumbs className={classes.breadcrumbTop} breadcrumbs={breadcrumbs} />
        <TopHeaderWithStatus
          {...props}
          id={match.params.id}
          enableValTH={enableValue}
          actionButtonsForGrid={actionButtonsForGrid}
          showHeaderStatus
          showButtons
          setEnableFuncTH={toggleEnableVal}
        />
        <GenericTabComponent
          {...props}
          id={match.params.id}
          enableValTH={enableValue}
          enableVal={getEnableVal}
          tabArray={categoryTabArray}
          isScrollable
        />
      </SimpleShowLayout>
    </>
  );
};

TagView.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(TagView);
