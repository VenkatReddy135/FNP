/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import { SimpleForm, SelectInput, useTranslate, useNotify, useMutation, useRedirect } from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useStyles from "../../../assets/theme/common";
import partyStyles from "./PartyCreateStyle";
import { initialValues } from "./CreatePartyConstants";
import PersonalInfo from "./PersonalInfo";
import Roles from "./Roles";
import { TIMEOUT } from "../../../config/GlobalConfig";
import LoaderComponent from "../../../components/LoaderComponent";
import SimpleModel from "../../../components/CreateModal";
import CustomToolbar from "../../../components/CustomToolbar";
import CommonDialogContent from "../../../components/CommonDialogContent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import pollingService from "../../../utils/pollingService";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";

/**
 * @returns {React.ReactElement} returns a create party form
 */
const PartyCreate = () => {
  const classes = useStyles();
  const [partyType, setPartyType] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [partyRoles, setPartyRoles] = useState([]);
  const [partyClassification, setPartyClassifications] = useState([]);
  const [partyObj, updatePartyObj] = useState(initialValues);
  const [open, toggleModal] = useState(false);
  const [partyCreated, setPartyCreated] = useState(false);
  const [genderOptions, setGenderOptions] = useState([]);
  const partyClasses = partyStyles();
  const notify = useNotify();
  const history = useHistory();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const [dialogObj, setConfirmDialog] = useState({});
  const SelectedPartyType =
    partyType.length && partyType.filter((element) => element.id === partyObj.partyType).shift();
  const SelectedPartyRole = partyRoles.length && partyRoles.filter((element) => element.id === partyObj.role).shift();
  const isPartyType = partyObj && partyObj.partyType;

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    { displayName: translate("new_party") },
  ];

  /**
   * @function isValidFormFields will validate the post create party object before submit
   * @param {object} partyObject  is passed to the function
   * @returns {boolean} returns if form is valid to submit
   */
  const isValidFormFields = (partyObject) => {
    const { notAvailable, loginPhoneNumber, loginEmailId, contactEmail, contactPhone } = partyObject;
    if (!notAvailable && !loginEmailId && !loginPhoneNumber) {
      notify(translate("required_fields_login_details"), "error", TIMEOUT);
      return false;
    }
    if (notAvailable && !contactEmail && !contactPhone) {
      notify(translate("required_fields_contact_details"), "error", TIMEOUT);
      return false;
    }
    return true;
  };
  /**
   * @function roleNames will fetch the list of names of Roles selected
   * @param {Array | string} roleIds passed to fetch name from id of roles
   * @returns {Array} roleName returns list of array of Role
   */
  const roleNames = (roleIds) => {
    let roleName = [];
    if (roleIds) {
      const rolesObj = Object.fromEntries(partyRoles.map((item) => [item.id, item.name]));
      if (Array.isArray(roleIds)) {
        roleName = roleIds.map((item) => rolesObj[item]);
      } else roleName.push(rolesObj[roleIds]);
    }
    return roleName;
  };
  const postCreatePartyObj = {
    dataObj: {
      ...partyObj,
      isPrimaryRole: !!partyObj.role,
      roleNames: roleNames(partyObj.role).concat(roleNames(partyObj.otherRoles)),
      dateOfBirth: partyObj.dateOfBirth ? new Date(partyObj.dateOfBirth).toISOString().replace(".000Z", "") : null,
      dateOfAnniversary: partyObj.dateOfAnniversary
        ? new Date(partyObj.dateOfAnniversary).toISOString().replace(".000Z", "")
        : null,
      loginCountryCodeId: partyObj.loginPhoneNumber ? partyObj.loginCountryCodeId : null,
      loginPhoneNumber: partyObj.loginPhoneNumber ? partyObj.loginPhoneNumber : null,
      username: partyObj.notAvailable ? partyObj.username : "",
      contactCountryCodeId: partyObj.contactPhone ? partyObj.contactCountryCodeId : null,
      contactPhone: partyObj.contactPhone ? partyObj.contactPhone : null,
      faxNumber: partyObj.faxNumber ? partyObj.faxNumber : null,
      franchiseName: partyObj.franchiseName.trim(),
      name: partyObj.name.trim(),
      designation: partyObj.designation.trim(),
    },
  };

  /**
   * @function handleSetPartyTypes This function will setData for party types
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetPartyTypes = (res) => setPartyType(res?.data?.data);
  /**
   * @function handleSetGender This function will setData for Gender options
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSetGenderOption = (res) => setGenderOptions(res?.data?.data);
  /**
   * @function handleSetCountryCodes This function will setData for country codes
   * @param {object} res is passed to the function
   */
  const handleSetCountryCodes = (res) => {
    const countryCodeList = res?.data?.data?.map((data) => {
      return { id: data.id, name: data.code };
    });
    setCountryCodes(countryCodeList);
  };
  const resourceForPartyType = `${window.REACT_APP_PARTY_SERVICE}/partytypes`;
  const resourceForCountryCodes = `${window.REACT_APP_PARTY_SERVICE}/country-codes`;
  const resourceForGender = `${window.REACT_APP_PARTY_SERVICE}/genders`;
  const { loading: partyTypeLoading } = useCustomQueryWithStore("getData", resourceForPartyType, handleSetPartyTypes);
  const { loading: genderLoading } = useCustomQueryWithStore("getData", resourceForGender, handleSetGenderOption);
  const { loading: countryCodeLoading } = useCustomQueryWithStore(
    "getData",
    resourceForCountryCodes,
    handleSetCountryCodes,
  );
  /**
   * @function handleUpdateRoles This function will handle Roles
   * @param {object} response is passed to the function
   * @returns {Array} array of roles
   */
  const handleUpdateRoles = (response) => setPartyRoles([...response?.data?.data]);
  /**
   * @param {object} response response from API
   * @function to handle errors for response other than success
   */
  const handleBadRequestCreateRequest = (response) => {
    setPartyCreated(false);
    notify(response.message ? response.message : translate("error_message_party_create"), "error", TIMEOUT);
  };
  /**
   * @param {object} res includes response of API success
   * @function onPollingSuccess to handle polling success after submitting request for party create
   */
  const onPollingSuccess = (res) => {
    setPartyCreated(false);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${res.data.resourceId}/show`);
  };

  const { handlePollingSuccess } = pollingService({
    notify,
    mutate,
    translate,
    url: `${window.REACT_APP_PARTY_SERVICE}/request-status`,
    successMessage: translate("party_create_success_message"),
    setLoader: setPartyCreated,
    onPollingSuccess,
  });

  /**
   * @function handleSuccessCreate to handle success on submitting request to create party
   * @param {object} response from API
   */
  const handleSuccessCreate = (response) => {
    setPartyCreated(true);
    handlePollingSuccess(response?.data?.data?.requestId);
  };
  /**
   * @function handleUpdateClassifications This function will handle Classifications
   * @param {object} response is passed to the function
   * @returns {Array} array of roles
   */
  const handleUpdateClassifications = (response) => setPartyClassifications([...response?.data?.data]);

  /**
   * @function handleActionAfterSubmit to show created party details after submit
   */
  const handleActionAfterSubmit = () => {
    toggleModal(false);
    setPartyCreated(true);
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_PARTY_SERVICE}/parties`,
        payload: {
          data: postCreatePartyObj,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleSuccessCreate,
            handleBadRequest: handleBadRequestCreateRequest,
          });
        },
        onFailure: (error) => {
          setPartyCreated(false);
          onFailure({ error, notify, translate });
        },
      },
    );
  };
  /**
   * @function handleChange for updating state for create Party
   * @param {Event} event value of selected field
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "partyType") {
      updatePartyObj({ ...initialValues, partyType: value });
      mutate(
        {
          type: "getData",
          resource: `${window.REACT_APP_SIMSIM_SERVICE}/party-type-roles/${value}`,
          payload: {
            data: null,
          },
        },
        {
          onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess: handleUpdateRoles }),
          onFailure: (error) => onFailure({ error, notify, translate }),
        },
      );
      mutate(
        {
          type: "getData",
          resource: `${window.REACT_APP_PARTY_SERVICE}/classifications/${value}`,
          payload: {
            data: null,
          },
        },
        {
          onSuccess: (response) =>
            onSuccess({ response, notify, translate, handleSuccess: handleUpdateClassifications }),
          onFailure: (error) => onFailure({ error, notify, translate }),
        },
      );
    } else {
      updatePartyObj((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  /**
   * @function dialogContent function renders the Pup-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => <CommonDialogContent message={message} />;

  /**
   * @function showPopup function renders a confirmation pop-up with action buttons
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    const message = translate("create_party");
    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: translate("cancel"),
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    toggleModal(true);
  };
  /**
   * @function handleSubmitForm for Create Party will validate the form first and then submit
   * @param {object} createPartyObj contains form data
   */
  const handleSubmitForm = (createPartyObj) => {
    updatePartyObj({ ...partyObj, ...createPartyObj });
    const isValidForm = isValidFormFields(createPartyObj);
    if (isValidForm) showPopup("Continue");
  };
  /**
   * @function handleCancelButton function called on click of cancel button to navigate back to previous routes
   * @returns {React.ReactElement} returns the previously loaded component
   */
  const handleCancelButton = () => history.goBack();
  /**
   * @returns {React.Component} return component
   */
  const RenderTitle = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("new_party")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );

  if (partyCreated) {
    return <LoaderComponent />;
  }

  return (
    <>
      {RenderTitle}
      {partyTypeLoading || countryCodeLoading || genderLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <SimpleForm
            initialValues={partyObj}
            save={handleSubmitForm}
            toolbar={
              isPartyType ? (
                <CustomToolbar onClickCancel={handleCancelButton} saveButtonLabel={translate("create")} />
              ) : null
            }
          >
            <Grid item className={partyClasses.gridContainer}>
              <SelectInput
                source="partyType"
                choices={partyType}
                className={classes.autoCompleteItem}
                onChange={handleChange}
              />
            </Grid>
            {isPartyType && (
              <>
                <Roles
                  partyObj={partyObj}
                  partyClassification={partyClassification}
                  partyRoles={partyRoles}
                  updatePartyObj={updatePartyObj}
                />
                <PersonalInfo
                  partyType={SelectedPartyType}
                  countryCodes={countryCodes}
                  partyObj={partyObj}
                  updatePartyObj={updatePartyObj}
                  handleChange={handleChange}
                  genderOptions={genderOptions}
                  partyRole={SelectedPartyRole}
                />
              </>
            )}
          </SimpleForm>
          <SimpleModel
            {...dialogObj}
            openModal={open}
            handleClose={() => toggleModal(false)}
            handleAction={handleActionAfterSubmit}
          />
        </>
      )}
    </>
  );
};
export default PartyCreate;
