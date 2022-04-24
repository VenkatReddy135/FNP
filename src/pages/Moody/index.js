/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslate } from "react-admin";
import { Typography, Divider } from "@material-ui/core";
import useStyles from "../../assets/theme/common";
import TagDropdown from "../../components/DomainDropdown";
import SimpleGrid from "../../components/SimpleGrid";
import ActionButton from "./ActionButton";

/**
 * Component for  All Reviews in Moody, this component helps to manage reviews.
 *
 * @returns {React.ReactElement} returns a Grid with reviews
 */
const Reviews = () => {
  const translate = useTranslate();
  const classes = useStyles();
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const isDomainSelected = !!domain;

  const configurationForGrid = [
    { source: "creationDate", type: "DateField", label: translate("review_date") },
    { source: "deliveryInfo.deliveryDate", type: "DateField", label: translate("order_date") },
    { source: "approvalStatus", type: "TextField", label: translate("status") },
    { source: "productNames", type: "CustomSourceData", label: translate("product_name"), sortable: false },
    { source: "order.subOrderId", type: "TextField", label: translate("sub_order_id") },
    { source: "overallRating", type: "StarRating", label: translate("rating") },
    { source: "reviewText", type: "TextField", label: translate("review"), sortable: false },
    { source: "action", type: "ActionButton", label: translate("action"), sortable: false },
    { source: "customer.customerEmail", type: "TextField", label: translate("customer_email_id") },
  ];

  /**
   * @returns {React.Component} return component
   */
  const ReviewHeader = useMemo(
    () => (
      <>
        <Typography variant="h5" className={classes.mainTitleHeading}>
          {translate("reviews")}
        </Typography>
        <Divider variant="fullWidth" className={classes.headerClass} />
        <TagDropdown />
      </>
    ),
    [],
  );

  return (
    <div data-testid="reviewsComponent">
      {ReviewHeader}
      {isDomainSelected && (
        <SimpleGrid
          isRowSelectable={(record) => record.approvalStatus === "PENDING"}
          configurationForGrid={configurationForGrid}
          actionButtonsForGrid={[]}
          bulkActionButtons={<ActionButton />}
          gridTitle=""
          filter={{ domainName: domain }}
          sortField={{ field: "creationDate", order: "DESC" }}
          searchLabel={translate("sub_order_id")}
          resource={`${window.REACT_APP_MOODY_SERVICE}moderation/reviews`}
          searchinputtype="number"
        />
      )}
    </div>
  );
};

export default Reviews;
