/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from "react";
import {
  useTranslate,
  SimpleForm,
  required,
  useRedirect,
  useNotify,
  useMutation,
  Toolbar,
  Button,
  SaveButton,
} from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles, CustomSwitch } from "../Website_Config_Style";
import useGlobalStyle from "../../../assets/theme/common";
import SimpleModel from "../../../components/CreateModal";
import Dropdown from "../../../components/Dropdown";
import CommonDialogContent from "../../../components/CommonDialogContent";
import CustomTextInput from "../../../components/TextInput";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";
import { urlValidtorForTextfield } from "../../../utils/validationFunction";

/**
 * Component to create a URL redirect
 *
 * @returns {React.ReactElement} returns Create URL redirect component
 */
const CreateNewUrlRedirect = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { cancelButton, submitButton, fullWidth, urlToolHead, divider, dividerStyle, gridStyleNew } = classes;
  const redirect = useRedirect();
  const notify = useNotify();
  const [mutate] = useMutation();
  const [editedData, setEditedData] = useState();
  const translate = useTranslate();
  const [isEnabled, setIsEnabled] = useState(true);
  const [show, toggleModal] = useState(false);
  const [breadcrumbsList] = useState([
    {
      displayName: translate("url_redirect_tool"),
      navigateTo: `/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`,
    },
    {
      displayName: translate("addUrl"),
    },
  ]);
  const urlValidator = urlValidtorForTextfield(translate("pleaseEnterValidUrl"));
  /**
   *handles on change event for Switch
   *
   */
  const handleSwitchChange = () => {
    setIsEnabled(!isEnabled);
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("createUrlRedirectSuccess"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`);
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    toggleModal(false);
    const { sourceUrl, targetUrl, entityType, redirectType, comment } = editedData;
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`,
        payload: {
          data: {
            params: null,
            dataObj: {
              sourceUrl,
              targetUrl,
              entityType,
              redirectType,
              comment,
              isEnabled,
            },
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
  };

  /**
   * Function to validate and call api to update data
   *
   * @param {object} updateData update data
   */
  const updateUrlRedirectHandler = (updateData) => {
    toggleModal(true);
    setEditedData(updateData);
  };

  /**
   *@function cancelHandler
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect`);
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
      <SaveButton label={translate("create")} icon={<></>} className={submitButton} />
    </Toolbar>
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid item container justify="space-between">
        <Grid className={urlToolHead} item>
          <Typography variant="h5" color="inherit" className={globalClasses.gridStyle}>
            {translate("addUrl")}
          </Typography>
          <Divider orientation="vertical" className={divider} />
          <CustomSwitch checked={isEnabled} name="isEnabled" onClick={handleSwitchChange} />
        </Grid>
      </Grid>

      <Divider variant="fullWidth" className={dividerStyle} />
      <SimpleForm save={updateUrlRedirectHandler} toolbar={<CustomToolbar />}>
        <Grid container spacing={5} xl={12} className={fullWidth}>
          <CustomTextInput label="sourceUrl" type="url" validate={[required(), urlValidator]} edit />
        </Grid>
        <Grid container spacing={5} xl={12} className={fullWidth}>
          <CustomTextInput label="targetUrl" type="url" validate={[required(), urlValidator]} edit />
        </Grid>
        <Grid className={gridStyleNew} container spacing={5} item md={6}>
          <Dropdown
            label="entityType"
            validate={required()}
            data={[
              { id: translate("product"), name: translate("product") },
              { id: translate("category"), name: translate("category") },
              { id: translate("cms"), name: translate("cms") },
              { id: translate("others"), name: translate("others") },
            ]}
            edit
          />
          <Dropdown
            label="redirectType"
            validate={required()}
            data={[
              { id: "301", name: "301" },
              { id: "302", name: "302" },
            ]}
            edit
          />
        </Grid>
        <Grid container spacing={5} xl={12} className={fullWidth}>
          <CustomTextInput label="comment" validate={required()} edit />
        </Grid>
      </SimpleForm>
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("addConfirmationMessageOfUrlRedirect")} />}
        showButtons
        showTitle=""
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={show}
        handleClose={() => toggleModal(false)}
        handleAction={continueHandler}
      />
    </>
  );
};

export default CreateNewUrlRedirect;
