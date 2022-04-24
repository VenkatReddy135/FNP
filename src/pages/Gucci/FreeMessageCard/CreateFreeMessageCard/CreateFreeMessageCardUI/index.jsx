/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, TextInput, required, useNotify, useCreate, useRedirect } from "react-admin";
import useStyles from "../../../../../assets/theme/common";
import CustomToolbar from "../../../../../components/CustomToolbar";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import SimpleModel from "../../../../../components/CreateModal";
import SwitchComp from "../../../../../components/switch";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks/HelperFunctions";
import { TIMEOUT } from "../../../../../config/GlobalConfig";

/**
 * @param {object} props all required props are passed here
 * @function CreateFreeMessageCardUI  to redirect  FreeMessages Create
 * @returns {React.ReactElement} FreeMessages Create Page
 */
const CreateFreeMessageCardUI = (props) => {
  const { selectedOccasion } = props;
  const { occasionName, id } = selectedOccasion;
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const classes = useStyles();
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [createRelationObj, updateCreateRelationObj] = useState({
    text: "",
    occasionId: "",
    isEnabled: true,
  });
  const baseURL = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${id}/view`;

  /**
   * @function handleSuccess This function will run on success of create message for occasion
   */
  const handleSuccess = () => {
    redirect(`/${baseURL}`);
    notify(translate("create_occasion_success_message"), "info", TIMEOUT);
  };
  /**
   * @function handleBadRequest This function will run on failure of create message for occasion
   * @param {object} res is passed to the function
   */
  const handleBadRequest = (res) => {
    notify(res?.message, "error", TIMEOUT);
    setIsOpen(false);
  };
  /**
   * @function  createOccasionMessage post call to create new message
   */
  const [createOccasionMessage] = useCreate(
    `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages`,
    {
      dataObj: JSON.stringify({
        isEnabled: true,
        occasionId: id,
        text: createRelationObj.text,
      }),
    },
    {
      onSuccess: (response) => {
        onSuccess({ response, handleSuccess, handleBadRequest });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  /**
   * @function dialogContent function renders the Pop-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => <CommonDialogContent message={message} />;

  /**
   * @function showPopup function called on click of save button on Create Page
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    const message = `${translate("add_freemessage")}`;
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
   * @function cancelHandler function called on click of cancel button of create FreeMessage Page
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/${id}/view`);
  };
  /**
   * @param {object} createObj have all fieds entered value
   * @function handlesubmit function called on save button
   */
  const handlesubmit = (createObj) => {
    showPopup("Continue");
    updateCreateRelationObj((prevState) => ({ ...prevState, text: createObj.messageOnCard }));
  };

  return (
    <SimpleForm
      save={handlesubmit}
      toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("add")} />}
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
            source="messageOnCard"
            label={translate("message_on_card")}
            className={classes.formInputWidth}
            validate={[required()]}
            autoComplete="off"
          />
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="flex-start" justify="space-between" md={6}>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <Typography variant="h6">{translate("status")}</Typography>
          <SwitchComp disable record />
        </Grid>
      </Grid>

      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={createOccasionMessage}
      />
    </SimpleForm>
  );
};
CreateFreeMessageCardUI.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedOccasion: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default CreateFreeMessageCardUI;
