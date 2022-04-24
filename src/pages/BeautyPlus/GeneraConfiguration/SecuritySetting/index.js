/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslate, useMutation, useNotify, useRefresh } from "react-admin";
import { useSelector } from "react-redux";
import { Typography, Grid, Divider } from "@material-ui/core";
import SimpleModel from "../../../../components/CreateModal";
import { useStyles } from "../../Website_Config_Style";
import useGlobalStyle from "../../../../assets/theme/common";
import DomainDropdown from "../../../../components/DomainDropdown";
import LoaderComponent from "../../../../components/LoaderComponent";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import SecuritySettingView from "./SecuritySettingFromView";
import validatorHelper from "./helper";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
/**
 * security setting
 *
 * @returns {React.Component} //return component
 */
const SecuritySetting = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyle();
  const { domainViewSmall } = classes;
  const translate = useTranslate();
  const classesForPasswordList = [
    { label: translate("uppercaseLetters"), value: "uppercaseLetters" },
    { label: translate("lowercaseLetters"), value: "lowercaseLetters" },
    { label: translate("number"), value: "number" },
    { label: translate("specialCharacters"), value: "specialCharacters" },
  ];
  const [edit, setEdit] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const [show, toggleModal] = useState(false);
  const { domain } = useSelector((state) => state.TagDropdownData.domainData);
  const showView = !!domain;
  const [data, setData] = useState(false);
  const [securitySettingUpdateData, setSecuritySettingUpdateData] = useState();
  const [breadcrumbsList] = useState([
    {
      displayName: translate("securitySetting"),
    },
  ]);
  const [mutate] = useMutation();
  const domainName = domain?.toLowerCase() || "";
  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    if (res.data?.params) {
      setData(res.data);
    }
  };

  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/security/${domainName}/`;
  const enabled = domainName !== "";

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    enabled,
  });

  useEffect(() => {
    setEdit(false);
    setData({});
  }, [domain]);

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   */
  const handleUpdateSuccess = () => {
    notify(translate("securitySettingUpdateSuccess"), "info", TIMEOUT);
    setEdit(false);
    refresh();
  };

  /**
   *@function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = useCallback(async () => {
    const {
      adminAccountSharing,
      lockOutTime,
      loginOTPExpirationTimeFrame,
      maximumAllowedPasswordRecoveryAttemptsPerHour,
      maximumLoginAttemptsBeforeLockout,
      maximumPasswordLength,
      minimumPasswordLength,
      passwordLifetime,
      passwordRecoveryLinkExpiration,
      passwordResetProtectionType,
      numberOfCharacterClassesForPassword,
    } = securitySettingUpdateData;
    mutate(
      {
        type: "put",
        resource,
        payload: {
          data: {
            id: domain.toLowerCase(),
            adminAccountSharing,
            lockOutTime,
            loginOTPExpirationTimeFrame,
            maximumAllowedPasswordRecoveryAttemptsPerHour,
            maximumLoginAttemptsBeforeLockout,
            maximumPasswordLength,
            minimumPasswordLength,
            passwordLifetime,
            passwordRecoveryLinkExpiration,
            passwordResetProtectionType,
            numberOfCharacterClassesForPassword,
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
  }, [domain, securitySettingUpdateData]);

  /**
   * check validations & submit the form
   *
   * @param {object} editData editData props
   * @returns {boolean} added boolean for return consitency
   */
  const updateSecuritySettingFun = (editData) => {
    const combinedState = { ...securitySettingUpdateData, ...editData };
    const errorMessage = validatorHelper(combinedState);
    if (errorMessage) {
      notify(`${translate(errorMessage?.message)} ${errorMessage?.value}`, "error", TIMEOUT);
      return false;
    }
    toggleModal(true);
    setSecuritySettingUpdateData({ ...combinedState });
    return true;
  };

  /**
   * Function to handle CancelButton
   */
  const handleCancelButton = useCallback(() => {
    setEdit(false);
  }, []);

  /**
   * Function to handle CancelButton
   *
   * @param {string} val index of the checkbox to set value of numberOfCharacterClassesForPassword
   */
  const handleCheckbox = (val) => {
    const classesList = val.map((item) => item.value);
    setSecuritySettingUpdateData({
      ...securitySettingUpdateData,
      numberOfCharacterClassesForPassword: classesList,
    });
  };

  const DomainSelection = useMemo(
    () => (
      <>
        <Grid item>
          <Typography
            variant="h5"
            color="inherit"
            className={`${globalClasses.gridStyle} ${globalClasses.titleLineHeight}`}
          >
            {translate("securitySetting")}
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
  return (
    <Grid style={{ height: "100%" }}>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      {DomainSelection}
      {loading && domain ? (
        <LoaderComponent />
      ) : (
        showView && (
          // it is multiple or not  it is not decide that why
          <SecuritySettingView
            securitySettingDetails={data?.params}
            edit={edit}
            handleChangeCheckBox={handleCheckbox}
            setEdit={setEdit}
            classesForPasswordList={classesForPasswordList}
            handleCancelButton={handleCancelButton}
            updateSecuritySettingFun={updateSecuritySettingFun}
          />
        )
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("updateConfirmationMessageOfSecuritySetting")} />}
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

export default SecuritySetting;
