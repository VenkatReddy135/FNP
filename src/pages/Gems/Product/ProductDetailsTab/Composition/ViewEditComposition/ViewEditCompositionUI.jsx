/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { SimpleForm, useTranslate, useRedirect, required, useMutation, useNotify, NumberInput } from "react-admin";
import { Typography, Grid, IconButton, Divider, Box } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleModel from "../../../../../../components/CreateModal";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import CustomTextInput from "../../../../../../components/TextInput";
import CustomCreatedModifiedValue from "../../../../../../components/CustomCreatedModifiedValue";
import CommonDelete from "../../../../../../components/CommonDelete";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";
import {
  handleInvalidCharsInNumberInput,
  minimumNumber,
  maximumNumber,
} from "../../../../../../utils/validationFunction";

/**
 * Component to render the View/Edit Page UI for Product Composition
 *
 * @param {*} props props for Product Composition ui
 * @returns {React.ReactElement} Product Composition view
 */
const ViewEditCompositionUI = (props) => {
  const { match, isEditable } = props;

  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const [mutate] = useMutation();

  const [state, setState] = useState({
    compositionId: match?.params?.cid || "",
    productId: match?.params?.pid || "",
    responseData: {},
    formData: {},
    isOpen: false,
    deleteModal: false,
  });
  const { compositionId, productId, responseData, formData, isOpen, deleteModal } = state;

  const { createdBy, createdAt, updatedBy, updatedAt } = responseData;
  const createdModifiedObj = {
    createdByValue: createdBy,
    createdDateValue: createdAt,
    modifiedByValue: updatedBy,
    modifiedDateValue: updatedAt,
  };

  /**
   * @function handleCompositionInfo This function will set composition details of a composition id
   * @param {object} response is passed to the function
   */
  const handleCompositionInfo = (response) => {
    setState((prevState) => ({ ...prevState, responseData: { ...response.data } }));
  };
  const resourceForCompositionInfo = `${window.REACT_APP_GEMS_SERVICE}products/compositions/${compositionId}`;

  useCustomQueryWithStore("getData", resourceForCompositionInfo, handleCompositionInfo);

  /**
   * @function handleSubmit function called on Update button
   * @param {event} event  returns object when clicked on Update button
   */
  const handleSubmit = (event) => {
    setState((prevState) => ({ ...prevState, formData: { ...event }, isOpen: true }));
  };

  /**
   * @function closeModal function called on Update button
   */
  const closeModal = () => {
    setState((prevState) => ({ ...prevState, isOpen: false }));
  };

  /**
   * @function cancelHandler function called on click of cancel button of edit composition Page
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_GEMS_SERVICE}products/${productId}/show/composition`);
  };
  /**
   * @function switchToEditHandler  function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = () => {
    redirect(`/${window.REACT_APP_GEMS_SERVICE}products/composition/${productId}/edit/${compositionId}`);
  };
  /**
   * @function deleteHandler to delete composition
   */
  const deleteHandler = useCallback(() => {
    setState((prevState) => ({ ...prevState, deleteModal: true }));
  }, []);

  /**
   * @function closeDeleteHandler to delete composition
   */
  const closeDeleteHandler = useCallback(() => {
    setState((prevState) => ({ ...prevState, deleteModal: false }));
  }, []);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("update_composition_success"), "info", TIMEOUT);
    cancelHandler();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = () => {
    const { quantity, suggestedMarkupPercentage } = formData;
    closeModal();
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_GEMS_SERVICE}products/compositions/${compositionId}`,
        payload: {
          data: {
            quantity,
            suggestedMarkupPercentage,
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
    <SimpleForm
      save={handleSubmit}
      toolbar={
        isEditable ? <CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("update")} /> : null
      }
      initialValues={responseData}
    >
      <Grid container direction="row">
        <Typography variant="h5">{responseData.id}</Typography>
      </Grid>
      <Divider variant="fullWidth" />
      <Grid container direction="column" alignItems="flex-end" justify="space-between">
        {!isEditable && (
          <Grid item>
            <IconButton data-at-id="compEditBtn" onClick={switchToEditHandler}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton>
              <DeleteOutlinedIcon data-at-id="delEditBtn" onClick={deleteHandler} />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <Box maxWidth={800}>
        <Grid container spacing={3} data-testid="details_block">
          <CustomTextInput gridSize={{ xs: 6 }} label="product_id" value={responseData?.compositionProduct?.id} />
          <CustomTextInput gridSize={{ xs: 6 }} label="product_name" value={responseData?.compositionProduct?.name} />
          {isEditable ? (
            <Grid item xs={6}>
              <NumberInput
                source="quantity"
                label={translate("product_quantity")}
                validate={[required(), minimumNumber(1, "product_quantity_error")]}
                min={1}
                data-at-id="quantity"
                onKeyDown={handleInvalidCharsInNumberInput}
              />
            </Grid>
          ) : (
            <CustomTextInput gridSize={{ xs: 6 }} label="product_quantity" defaultValue={responseData.quantity} />
          )}
          {isEditable ? (
            <Grid item xs={6}>
              <NumberInput
                source="suggestedMarkupPercentage"
                label={translate("suggested_markup_percentage")}
                data-at-id="suggestedMarkup"
                onKeyDown={handleInvalidCharsInNumberInput}
                type="number"
                validate={[
                  minimumNumber(1, "suggested_markup_percentage_error"),
                  maximumNumber(100, "suggested_markup_percentage_error"),
                ]}
                min={1}
                max={100}
              />
            </Grid>
          ) : (
            <Grid item xs={6} data-testid="compQuantity">
              <CustomTextInput
                gridSize={{ xs: 6 }}
                label="suggested_markup_percentage"
                edit={false}
                defaultValue={responseData.suggestedMarkupPercentage}
                type="number"
              />
            </Grid>
          )}
        </Grid>
        <Box paddingTop="20px" data-testid="date_block">
          <CustomCreatedModifiedValue createdModifiedObj={createdModifiedObj} />
        </Box>
      </Box>
      <SimpleModel
        dialogContent={<CommonDialogContent message={`${translate("update_message")} ${translate("composition")}`} />}
        openModal={isOpen}
        handleClose={closeModal}
        handleAction={continueHandler}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
      />
      <CommonDelete
        resource={`${window.REACT_APP_GEMS_SERVICE}products/compositions/${compositionId}`}
        deleteText={translate("composition_delete_message")}
        redirectPath={`/${window.REACT_APP_GEMS_SERVICE}products/${productId}/show/composition`}
        close={closeDeleteHandler}
        open={deleteModal}
      />
    </SimpleForm>
  );
};

ViewEditCompositionUI.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool.isRequired,
};
export default ViewEditCompositionUI;
