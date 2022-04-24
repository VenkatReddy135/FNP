/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import EditIcon from "@material-ui/icons/Edit";
import {
  SimpleForm,
  useTranslate,
  useMutation,
  Toolbar,
  Button,
  SaveButton,
  required,
  useNotify,
  useRefresh,
} from "react-admin";
import { useSelector } from "react-redux";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import Dropdown from "../../../../components/Dropdown";
import SimpleModel from "../../../../components/CreateModal";
import DomainDropdown from "../../../../components/DomainDropdown";
import LoaderComponent from "../../../../components/LoaderComponent";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import CustomViewUI from "../../../../components/CustomViewUI/CustomViewUI";

/**
 * HrefLang
 *
 * @returns {React.Component} //return component
 */
const HrefLang = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { cancelButton, submitButton, editIcon, editView, fullWidth, fromView, domainViewSmall } = classes;
  const translate = useTranslate();

  const [edit, setEdit] = useState(false);
  const [mutate] = useMutation();
  const [editData, setUpdateData] = useState();
  const notify = useNotify();
  const refresh = useRefresh();
  const [data, setData] = useState(null);
  const [show, toggleModal] = useState(false);
  const [breadcrumbsList] = useState([
    {
      displayName: translate("hrefLang"),
    },
  ]);
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
   * handles on change event for update HrefLang
   *
   * @param {object} updateData update props
   */
  const updateHrefLang = useCallback((updateData) => {
    toggleModal(true);
    setUpdateData(updateData);
  }, []);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("hrefLangUpdateSuccess"), "info", TIMEOUT);
    setEdit(false);
    refresh();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = useCallback(async () => {
    const robotConfiguration = data?.robotConfiguration;
    const enableAMPTagOnPages = data?.enableAMPTagOnPages;
    // const ogAndFb = data?.ogAndFb;
    const catMetaInfoSetting = data?.catMetaInfoSetting;
    // const schemas = data?.schemas;
    const xmlSiteMap = data?.xmlSiteMap;
    const url = data?.url;
    const xmlData = xmlSiteMap?.domesticCategory;
    toggleModal(false);

    mutate(
      {
        type: "put",
        resource: `${resource}href`,
        payload: {
          id: domain.toLowerCase(),
          data: {
            id: domain.toLowerCase(),
            customInstructionForRobot: robotConfiguration?.customInstructionForRobot,
            defaultRobots: robotConfiguration?.defaultRobots,
            enableAMPTag: enableAMPTagOnPages?.enableAMPTag,
            enableSubmissionToMetaRobots: xmlData?.siteMapFields.enableSubmissionToMetaRobots,
            entitiesEnabledFor: editData?.entitiesEnabledFor,
            // fbAppId: ogAndFb?.fbAppId,
            hrefLangScope: editData?.hrefLangScope,
            includeCMSInSiteMap: xmlData?.siteMapFields.includeCMSInSiteMap,
            includeLastModified: xmlData?.siteMapFields.includeLastModified,
            // localSchema: schemas?.localSchema,
            locale: editData?.locale,
            maxLengthH1Tag: catMetaInfoSetting?.maxLengthH1Tag,
            maxLengthMetaDescription: catMetaInfoSetting?.maxLengthMetaDescription,
            maxLengthMetaKeywords: catMetaInfoSetting?.maxLengthMetaKeywords,
            maxLengthMetaTitle: catMetaInfoSetting?.maxLengthMetaTitle,
            maximumFileSize: xmlData?.siteMapFields.maximumFileSize,
            maximumNoOFUrlsPerFile: xmlData?.siteMapFields.maximumNoOFUrlsPerFile,
            // ogSiteName: ogAndFb?.ogSiteName,
            // ogImage: ogAndFb?.ogImage,
            // ogType: ogAndFb?.ogType,
            // twitterImage: ogAndFb?.twitterImage,
            // organizationSchema: schemas?.organizationSchema,
            // postalSchema: schemas?.postalSchema,
            siteMapGenerationFrequency: xmlData?.siteMapFields.siteMapGenerationFrequency,
            siteMapPriority: xmlData?.siteMapFields.siteMapPriority,
            siteMapStartTime: xmlData?.siteMapFields.siteMapStartTime,
            xmlSitemapHeader: "InternationalCategory",
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
  }, [domain, editData]);

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = useCallback(() => {
    setEdit(false);
  }, []);

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

  /**
   *
   * @returns {React.Component} return component
   */
  const DomainSelection = useMemo(
    () => (
      <>
        <Typography
          variant="h5"
          color="inherit"
          className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
        >
          {translate("hrefLang")}
        </Typography>
        <Divider />
        <Grid container className={domainViewSmall}>
          <Grid item xs={12} sm={3} md={3}>
            <DomainDropdown />
          </Grid>
        </Grid>
      </>
    ),
    [],
  );

  const hrefLang = data?.hrefLang;
  return (
    <Grid>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      {DomainSelection}
      {loading && domain ? (
        <LoaderComponent />
      ) : (
        showView && (
          <SimpleForm
            className={fromView}
            variant="standard"
            save={updateHrefLang}
            toolbar={edit ? <CustomToolbar /> : null}
          >
            {!edit && (
              <Grid className={editView}>
                <EditIcon className={editIcon} onClick={() => setEdit(!edit)} />
              </Grid>
            )}
            <Grid container spacing={5} className={fullWidth}>
              {edit ? (
                <Dropdown
                  label="hrefLangScope"
                  value={hrefLang?.hrefLangScope}
                  data={[
                    { id: translate("global"), name: translate("global") },
                    { id: translate("website"), name: translate("website") },
                  ]}
                  validate={required()}
                  edit={edit}
                />
              ) : (
                <CustomViewUI label={translate("hrefLangScope")} value={hrefLang?.hrefLangScope} />
              )}
              {edit ? (
                <Dropdown
                  label="entitiesEnabledFor"
                  validate={required()}
                  value={hrefLang?.entitiesEnabledFor}
                  data={[
                    { id: translate("category"), name: translate("category") },
                    { id: translate("product"), name: translate("product") },
                    { id: translate("home"), name: translate("home") },
                    { id: translate("cmsStaticPages"), name: translate("cmsStaticPages") },
                  ]}
                  edit={edit}
                />
              ) : (
                <CustomViewUI label={translate("entitiesEnabledFor")} value={hrefLang?.entitiesEnabledFor} />
              )}
              {edit ? (
                <Dropdown
                  validate={required()}
                  label="locale"
                  value={hrefLang?.locale}
                  data={[
                    { id: "en-sg", name: "en-sg" },
                    { id: "en-ae", name: "en-ae" },
                    { id: "en-in", name: "en-in" },
                  ]}
                  edit={edit}
                />
              ) : (
                <CustomViewUI label={translate("locale")} value={hrefLang?.locale} />
              )}
            </Grid>
          </SimpleForm>
        )
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfHreflang")} />}
        showButtons
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

export default HrefLang;
