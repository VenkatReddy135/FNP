/* eslint no-shadow: ["error", { "allow": ["props"] }] */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import {
  useTranslate,
  SimpleForm,
  required,
  useNotify,
  useMutation,
  Toolbar,
  Button,
  SaveButton,
  useRedirect,
} from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import { useStyles, CustomSwitch } from "../Website_Config_Style";
import useGlobalStyle from "../../../assets/theme/common";
import SimpleModel from "../../../components/CreateModal";
import Dropdown from "../../../components/Dropdown";
import CommonDialogContent from "../../../components/CommonDialogContent";
import CustomTextInput from "../../../components/TextInput";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../config/GlobalConfig";
import formatDateValue from "../../../utils/formatDateTime";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
import { urlValidtorForTextfield } from "../../../utils/validationFunction";

/**
 * Component to create a URL redirect
 *
 * @param {object} props props of url redirect
 * @returns {React.ReactElement} returns Create URL redirect component
 */
const UpdateUrlRedirect = (props) => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const {
    cancelButton,
    submitButton,
    fullWidth,
    urlToolHead,
    divider,
    dividerStyle,
    gridStyleNew,
    labelText,
    valueText,
  } = classes;
  const { id } = props;
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const [editedData, setEditedData] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [mutate] = useMutation();
  const [data, setData] = useState(false);
  const [open, toggleModal] = useState(false);
  const [breadcrumbsList] = useState([
    {
      displayName: translate("url_redirect_tool"),
      navigateTo: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`,
    },
    {
      displayName: id,
    },
  ]);
  const urlValidator = urlValidtorForTextfield(translate("pleaseEnterValidUrl"));
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (!res?.data?.message) {
      setData(res.data);
      setIsEnabled(res.data.isEnabled);
    }
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}/`;
  const payload = { id };

  useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    payload,
  });

  /**
   *@function cancelHandler
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}/show`);
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("updateUrlRedirectSuccess"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`);
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const { targetUrl, redirectType, comment } = editedData;
    mutate(
      {
        type: "put",
        resource,
        payload: {
          id,
          data: {
            targetUrl,
            redirectType,
            comment,
            isEnabled,
          },
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
  };

  /**
   * @param {object} props props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <Button
        type="button"
        label={translate("cancel")}
        variant="outlined"
        onClick={cancelHandler}
        className={cancelButton}
      />
      <SaveButton label={translate("update")} icon={<></>} className={submitButton} />
    </Toolbar>
  );

  /**
   * Function to validate and call api to update data
   *
   * @param {object} updateData update data
   */
  const updateUrlRedirectHandler = (updateData) => {
    toggleModal(true);
    setEditedData(updateData);
  };

  const ViewForm = data && (
    <SimpleForm save={updateUrlRedirectHandler} toolbar={<CustomToolbar />}>
      <Grid container spacing={5} xl={12} item className={fullWidth}>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("sourceUrl")}</Grid>
          <Grid className={valueText}>{data?.sourceUrl}</Grid>
        </Grid>
      </Grid>
      <Grid container spacing={5} xl={12} item className={fullWidth}>
        <CustomTextInput
          label="targetUrl"
          type="url"
          value={data?.targetUrl}
          validate={[required(), urlValidator]}
          edit
        />
      </Grid>
      <Grid className={gridStyleNew} container spacing={5} item md={6}>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("entityType")}</Grid>
          <Grid className={valueText}>{data?.entityType}</Grid>
        </Grid>
        <Dropdown
          label="redirectType"
          value={data?.redirectType}
          data={[
            { id: "301", name: "301" },
            { id: "302", name: "302" },
          ]}
          edit
        />
      </Grid>
      <Grid container spacing={5} item xl={12} className={fullWidth}>
        <CustomTextInput label="comment" multiline value={data?.comment} validate={[required()]} edit />
      </Grid>
      <Grid className={gridStyleNew} container spacing={5} item md={6}>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("createdBy")}</Grid>
          <Grid className={valueText}>{data?.createdBy}</Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("createdDate")}</Grid>
          <Grid className={valueText}>{formatDateValue(data?.createdAt)}</Grid>
        </Grid>
      </Grid>
      <Grid className={gridStyleNew} container spacing={5} item md={6}>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("lastModifiedBy")}</Grid>
          <Grid className={valueText}>{data?.updatedBy}</Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Grid className={labelText}>{translate("lastModifiedDate")}</Grid>
          <Grid className={valueText}>{formatDateValue(data?.updatedAt)}</Grid>
        </Grid>
      </Grid>
    </SimpleForm>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid item container justify="space-between">
        <Grid className={urlToolHead} item>
          <Typography variant="h5" color="inherit" className={globalClasses.gridStyle}>
            {data?.id}
          </Typography>
          <Divider orientation="vertical" className={divider} />
          <CustomSwitch checked={isEnabled} name="isEnabled" onClick={() => setIsEnabled(!isEnabled)} />
        </Grid>
      </Grid>
      <Divider variant="fullWidth" className={dividerStyle} />
      {ViewForm}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfUrlRedirect")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={continueHandler}
      />
    </>
  );
};

UpdateUrlRedirect.propTypes = {
  id: PropTypes.string.isRequired,
};
export default UpdateUrlRedirect;
