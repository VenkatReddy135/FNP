/* eslint-disable react/jsx-props-no-spreading */
import { Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { useLocation } from "react-router-dom";
import useStyles from "../../../assets/theme/common";
import AdvanceSearchLink from "../../../components/AdvanceSearchLink";
import CommonDialogContent from "../../../components/CommonDialogContent";
import SimpleModel from "../../../components/CreateModal";
import SimpleGrid from "../../../components/SimpleGrid";
import promotionalConfig from "../../../config/PromotionConfig";
import useDeleteForm from "../PromotionHelper/useDeleteForm";

/**
 * @function PromotionList  Component for Promotion Management List contains a simple grid with configurations for List of promotions
 * @param {object} props all the props needed for Promotion Management List
 * @returns {React.ReactElement} returns a Promotion Management List component
 */
const PromotionList = (props) => {
  const classes = useStyles();

  const translate = useTranslate();

  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  const [showFilter, setShowFilter] = useState(query.get("showFilter"));

  const [open, toggleModal] = useState(false);

  const [promotionId, setPromotionId] = useState(null);

  const [advanceSearchFilter, setAdvanceSearchFilter] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [deletePromotion] = useDeleteForm(deleteId, "");

  const filterOption = query.get("filter") || null;
  const selectedOptionalColumns =
    filterOption && JSON.parse(filterOption).filter && showFilter
      ? JSON.parse(atob(JSON.parse(filterOption).filter)).map((item) => item.fieldName)
      : [];

  /**
   * @function deleteHandler to delete the selected promotion.
   */
  const deleteHandler = () => {
    setDeleteId(promotionId);
    toggleModal(false);
  };

  useEffect(() => {
    if (deleteId) {
      deletePromotion();
      setDeleteId(null);
    }
  }, [deletePromotion, deleteId]);

  /**
   * @function showModal to show delete modal
   * @param {string} rowId selected promotion id to be deleted.
   */
  const showModal = (rowId) => {
    setPromotionId(rowId);
    toggleModal(true);
  };

  const actionButtonsForPromotionGrid = [
    {
      type: "CreateButton",
      label: translate("create_promotion"),
      icon: <></>,
      variant: "outlined",
    },
  ];

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/show",
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "/edit",
      isEditable: true,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: showModal,
    },
  ];

  const configurationForGridColumns = {
    id: {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("promotion_id"),
      tabPath: "/show",
      sortable: true,
      isLink: true,
    },
    promotionName: {
      source: "promotionName",
      type: "TextField",
      label: translate("promotion_name"),
    },
    domain: {
      source: "domain",
      type: "CustomSourceData",
      label: translate("promotion_domain"),
    },
    geoId: {
      source: "geo",
      type: "CustomSourceData",
      label: translate("promotion_geo"),
    },
    fromDate: {
      source: "fromDate",
      type: "CustomDateField",
      label: translate("promotion_startDate"),
    },
    thruDate: {
      source: "thruDate",
      type: "CustomDateField",
      label: translate("promotion_endDate"),
    },
    status: {
      source: "status",
      type: "StatusField",
      label: translate("promotion_status"),
      displayStatusText: {
        trueText: translate("active"),
        falseText: translate("inactive"),
      },
    },
    productName: {
      source: "productName",
      type: "TextField",
      label: translate("product_name"),
    },
    couponCode: {
      source: "couponCode",
      type: "CustomSourceData",
      label: translate("coupon_code"),
    },
    categoryName: {
      source: "categoryName",
      type: "TextField",
      label: translate("category_name"),
    },
    createdBy: { source: "createdBy", type: "TextField", label: translate("promotion_createdBy") },
    createdAt: {
      source: "createdAt",
      type: "CustomDateField",
      label: translate("promotion_createdDate"),
    },
  };

  const configurationForGrid = promotionalConfig.allGridColumns
    .filter(
      (item) => !(promotionalConfig.gridOptionalColumns.includes(item) && !selectedOptionalColumns.includes(item)),
    )
    .map((item) => configurationForGridColumns[item]);

  /**
   * @function clearFilter clear adv search
   */
  const clearFilter = () => {
    setAdvanceSearchFilter(null);
    setShowFilter(null);
  };

  useEffect(() => {
    const filter = search ? new URLSearchParams(search).get("filter") : "";
    if (filter && showFilter) {
      const tempObj = JSON.parse(filter);
      setAdvanceSearchFilter(tempObj.filter);
    } else setAdvanceSearchFilter(null);
  }, [search, showFilter]);

  const AdvanceFilter = (
    <AdvanceSearchLink
      isFilterSet={advanceSearchFilter}
      listingPagePath={`/${window.REACT_APP_MINECRAFT_SERVICE}/promotions`}
      clearFilter={clearFilter}
      clearLabel={translate("promotion_clear_filter")}
      advanceSearchPagePath={`/${window.REACT_APP_MINECRAFT_SERVICE}/promotions/advancesearch`}
      advanceSearchLabel={translate("promotion_add_filter")}
    />
  );

  /**
   * @function dialogContent Component to show dialog heading for modal
   * @returns {React.ReactElement} return react element.
   */
  const dialogContent = useCallback(() => {
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid item>
          <DeleteOutlineOutlinedIcon style={{ color: "red", fontSize: "46px" }} />
        </Grid>

        <Grid item className={classes.textAlignCenter}>
          <CommonDialogContent message={`${translate("promotion_delete")} ${promotionId}`} />
        </Grid>
      </Grid>
    );
  }, [promotionId, classes, translate]);

  return (
    <>
      <SimpleGrid
        {...props}
        configurationForGrid={configurationForGrid}
        actionButtonsForGrid={actionButtonsForPromotionGrid}
        gridTitle={translate("promotion_title")}
        searchLabel={translate("promotion_search_label")}
        additionalLink={AdvanceFilter}
        sortField={{ field: "createdAt", order: "DESC" }}
        filter={{ filter: advanceSearchFilter }}
      />
      <SimpleModel
        dialogContent={dialogContent()}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        handleClose={() => toggleModal(false)}
        handleAction={deleteHandler}
      />
    </>
  );
};

export default PromotionList;
