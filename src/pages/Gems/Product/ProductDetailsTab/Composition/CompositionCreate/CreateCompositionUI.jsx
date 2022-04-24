/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Grid, Box } from "@material-ui/core";
import { SimpleForm, NumberInput, required, useTranslate, useMutation, useNotify } from "react-admin";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import SimpleModel from "../../../../../../components/CreateModal";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import CustomAutoComplete from "../../../../../../components/CustomAutoComplete";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import {
  handleInvalidCharsInNumberInput,
  minimumNumber,
  maximumNumber,
} from "../../../../../../utils/validationFunction";
import { onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * Component for create composition UI
 *
 * @param {*} props all the props needed for create composition UI
 * @returns {React.ReactElement} returns a create composition UI component.
 */
const CreateCompositionUI = (props) => {
  const { match } = props;
  const requiredValidate = [required()];
  const history = useHistory();
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();

  const [state, setState] = useState({
    modalOpenFlag: false,
    apiParams: {
      fieldName: "Product Name-SKU Code",
      type: "getData",
      url: `${window.REACT_APP_GEMS_SERVICE}/products/product`,
      sortParam: "id",
      sortDirc: "ASC",
      fieldId: "id",
    },
    productId: match.params.id,
    formData: {},
  });

  const { modalOpenFlag, apiParams, productId, formData } = state;

  /**
   * @function handleCancel to cancel the inertion of composition insertion form.
   */
  const handleClosePopup = () => {
    setState((prevState) => ({ ...prevState, modalOpenFlag: false }));
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("create_composition_success"), "info", TIMEOUT);
    history.goBack();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = () => {
    const { prodSkuCode, compQuantity, suggestedMarkup } = formData;
    handleClosePopup();
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_GEMS_SERVICE}products/compositions`,
        payload: {
          data: {
            params: null,
            dataObj: {
              compositionProduct: {
                id: prodSkuCode.id,
              },
              product: {
                id: productId,
              },
              quantity: compQuantity || 0,
              suggestedMarkupPercentage: suggestedMarkup || 0,
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

  /**
   * @function handleCancel to cancel the inertion of composition insertion form.
   */
  const handleCancel = () => {
    history.goBack();
  };

  /**
   * @param {object} data event
   * @function handleSubmit to submit a form onClick event
   */
  const handleSubmit = (data) => {
    setState((prevState) => ({ ...prevState, modalOpenFlag: true, formData: { ...data } }));
  };

  return (
    <Box maxWidth={1200}>
      <SimpleForm
        save={handleSubmit}
        toolbar={<CustomToolbar onClickCancel={handleCancel} saveButtonLabel={translate("create")} />}
      >
        <Grid container justify="space-between">
          <Grid item xs={5} data-testid="prodSkuCode">
            <CustomAutoComplete
              source="prodSkuCode"
              label={translate("product_name_sku_code")}
              dataId="productNameSKUcode"
              apiParams={apiParams}
              onOpen
              validate={requiredValidate}
            />
          </Grid>
          <Grid item xs={3} data-testid="compQuantity">
            <NumberInput
              source="compQuantity"
              label={translate("product_quantity")}
              validate={[required(), minimumNumber(1, "product_quantity_error")]}
              min={1}
              data-at-id="quantity"
              onKeyDown={handleInvalidCharsInNumberInput}
            />
          </Grid>
          <Grid item xs={3} data-testid="suggestedMarkup">
            <NumberInput
              source="suggestedMarkup"
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
        </Grid>
      </SimpleForm>
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("composition_submit_message")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={modalOpenFlag}
        handleClose={handleClosePopup}
        handleAction={continueHandler}
      />
    </Box>
  );
};
CreateCompositionUI.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};
CreateCompositionUI.defaultProps = {
  match: {},
};

export default CreateCompositionUI;
