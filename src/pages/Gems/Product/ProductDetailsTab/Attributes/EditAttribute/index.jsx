/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { TextInput, required, SimpleForm, useTranslate, useMutation, useNotify } from "react-admin";
import PropTypes from "prop-types";
import { Grid, Typography, Divider } from "@material-ui/core";
import SimpleModel from "../../../../../../components/CreateModal";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import SwitchComp from "../../../../../../components/switch";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import { useCustomQueryWithStore, useBoolean, onFailure, onSuccess } from "../../../../../../utils/CustomHooks";
import formatDateValue from "../../../../../../utils/formatDateTime";
import useStyles from "../../../../../../assets/theme/common";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";
import LoaderComponent from "../../../../../../components/LoaderComponent";

/**
 * Component for edit attribute UI
 *
 * @param {object} props all props required
 * @param {object} match to get the id
 * @param {object} history to get the router API's for navigations
 * @returns {React.ReactElement} returns a edit attribute UI
 */
const EditAttribute = (props) => {
  const { match, history } = props;
  const translate = useTranslate();
  const classes = useStyles();
  const requiredValidate = [required()];
  const notify = useNotify();
  const [mutate] = useMutation();
  const [modalOpenFlag, isModalOpen] = useBoolean(false);
  const [isEnabled, setEnabled] = useState(true);
  const [responseData, setResponseData] = useState({});
  const { createdBy, createdAt, updatedBy, updatedAt, isEnabled: enabledValue } = responseData;
  const [editObj, setEditObj] = useState({
    attributeName: "",
    attributeValue: "",
  });
  const productId = match?.params?.id;

  /**
   * @function handleAttributeInfo This function will set attribute details of id
   * @param {object} response is passed to the function
   */
  const handleAttributeInfo = (response) => {
    setResponseData(response?.data);
  };
  const resourceAttributeInfo = `${window.REACT_APP_GEMS_SERVICE}products/attributes/${productId}`;
  const { loading } = useCustomQueryWithStore("getOne", resourceAttributeInfo, handleAttributeInfo);

  /**
   * @function handleSubmit to submit a form onClick event
   * @param {object} formValues object to get the response status
   */
  const handleSubmit = (formValues) => {
    const { isEnabled: i, attributeName: aN, attributeValue: aV, enabled: e } = formValues;
    isModalOpen.on();
    setEditObj({ isEnabled: i, attributeName: aN, attributeValue: aV, enabled: e });
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response object to get the response status
   */
  const handleUpdateSuccess = (response) => {
    notify(response?.data?.message || translate("update_attribute_success"), "info", TIMEOUT);
    isModalOpen.off();
    history.goBack();
  };

  /**
   * @function updateTagRelation function called when button click for update
   */
  const updateAttribute = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_GEMS_SERVICE}products/attributes/${productId}`,
        payload: {
          data: {
            attributeName: editObj?.attributeName,
            attributeValue: editObj?.attributeValue,
            isEnabled,
            enabled: responseData?.enabled,
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

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue]);

  /**
   * @function handleCancel to cancel the updation of attribute details
   */
  const handleCancel = () => {
    history.goBack();
  };

  /**
   * @param {boolean} value to set in the state
   * @function handleIsEnabledChange to change the enable flags
   */
  const handleIsEnabledChange = (value) => {
    setEnabled(value);
  };

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Typography variant="h5" data-testid="edit_attribute" className={classes.gridStyle}>
          {translate("edit_attribute")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" className={classes.dividerStyle} />
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm
          save={handleSubmit}
          toolbar={<CustomToolbar onClickCancel={handleCancel} saveButtonLabel={translate("update")} />}
          initialValues={responseData}
        >
          <>
            <Grid container>
              <Grid item xs={3}>
                <CustomViewUI
                  label={translate("attribute_type")}
                  value={responseData?.attributeType?.name}
                  gridSize={{ xs: 12 }}
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
                <SwitchComp record={isEnabled} onChange={handleIsEnabledChange} disable={false} />
              </Grid>
            </Grid>
          </>
          <Grid container className={classes.listStyle}>
            <Grid item data-testid="relations_created_by" md={3}>
              <CustomViewUI label={translate("relations_created_by")} value={createdBy} />
            </Grid>
            <Grid item data-testid="relations_created_date" md={9}>
              <CustomViewUI
                label={translate("relations_created_date")}
                value={createdAt ? formatDateValue(createdAt) : null}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.tabStyle}>
            <Grid item data-testid="last_modified_by" md={3}>
              <CustomViewUI label={translate("last_modified_by")} value={updatedBy} />
            </Grid>
            <Grid item data-testid="last_modified_date" md={9}>
              <CustomViewUI
                label={translate("last_modified_date")}
                value={updatedAt ? formatDateValue(updatedAt) : null}
              />
            </Grid>
          </Grid>
        </SimpleForm>
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("attribute_update_message")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={modalOpenFlag}
        handleClose={isModalOpen.off}
        handleAction={updateAttribute}
      />
    </>
  );
};

EditAttribute.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any),
};
EditAttribute.defaultProps = {
  match: {},
  history: {},
};

export default EditAttribute;
