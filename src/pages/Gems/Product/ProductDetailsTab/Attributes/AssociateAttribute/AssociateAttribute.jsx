/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from "react";
import { useTranslate, SimpleForm, TextInput, useNotify, SelectInput, useCreate, required } from "react-admin";
import PropTypes from "prop-types";
import { Grid, Typography, Divider } from "@material-ui/core";
import SimpleModel from "../../../../../../components/CreateModal";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import { useCustomQueryWithStore, useBoolean, onFailure, onSuccess } from "../../../../../../utils/CustomHooks";
import SwitchComp from "../../../../../../components/switch";
import useStyles from "../../../../../../assets/theme/common";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * Component for create attribute UI
 *
 * @param {object} props all the props needed for create attribute UI
 * @param {object} props.match is used to get the product id from match.params.id
 * @param {object} props.history is used for routing
 * @returns {React.ReactElement} returns a create attribute UI
 */
const AssociateAttribute = (props) => {
  const requiredValidate = [required()];

  const { match, history } = props;
  const translate = useTranslate();
  const notify = useNotify();
  const [modalOpenFlag, isModalOpen] = useBoolean(false);
  const [isEnabled, setEnabled] = useState(true);
  const productId = match?.params?.id;
  const classes = useStyles();
  const [attributeType, setAttributeTypes] = useState([]);
  const [createObj, setCreateObj] = useState({
    attributeName: "",
    attributeValue: "",
    attributeType: {},
  });

  /**
   * @function handleSuccessAttributeTypes This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccessAttributeTypes = (response) => {
    const attributeTypes = response?.data?.data?.map((item) => {
      return { id: item?.id, name: item?.name };
    });
    setAttributeTypes(attributeTypes);
  };
  useCustomQueryWithStore("getData", `${window.REACT_APP_GEMS_SERVICE}attributes/types`, handleSuccessAttributeTypes);

  /**
   * @function handleSubmit to submit a form onClick event
   * @param {object} formValues object to get the response status
   */
  const handleSubmit = (formValues) => {
    const { attributeType: aT, attributeName, attributeValue } = formValues;
    isModalOpen.on();
    setCreateObj((prev) => {
      return { ...prev, attributeType: aT, attributeName, attributeValue };
    });
  };

  /**
   * @function handleCancel to cancel the insertion of composition insertion form.
   */
  const handleCancel = () => {
    history.goBack();
  };

  /**
   *
   * @param {boolean} enabledValue to set in the state
   * @function handleIsEnabledChange to change the enable flags
   */
  const handleIsEnabledChange = (enabledValue) => {
    setEnabled(enabledValue);
  };

  /**
   * @function handleSuccess This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    history.goBack();
    notify(res?.data?.message || translate("attribute_success_message"), "info", TIMEOUT);
    isModalOpen.off();
  };

  /**
   * @function handleBadRequest This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleBadRequest = (res) => {
    isModalOpen.off();
    notify(res?.message || translate("associate_attribute_error_message"), "error", TIMEOUT);
  };

  const [createAttribute] = useCreate(
    `${window.REACT_APP_GEMS_SERVICE}products/attributes`,
    {
      dataObj: JSON.stringify({
        isEnabled,
        enabled: isEnabled,
        attributeValue: createObj.attributeValue,
        attributeName: createObj.attributeName,
        attributeType: { id: createObj.attributeType },
        product: {
          id: productId,
        },
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
      <Grid container direction="row" justify="space-between">
        <Typography variant="h5" data-testid="associate_attribute" className={classes.gridStyle}>
          {translate("associate_attribute")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      <SimpleForm
        save={handleSubmit}
        toolbar={<CustomToolbar onClickCancel={handleCancel} saveButtonLabel={translate("associate")} />}
      >
        <>
          <Grid container>
            <Grid item xs={3}>
              <SelectInput
                source="attributeType"
                className={classes.selectItem}
                label={translate("attribute_type")}
                data-testid="attribute_type"
                choices={attributeType}
                validate={requiredValidate}
              />
            </Grid>
            <Grid item xs={3}>
              <TextInput
                source="attributeName"
                label={translate("attribute_name")}
                className={classes.textInputField}
                validate={requiredValidate}
                data-testid="attribute_name"
              />
            </Grid>
            <Grid item xs={3}>
              <TextInput
                source="attributeValue"
                label={translate("attribute_value")}
                className={classes.textInputField}
                validate={requiredValidate}
                data-testid="attribute_value"
              />
            </Grid>
          </Grid>
          <Grid container data-testid="is_enabled" direction="row">
            <Grid item xs={12}>
              <Typography variant="caption">{translate("is_enabled")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <SwitchComp record={isEnabled} onChange={handleIsEnabledChange} />
            </Grid>
          </Grid>
        </>
      </SimpleForm>

      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("attribute_create_message")} />}
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
AssociateAttribute.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any),
};
AssociateAttribute.defaultProps = {
  match: {},
  history: {},
};

export default AssociateAttribute;
