/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import { Grid, Typography } from "@material-ui/core";
import GenericTab from "../../../../components/GenericTab";
import FCComponentPriceMasterList from "../FCComponentPriceMaster/List";
import ComponentPriceRuleManagerList from "../ComponentPriceRuleManager/List";
import useCommonStyles from "../../../../assets/theme/common";
import CustomBreadCrumbs from "../../../../components/Breadcrumbs";

/**
 * Price Master Details component
 *
 * @param {*} props object expected to display this component
 * @returns {React.ReactElement} price master details parent component
 */
const PriceMasterDetails = (props) => {
  const commonClasses = useCommonStyles();
  const translate = useTranslate();
  const breadcrumbs = [{ displayName: translate("fcComponentPriceMaster.price_master") }];
  const priceMasterTabArray = [
    {
      key: "FCComponentPriceMaster",
      title: translate("fcComponentPriceMaster.fc_component_price_master"),
      path: "",
      componentToRender: FCComponentPriceMasterList,
    },
    {
      key: "ComponentPriceRuleManager",
      title: translate("componentPriceRuleManager.price_rule_title"),
      path: "component-price-rule-manager",
      componentToRender: ComponentPriceRuleManagerList,
    },
  ];

  return (
    <>
      <CustomBreadCrumbs breadcrumbs={breadcrumbs} />
      <Grid className={commonClasses.gridStyle} item>
        <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
          {translate("fcComponentPriceMaster.price_master")}
        </Typography>
      </Grid>
      <GenericTab {...props} tabArray={priceMasterTabArray} isScrollable />
    </>
  );
};

export default React.memo(PriceMasterDetails);
