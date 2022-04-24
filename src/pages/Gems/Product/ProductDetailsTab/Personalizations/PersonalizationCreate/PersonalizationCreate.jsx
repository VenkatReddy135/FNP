/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { SimpleForm, useTranslate, useNotify, useCreate } from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import PersonalizationSimpleForm from "../PersonalizationSimpleForm";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import { useBoolean, onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import SimpleModel from "../../../../../../components/CreateModal";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * Component for Create Personalization
 *
 * @param {*} props all the props passed from the listing component
 * @param {object} props.match to get the id of the product
 * @param {object} props.history is used for navigation
 * @returns {React.ReactElement} returns a personalization create component
 */
const PersonalizationCreate = (props) => {
  const { match, history } = props;
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const [modalOpenFlag, isModalOpen] = useBoolean(false);
  const { id } = match.params;

  const [createObj, setCreateObj] = useState({
    allowedMediaTypes: "",
    contentType: "",
    fieldName: "",
    isFullWidth: false,
    isRequired: false,
    label: "",
    isMessageOnProduct: false,
    maximumQuantity: 0,
    maximumSize: 0,
    maximumSizeUnit: "",
    minimumQuantity: 0,
    minimumSize: 0,
    minimumSizeUnit: "",
    sequence: 0,
  });

  const {
    allowedMediaTypes,
    contentType,
    fieldName,
    isFullWidth,
    isRequired,
    label,
    maximumQuantity,
    maximumSize,
    maximumSizeUnit,
    minimumQuantity,
    minimumSize,
    minimumSizeUnit,
    sequence,
    isMessageOnProduct,
  } = createObj;

  /**
   * @function cancelCreate to redirect back to the listing page for personalization.
   */
  const cancelCreate = () => {
    history.goBack();
  };

  /**
   * @function handleSubmit to submit a form
   * @param {object} formValues object containing the form Values
   */
  const handleSubmit = (formValues) => {
    isModalOpen.on();
    setCreateObj((prev) => {
      return { ...prev, ...formValues };
    });
  };

  /**
   * @function handleSuccess This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    history.goBack();
    notify(res?.data?.message || translate("product_attribute_create_message"), "info", TIMEOUT);
    isModalOpen.off();
  };

  /**
   * @function handleBadRequest This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleBadRequest = (res) => {
    isModalOpen.off();
    notify(res?.message || translate("product_attribute_error_message"), "error", TIMEOUT);
  };

  const [createAttribute] = useCreate(
    `${window.REACT_APP_GEMS_SERVICE}products/personalizations`,
    {
      dataObj: JSON.stringify({
        allowedMediaTypes,
        contentType,
        fieldName,
        isFullWidth,
        isRequired,
        label,
        isMessageOnProduct,
        maximumQuantity,
        maximumSize,
        maximumSizeUnit,
        minimumQuantity,
        minimumSize,
        minimumSizeUnit,
        product: {
          id,
        },
        sequence,
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

  return (
    <>
      <Grid container>
        <Typography variant="h5" className={classes.gridStyle}>
          {translate("new_attribute")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <SimpleForm
        save={handleSubmit}
        toolbar={
          <CustomToolbar onClickCancel={cancelCreate} saveButtonLabel={translate("continue")} saveButtonIcon={<></>} />
        }
      >
        <PersonalizationSimpleForm isEditable {...props} />
      </SimpleForm>
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("product_attribute_confirmation_message")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={modalOpenFlag}
        handleClose={isModalOpen.off}
        handleAction={createAttribute}
      />
    </>
  );
};

PersonalizationCreate.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any),
};

PersonalizationCreate.defaultProps = {
  match: {},
  history: {},
};
export default PersonalizationCreate;
