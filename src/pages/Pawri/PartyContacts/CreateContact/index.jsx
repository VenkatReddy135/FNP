/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import SimpleModel from "../../../../components/CreateModal";
import CreateContactUI from "./CreateContactUI";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import { isInvalidPincode, validatePincode } from "../HelperFunctions";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import LoaderComponent from "../../../../components/LoaderComponent";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import {
  initialStateForCreateObj,
  STATE,
  CITY,
  PINCODE,
  STATE_ID,
  CITY_ID,
  COUNTRY_ID,
  IS_EMPTY,
  POSTAL_ADDRESS,
  PHONE_NUMBER,
  COUNTRY_INDIA,
} from "../PartyContactsConstants";
/**
 * Component to create contact information for Party Management module
 *
 * @param {object} props all the props required by Create Contact Information
 * @returns {React.ReactElement} returns Create Contact Information component
 */
const CreateContact = (props) => {
  const { match } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const notify = useNotify();
  const redirect = useRedirect();
  const [open, toggleModal] = useState(false);
  const [selectedContactTypeName, setContactTypeName] = useState(null);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [contactTypesList, setContactTypes] = useState([]);
  const [contactPurposes, setContactPurposes] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [pincodeData, setPincodeData] = useState({ isPincodeInvalid: false, pincodeResponseData: {} });
  const [createObj, setCreateObj] = useState(initialStateForCreateObj);
  const [disable, setDisable] = useState(false);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },

    {
      displayName: `${match.params.id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${match.params.id}/show/contact-info`,
    },
    { displayName: translate("new_contact_information") },
  ];
  const {
    address1,
    address2,
    attentionName,
    cityId,
    countryId,
    doorbell,
    pincode,
    stateId,
    toName,
    contactPurposeId,
    contactTypeId,
    email,
    fromDate,
    phone,
    countryCodeId,
    throughDate,
  } = createObj;
  /**
   * @function handleContactTypes This function will set contact Info details of a party id
   * @param {object} response is passed to the function
   */
  const handleContactTypes = (response) => {
    const contactTypesLists = response?.data?.data?.map((data) => {
      return { id: data.id, name: data.description };
    });
    setContactTypes(contactTypesLists);
  };
  const { loading: contactTypeLoading } = useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_PARTY_SERVICE}/contact-types`,
    handleContactTypes,
  );
  /**
   * @function handleContactPurposes This function will set contact Info details of a party id
   * @param {object} response is passed to the function
   */
  const handleContactPurposes = (response) => {
    const contactPurposeValue = response?.data?.data?.map((data) => {
      return { id: data.id, name: data.description };
    });
    setContactPurposes(contactPurposeValue);
  };
  const resourceForContactPurpose = `${window.REACT_APP_PARTY_SERVICE}/contact-purposes`;
  const payload = { contactTypeId };
  const enabled = Boolean(contactTypeId);
  useCustomQueryWithStore("getData", resourceForContactPurpose, handleContactPurposes, { enabled, payload });
  /**
   * @function handleCountries This function will set list of countries
   * @param {object} response is passed to the function
   */
  const handleCountries = (response) => {
    const countriesList = response?.data?.data?.map((data) => {
      return { id: data.countryId, name: data.countryName };
    });
    setCountryList(countriesList);
  };
  const resourceForCountries = `${window.REACT_APP_TIFFANY_SERVICE}/countries`;
  useCustomQueryWithStore("getData", resourceForCountries, handleCountries, {
    enabled: selectedContactTypeName === POSTAL_ADDRESS,
  });
  /**
   * @function handleCountryCode This function will set list of country codes
   * @param {object} response is passed to the function
   */
  const handleCountryCode = (response) => {
    const countriesCode = response?.data?.data?.map((data) => {
      return { id: data.id, name: data.code };
    });
    setCountryCodes(countriesCode);
  };
  const resourceForCountryCodes = `${window.REACT_APP_PARTY_SERVICE}/country-codes`;
  useCustomQueryWithStore("getData", resourceForCountryCodes, handleCountryCode, {
    enabled: selectedContactTypeName === PHONE_NUMBER,
  });
  /**
   * @function getDropdownValues function that makes a GET API call based on the resource and fieldName
   * @param {string} resource the resource name for the GET call
   * @param {string} fieldName the state, city or pincode name to make conditional switch cases
   */
  const getDropdownValues = (resource, fieldName) => {
    mutate(
      {
        type: "getData",
        resource,
        payload: {},
      },
      {
        onSuccess: (res) => {
          const dropdownValues = [];
          if (res.data && res.status === "success") {
            switch (fieldName) {
              case STATE:
                res?.data?.data?.forEach((item) => {
                  dropdownValues.push({ id: item.stateId, name: item.stateName });
                });
                setStatesList(dropdownValues);
                break;
              case CITY:
                res?.data?.data?.forEach((item) => {
                  dropdownValues.push({ id: item.cityId, name: item.cityName });
                });
                setCitiesList(dropdownValues);
                break;
              case PINCODE:
                setPincodeData({
                  isPincodeInvalid: isInvalidPincode(res.data, createObj),
                  pincodeResponseData: res.data,
                });
                break;
              default:
                break;
            }
          } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
            setPincodeData({
              isPincodeInvalid: isInvalidPincode(res.data, createObj),
            });
          }
        },
        onFailure: (error) =>
          onFailure({
            error,
            notify,
            translate,
            handleFailure: () => (fieldName === STATE ? setStatesList([]) : setCitiesList([])),
          }),
      },
    );
  };
  /**
   * @function handleCreateSuccess This function will handle Success on Update
   * @param {object} res contains message
   */
  const handleCreateSuccess = (res) => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${match.params.id}/show/contact-info`);
    notify(res?.data?.data?.message || translate("create_contact_success_message"), "info", TIMEOUT);
  };
  /**
   * @param {object} res response from API
   * @function to handle errors while creating contact
   */
  const handleBadRequest = (res) => {
    setDisable(false);
    notify(res.data?.errors[0]?.message, "error", TIMEOUT);
  };
  const postCreateContactObj = {
    dataObj: {
      addressContact: toName
        ? {
            address1: address1.trim(),
            address2: address2.trim(),
            attentionName: attentionName.trim(),
            cityId,
            countryId,
            doorbell,
            pincode,
            stateId,
            toName: toName.trim(),
          }
        : null,
      contactPurposeId,
      contactTypeId,
      emailContact: email ? { email } : null,
      fromDate,
      phoneContact: phone ? { countryCodeId, phone } : null,
      primary: false,
      throughDate,
    },
  };
  /**
   * @function createContactInformation function to create the contact address of a party with a post call
   */
  const createContactInformation = () => {
    toggleModal(false);
    setDisable(true);
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_PARTY_SERVICE}/partycontacts/${match.params.id}`,
        payload: {
          data: postCreateContactObj,
        },
      },
      {
        onSuccess: (response) =>
          onSuccess({ response, notify, translate, handleSuccess: handleCreateSuccess, handleBadRequest }),
        onFailure: (error) => {
          setDisable(false);
          onFailure({ error, notify, translate });
        },
      },
    );
  };
  /**
   * @function createContact function renders a confirmation pop-up with action buttons after validating form fields
   * @param {object} createObject is passed
   */
  const createContact = (createObject) => {
    setCreateObj({ ...createObj, ...createObject });
    const err = validatePincode(createObj, selectedContactTypeName, pincodeData.pincodeResponseData, countryId);
    if (!err) return;
    toggleModal(true);
  };
  /**
   * @function handleContactTypeChange function called on change of Contact Type in Create Contact Page
   * @param {Event} event called on change of Contact Type
   */
  const handleContactTypeChange = (event) => {
    const { value } = event.target;
    setContactTypeName(value);
    const selectedOption = contactTypesList.find((item) => item.name === value);
    setCreateObj((prevState) => ({ ...prevState, contactTypeId: selectedOption.id }));
  };
  /**
   * @function handleCityStateCountryChange function called on change of city,state,country in create contact page
   *@param {string} name source name
   *@param {string} value called on change of Input
   */
  const handleCityStateCountryChange = (name, value) => {
    switch (name) {
      case CITY_ID:
        setCreateObj((prevState) => ({ ...prevState, [name]: value, pincode: IS_EMPTY }));
        break;
      case STATE_ID:
        setCreateObj((prevState) => ({ ...prevState, [name]: value, pincode: IS_EMPTY }));
        break;
      case COUNTRY_ID:
        getDropdownValues(`${window.REACT_APP_TIFFANY_SERVICE}/countries/${value}/states`, STATE);
        getDropdownValues(`${window.REACT_APP_TIFFANY_SERVICE}/cities/country/${value}`, CITY);
        setCreateObj((prevState) => ({
          ...prevState,
          [name]: value,
          stateId: IS_EMPTY,
          cityId: IS_EMPTY,
          pincode: IS_EMPTY,
        }));
        break;
      default:
        break;
    }
  };
  /**
   * @function handleDate function called on onChange of Date field
   * @param {Event} event event contains data for Date state
   */
  const handleDate = (event) => {
    const { value, name } = event.target;
    const date = value || null;
    setCreateObj((prevState) => ({ ...prevState, [name]: date }));
  };
  /**
   * @param {Event} event prop is passed to the function
   * @function handlePincodeChange function called to validate pincode
   */
  const handlePincodeChange = (event) => {
    const { name, value } = event.target;
    if (value && countryId === COUNTRY_INDIA)
      getDropdownValues(`${window.REACT_APP_TIFFANY_SERVICE}/countries/states/cities/pincode/${value}`, PINCODE);
    setCreateObj((prevState) => ({ ...prevState, [name]: value }));
  };
  /**
   * @function cancelHandler function called on click of cancel button of Create Contact Page
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${match.params.id}/show/contact-info`);
  };
  /**
   * @returns {React.Component} return component
   */
  const RenderTitle = useMemo(() => {
    return (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("new_contact_information")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    );
  }, []);
  return (
    <>
      {RenderTitle}
      {contactTypeLoading ? (
        <LoaderComponent />
      ) : (
        <CreateContactUI
          selectedContactTypeName={selectedContactTypeName}
          contactTypesList={contactTypesList}
          contactPurposeList={contactPurposes}
          cities={citiesList}
          states={statesList}
          countries={countryList}
          isPincodeInvalid={pincodeData.isPincodeInvalid}
          countryCodes={countryCodes}
          handleContactTypeChange={handleContactTypeChange}
          cancelHandler={cancelHandler}
          createContact={createContact}
          handleCityStateCountryChange={handleCityStateCountryChange}
          handlePincodeChange={handlePincodeChange}
          createObj={createObj}
          handleDate={handleDate}
          setCreateObj={setCreateObj}
        />
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("confirmation_create_new_contact")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        isDisable={disable}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={createContactInformation}
      />
    </>
  );
};
CreateContact.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};
CreateContact.defaultProps = {
  match: {},
};
export default CreateContact;
