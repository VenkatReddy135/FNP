/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useMemo } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useSelector } from "react-redux";
import {
  RadioButtonGroupInput,
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
import { Typography, Grid, Divider } from "@material-ui/core";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import Dropdown from "../../../../components/Dropdown";
import CustomNumberInput from "../../../../components/NumberInput";
import DomainDropdown from "../../../../components/DomainDropdown";
import SimpleModel from "../../../../components/CreateModal";
import LoaderComponent from "../../../../components/LoaderComponent";
import CustomCheckboxArray from "../../../../components/CustomCheckboxArray";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import CustomViewUI from "../../../../components/CustomViewUI/CustomViewUI";
import TimeInput from "../../../../components/CustomTimePicker/TimeInput";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * SiteMap
 *
 * @returns {React.Component} //return component
 */
const SiteMap = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { cancelButton, submitButton, editIcon, editView, fullWidth, fromView, domainViewSmall, labelText } = classes;
  const translate = useTranslate();
  const [state, setState] = useState({
    edit: false,
    applicableTo: "domesticCategory",
    show: false,
    editData: {},
    data: null,
    xmlData: {},
    xmlIcism: [],
  });
  const [breadcrumbsList] = useState([
    {
      displayName: translate("xmlSitemap"),
    },
  ]);
  const { edit, applicableTo, show, editData, data, xmlData, xmlIcism } = state;
  const notify = useNotify();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const { domain } = useSelector((dropdownstate) => dropdownstate.TagDropdownData.domainData);
  const showView = !!domain;
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) {
      setState({ ...state, data: res.data.params, edit: false });
    }
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/SEOEmail/${domainName}/`;
  const enabled = domainName !== "";
  const payload = { id: domainName };

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    enabled,
    payload,
  });

  /**
   * handles on change event for update HrefLang
   *
   * @param {object} updateData update data
   */
  const updateXMLSitemap = (updateData) => {
    setState({ ...state, show: true, editData: { ...updateData } });
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("xmlSitemapUpdateSuccess"), "info", TIMEOUT);
    setState({ ...state, edit: false, show: false });
    refresh();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    const robotConfiguration = data?.robotConfiguration;
    const enableAMPTagOnPages = data?.enableAMPTagOnPages;
    // const ogAndFb = data?.ogAndFb;
    const catMetaInfoSetting = data?.catMetaInfoSetting;
    // const schemas = data?.schemas;
    const hrefLang = data?.hrefLang;
    const url = data?.url;

    mutate(
      {
        type: "put",
        resource,
        payload: {
          data: {
            id: domain.toLowerCase(),
            xmlSitemapHeader: applicableTo,
            customInstructionForRobot: robotConfiguration?.customInstructionForRobot,
            defaultRobots: robotConfiguration?.defaultRobots,
            enableAMPTag: enableAMPTagOnPages?.enableAMPTag,
            enableSubmissionToMetaRobots: editData?.enableSubmissionToMetaRobots,
            entitiesEnabledFor: hrefLang?.entitiesEnabledFor,
            // fbAppId: ogAndFb?.fbAppId,
            hrefLangScope: hrefLang?.hrefLangScope,
            includeCMSInSiteMap: xmlIcism,
            includeLastModified: editData?.includeLastModified,
            // localSchema: schemas?.localSchema,
            locale: hrefLang?.locale,
            maxLengthH1Tag: catMetaInfoSetting?.maxLengthH1Tag,
            maxLengthMetaDescription: catMetaInfoSetting?.maxLengthMetaDescription,
            maxLengthMetaKeywords: catMetaInfoSetting?.maxLengthMetaKeywords,
            maxLengthMetaTitle: catMetaInfoSetting?.maxLengthMetaTitle,
            maximumFileSize: editData?.maximumFileSize,
            maximumNoOFUrlsPerFile: editData?.maximumNoOFUrlsPerFile,
            // ogSiteName: ogAndFb?.ogSiteName,
            // ogImage: ogAndFb?.ogImage,
            // ogType: ogAndFb?.ogType,
            // twitterImage: ogAndFb?.twitterImage,
            // organizationSchema: schemas?.organizationSchema,
            // postalSchema: schemas?.postalSchema,
            siteMapGenerationFrequency: editData?.siteMapGenerationFrequency,
            siteMapPriority: editData?.siteMapPriority,
            siteMapStartTime: editData?.siteMapStartTime,
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
    setState({ ...state, show: false });
  };

  /**
   * handel change applicable To value
   *
   * @param {*} event change event
   */
  const onchangeApplicableTo = (event) => {
    setState({ ...state, applicableTo: event.target.value });
    refresh();
  };

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = () => {
    setState({ ...state, edit: false });
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

  /**
   * function to set includeCMSInSiteMap
   *
   * @param {Array} value event object
   */
  const setCheckbox = (value) => {
    setState({ ...state, xmlIcism: [...value] });
  };

  useEffect(() => {
    const xmlSiteMap = data?.xmlSiteMap;
    const xmlDataTemp = xmlSiteMap?.[applicableTo]?.siteMapFields;
    setState({
      ...state,
      xmlData: xmlDataTemp,
      xmlIcism: xmlDataTemp?.includeCMSInSiteMap || [],
      startTime: xmlDataTemp?.siteMapStartTime || "00:00:01",
    });
  }, [applicableTo, data]);

  /**
   *
   * @returns {React.Component} return component
   */
  const DomainSelection = useMemo(
    () => (
      <>
        <Grid item>
          <Typography
            variant="h5"
            color="inherit"
            className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
          >
            {translate("xmlSitemap")}
          </Typography>
          <Divider />
        </Grid>
        <Grid container className={domainViewSmall}>
          <Grid item xs={12} sm={3} md={3}>
            <DomainDropdown />
          </Grid>
        </Grid>
      </>
    ),
    [],
  );

  const initialFormValues = {
    ...state?.data?.xmlSiteMap?.domesticCategory?.siteMapFields,
  };

  const FormBody = useMemo(
    () => (
      <SimpleForm
        className={fromView}
        variant="standard"
        save={updateXMLSitemap}
        initialValues={initialFormValues}
        toolbar={edit ? <CustomToolbar /> : null}
      >
        {!edit && (
          <Grid className={editView}>
            <EditIcon className={editIcon} onClick={() => setState({ ...state, edit: true })} />
          </Grid>
        )}
        <Grid container className={fullWidth} spacing={5}>
          {edit ? (
            <Dropdown
              label="applicableTo"
              value={edit ? applicableTo : translate(applicableTo)}
              data={[
                { id: "domesticCategory", name: translate("domesticCategory") },
                { id: "internationalCategory", name: translate("internationalCategory") },
                { id: "domesticProduct", name: translate("domesticProduct") },
                { id: "internationalProduct", name: translate("internationalProduct") },
              ]}
              onSelect={onchangeApplicableTo}
              edit={edit}
            />
          ) : (
            <CustomViewUI label={translate("applicableTo")} value={translate(applicableTo)} />
          )}
        </Grid>

        <Grid container className={fullWidth} spacing={5}>
          {edit ? (
            <Dropdown
              validate={required()}
              label="siteMapGenerationFrequency"
              value={xmlData?.siteMapGenerationFrequency}
              data={[
                { id: translate("hourly"), name: translate("hourly") },
                { id: translate("daily"), name: translate("daily") },
                { id: translate("weekly"), name: translate("weekly") },
                { id: translate("monthly"), name: translate("monthly") },
                { id: translate("yearly"), name: translate("yearly") },
                { id: translate("never"), name: translate("never") },
              ]}
              edit={edit}
            />
          ) : (
            <CustomViewUI label={translate("siteMapGenerationFrequency")} value={xmlData?.siteMapGenerationFrequency} />
          )}
          {edit ? (
            <CustomNumberInput
              validate={required()}
              label="siteMapPriority"
              value={xmlData?.siteMapPriority}
              edit={edit}
              typeText=""
              min={0}
            />
          ) : (
            <CustomViewUI label={translate("siteMapPriority")} value={xmlData?.siteMapPriority} />
          )}

          {edit ? (
            <Grid item md={3}>
              <RadioButtonGroupInput
                validate={required()}
                defaultValue={xmlData?.includeLastModified ? xmlData?.includeLastModified?.toLowerCase() : null}
                label={translate("includeLastModified")}
                source="includeLastModified"
                choices={[
                  { id: "yes", name: translate("yes") },
                  { id: "no", name: translate("no") },
                ]}
              />
            </Grid>
          ) : (
            <CustomViewUI label={translate("includeLastModified")} value={xmlData?.includeLastModified} />
          )}
        </Grid>
        <Grid container className={fullWidth} spacing={5}>
          {edit ? (
            <Grid item md={4}>
              <TimeInput source="siteMapStartTime" className={fullWidth} label={translate("siteMapStartTime")} />
            </Grid>
          ) : (
            <CustomViewUI label={translate("siteMapStartTime")} value={xmlData?.siteMapStartTime} />
          )}
          {edit ? (
            <CustomNumberInput
              validate={required()}
              label="maximumNoOFUrlsPerFile"
              value={xmlData?.maximumNoOFUrlsPerFile}
              edit={edit}
              typeText=""
              min={0}
            />
          ) : (
            <CustomViewUI label={translate("maximumNoOFUrlsPerFile")} value={xmlData?.maximumNoOFUrlsPerFile} />
          )}
          {edit ? (
            <CustomNumberInput
              validate={required()}
              label="maximumFileSize"
              value={xmlData?.maximumFileSize}
              edit={edit}
              typeText=""
              min={0}
            />
          ) : (
            <CustomViewUI label={translate("maximumFileSize")} value={xmlData?.maximumFileSize} />
          )}
        </Grid>

        <Grid container>
          {edit ? (
            <Grid item md={4}>
              <RadioButtonGroupInput
                validate={required()}
                label={translate("enableSubmissionToMetaRobots")}
                source="enableSubmissionToMetaRobots"
                defaultValue={xmlData?.enableSubmissionToMetaRobots.toLowerCase()}
                choices={[
                  { id: "yes", name: translate("yes") },
                  { id: "no", name: translate("no") },
                ]}
              />
            </Grid>
          ) : (
            <CustomViewUI
              label={translate("enableSubmissionToMetaRobots")}
              value={xmlData?.enableSubmissionToMetaRobots}
            />
          )}
          <Grid item md={8}>
            {edit ? (
              <CustomCheckboxArray
                checkboxList={[
                  { value: translate("blogs"), label: translate("blogs") },
                  { value: translate("articles"), label: translate("articles") },
                  { value: translate("staticInformationPages"), label: translate("staticInformationPages") },
                ]}
                onChange={setCheckbox}
                checkAllButton
                label={translate("includeCMSInSiteMap")}
                defaultValue={xmlData?.includeCMSInSiteMap || []}
                edit={edit}
                className={labelText}
              />
            ) : (
              <CustomViewUI
                gridSize={{ md: 8 }}
                label={translate("includeCMSInSiteMap")}
                value={(xmlData?.includeCMSInSiteMap || []).join(",")}
              />
            )}
          </Grid>
        </Grid>
      </SimpleForm>
    ),
    [state],
  );
  return (
    <Grid>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      {DomainSelection}
      {loading && data ? <LoaderComponent /> : showView && FormBody}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfXmlSitemap")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={show}
        handleClose={() => setState({ ...state, show: false })}
        handleAction={continueHandler}
      />
    </Grid>
  );
};

export default SiteMap;
