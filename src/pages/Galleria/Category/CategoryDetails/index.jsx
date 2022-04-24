/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleShowLayout } from "react-admin";
import { useHistory } from "react-router-dom";
import CategoryView from "../CategoryMaster/CategoryView";
import GenericTabComponent from "../../../../components/GenericTab";
import CategoryConfiguration from "../CategoryConfiguration";
import CategoryContent from "../CategoryContent";
import CategoryRelationList from "../CategoryRelation/CategoryRelationList";
import SeoDetails from "../CategorySEO/SeoDetails";
import TopHeaderWithStatus from "../../../../components/TopHeaderWithStatus/index";
import CategoryFilters from "../../../PLP/CategoryFilters";
import CategoryProductList from "../../../PLP/CategoryProducts/List";
import SequencingList from "../../../PLP/Sequencing/SequencingList";
import CategoryAttributesList from "../CategoryAttributes/List";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import useStyles from "../../../../assets/theme/common";
/**
 * Component for Category Details page to display generic tabs
 *
 * @param {*} props all the props needed for Category Details
 * @returns {React.ReactElement} returns a Category Details Component
 */
const CategoryDetails = (props) => {
  const translate = useTranslate();
  const { match, isEditable } = props;
  const history = useHistory();
  const [enableValue, setEnableValue] = useState(false);
  const [workFlowState, setWorkflowState] = useState("");
  const selectedCategoryId = localStorage.getItem("selectedCategoryId");
  const classes = useStyles();

  /**
   * @function onViewHistoryClickHandler
   *
   */
  const onViewHistoryClickHandler = () => {
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${match.params.id}/history`,
    });
  };
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    { displayName: selectedCategoryId },
  ];

  const categoryTabArray = [
    {
      key: "categories",
      title: "Categories",
      path: "",
      componentToRender: CategoryView,
    },
    {
      key: "attributes",
      title: "Attributes",
      path: "attributes",
      componentToRender: CategoryAttributesList,
    },
    { key: "content", title: "Content", path: "content", componentToRender: CategoryContent },
    { key: "seo", title: "SEO", path: "seo", componentToRender: SeoDetails },
    {
      key: "configurations",
      title: "Configurations",
      path: "configurations",
      componentToRender: CategoryConfiguration,
    },
    {
      key: "relationship",
      title: "Relationship",
      path: "relationship",
      componentToRender: CategoryRelationList,
    },
    {
      key: "filters",
      title: "filters",
      path: "filters",
      componentToRender: CategoryFilters,
    },
    {
      key: "products",
      title: translate("products"),
      path: "products",
      componentToRender: CategoryProductList,
    },
    {
      key: "sequencing",
      title: translate("product_sequence.sequence"),
      path: "sequencing",
      componentToRender: SequencingList,
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
          id={selectedCategoryId}
          actionButtonsForGrid={actionButtonsForGrid}
          showHeaderStatus
          showButtons
          handleIsEnabled
          isEditable={isEditable}
          setEnableFuncTH={setEnableValue}
          enableValTH={enableValue}
          workFlowStateTH={workFlowState}
        />
        <GenericTabComponent
          tabArray={categoryTabArray}
          {...props}
          id={match.params.id}
          isScrollable
          enableValGC={enableValue}
          setEnableFuncGC={setEnableValue}
          workFlowStateGC={workFlowState}
          setWorkFlowStateGC={setWorkflowState}
        />
      </SimpleShowLayout>
    </>
  );
};

CategoryDetails.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default React.memo(CategoryDetails);
