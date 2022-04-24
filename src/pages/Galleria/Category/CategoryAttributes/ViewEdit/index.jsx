import React, { useState } from "react";
import { useTranslate, useMutation, useRedirect, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../utils/CustomHooks";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import CategoryAttributesViewEditUI from "./CategoryAttributesViewEditUI";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component for View/Edit CategoryAttributes
 *
 * @param {object} props all the props needed for CategoryAttributes edit/view
 * @returns {React.ReactElement} returns a Category Attributes View/Edit component
 */
const CategoryAttributesViewEdit = (props) => {
  const translate = useTranslate();
  const [mutate] = useMutation();
  const redirect = useRedirect();
  const notify = useNotify();
  const history = useHistory();
  const [open, toggleModal] = useState(false);
  const [updateToggle, setUpdateToggle] = useState(false);
  const { match, isEditable } = props;

  const categoryId = match?.params?.categoryId;
  const attributeId = match?.params?.attributeId;

  const [initialFormData, setInitialData] = useState({
    attributeName: "",
    attributeValue: "",
    createdAt: "",
    createdByName: "",
    updatedAt: "",
    updatedByName: "",
  });
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
    { displayName: attributeId },
  ];

  /**
   * @function handleSuccess This function will set the initial data in object
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    setInitialData(res.data);
  };

  const resource = `${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/attributes/${attributeId}`;
  const { loading } = useCustomQueryWithStore("getOne", resource, handleSuccess);

  const { attributeName, attributeValue } = initialFormData;

  /**
   * @param {object} event data for create button
   * @function editAttributeHandler function called on click of edit button
   */
  const editAttributeHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/attributes/${attributeId}/edit`,
    });
  };

  /**
   * @function saveAttributeData function called on click of update button
   * @param {object} updateAttributeObj updated input values
   */
  const saveAttributeData = (updateAttributeObj) => {
    const { attributeName: name, attributeValue: value } = updateAttributeObj;
    setUpdateToggle(true);
    setInitialData((prevState) => ({
      ...prevState,
      attributeName: name,
      attributeValue: value,
    }));
  };

  /**
   * @function deleteAttributeHandler function called on click of delete button
   */
  const deleteAttributeHandler = () => {
    toggleModal(true);
  };

  /**
   * @function handleUpdateSuccess function called on successful update
   * @param {object} res response after update
   */
  const handleUpdateSuccess = (res) => {
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/attributes`);
    notify(res?.data?.message, "info", TIMEOUT);
  };

  /**
   * @function updateAttributeHandler function called on click of Continue button
   * @param {string} rowId attribute id to be updated
   */
  const updateAttributeHandler = (rowId) => {
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/attributes/${rowId}`,
        payload: {
          data: {
            attributeName,
            attributeValue,
            comment: "Category Attribute Updated",
            isEnabled: true,
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
    setUpdateToggle(false);
  };

  /**
   * @function closeForm will close the form and set it to initial state
   */
  const closeForm = () => {
    history.goBack();
  };

  return (
    !loading && (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <CategoryAttributesViewEditUI
          isEditable={isEditable}
          editAttributeHandler={editAttributeHandler}
          deleteAttributeHandler={deleteAttributeHandler}
          updateAttributeHandler={updateAttributeHandler}
          saveAttributeData={saveAttributeData}
          closeForm={closeForm}
          categoryId={categoryId}
          attributeId={attributeId}
          open={open}
          toggleModal={toggleModal}
          updateToggle={updateToggle}
          setUpdateToggle={setUpdateToggle}
          initialFormData={initialFormData}
        />
      </>
    )
  );
};

CategoryAttributesViewEdit.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default CategoryAttributesViewEdit;
