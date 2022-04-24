/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint no-underscore-dangle: ["error", { "allow": [ "__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__"] }] */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import EditIcon from "@material-ui/icons/Edit";
import {
  SimpleForm,
  useTranslate,
  required,
  Toolbar,
  Button,
  SaveButton,
  email,
  useNotify,
  useRefresh,
  useMutation,
} from "react-admin";
import { useSelector } from "react-redux";
import { Typography, Grid, Divider } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SimpleModel from "../../../components/CreateModal";
import { useStyles, Accordion, AccordionSummary, AccordionDetails } from "../Website_Config_Style";
import useGlobalStyle from "../../../assets/theme/common";
import Dropdown from "../../../components/Dropdown";
import CustomTextInput from "../../../components/TextInput";
import DomainDropdown from "../../../components/DomainDropdown";
import LoaderComponent from "../../../components/LoaderComponent";
import CommonDialogContent from "../../../components/CommonDialogContent";
import SimpleFormToggle from "../../../components/SimpleFormToggle";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

/**
 * Admin Email
 *
 * @returns {React.Component} //return component
 */
const AdminEmail = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
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
    previewText,
  } = classes;
  const translate = useTranslate();
  const [edit, setEdit] = useState(false);
  const [editedData, setEditedData] = useState({});
  const notify = useNotify();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const [expanded, setExpanded] = React.useState("panel1");
  const [show, toggleModal] = useState(false);
  const [data, setData] = useState(false);
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const showView = !!domain;
  const adminEmail = data?.params;
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) setData(res.data);
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/admin/${domainName}/`;
  const enabled = domainName !== "";
  const payload = { id: domainName };

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, { enabled, payload });

  useEffect(() => {
    setEdit(false);
    setData({});
  }, [domain]);

  /**
   * handles on change event for AccordionSummary
   *
   * @param {string} panel contain panel
   */
  const handleChange = useCallback((panel) => {
    return (_event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
  }, []);

  /**
   * function called on click of continue button from confirmation modal
   *
   * @param {object} updateData updated data
   */
  const updateAdminEmail = useCallback(async (updateData) => {
    toggleModal(true);
    setEditedData(updateData);
  }, []);

  /**
   * function called to set edit false
   */
  const handleCancelButton = useCallback(() => {
    setEdit(false);
  }, []);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("adminEmailUpdateSuccess"), "info", TIMEOUT);
    setEdit(false);
    refresh();
  };

  const mutationPayload = {
    id: domain?.toLowerCase(),
    data: {
      id: domain?.toLowerCase(),
      bcc: editedData?.bcc,
      cc: editedData?.cc,
      replyTo: editedData?.replyTo,
      senderEmail: editedData?.senderEmail,
      senderName: editedData?.senderName,
      subject: "create",
      isEnabled: editedData?.isEnabled,
      forgotPasswordEmailTemplate: editedData?.forgotPasswordEmailTemplate,
      smsMessageTemplate: editedData?.smsMessageTemplate,
    },
  };

  /**
   * function called to update data
   */
  const continueHandler = useCallback(() => {
    mutate(
      {
        type: "put",
        resource,
        payload: mutationPayload,
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
  }, [domain, editedData]);

  /**
   *
   * @returns {React.Component} return component
   */
  const CustomToolbar = useMemo(
    (props) => (
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
    ),
    [],
  );

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
            {translate("adminEmail")}
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

  /**
   *
   * @returns {React.Component} return component
   */
  const ForgotPasswordAccordian = useMemo(
    () => (
      <Accordion square expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          IconButtonProps={{ edge: "start" }}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography>{translate("panelTitleOne")}</Typography>
        </AccordionSummary>
        {showView && (
          <AccordionDetails>
            <Grid className={editView}>
              {!edit && <EditIcon className={editIcon} onClick={() => setEdit(!edit)} />}
            </Grid>
            <SimpleForm
              className={form}
              variant="standard"
              save={updateAdminEmail}
              toolbar={edit ? CustomToolbar : null}
            >
              <Grid container spacing={5} xl={12} className={fullWidth}>
                <CustomTextInput
                  label="senderEmail"
                  type="email"
                  value={adminEmail?.senderEmail}
                  validate={[email(), required()]}
                  edit={edit}
                />
                <CustomTextInput label="senderName" value={adminEmail?.senderName} validate={required()} edit={edit} />
                <Grid item xs={12} sm={4} md={4}>
                  <Typography component="div">
                    <Grid container alignContent="center" spacing={1}>
                      <Grid container className={edit ? editLabelText : labelText} item>
                        {translate("isEnabled")}
                      </Grid>
                      <Grid item>
                        <SimpleFormToggle record={data?.isEnabled} enabledForEdit={edit} name="isEnabled" />
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
              <Grid container spacing={5} className={fullWidth}>
                <Dropdown
                  label="smsMessageTemplate"
                  value={data?.smsMessageTemplate}
                  data={[
                    { id: "Template1", name: "Template1" },
                    { id: "Template2", name: "Template2" },
                    { id: "Template3", name: "Template3" },
                  ]}
                  edit={edit}
                  onSelect={() => {}}
                />
                <Dropdown
                  label="forgotPasswordEmailTemplate"
                  value={data?.forgotPasswordEmailTemplate}
                  data={[
                    { id: "Template1", name: "Template1" },
                    { id: "Template2", name: "Template2" },
                    { id: "Template3", name: "Template3" },
                  ]}
                  edit={edit}
                  onSelect={() => {}}
                />
                {edit && (
                  <Grid item xs={4}>
                    <Typography variant="h5" color="inherit" className={previewText}>
                      {translate("viewPreview")}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <br />
            </SimpleForm>
          </AccordionDetails>
        )}
      </Accordion>
    ),
    [expanded, adminEmail, data, showView, edit],
  );

  /**
   *
   * @returns {React.Component} return component
   */
  const ResetPasswordAccordian = useMemo(
    () => (
      <Accordion square expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          IconButtonProps={{ edge: "start" }}
          aria-controls="panel2d-content"
          id="panel2d-header"
        >
          <Typography>{translate("panelTitleTwo")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
          </Typography>
        </AccordionDetails>
      </Accordion>
    ),
    [expanded],
  );

  return (
    <Grid>
      {DomainSelection}
      {loading && domain ? (
        <LoaderComponent />
      ) : (
        <Grid>
          <br />
          {ForgotPasswordAccordian}
          {ResetPasswordAccordian}
        </Grid>
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfAdminEmail")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={show}
        handleClose={() => toggleModal(false)}
        handleAction={continueHandler}
      />
    </Grid>
  );
};

export default AdminEmail;
