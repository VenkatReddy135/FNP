/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Typography, Divider, Grid, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { SimpleForm, useTranslate, required, useMutation, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import useStyles from "../../../../../../assets/theme/common";
import SimpleModel from "../../../../../../components/CreateModal";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import CustomAutoComplete from "../../../../../../components/CustomAutoComplete";
import { onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * Component for AssociateFeature
 *
 * @param {object} props props
 * @param {object} props.match history match
 * @returns {React.ReactElement} returns a AssociateFeature component
 */
const AssociateFeature = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const [mutate] = useMutation();
  const { match } = props;
  const selectedProductId = match.params.id;
  const [state, setState] = useState({
    modalOpenFlag: false,
    apiParams: {
      type: "getData",
      url: `${window.REACT_APP_GEMS_SERVICE}/features/types`,
      sortParam: "id",
      sortDirc: "ASC",
      fieldName: "name",
      fieldId: "id",
    },
    productId: match.params.id,
    formData: {},
    featureTypeId: "",
  });
  const { modalOpenFlag, apiParams, featureTypeId, formData } = state;

  /**
   * @function handleCancel to cancel the inertion of composition insertion form.
   */
  const handleCancel = () => {
    history.goBack();
  };

  /**
   * @function closePopup function called on click of create button on Create Page
   */
  const closePopup = () => {
    setState((prevState) => ({ ...prevState, modalOpenFlag: false }));
  };

  /**
   * @function setType function called on click of create button on Create Page
   * @param {object} e event called on click of cancel
   */
  const setType = (e) => {
    setState((prevState) => ({ ...prevState, featureTypeId: e?.target?.value?.id || "" }));
  };

  /**
   *@function createAssociation function called on click of create
   *@param {object} data event called on click of cancel
   */
  const createAssociation = (data) => {
    setState((prevState) => ({ ...prevState, formData: { ...data }, modalOpenFlag: true }));
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("create_feature_success"), "info", TIMEOUT);
    history.goBack();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = () => {
    const { featureName, featureValue } = formData;
    closePopup();
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_GEMS_SERVICE}products/features`,
        payload: {
          data: {
            params: null,
            dataObj: {
              featureType: {
                id: featureName.id,
              },
              featureValue: {
                id: featureValue.id,
              },
              product: {
                id: selectedProductId,
              },
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

  return (
    <>
      <SimpleForm
        save={createAssociation}
        toolbar={<CustomToolbar onClickCancel={handleCancel} saveButtonLabel={translate("associate")} />}
      >
        <Typography variant="h5" className={classes.gridStyle}>
          {translate("associate_feature")}
        </Typography>
        <Divider variant="fullWidth" className={classes.tabStyle} />
        <Box maxWidth="600px">
          <Grid container justify="space-between" data-testid="feature_type_name">
            <Grid item xs={5}>
              <CustomAutoComplete
                source="featureName"
                label={translate("feature_type_name")}
                dataId="feature_type_name"
                apiParams={{ ...apiParams }}
                onOpen
                validate={[required()]}
                onChange={setType}
              />
            </Grid>
            <Grid item xs={5} data-testid="feature_value">
              <CustomAutoComplete
                source="featureValue"
                label={translate("feature_value")}
                dataId="feature_value"
                apiParams={{
                  ...apiParams,
                  url: `${window.REACT_APP_GEMS_SERVICE}features/values?feature-type=${featureTypeId}`,
                  fieldName: "value",
                }}
                onOpen
                validate={[required()]}
                disabled={!featureTypeId}
              />
            </Grid>
          </Grid>
        </Box>
      </SimpleForm>
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("feature_associate_submit_message")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={modalOpenFlag}
        handleClose={closePopup}
        handleAction={continueHandler}
      />
    </>
  );
};

AssociateFeature.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AssociateFeature;
