/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Grid, Typography, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, useRedirect, TextInput, required, useMutation, useNotify } from "react-admin";
import useStyles from "../../../../../assets/theme/common";
import CustomToolbar from "../../../../../components/CustomToolbar";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import SimpleModel from "../../../../../components/CreateModal";
import SwitchComp from "../../../../../components/switch";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import LoaderComponent from "../../../../../components/LoaderComponent";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks/HelperFunctions";
import { TIMEOUT } from "../../../../../config/GlobalConfig";

/**
 * @param {object} props   all required props are passed here
 * @function EditFreeMessageCardUI  to redirect  FreeMessages Edit
 * @returns {React.ReactElement} FreeMessages Edit Page
 */
const EditFreeMessageCardUI = (props) => {
  const { match, selectedOccasion } = props;
  const messageId = match.params.id;
  const { occasionName, id } = selectedOccasion;
  const translate = useTranslate();
  const classes = useStyles();
  const redirect = useRedirect();
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [responseData, setResponseData] = useState({});
  const notify = useNotify();
  const [mutate] = useMutation();
  const baseURL = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${id}/view`;

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("edit_occasion_success_message"), "info", TIMEOUT);
    setIsOpen(false);
    redirect(`/${baseURL}`);
  };

  /**
   * @function updateOccasionMesage function called when button click for update
   */
  const updateOccasionMesage = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages`,
        payload: {
          data: {
            isEnabled: responseData.isEnabled,
            occasionId: id,
            text: responseData.text,
            id: messageId,
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
   * @function handleFreeMessageCardInfo This function will set free message card details
   * @param {object} response is passed to the function
   */
  const handleFreeMessageCardInfo = (response) => {
    setResponseData(response.data);
  };
  const resourceForFreeMessageCardInfo = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${messageId}`;
  const { loading } = useCustomQueryWithStore("getOne", resourceForFreeMessageCardInfo, handleFreeMessageCardInfo);

  /**
   * @function dialogContent function renders the Pop-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => <CommonDialogContent message={message} />;

  /**
   * @function showPopup function called on click of update button on Edit Page
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    const message = `${translate("update_freemessage")}`;
    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: `${translate("cancel")}`,
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setIsOpen(true);
  };

  /**
   * @function cancelHandler function called on click of cancel button of edit FreeMessage Page
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${id}/view`);
  };
  /**
   * @param {string } editData object has data entered in field
   * @function handleSubmit function called on update button
   */
  const handleSubmit = (editData) => {
    showPopup("Continue");
    const editObj = {
      text: editData.text,
      isEnabled: editData.isEnabled,
    };
    setResponseData({ ...responseData, ...editObj });
  };
  /**
   * @param {boolean} enabledValue to set in the state
   * @function handleIsEnabledChange to change the enable flags
   */
  const handleIsEnabledChange = (enabledValue) => {
    setResponseData({
      ...responseData,
      isEnabled: enabledValue,
    });
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm
          save={handleSubmit}
          initialValues={responseData}
          toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("update")} />}
        >
          <Grid container direction="row" alignItems="flex-start" justify="space-between" md={6}>
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs className={classes.gridStyle}>
              <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
                {occasionName}
              </Typography>
              <Divider variant="fullWidth" />
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="flex-start" justify="space-between" md={6}>
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              <TextInput
                source="text"
                type="text"
                label={`${translate("message_on_card")}`}
                className={classes.fullWidth}
                validate={[required()]}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="flex-start" justify="space-between" md={6}>
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              <Typography variant="h6">{translate("status")}</Typography>
              <SwitchComp record={responseData.isEnabled} onChange={(val) => handleIsEnabledChange(val)} />
            </Grid>
          </Grid>
          <SimpleModel
            {...confirmDialogObj}
            openModal={isOpen}
            handleClose={() => setIsOpen(false)}
            handleAction={updateOccasionMesage}
          />
        </SimpleForm>
      )}
    </>
  );
};
EditFreeMessageCardUI.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedOccasion: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EditFreeMessageCardUI;
