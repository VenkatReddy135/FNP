/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../components/SimpleGrid";

/**
 * Component for Payment Options list functionality which lists applicable payment options
 *
 * @param {*} props all the props needed for Payment Options list
 * @returns {React.ReactElement} returns a Payment Options list
 */
const PaymentOptionsList = (props) => {
  const translate = useTranslate();
  const paymentOptionsGridTitle = translate("payment_options");

  const configurationForPaymentOptionsGrid = [
    {
      source: "name",
      type: "TextField",
      label: translate("payment_options"),
    },
    {
      source: "email",
      type: "CustomSourceData",
      field: "contacts",
      label: "",
      sortable: false,
    },
  ];

  return (
    <>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_PARTY_SERVICE}/parties/search`}
        configurationForGrid={configurationForPaymentOptionsGrid}
        actionButtonsForGrid={[]}
        actionButtonsForEmptyGrid={[]}
        gridTitle={paymentOptionsGridTitle}
        isSearchEnabled={false}
        filter={{ partyName: "fnp", partyType: "Individual" }}
      />
    </>
  );
};
export default PaymentOptionsList;
