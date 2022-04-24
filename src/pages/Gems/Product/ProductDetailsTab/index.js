/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleShowLayout } from "react-admin";
import { Typography } from "@material-ui/core";
import GenericTabComponent from "../../../../components/GenericTab";
import TopHeaderWithStatus from "../../../../components/TopHeaderWithStatus";
import BasicDetails from "./BasicDetails";
import Composition from "./Composition/CompositionList";
import AttributesList from "./Attributes/AttributesList/AttributesList";
import Features from "./Feature/FeatureList";
import Personalizations from "./Personalizations/PersonalizationsList";
import Tags from "./Tags/TagsList";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";

/**
 * @param {object} props props related to Product Details
 * @function ProductDetails to redirect Product Details
 * @returns {React.ReactElement} returns a generic tab component
 */
const ProductDetails = (props) => {
  const translate = useTranslate();
  const { match } = props;

  const [enableValue, setEnableValue] = useState(false);
  const [productData, setData] = useState({});

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const { data } = res;
    setData({ ...data });
  };

  useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_GEMS_SERVICE}products/${match?.params?.id}`,
    handleSetDataSuccess,
  );

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

  const productClassification = [
    {
      key: "basicDetails",
      title: "Basic Details",
      path: "",
      componentToRender: BasicDetails,
    },
    {
      key: "composition",
      title: "composition",
      path: "composition",
      componentToRender: Composition,
    },
    {
      key: "features",
      title: "Features",
      path: "features",
      componentToRender: Features,
    },
    {
      key: "attributes",
      title: "Attributes",
      path: "attributes",
      componentToRender: AttributesList,
    },
    {
      key: "personalizations",
      title: "Personalizations",
      path: "personalizations",
      componentToRender: Personalizations,
    },
    {
      key: "tags",
      title: "Tags",
      path: "tags",
      componentToRender: Tags,
    },
  ];
  const actionButtonsForGrid = [
    {
      type: "Button",
      label: translate("view_history"),
      variant: "outlined",
    },
    {
      type: "Button",
      label: translate("IMPORT"),
      variant: "contained",
    },
  ];
  return (
    <>
      <SimpleShowLayout {...props}>
        <Typography variant="h5">{translate("product_management")}</Typography>
        <TopHeaderWithStatus
          {...props}
          id={productData?.skuCode}
          enableValTH={enableValue}
          actionButtonsForGrid={actionButtonsForGrid}
          showHeaderStatus
          setEnableFuncTH={toggleEnableVal}
          showButtons
        />
        <GenericTabComponent
          {...props}
          enableValTH={enableValue}
          tabArray={productClassification}
          isScrollable
          enableVal={getEnableVal}
          id={match?.params?.id}
        />
      </SimpleShowLayout>
    </>
  );
};

ProductDetails.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ProductDetails;
