/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  SimpleForm,
  useNotify,
  required,
  TextInput,
  NumberInput,
  useMutation,
  useRedirect,
} from "react-admin";
import { Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import { useStyles } from "../../../../../BeautyPlus/Website_Config_Style";
import SimpleModel from "../../../../../../components/CreateModal";
import CommonDialogContent from "../../../../../../components/CommonDialogContent";
import CustomToolbar from "../../../../../../components/CustomToolbar";
import CommonDelete from "../../../../../../components/CommonDelete";
import formatDateValue from "../../../../../../utils/formatDateTime";
import { minValue, handleInvalidNumberLength } from "../../../../../../utils/validationFunction";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../../utils/CustomHooks";
import { TIMEOUT } from "../../../../../../config/GlobalConfig";

/**
 * Component to View Tag Details
 *
 * @param {object} props props of url redirect
 * @returns {React.ReactElement} returns component
 */
const ViewTagDetails = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();
  const redirect = useRedirect();
  const { id, isEditable, enableValTH, enableVal } = props;

  const [state, setState] = useState({
    data: {},
    isdeleteModal: false,
    isUpdateModal: false,
    tagTypes: {},
    isEdit: isEditable,
    formData: {},
    currentItemUrl: `${window.REACT_APP_GALLERIA_SERVICE}/tags/tag?tagId=${id}`,
    listingUrl: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
  });
  const { data, isdeleteModal, tagTypes, isEdit, isUpdateModal, formData, currentItemUrl, listingUrl } = state;

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (!res?.data?.message) {
      setState((prevState) => ({ ...prevState, data: { ...res.data } }));
      enableVal(res.data.isEnabled);
    }
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetTagTypesSuccess = (response) => {
    if (response?.data?.data) {
      const tagTypeVal = {};
      response.data.data.forEach((val) => {
        tagTypeVal[val.tagTypeId] = val.tagTypeName;
      });
      setState((prevState) => ({ ...prevState, tagTypes: { ...tagTypeVal } }));
    }
  };

  useCustomQueryWithStore("getData", currentItemUrl, handleSetDataSuccess);
  useCustomQueryWithStore("getData", `${window.REACT_APP_GALLERIA_SERVICE}/tag-types`, handleSetTagTypesSuccess);

  /**
   * Function editCancelHandler
   *
   */
  const editCancelHandler = () => {
    setState((prevState) => ({ ...prevState, isEdit: false }));
    redirect(`${listingUrl}/${id}/show`);
  };

  /**
   * Function to show notification on success
   *
   *  @param {object} saveData is simpleform data
   */
  const saveFormData = (saveData) => {
    setState((prevState) => ({ ...prevState, isUpdateModal: true, formData: { ...saveData } }));
  };

  /**
   * @function handleClose close modal
   */
  const handleClose = () => {
    setState((prevState) => ({ ...prevState, isUpdateModal: false, isdeleteModal: false }));
  };

  /**
   * @function updateSuccess update success
   *
   * @param {object} response is passed to the function
   */
  const updateSuccess = (response) => {
    if (response?.data?.message) {
      notify(response?.data?.message, "info", TIMEOUT);
    }
    redirect(listingUrl);
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const { tagName, sequence, comment } = formData;
    handleClose();
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/tags?tagId=${id}`,
        payload: {
          data: {
            tagName,
            sequence: sequence || "",
            comment,
            isEnabled: enableValTH,
            tagId: id,
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: updateSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function enableEditMode set edit mode
   */
  const enableEditMode = () => {
    setState((prevState) => ({ ...prevState, isEdit: true }));
    redirect(`${listingUrl}/${id}/update`);
  };

  /**
   * @function enableDeleteMode set edit mode
   */
  const enableDeleteMode = () => {
    setState((prevState) => ({ ...prevState, isdeleteModal: true }));
  };

  return (
    <>
      <SimpleForm
        save={saveFormData}
        toolbar={
          isEdit ? <CustomToolbar onClickCancel={editCancelHandler} saveButtonLabel={translate("update")} /> : null
        }
      >
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.headerClass}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">{translate("tag_details")}</Typography>
          </Grid>
          {!isEdit && (
            <Grid item xs={6}>
              <Grid container justify="flex-end" className={classes.fullWidth}>
                <EditIcon className={classes.iconStyle} onClick={enableEditMode} />
                <DeleteIcon className={classes.iconStyle} onClick={enableDeleteMode} />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid
          className={classes.customMargin}
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          md={9}
          spacing={3}
        >
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("tag_name")}</Typography>
            <Typography variant="h6">{data.tagName}</Typography>
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("tag_id")}</Typography>
            <Typography variant="h6">{data.tagId}</Typography>
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("tag_type")}</Typography>
            <Typography variant="h6">{tagTypes[data.tagTypeId]}</Typography>
          </Grid>
        </Grid>
        <Grid
          className={classes.customMargin}
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          md={6}
          spacing={3}
        >
          {!isEdit ? (
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              <Typography variant="caption">{translate("tag_sequence")}</Typography>
              <Typography variant="h6">{data.sequence}</Typography>
            </Grid>
          ) : (
            <Grid item xs>
              <NumberInput
                type="tel"
                label={translate("tag_sequence")}
                source="sequence"
                defaultValue={data.sequence}
                validate={[minValue(0, "tag_sequence_negative_error")]}
                margin="none"
                min={1}
                autoComplete="off"
                onKeyDown={(e) => handleInvalidNumberLength(e, 9999)}
              />
            </Grid>
          )}
        </Grid>
        <Grid
          className={classes.customMargin}
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          md={6}
          spacing={3}
        >
          {!isEdit ? (
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <Typography variant="caption">{translate("comment")}</Typography>
              <Typography variant="h6">{data.comment}</Typography>
            </Grid>
          ) : (
            <Grid item xs>
              <TextInput
                label={translate("comment")}
                source="comment"
                defaultValue={data.comment}
                validate={[required()]}
                margin="none"
                fullWidth
                multiline
              />
            </Grid>
          )}
        </Grid>
        <Grid
          className={classes.customMargin}
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          md={9}
          spacing={3}
        >
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("created_by")}</Typography>
            <Typography variant="h6">{data.createdByName}</Typography>
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("created_date")}</Typography>
            <Typography variant="h6">{data.createdAt ? formatDateValue(data.createdAt) : ""}</Typography>
          </Grid>
        </Grid>
        <Grid
          className={classes.customMargin}
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          md={9}
          spacing={3}
        >
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("last_modified_by")}</Typography>
            <Typography variant="h6">{data.updatedByName}</Typography>
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("last_modified_date")}</Typography>
            <Typography variant="h6">{data.moderatedAt ? formatDateValue(data.updatedAt) : ""}</Typography>
          </Grid>
        </Grid>
      </SimpleForm>
      <CommonDelete
        resource={`${window.REACT_APP_GALLERIA_SERVICE}/tags?tagId=${id}`}
        redirectPath={listingUrl}
        params={{}}
        close={handleClose}
        open={isdeleteModal}
        deleteText={`${translate("delete_confirmation_message")} ${translate("tag")}?`}
      />
      <SimpleModel
        dialogContent={<CommonDialogContent message={`${translate("update_message")} ${translate("tag")}?`} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={isUpdateModal}
        handleClose={handleClose}
        handleAction={continueHandler}
      />
    </>
  );
};

export default React.memo(ViewTagDetails);

ViewTagDetails.propTypes = {
  id: PropTypes.string.isRequired,
  enableVal: PropTypes.func,
  isEditable: PropTypes.bool,
  enableValTH: PropTypes.bool,
};

ViewTagDetails.defaultProps = {
  enableVal: () => {},
  isEditable: false,
  enableValTH: false,
};
