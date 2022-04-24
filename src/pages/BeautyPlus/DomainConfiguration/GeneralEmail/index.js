/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useSelector } from "react-redux";
import {
  SimpleForm,
  useTranslate,
  required,
  useMutation,
  Toolbar,
  Button,
  SaveButton,
  email,
  useNotify,
  useRefresh,
} from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import SimpleModel from "../../../../components/CreateModal";
import CustomTextInput from "../../../../components/TextInput";
import DomainDropdown from "../../../../components/DomainDropdown";
import LoaderComponent from "../../../../components/LoaderComponent";
import Dropdown from "../../../../components/Dropdown";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import SimpleFormToggle from "../../../../components/SimpleFormToggle";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * General Email
 *
 * @returns {React.Component} returns General email page view
 */
const GeneralEmail = () => {
  const classes = useStyles();
  const {
    cancelButton,
    submitButton,
    domainViewSmall,
    editIcon,
    editView,
    form,
    fullWidth,
    editLabelText,
    labelText,
  } = classes;
  const globalClasses = useGlobalStyle();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const [localState, setState] = useState({
    headers: "generalContact",
    show: false,
    editedData: null,
    edit: false,
    data: null,
  });
  const { headers, show, editedData, edit, data } = localState;
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const showView = !!domain;
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) {
      setState({ ...localState, data: res.data });
    }
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/generalEmail/${domainName}/`;
  const enabled = domainName !== "";
  const payload = { id: domainName };

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    enabled,
    payload,
  });

  useEffect(() => {
    setState({ ...localState, edit: false, data: {} });
  }, [domain]);

  /**
   * Function to validate and call api to update data
   *
   * @param {object} updateData update data
   */
  const generalEmailHandler = (updateData) => {
    setState({ ...localState, show: true, editedData: updateData });
  };

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = () => {
    setState({ ...localState, edit: false });
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("generalEmailUpdateSuccess"), "info", TIMEOUT);
    setState({ ...localState, edit: false, show: false });
    refresh();
  };

  /**
   * function called to update data
   */
  const continueHandler = useCallback(() => {
    const {
      bcc,
      cc,
      replyTo,
      senderEmail,
      generalEmailTemplate,
      customerServiceEmailTemplate,
      subject,
      senderName,
      isEnabled,
      contentType,
    } = editedData;

    mutate(
      {
        type: "put",
        resource,
        payload: {
          id: domain.toLowerCase(),
          data: {
            id: domain.toLowerCase(),
            bcc,
            cc,
            replyTo,
            senderEmail,
            senderName,
            subject,
            contentType,
            isEnabled,
            header: headers,
            template: headers === "generalContact" ? generalEmailTemplate : customerServiceEmailTemplate,
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
    setState({ ...localState, show: false });
  }, [domain, localState]);

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
        onClick={handleCancelButton}
        className={cancelButton}
      />
      <SaveButton label={translate("update")} icon={<></>} className={submitButton} />
    </Toolbar>
  );

  const generalEmail = data?.params?.[headers];
  const adminEmail = generalEmail?.adminEmail;
  /**
   *
   * @returns {React.Component} return component
   */
  const DomainSelection = useMemo(
    () => (
      <>
        <Grid item>
          <Typography
            variant="h5"
            color="inherit"
            className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
          >
            {translate("generalEmail")}
          </Typography>
          <Divider />
        </Grid>
        <Grid container className={domainViewSmall}>
          <Grid item xs={12} sm={3} md={3}>
            <DomainDropdown />
          </Grid>
        </Grid>
      </>
    ),
    [],
  );
  return (
    <Grid>
      {DomainSelection}
      <Grid className={editView}>
        {!edit && showView && (
          <EditIcon className={editIcon} onClick={() => setState({ ...localState, edit: !edit })} />
        )}
      </Grid>
      {loading && domain ? (
        <LoaderComponent />
      ) : (
        showView && (
          <SimpleForm
            className={form}
            variant="standard"
            save={generalEmailHandler}
            toolbar={edit ? <CustomToolbar /> : null}
          >
            <Dropdown
              label="headers"
              value={edit ? headers : translate(headers)}
              data={[
                { id: "generalContact", name: translate("generalContact") },
                { id: "customerService", name: translate("customerService") },
              ]}
              onSelect={(event) => {
                setState({ ...localState, headers: event.target.value });
                refresh();
              }}
              edit={edit}
            />
            <br />
            <Grid container spacing={5} xl={12} className={fullWidth}>
              <CustomTextInput
                label="senderEmail"
                type="email"
                value={adminEmail?.senderEmail}
                validate={[email(), required()]}
                edit={edit}
              />
              <CustomTextInput
                label={headers === "generalContact" ? "generalEmailTemplate" : "customerServiceEmailTemplate"}
                type="text"
                value={
                  headers === "generalContact"
                    ? generalEmail?.generalEmailTemplate
                    : generalEmail?.customerServiceEmailTemplate
                }
                validate={required()}
                edit={edit}
              />
              <CustomTextInput
                label="senderName"
                value={generalEmail?.adminEmail?.senderName}
                validate={required()}
                edit={edit}
              />
              <CustomTextInput
                label="subject"
                type="text"
                value={adminEmail?.subject}
                validate={required()}
                edit={edit}
              />
              <CustomTextInput
                label="contentType"
                type="text"
                value={generalEmail?.contentType}
                validate={required()}
                edit={edit}
              />
              <Grid item xs={12} sm={4} md={4}>
                <Typography component="div">
                  <Grid container alignContent="center" spacing={1}>
                    <Grid container className={edit ? editLabelText : labelText} item>
                      {translate("isEnabled")}
                    </Grid>
                    <Grid item>
                      <SimpleFormToggle record={generalEmail?.isEnabled} enabledForEdit={edit} name="isEnabled" />
                    </Grid>
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={5} className={fullWidth}>
              <CustomTextInput
                label="replyTo"
                type="email"
                value={adminEmail?.replyTo}
                validate={[email(), required()]}
                edit={edit}
              />
              <CustomTextInput
                label="cc"
                type="email"
                value={adminEmail?.cc}
                validate={[email(), required()]}
                edit={edit}
              />
              <CustomTextInput
                label="bcc"
                type="email"
                value={adminEmail?.bcc}
                validate={[email(), required()]}
                edit={edit}
              />
            </Grid>
          </SimpleForm>
        )
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfGeneralEmail")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={show}
        handleClose={() => setState({ ...localState, show: false })}
        handleAction={continueHandler}
      />
    </Grid>
  );
};

export default GeneralEmail;
