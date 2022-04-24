/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Typography, Grid, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { SelectInput, useTranslate, required, SimpleForm, useRedirect, useMutation, useNotify } from "react-admin";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import SimpleModel from "../../../../../../components/CreateModal";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import CustomTextInput from "../../../../../../components/TextInput";
import SwitchComp from "../../../../../../components/SimpleFormToggle";
import CustomCreatedModifiedValue from "../../../../../../components/CustomCreatedModifiedValue";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * EditFeatureUI component which will be mounted by React on a root node.
 *
 * @param {object} props required by the edit feature
 * @param {string} props.pid product id from route
 * @param {string} props.fid feature id from route
 * @returns {React.ReactElement} returns a React element
 */
const EditFeatureUI = (props) => {
  const { pid, fid } = props;
  const redirect = useRedirect();
  const notify = useNotify();
  const [mutate] = useMutation();
  const translate = useTranslate();
  const [state, setState] = useState({
    selectReady: false,
    featureValues: [],
    responseData: {},
    isOpen: false,
    formData: {},
  });
  const { featureValues, responseData, isOpen, selectReady, formData } = state;

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const featuresData =
      res?.data?.data?.map((data) => {
        return { id: data.id, name: data.value };
      }) || [];
    setState((prevState) => ({ ...prevState, featureValues: [...featuresData], selectReady: true }));
  };

  /**
   * @function handleSetEditSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetEditSuccess = (res) => {
    setState((prevState) => ({ ...prevState, responseData: { ...res.data } }));
  };
  const resourceEdit = `${window.REACT_APP_GEMS_SERVICE}products/features/${fid}`;
  useCustomQueryWithStore("getOne", resourceEdit, handleSetEditSuccess);

  /**
   * function for the Submit click
   *
   * @param {object} data form data
   */
  const handleSubmit = (data) => {
    setState((prevState) => ({ ...prevState, isOpen: true, formData: { ...data } }));
  };

  /**
   *
   * function for the cancel click
   */
  const handleCancel = () => {
    redirect(`/${window.REACT_APP_GEMS_SERVICE}products/${pid}/show/features`);
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("update_feature_success"), "info", TIMEOUT);
    handleCancel();
  };

  /**
   * function for the continue click
   */
  const handleContinue = () => {
    const { newFeatureValue, isEnabled } = formData;
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_GEMS_SERVICE}products/features/${responseData.id}`,
        payload: {
          data: {
            enabled: isEnabled,
            featureValue: {
              id: newFeatureValue,
            },
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
  };

  /**
   * @function closePopup function called on click of create button on Create Page
   */
  const closePopup = () => {
    setState((prevState) => ({ ...prevState, isOpen: false }));
  };

  const customToolbar = <CustomToolbar onClickCancel={handleCancel} saveButtonLabel={translate("Update")} />;
  const commonDialogContent = <CommonDialogContent message={translate("feature_update_warning_message")} />;
  const { createdBy, createdAt, updatedBy, updatedAt } = responseData;
  const createdModifiedObj = {
    createdByValue: createdBy,
    createdDateValue: createdAt,
    modifiedByValue: updatedBy,
    modifiedDateValue: updatedAt,
  };

  useEffect(() => {
    if (responseData?.featureType?.id) {
      mutate(
        {
          type: "getData",
          resource: `${window.REACT_APP_GEMS_SERVICE}features/values?feature-type=${responseData.featureType.id}`,
          payload: {},
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleSetDataSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
    }
  }, [responseData]);

  return (
    <SimpleForm toolbar={customToolbar} initialValues={responseData} save={handleSubmit}>
      <Box maxWidth="900px">
        <Grid container>
          <Grid item xs={4} data-testid="feature_type_name">
            <CustomTextInput
              label={translate("feature_type_name")}
              defaultValue={responseData?.featureType?.name}
              gridSize={{ xs: 12 }}
            />
          </Grid>
          <Grid item xs={4} data-testid="EditFeatureValue">
            {selectReady && (
              <SelectInput
                source="newFeatureValue"
                label={translate("feature_value")}
                validate={required()}
                data-at-id="EditFeatureValue"
                choices={featureValues}
                defaultValue={responseData?.featureValue?.id}
                margin="none"
              />
            )}
          </Grid>
          <Grid item xs={4} data-testid="isEnabled">
            <Typography variant="caption">{translate("is_enabled")}</Typography>
            <SwitchComp name="isEnabled" record={responseData?.isEnabled} enabledForEdit />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <CustomCreatedModifiedValue createdModifiedObj={createdModifiedObj} />
        </Grid>
        <SimpleModel
          dialogContent={commonDialogContent}
          showButtons
          closeText={translate("cancel")}
          actionText={translate("continue")}
          openModal={isOpen}
          handleClose={closePopup}
          handleAction={handleContinue}
        />
      </Box>
    </SimpleForm>
  );
};
EditFeatureUI.propTypes = {
  pid: PropTypes.string.isRequired,
  fid: PropTypes.string.isRequired,
};
export default EditFeatureUI;
