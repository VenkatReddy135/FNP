/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid } from "@material-ui/core";
import React, { useState, useMemo } from "react";
import { useTranslate, SimpleForm, required, useMutation, useNotify, useRedirect } from "react-admin";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import CustomTextInput from "../../../../../components/TextInput";
import CustomToolbar from "../../../../../components/CustomToolbar";
import SimpleModal from "../../../../../components/CreateModal";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component for CategoryAttributes Create
 *
 * @param {object} props all the props needed for Category Attributes Create
 * @returns {React.ReactElement} returns a Category Attributes Create component
 */
const CategoryAttributesCreate = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const history = useHistory();
  const [open, toggleModal] = useState(false);
  const initialState = {
    attributeName: "",
    attributeValue: "",
  };
  const [input, setInput] = useState(initialState);
  const { match } = props;

  const categoryId = match?.params?.categoryId;
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: categoryId,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show`,
    },
    {
      displayName: translate("category_attribute"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/attributes`,
    },
    { displayName: translate("new_attribute") },
  ];

  /**
   * @function handleUpdateSuccess function called on successful creation
   */
  const handleCreateSuccess = () => {
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/attributes`);
    notify(translate("category_attribute_created_successfully"), "info", TIMEOUT);
  };

  /**
   * @function attributeCreateHandler function called on click of Continue button
   * @param {string} rowId category id in which attribute has to be created
   */
  const attributeCreateHandler = (rowId) => {
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/${rowId}/attributes`,
        payload: {
          data: { dataObj: { attributeName: input.attributeName, attributeValue: input.attributeValue } },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleCreateSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    toggleModal(false);
  };

  /**
   * @function closeForm will close the form and set it to initial state
   */
  const closeForm = () => {
    history.goBack();
  };

  /**
   * @function saveAttributeData function called on click of Create button
   * @param {object} createAttributeObj updated input values
   */
  const saveAttributeData = (createAttributeObj) => {
    toggleModal(true);
    setInput({ ...input, ...createAttributeObj });
  };

  /**
   * @returns {React.Component} returns component
   */
  const InputForm = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Typography variant="subtitle1">{translate("new_attribute")}</Typography>
        <SimpleForm
          initialValues={input}
          save={saveAttributeData}
          toolbar={<CustomToolbar onClickCancel={closeForm} saveButtonLabel={translate("create")} />}
        >
          <Grid data-testid="text-input" container wrap="nowrap" spacing={5}>
            <CustomTextInput
              source="attributeName"
              label="attribute_type"
              validate={required()}
              edit
              gridSize={{ xs: 12, sm: 2, md: 2 }}
            />
            <CustomTextInput
              source="attributeValue"
              label="attribute_value"
              validate={required()}
              edit
              gridSize={{ xs: 12, sm: 2, md: 2 }}
            />
          </Grid>
        </SimpleForm>
      </>
    ),
    [],
  );

  return (
    <>
      {InputForm}
      <SimpleModal
        openModal={open}
        dialogContent={<CommonDialogContent message={translate("new_attribute_creation_confirmation")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={() => toggleModal(false)}
        handleAction={() => attributeCreateHandler(`${categoryId}`)}
      />
    </>
  );
};

CategoryAttributesCreate.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CategoryAttributesCreate;
