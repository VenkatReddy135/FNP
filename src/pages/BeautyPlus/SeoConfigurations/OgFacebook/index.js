/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useSelector } from "react-redux";
import {
  SimpleForm,
  useTranslate,
  useMutation,
  Toolbar,
  Button,
  SaveButton,
  required,
  maxLength,
  useNotify,
  useRefresh,
} from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import CustomTextInput from "../../../../components/TextInput";
import CustomNumberInput from "../../../../components/NumberInput";
import DomainDropdown from "../../../../components/DomainDropdown";

import SimpleModel from "../../../../components/CreateModal";
import LoaderComponent from "../../../../components/LoaderComponent";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * OgFacebook
 *
 * @returns {React.Component} //return component
 */
const OgFacebook = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { cancelButton, submitButton, editIcon, editView, fullWidth, fromView, domainViewSmall } = classes;
  const translate = useTranslate();

  const [edit, setEdit] = useState(false);
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const [data, setData] = useState(null);
  const [show, toggleModal] = useState(false);

  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const showView = !!domain;
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) {
      setData(res.data.params);
    }
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/SEOEmail/${domainName}/`;
  const enabled = domainName !== "";
  const payload = { id: domainName };

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    enabled,
    payload,
  });

  useEffect(() => {
    setEdit(false);
    setData({});
  }, [domain]);

  /**
   * on save data toggle will show
   *
   */
  const updateOgFacebook = () => {
    toggleModal(true);
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("metaInformationUpdateSuccess"), "info", TIMEOUT);
    setEdit(false);
    refresh();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const robotConfiguration = data?.robotConfiguration;
    const enableAMPTagOnPages = data?.enableAMPTagOnPages;
    const catMetaInfoSetting = data?.catMetaInfoSetting;
    const xmlSiteMap = data?.xmlSiteMap;
    const url = data?.url;
    const hrefLang = data?.hrefLang;
    const xmlData = xmlSiteMap?.domesticCategory;

    mutate(
      {
        type: "put",
        resource,
        payload: {
          id: domain.toLowerCase(),
          data: {
            id: domain.toLowerCase(),
            customInstructionForRobot: robotConfiguration?.customInstructionForRobot,
            defaultRobots: robotConfiguration?.defaultRobots,
            enableAMPTag: enableAMPTagOnPages?.enableAMPTag,
            enableSubmissionToMetaRobots: xmlData?.siteMapFields.enableSubmissionToMetaRobots,
            entitiesEnabledFor: hrefLang?.entitiesEnabledFor,
            hrefLangScope: hrefLang?.hrefLangScope,
            includeCMSInSiteMap: xmlData?.siteMapFields.includeCMSInSiteMap,
            includeLastModified: xmlData?.siteMapFields.includeLastModified,
            locale: hrefLang?.locale,
            maxLengthH1Tag: catMetaInfoSetting?.maxLengthH1Tag,
            maxLengthMetaDescription: catMetaInfoSetting?.maxLengthMetaDescription,
            maxLengthMetaKeywords: catMetaInfoSetting?.maxLengthMetaKeywords,
            maxLengthMetaTitle: catMetaInfoSetting?.maxLengthMetaTitle,
            maximumFileSize: xmlData?.siteMapFields.maximumFileSize,
            maximumNoOFUrlsPerFile: xmlData?.siteMapFields.maximumNoOFUrlsPerFile,
            siteMapGenerationFrequency: xmlData?.siteMapFields.siteMapGenerationFrequency,
            siteMapPriority: xmlData?.siteMapFields.siteMapPriority,
            siteMapStartTime: xmlData?.siteMapFields.siteMapStartTime,
            url,
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
    toggleModal(false);
  };

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = () => {
    setEdit(false);
  };

  /**
   * @param {object} props props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <Button
        type="button"
        label={translate("cancel")}
        variant="outlined"
        onClick={handleCancelButton}
        className={cancelButton}
      />
      <SaveButton label={translate("update")} icon={<></>} className={submitButton} />
    </Toolbar>
  );

  const ogAndFb = data?.ogAndFb;

  return (
    <Grid>
      <Grid item>
        <Typography
          variant="h5"
          color="inherit"
          className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
        >
          {translate("ogFacebook")}
        </Typography>
        <Divider />
      </Grid>
      <Grid container className={domainViewSmall}>
        <Grid item xs={12} sm={3} md={3}>
          <DomainDropdown />
        </Grid>
      </Grid>
      {loading && domain ? (
        <LoaderComponent />
      ) : (
        showView && (
          <SimpleForm
            className={fromView}
            variant="standard"
            save={updateOgFacebook}
            toolbar={edit ? <CustomToolbar /> : null}
          >
            {!edit && (
              <Grid className={editView}>
                <EditIcon className={editIcon} onClick={() => setEdit(!edit)} />
              </Grid>
            )}

            <Grid container spacing={5} className={fullWidth}>
              <CustomTextInput label="ogSiteName" value={ogAndFb?.ogSiteName} edit={edit} validate={required()} />
              <CustomNumberInput
                label="fbAppId"
                value={ogAndFb?.fbAppId}
                validate={[maxLength(5), required()]}
                edit={edit}
                typeText=""
              />
            </Grid>
          </SimpleForm>
        )
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfOgFacebook")} />}
        showButtons
        showTitle=""
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={show}
        handleClose={() => toggleModal(false)}
        handleAction={continueHandler}
      />
    </Grid>
  );
};

export default OgFacebook;
