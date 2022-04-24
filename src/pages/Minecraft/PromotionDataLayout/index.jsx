import { Button, Divider, Grid, IconButton, Typography } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Toolbar, useMutation, useNotify, useRedirect, useTranslate } from "react-admin";
import useStyles from "../../../assets/theme/common";
import CommonDialogContent from "../../../components/CommonDialogContent";
import SimpleModel from "../../../components/CreateModal";
import { TIMEOUT } from "../../../config/GlobalConfig";
import promotionConfig from "../../../config/PromotionConfig";
import { onFailure, onSuccess, useCustomQueryWithStore } from "../../../utils/CustomHooks";
import ActionAndPrice from "../promotionalForms/ActionAndPrice";
import BasicProperties from "../promotionalForms/BasicProperties";
import Criteria from "../promotionalForms/Criteria";
import ManageCodes from "../promotionalForms/ManageCodes";
import PromotionAuthor from "../promotionalForms/PromotionAuthor";
import preparePromotionData from "../PromotionHelper/preparePromotionData";
import { formReducer, formValidityReducer } from "../PromotionHelper/promotionReducer";
import useDeleteForm from "../PromotionHelper/useDeleteForm";

/**
 *
 * @function PromotionDataLayout Component used to show new fields based on selected form.
 * @param {object} props required props for the component
 * @param {number} props.id the id of the selected form
 * @param {boolean} props.edit to choose whether to show editable form or not.
 * @returns {React.Component} return react component.
 */
const PromotionDataLayout = (props) => {
  const { id, edit } = props;

  const classes = useStyles();

  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();

  const currentItemUrl = `${window.REACT_APP_MINECRAFT_SERVICE}/promotions/${id}/`;
  const listingUrl = `/${window.REACT_APP_MINECRAFT_SERVICE}/promotions`;

  const [open, toggleModal] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const [isPromotionalData, setIsPromotionalData] = useState(false);

  const [updateCouponCalls, setUpdateCouponCalls] = useState({});

  const [updatePromotionData, setUpdatePromotionData] = useState({});

  const [masterForm, updateMasterForm] = useReducer(formReducer, promotionConfig.initialMasterFormValue);

  const [masterFormValidity, updateMasterFormValidity] = useReducer(
    formValidityReducer,
    promotionConfig.initialMasterFormValidity,
  );

  const [deletePromotion] = useDeleteForm(deleteId, listingUrl);

  /**
   * @function handlePromotionalDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handlePromotionalDataSuccess = (res) => {
    const data = res?.data;

    if (data) {
      updateMasterForm({ type: "setValue", payload: preparePromotionData.view(data) });
      setIsPromotionalData(true);
    }
  };

  useCustomQueryWithStore("getOne", currentItemUrl, handlePromotionalDataSuccess, {
    payload: { id, codeSize: 100 },
  });

  /**
   * @function deleteHandler to delete the selected promotion.
   */
  const deleteHandler = () => {
    setDeleteId(id);
    toggleModal(false);
  };

  useEffect(() => {
    if (deleteId) {
      deletePromotion();
      setDeleteId(null);
    }
  }, [deletePromotion, deleteId]);

  /**
   * @function redirectToEditPage redirect to edit page of the current form
   */
  const redirectToEditPage = () => {
    redirect(`/${currentItemUrl}edit`);
  };

  /**
   * @function dialogContentForDelete Component to show dialog for delete modal
   * @returns {React.ReactElement} return react element.
   */
  const dialogContentForDelete = useCallback(() => {
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid item>
          <DeleteOutlinedIcon style={{ color: "red", fontSize: "46px" }} />
        </Grid>
        <Grid item style={{ textAlign: "center" }}>
          <CommonDialogContent
            message={`${translate("promotion_delete")} "${masterForm.id} - ${masterForm.promotionName}"`}
          />
        </Grid>
      </Grid>
    );
  }, [masterForm, translate]);

  /**
   * @function dialogContentForUpdate Component to show dialog for update modal
   * @returns {React.ReactElement} return react element.
   */
  const dialogContentForUpdate = useCallback(() => {
    return (
      <Grid style={{ textAlign: "center" }}>
        <CommonDialogContent message={translate("promotion_update")} />
      </Grid>
    );
  }, [translate]);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = useCallback(() => {
    notify(`${masterForm.promotionName} - ${translate("promotion_update_success")}`, "info", TIMEOUT);
    redirect(listingUrl);
  }, [notify, translate, listingUrl, masterForm, redirect]);

  const updatePromotion = useCallback(
    (promotionData = {}) => {
      mutate(
        {
          type: "put",
          resource: currentItemUrl,
          payload: {
            data: isEmpty(promotionData) ? updatePromotionData : promotionData,
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
      toggleModal(false);
    },
    [handleUpdateSuccess, currentItemUrl, updatePromotionData, mutate, notify, translate],
  );

  /**
   * @function handleCouponUpdateFailure This function will handle failure of Update coupon
   * @param {object} error error
   * @param {object} item current coupon
   */
  const handleCouponUpdateFailure = useCallback(
    (error, item) => {
      setUpdateCouponCalls((prev) => {
        const newObj = { ...prev, [item.batchId]: { ...prev[item.batchId], status: "failure" } };
        return newObj;
      });
      onFailure({ error, notify, translate });
    },
    [setUpdateCouponCalls, notify, translate],
  );

  /**
   * @function handleCouponUpdateSuccess This function will handle Success of Update coupon
   * @param {object} res response
   * @param {object} item current coupon
   */
  const handleCouponUpdateSuccess = useCallback(
    (res, item) => {
      if (res.status === "success") {
        setUpdateCouponCalls((prev) => {
          return { ...prev, [item.batchId]: { ...prev[item.batchId], status: "success" } };
        });
      } else {
        setUpdateCouponCalls((prev) => {
          return { ...prev, [item.batchId]: { ...prev[item.batchId], status: "failure" } };
        });
        notify(res.data?.errors ? res.data.errors[0].message : translate("update_coupon_failure"), "error", TIMEOUT);
      }
    },
    [setUpdateCouponCalls, translate, notify],
  );

  const updateCouponCode = useCallback(
    (item) => {
      mutate(
        {
          type: "update",
          resource: `${window.REACT_APP_MINECRAFT_SERVICE}/coupons/${item.batchId}`,
          payload: {
            data: {
              fromDate: item.fromDate,
              thruDate: item.thruDate,
            },
          },
        },
        {
          onSuccess: (response) => {
            handleCouponUpdateSuccess(response, item);
          },
          onFailure: (error) => {
            handleCouponUpdateFailure(error, item);
          },
        },
      );
    },
    [handleCouponUpdateSuccess, handleCouponUpdateFailure, mutate],
  );

  useEffect(() => {
    if (isEmpty(updateCouponCalls)) return;
    let continueUpdate = true;
    const arr = Object.values(updateCouponCalls);
    for (let i = 0; i < arr.length; i += 1) {
      if (
        (i === 0 && arr[i].status === "inactive") ||
        (i > 0 && arr[i - 1].status === "success" && arr[i].status === "inactive")
      ) {
        updateCouponCode(arr[i]);
        continueUpdate = false;
        break;
      } else if (arr[i].status === "failure") {
        toggleModal(false);
        continueUpdate = false;
        setUpdateCouponCalls({});
        break;
      }
    }
    if (continueUpdate) {
      updatePromotion();
      setUpdateCouponCalls({});
    }
  }, [updateCouponCalls, updateCouponCode, updatePromotion]);

  /**
   *@function updateHandler To update the current promotion.
   */
  const updateHandler = () => {
    const data = preparePromotionData.create(masterForm);
    const autoCodeConfigs = data.autoCodeConfigs[0]?.isValid ? data.autoCodeConfigs : [];
    delete data.createdBy;
    delete data.createdAt;
    delete data.updatedBy;
    delete data.updatedAt;
    delete data.version;
    delete data.createdByName;
    delete data.updatedByName;
    delete data.id;
    delete data.promotionType;

    const newData = {
      ...data,
      manualCodes: data.manualCodes.filter((item) => !item.batchId),
      autoCodes: [],
      autoCodeConfigs,
      criteria: data.criteria.map(({ mapping, ...rest }) => rest),
    };
    setUpdatePromotionData(newData);
    const couponCodes = data.manualCodes
      .filter((code) => code.batchId && code.isUpdated)
      .concat(data.autoCodes.filter((code) => code.batchId && code.isUpdated));

    let objCoupon = {};

    couponCodes.forEach((item) => {
      objCoupon = {
        ...objCoupon,
        [item.batchId]: {
          status: "inactive",
          fromDate: item.fromDate,
          thruDate: item.thruDate,
          batchId: item.batchId,
        },
      };
    });

    if (isEmpty(objCoupon)) {
      updatePromotion(newData);
    } else setUpdateCouponCalls(objCoupon);
  };

  /**
   * @function CustomToolbar Cancel and Update Button Component.
   * @returns {React.Component} return react component
   */
  const CustomToolbar = () => (
    <Toolbar>
      <Button variant="outlined" size="large" onClick={() => redirect(listingUrl)}>
        {translate("cancel")}
      </Button>
      <Button
        variant="contained"
        data-at-id="continue"
        onClick={() => {
          toggleModal(true);
        }}
        size="large"
        disabled={!Object.values(masterFormValidity).reduce((prev, curr) => prev && curr, true)}
      >
        {translate("update")}
      </Button>
    </Toolbar>
  );

  return (
    <>
      {isPromotionalData && (
        <Grid container direction="column" spacing={1} justify="space-between" className={classes.gridStyle}>
          <Grid item>
            <Grid container direction="row" item alignItems="center" justify="space-between">
              <Grid item>
                <div className={classes.labelText}>
                  <span style={{ color: "black" }}>{translate("promotion_view_breadcrumb_title")}</span>
                  <span>{` ${masterForm.id} - ${masterForm.promotionName}`}</span>
                </div>
                <Typography variant="h5" className={classes.gridStyle}>
                  {`${masterForm.id} - ${masterForm.promotionName}`}
                </Typography>
              </Grid>
              <Button variant="outlined" size="large">
                {translate("view_history")}
              </Button>
            </Grid>
            <Divider variant="fullWidth" className={classes.dividerStyle} />
          </Grid>
        </Grid>
      )}
      {isPromotionalData && (
        <>
          <Grid
            container
            alignItems="center"
            direction="row"
            className={classes.pageTitleHeading}
            justify="space-between"
          >
            <Grid item>{translate("basic_properties")}</Grid>
            {!edit && (
              <Grid item>
                <IconButton style={{ height: "32px", width: "32px" }} onClick={redirectToEditPage}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton style={{ height: "32px", width: "32px" }}>
                  <DeleteOutlinedIcon onClick={() => toggleModal(true)} />
                </IconButton>
              </Grid>
            )}
          </Grid>
          <BasicProperties
            edit={edit}
            create={false}
            formValues={masterForm}
            updateMasterForm={updateMasterForm}
            updateMasterFormValidity={updateMasterFormValidity}
          />
          <Grid className={classes.pageTitleHeading}>{translate("manage_codes")}</Grid>
          <ManageCodes
            edit={edit}
            create={false}
            formValues={masterForm}
            updateMasterForm={updateMasterForm}
            updateMasterFormValidity={updateMasterFormValidity}
          />
          <Grid className={classes.pageTitleHeading}>{translate("promotion_criteria")}</Grid>
          <Criteria
            edit={edit}
            create={false}
            formValues={masterForm}
            updateMasterForm={updateMasterForm}
            updateMasterFormValidity={updateMasterFormValidity}
          />
          <Grid className={classes.pageTitleHeading}>{translate("promotion_action_and_price")}</Grid>
          <ActionAndPrice
            edit={edit}
            create={false}
            formValues={masterForm}
            updateMasterForm={updateMasterForm}
            updateMasterFormValidity={updateMasterFormValidity}
          />
          <PromotionAuthor formValues={masterForm} />
          {edit && <CustomToolbar />}
        </>
      )}
      <SimpleModel
        data-testid="promotionDataLayout"
        dialogContent={edit ? dialogContentForUpdate() : dialogContentForDelete()}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        handleClose={() => toggleModal(false)}
        handleAction={edit ? updateHandler : deleteHandler}
      />
    </>
  );
};

PromotionDataLayout.propTypes = {
  id: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default PromotionDataLayout;
