/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { useTranslate, SimpleForm, required } from "react-admin";
import { Grid, Typography, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import CustomToolbar from "../../../../../components/CustomToolbar";
import CustomTextInput from "../../../../../components/TextInput";
import CommonDelete from "../../../../../components/CommonDelete";
import formatDateValue from "../../../../../utils/formatDateTime";
import SimpleModal from "../../../../../components/CreateModal";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import useStyles from "../../../../../assets/theme/common";

/**
 * Component for View/Edit CategoryAttributes UI
 *
 * @param {object} props all the props needed for CategoryAttributes edit/view
 * @returns {React.ReactElement} returns a Category Attributes View/Edit UI component
 */
const CategoryAttributesViewEditUI = (props) => {
  const translate = useTranslate();
  const classes = useStyles();

  const {
    isEditable,
    editAttributeHandler,
    deleteAttributeHandler,
    updateAttributeHandler,
    saveAttributeData,
    closeForm,
    categoryId,
    attributeId,
    open,
    toggleModal,
    updateToggle,
    setUpdateToggle,
    initialFormData,
  } = props;

  const { attributeName, attributeValue, createdByName, createdAt, updatedByName, updatedAt } = initialFormData;

  /**
   * @returns {React.Component} returns component
   */
  const ViewEditHeader = useMemo(
    () => (
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Typography variant="subtitle1">{translate("category_attribute_name")}</Typography>
        {!isEditable && (
          <Grid item>
            <IconButton onClick={editAttributeHandler}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton onClick={deleteAttributeHandler}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    ),
    [isEditable],
  );

  /**
   * @returns {React.Component} returns component
   */
  const ViewEditForm = useMemo(
    () => (
      <>
        <SimpleForm
          save={saveAttributeData}
          toolbar={
            isEditable ? <CustomToolbar onClickCancel={closeForm} saveButtonLabel={translate("update")} /> : null
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={2} md={4}>
              <CustomTextInput
                source="attributeName"
                label="attribute_type"
                value={attributeName}
                validate={required()}
                edit={isEditable}
                title={attributeName}
                className={classes.multiLineTypography}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={4}>
              <CustomTextInput
                source="attributeValue"
                label="attribute_value"
                value={attributeValue}
                validate={required()}
                edit={isEditable}
                title={attributeValue}
                className={classes.multiLineTypography}
              />
            </Grid>
          </Grid>

          <Grid container spacing={5}>
            <CustomTextInput label="createdBy" value={createdByName} gridSize={{ xs: 12, sm: 2, md: 4 }} />
            <CustomTextInput
              label="createdDate"
              value={formatDateValue(createdAt)}
              gridSize={{ xs: 12, sm: 2, md: 2 }}
            />
          </Grid>

          <Grid container spacing={5}>
            <CustomTextInput label="lastModifiedBy" value={updatedByName} gridSize={{ xs: 12, sm: 2, md: 4 }} />
            <CustomTextInput
              label="lastModifiedDate"
              value={formatDateValue(updatedAt)}
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
      {ViewEditHeader}
      {ViewEditForm}
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/attributes/${attributeId}`}
        redirectPath={`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/attributes`}
        deleteText={translate("attribute_deletion_confirmation")}
        close={() => toggleModal(false)}
        open={open}
      />
      <SimpleModal
        openModal={updateToggle}
        dialogContent={<CommonDialogContent message={translate("attribute_update_confirmation")} />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={() => setUpdateToggle(false)}
        handleAction={() => updateAttributeHandler(`${attributeId}`)}
      />
    </>
  );
};

CategoryAttributesViewEditUI.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  editAttributeHandler: PropTypes.func.isRequired,
  deleteAttributeHandler: PropTypes.func.isRequired,
  updateAttributeHandler: PropTypes.func.isRequired,
  saveAttributeData: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  categoryId: PropTypes.string.isRequired,
  attributeId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  updateToggle: PropTypes.bool.isRequired,
  setUpdateToggle: PropTypes.func.isRequired,
  initialFormData: PropTypes.shape({
    attributeName: PropTypes.string,
    attributeValue: PropTypes.string,
    createdByName: PropTypes.string,
    createdAt: PropTypes.string,
    updatedByName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

export default CategoryAttributesViewEditUI;
