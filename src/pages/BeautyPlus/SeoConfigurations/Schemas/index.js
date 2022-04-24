/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from "react";
import { useTranslate, useMutation, useNotify, useRefresh } from "react-admin";
import { useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import CommonButtonRow from "../../../../components/CommonButtonRow";
import EditorView from "../../../../components/EditorView";
import DomainDropdown from "../../../../components/DomainDropdown";
import SimpleModel from "../../../../components/CreateModal";
import LoaderComponent from "../../../../components/LoaderComponent";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * Schemas
 *
 * @returns {React.Component} //return component
 */
const Schemas = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { editIcon, editView, domainViewSmall } = classes;
  const translate = useTranslate();
  const [tabLocalSchema, setTabLocalSchema] = useState(0);
  const [tabPostalAddressSchema, setTabPostalAddressSchema] = useState(0);
  const [tabOrganizationSchema, setTabOrganizationSchema] = useState(0);
  const notify = useNotify();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const [edit, setEdit] = useState(false);
  const [show, toggleModal] = useState(false);
  const [seoConfigDetails, setSeoConfigDetails] = useState();
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const showView = !!domain;
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) {
      const schemas = res.data?.params?.schemas;
      setSeoConfigDetails(schemas);
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
    setSeoConfigDetails({});
  }, [domain]);

  /**
   *handles on change event for update HrefLang
   *
   */
  const updateSchema = () => {
    const { localSchema, postalSchema, organizationSchema } = seoConfigDetails;
    if (localSchema && postalSchema && organizationSchema) {
      toggleModal(true);
    }
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("schemasUpdateSuccess"), "info", TIMEOUT);
    setEdit(false);
    refresh();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const robotConfiguration = seoConfigDetails?.robotConfiguration;
    const enableAMPTagOnPages = seoConfigDetails?.enableAMPTagOnPages;
    const catMetaInfoSetting = seoConfigDetails?.catMetaInfoSetting;
    const xmlSiteMap = seoConfigDetails?.xmlSiteMap;
    const url = seoConfigDetails?.url;
    const hrefLang = seoConfigDetails?.hrefLang;
    const xmlData = xmlSiteMap?.domesticCategory;
    // const ogAndFb = seoConfigDetails?.ogAndFb;
    // const { localSchema, postalSchema, organizationSchema } = seoConfigDetails;
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
            // fbAppId: ogAndFb?.fbAppId,
            hrefLangScope: hrefLang?.hrefLangScope,
            includeCMSInSiteMap: xmlData?.siteMapFields.includeCMSInSiteMap,
            includeLastModified: xmlData?.siteMapFields.includeLastModified,
            // localSchema,
            locale: hrefLang?.locale,
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
            // organizationSchema,
            // postalSchema,
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
   * handle change event of localSchema
   *
   * @param {string} schemaName name of the filed
   * @param {string} schemaVale change value
   */
  const onChangeSchema = (schemaName, schemaVale) => {
    setSeoConfigDetails({
      ...seoConfigDetails,
      [schemaName]: schemaVale,
    });
  };

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = () => {
    setEdit(false);
  };

  const schemas = seoConfigDetails;
  return (
    <Grid>
      <Grid item>
        <Typography
          variant="h5"
          color="inherit"
          className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
        >
          {translate("schemas")}
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
          <Grid>
            {!edit && (
              <Grid className={editView}>
                <EditIcon className={editIcon} onClick={() => setEdit(!edit)} />
              </Grid>
            )}
            <EditorView
              disabled={!edit}
              title={translate("localSchema")}
              data={schemas?.localSchema || ""}
              selectedTab={tabLocalSchema}
              onChangeTab={(event, selectedTab) => {
                setTabLocalSchema(selectedTab);
              }}
              onValueChange={(value) => onChangeSchema("localSchema", value)}
            />

            <Grid container spacing={10}>
              <Grid item xs={12} sm={12} md={6}>
                <EditorView
                  disabled={!edit}
                  title={translate("postalAddressSchema")}
                  data={schemas?.postalSchema || ""}
                  selectedTab={tabPostalAddressSchema}
                  onChangeTab={(event, selectedTab) => {
                    setTabPostalAddressSchema(selectedTab);
                  }}
                  onValueChange={(value) => onChangeSchema("postalSchema", value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <EditorView
                  disabled={!edit}
                  title={translate("organizationSchema")}
                  data={schemas?.organizationSchema || ""}
                  selectedTab={tabOrganizationSchema}
                  onChangeTab={(event, selectedTab) => {
                    setTabOrganizationSchema(selectedTab);
                  }}
                  onValueChange={(value) => onChangeSchema("organizationSchema", value)}
                />
              </Grid>
            </Grid>
            {edit && (
              <CommonButtonRow
                onClickCancel={handleCancelButton}
                onClickUpdate={updateSchema}
                updateBtnDisable={!schemas?.localSchema || !schemas?.postalSchema || !schemas?.organizationSchema}
              />
            )}
          </Grid>
        )
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfSchemas")} />}
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

export default Schemas;
