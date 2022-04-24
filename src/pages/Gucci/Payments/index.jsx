/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { SimpleShowLayout, useTranslate } from "react-admin";
import { Divider, Grid, Typography } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
import GenericTabComponent from "../../../components/GenericTab";
import DomainSettingsList from "./DomainSettingsList";
import PaymentOptionsList from "./PaymentOptionsList";
import PaymentGroups from "./PaymentGroups";
import ServiceProviderList from "./ServiceProviders/ServiceProviderList";

/**
 * Component for Payment Details page to display configuration tabs
 *
 * @param {object} props props related to Payment Configuration
 * @returns {React.ReactElement} returns Payment Configuration with tabs
 */
const PaymentDetails = (props) => {
  const classes = useStyles();
  const translate = useTranslate();

  const paymentConfigTabArray = [
    {
      key: "domain",
      title: translate("domain_settings").toUpperCase(),
      path: "",
      componentToRender: DomainSettingsList,
    },
    {
      key: "options",
      title: translate("payment_options"),
      path: "options",
      componentToRender: PaymentOptionsList,
    },
    { key: "groups", title: translate("payment_groups"), path: "groups", componentToRender: PaymentGroups },
    {
      key: "providers",
      title: translate("service_providers"),
      path: "providers",
      componentToRender: ServiceProviderList,
    },
  ];
  return (
    <SimpleShowLayout {...props}>
      <Grid item className={classes.gridStyle}>
        <Typography variant="h5" color="inherit">
          {translate("payment_config_title")}
        </Typography>
      </Grid>
      <Divider className={classes.dividerStyle} />
      <GenericTabComponent tabArray={paymentConfigTabArray} {...props} />
    </SimpleShowLayout>
  );
};

export default PaymentDetails;
