/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Typography, Grid, Divider, Box } from "@material-ui/core";
import {
  useTranslate,
  SimpleForm,
  useRedirect,
  NumberInput,
  TextInput,
  required,
  useMutation,
  useNotify,
} from "react-admin";

import Dropdown from "../../../../../components/Dropdown";
import SimpleModel from "../../../../../components/CreateModal";
import CustomTextInput from "../../../../../components/TextInput";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import CustomToolbar from "../../../../../components/CustomToolbar";
import useCommonStyles from "../../../../../assets/theme/common";
import { CustomSwitch } from "../../../../BeautyPlus/Website_Config_Style";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../utils/CustomHooks";
import { minValue } from "../../../../../utils/validationFunction";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Advanced search tool
 *
 * @returns {React.Component} //return component
 */
const AdvanceSearchUrlRedirect = () => {
  const classes = useCommonStyles();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const notify = useNotify();

  const [state, setState] = useState({
    tagTypes: [],
    newTagId: "",
    showModal: false,
    formData: {},
  });

  const { tagTypes, showModal, formData, newTagId } = state;

  const listingUrl = `/${window.REACT_APP_GALLERIA_SERVICE}/tags`;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: translate("create_new_tag") },
  ];

  /**
   * Function cancelhandler to redirect back to listing page
   *
   */
  const cancelHandler = () => {
    redirect(listingUrl);
  };

  /**
   * Function to store search data
   *
   * @param {object} createData update form data
   */
  const saveFormData = (createData) => {
    setState((prevState) => ({ ...prevState, showModal: true, formData: { ...createData } }));
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} response is passed to the function
   */
  const handleSetDataSuccess = (response) => {
    if (response?.data?.data) {
      const tagTypeVal = response.data.data.map((val) => {
        return { id: val.tagTypeId, name: val.tagTypeName };
      });
      setState((prevState) => ({ ...prevState, tagTypes: [...tagTypeVal] }));
    }
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GALLERIA_SERVICE}/tag-types`, handleSetDataSuccess);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("create_new_tag_success"), "info", TIMEOUT);
    redirect(listingUrl);
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const { tagName, tagSequence, comments } = formData;
    setState((prevState) => ({ ...prevState, showModal: false }));
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/tags`,
        payload: {
          data: {
            params: null,
            dataObj: {
              tagName,
              tagTypeId: formData.tag_type,
              sequence: tagSequence,
              comment: comments,
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
   * @function handleTagChange This function will setData
   * @param {object} e event
   */
  const handleTagChange = (e) => {
    const input = e.target.value;
    const processedInput = input ? input.replaceAll(" ", "-").toLowerCase() : "";
    setState((prevState) => ({ ...prevState, newTagId: processedInput }));
  };

  /**
   * @function handleClose close modal
   */
  const handleClose = () => {
    setState((prevState) => ({ ...prevState, showModal: false, formData: {} }));
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container justify="space-between">
        <Grid className={classes.pageHeaderWithButton} item>
          <Typography variant="h5" color="inherit" className={classes.gridStyle}>
            {translate("create_new_tag")}
          </Typography>
          <Divider orientation="vertical" className={classes.divider} />
          <CustomSwitch checked={false} name="isEnabled" />
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <Box maxWidth={1000}>
        <SimpleForm
          save={saveFormData}
          toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("create")} />}
        >
          <Grid container spacing={2} className={classes.gridStyleNew} data-testid="text-inputs">
            <Grid item xs={4} className={classes.flexParent}>
              <TextInput
                label={translate("tag_name")}
                source="tagName"
                validate={[required()]}
                onChange={handleTagChange}
              />
            </Grid>
            <Grid item xs={2} alignItems="center" justify="flex-start">
              <Box paddingTop="12px">
                <CustomTextInput
                  title={newTagId}
                  gridSize={{ xs: 12 }}
                  label={translate("tag_id")}
                  value={newTagId}
                  edit={false}
                  className={classes.multiLineTypography}
                />
              </Box>
            </Grid>
            <Grid item xs={6} className={classes.centerAlignContainer}>
              <Dropdown label="tag_type" data={tagTypes} edit validate={[required()]} />
            </Grid>
            <Grid item xs={12}>
              <NumberInput
                type="tel"
                label={translate("sequence")}
                source="tagSequence"
                validate={[minValue(0, "tag_sequence_negative_error")]}
                min={1}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Box maxWidth={500}>
                <TextInput fullWidth label={translate("comments")} source="comments" validate={[required()]} />
              </Box>
            </Grid>
          </Grid>
        </SimpleForm>
      </Box>
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("create_new_tag_warning")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={showModal}
        handleClose={handleClose}
        handleAction={continueHandler}
      />
    </>
  );
};

export default AdvanceSearchUrlRedirect;
