/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, useRedirect, useNotify, useDelete } from "react-admin";
import { Typography, Grid, Divider, Button, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import { useStyles } from "../Website_Config_Style";
import useCommonStyles from "../../../assets/theme/common";
import SimpleModel from "../../../components/CreateModal";
import SwitchComp from "../../../components/switch";
import CommonDialogContent from "../../../components/CommonDialogContent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import formatDateValue from "../../../utils/formatDateTime";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import CustomViewUI from "../../../components/CustomViewUI/CustomViewUI";

/**
 * Component to create a URL redirect
 *
 * @param {object} props props of url redirect
 * @returns {React.ReactElement} returns Create URL redirect component
 */
const ViewUrlRedirect = (props) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { id } = props;
  const { fullWidth, urlToolHead, divider, dividerStyle, iconStyle } = classes;
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const [data, setData] = useState({});
  const [open, toggleModal] = useState(false);
  const currentItemUrl = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}/`;
  const listingUrl = `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`;

  const [breadcrumbsList] = useState([
    {
      displayName: translate("url_redirect_tool"),
      navigateTo: listingUrl,
    },
    {
      displayName: id,
    },
  ]);

  const [deleteHandler] = useDelete(currentItemUrl, {}, null, {
    onSuccess: (res) => {
      if (res.data) {
        redirect(listingUrl);
        notify(res.data.message || translate("delete_success_message"));
      } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
        notify(
          res.data.errors[0].field
            ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
            : `${res.data.errors[0].message}`,
        );
      }
    },
    onFailure: (error) => notify(`Error: ${error.message}`, "warning"),
  });

  /**
   * Function to redirect to history page
   */
  const redirectToHistory = () => {
    history.push(`${listingUrl}/${id}/history?sourceUrl=${data?.sourceUrl}`);
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (!res?.data?.message) {
      setData(res.data);
    }
  };

  const payload = { id };

  useCustomQueryWithStore("getOne", currentItemUrl, handleSetDataSuccess, {
    payload,
  });

  const dialogContent = (
    <Grid className={commonClasses.centerAlignContainer}>
      <DeleteIcon className={classes.deleteIconStyle} />
      <CommonDialogContent message={translate("deleteConfirmationMessageOfUrlRedirect")} />
    </Grid>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <SimpleForm toolbar={null}>
        <Box marginTop="-15px" marginBottom="0px !important">
          <Grid container justify="space-between">
            <Grid className={urlToolHead} item spacing={2}>
              <Typography variant="h5" color="inherit" className={commonClasses.gridStyle}>
                {data?.id}
              </Typography>
              <Divider orientation="vertical" className={divider} />
              {data?.sourceUrl && <SwitchComp record={data?.isEnabled} disable={false} />}
            </Grid>
            <Button
              variant="outlined"
              size="medium"
              className={classes.buttonStyle}
              data-at-id="actionButton"
              onClick={redirectToHistory}
            >
              {translate("view_history")}
            </Button>
          </Grid>
        </Box>
        <Divider variant="fullWidth" className={dividerStyle} />
        <Grid container justify="flex-end" className={fullWidth}>
          <EditIcon
            className={iconStyle}
            onClick={() => {
              redirect(`/${currentItemUrl}update`);
            }}
          />
          <DeleteIcon
            className={iconStyle}
            onClick={() => {
              toggleModal(true);
            }}
          />
        </Grid>
        <Grid container>
          <CustomViewUI value={data?.sourceUrl} label={translate("sourceUrl")} />
        </Grid>
        <Grid container>
          <CustomViewUI value={data?.targetUrl} label={translate("targetUrl")} />
        </Grid>
        <Grid container>
          <Grid item md={4}>
            <CustomViewUI value={data?.entityType} label={translate("entityType")} />
          </Grid>
          <Grid item md={6}>
            <CustomViewUI value={data?.redirectType} label={translate("redirectType")} />
          </Grid>
        </Grid>
        <Grid container>
          <CustomViewUI value={data?.comment} label={translate("comments")} />
        </Grid>
        <Grid container>
          <Grid item md={4}>
            <CustomViewUI value={data?.createdBy} label={translate("createdBy")} />
          </Grid>
          <Grid item md={6}>
            <CustomViewUI value={formatDateValue(data?.createdAt)} label={translate("createdDate")} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={4}>
            <CustomViewUI value={data?.updatedBy} label={translate("lastModifiedBy")} />
          </Grid>
          <Grid item md={6}>
            <CustomViewUI value={formatDateValue(data?.updatedAt)} label={translate("lastModifiedDate")} />
          </Grid>
        </Grid>
      </SimpleForm>
      <SimpleModel
        delete
        dialogContent={dialogContent}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("delete")}
        openModal={open}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={deleteHandler}
      />
    </>
  );
};

export default ViewUrlRedirect;
ViewUrlRedirect.propTypes = {
  id: PropTypes.string.isRequired,
};
