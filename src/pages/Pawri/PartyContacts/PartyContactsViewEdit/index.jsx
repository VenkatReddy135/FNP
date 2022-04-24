import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useNotify, useRedirect, useTranslate, useMutation, useRefresh } from "react-admin";
import PartyContactsViewEditUI from "./PartyContactsViewEditUI";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import SimpleModel from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { validatePincode, isInvalidPincode } from "../HelperFunctions";
import { STATE_ID, CITY_ID, COUNTRY_ID, IS_EMPTY, POSTAL_ADDRESS, COUNTRY_INDIA } from "../PartyContactsConstants";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";

/**
 * Component to render the View/Edit Page of Party Contacts
 *
 * @param {object} props required for view and edit
 * @returns {React.ReactElement} all the props required by the Party Contacts - View/Edit
 */
const PartyContactsViewEdit = (props) => {
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const [open, toggleModal] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [contactPurposes, setContactPurposes] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [pincodeData, setPincodeData] = useState({ isPincodeInvalid: false, pincodeInfo: {} });
  const { isEditable, history } = props;
  const { partyId, partyContactId } = useParams();

  const {
    addressLine1,
    addressLine2,
    attentionName,
    cityId,
    countryId,
    doorbell,
    pincode,
    stateId,
    toName,
    contactPurposeId,
    contactType,
    email,
    fromDate,
    phone,
    countryCodeId,
    throughDate,
    primary,
    contactTypeId,
  } = responseData;

  /**
   * @function handleContactInfo This function will set contact Info details of a party id
   * @param {object} response is passed to the function
   * @returns {Array} array of objects
   */
  const handleContactInfo = (response) => setResponseData(response.data);
  const resourceForContactInfo = `${window.REACT_APP_PARTY_SERVICE}/partycontacts/${partyId}/${partyContactId}`;
  const { loading: contactInfoLoading } = useCustomQueryWithStore("getOne", resourceForContactInfo, handleContactInfo);

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
  useCustomQueryWithStore("getData", resourceForCountryCodes, handleCountryCode);

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a party id
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
  const { loading: countryLoading } = useCustomQueryWithStore("getData", resourceForCountries, handleCountries, {
    enabled: contactType === POSTAL_ADDRESS,
  });

  /**
   * @function handleStates This function will set list of states based on country id
   * @param {object} response is passed to the function
   */
  const handleStates = (response) => {
    const stateList = response?.data?.data?.map((data) => {
      return { id: data.stateId, name: data.stateName };
    });
    setStatesList(stateList);
  };
  const resourceForState = `${window.REACT_APP_TIFFANY_SERVICE}/countries/${countryId}/states`;
  useCustomQueryWithStore("getData", resourceForState, handleStates, { enabled: Boolean(countryId) });

  /**
   * @function handleCities This function will set list of cities based on state id
   * @param {object} response is passed to the function
   */
  const handleCities = (response) => {
    const cityList = response?.data?.data?.map((data) => {
      return { id: data.cityId, name: data.cityName };
    });
    setCitiesList(cityList);
  };
  const resourceForCities = `${window.REACT_APP_TIFFANY_SERVICE}/cities/country/${countryId}`;
  useCustomQueryWithStore("getData", resourceForCities, handleCities, {
    handleFailure: () => setCitiesList([]),
    enabled: Boolean(countryId),
  });

  /**
   * @function handleBadRequest to handle bad request
   * @param {object} res response from API
   */
  const handleBadRequest = (res) => {
    setPincodeData({
      isPincodeInvalid: isInvalidPincode(res.data, responseData),
    });
  };
  /**
   * @function handlePinCodes This function will set the pincode data based on pincode
   * @param {object} res is passed to the function
   */
  const handlePinCodes = (res) => {
    setPincodeData({
      isPincodeInvalid: isInvalidPincode(res.data, responseData),
      pincodeInfo: res.data,
    });
  };
  const resourceForPincode = `${window.REACT_APP_TIFFANY_SERVICE}/countries/states/cities/pincode/${pincode}`;
  useCustomQueryWithStore("getData", resourceForPincode, handlePinCodes, {
    handleBadRequest,
    enabled: Boolean(pincode) && countryId === COUNTRY_INDIA,
  });

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response contains message
   */
  const handleUpdateSuccess = (response) => {
    notify(response.data.message || translate("update_contact_success_message"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/contact-info`);
    refresh();
  };

  /**
   * @function updateContactAddress function to update the contact address of a party with a api call
   */
  const updateContactAddress = async () => {
    toggleModal(false);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_PARTY_SERVICE}/partycontacts/${partyId}/${partyContactId}`,
        payload: {
          data: JSON.stringify({
            addressContact: toName
              ? {
                  address1: addressLine1.trim(),
                  address2: addressLine2.trim(),
                  attentionName: attentionName.trim(),
                  cityId,
                  countryId,
                  doorbell,
                  pincode,
                  stateId,
                  toName: toName.trim(),
                }
              : null,
            emailContact: email ? { email } : null,
            phoneContact: phone ? { countryCodeId, phone } : null,
            contactPurposeId,
            contactTypeId: contactType,
            fromDate,
            primary,
            throughDate,
          }),
        },
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };

  /**
   *@function handlePinCodeChange function called on change of pincode
   *@param {Event} event called on change of Input
   */
  const handlePinCodeChange = (event) => {
    const { name, value } = event.target;
    setResponseData((prevState) => ({ ...prevState, [name]: value }));
  };
  /**
   * @function handleDate function called on onChange of Date field
   * @param {Event} event event contains data for Date state
   */
  const handleDate = (event) => {
    const { value, name } = event.target;
    const date = value || null;
    setResponseData((prevState) => ({ ...prevState, [name]: date }));
  };
  /**
   * @function handleCityStateCountryChange function called on change of city,state,country in edit contact page
   *@param {string} name source name
   *@param {string} value called on change of Input
   */
  const handleCityStateCountryChange = (name, value) => {
    switch (name) {
      case CITY_ID:
        setResponseData((prevState) => ({ ...prevState, [name]: value, pincode: IS_EMPTY }));
        break;
      case STATE_ID:
        setResponseData((prevState) => ({ ...prevState, [name]: value, cityId: IS_EMPTY, pincode: IS_EMPTY }));
        break;
      case COUNTRY_ID:
        setResponseData((prevState) => ({
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
   * @function handleChange this function is used to set state
   * @param {string} name passed to the function
   * @param {string} value passed to the function
   */
  const handleChange = (name, value) => {
    setResponseData((prevState) => ({ ...prevState, [name]: value }));
  };
  /**
   * @function updateContact function renders a confirmation pop-up with action buttons after validating form fields
   * @param {object} updateObject contains updated values of form
   */
  const updateContact = (updateObject) => {
    setResponseData({ ...responseData, ...updateObject });
    const validationErrors = validatePincode(responseData, contactType, pincodeData.pincodeInfo, countryId);
    if (!validationErrors) return;
    toggleModal(true);
  };
  /**
   * @function cancelHandler function called on click of cancel button to redirect on Contact List Page
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/contact-info`);
  };
  /**
   *@function switchToEditHandler function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = () => {
    history.push(`/${window.REACT_APP_PARTY_SERVICE}/partycontacts/${partyId}/${partyContactId}`);
  };

  return (
    <>
      {contactInfoLoading || countryLoading ? (
        <LoaderComponent />
      ) : (
        <PartyContactsViewEditUI
          isPincodeInvalid={pincodeData.isPincodeInvalid}
          handleChange={handlePinCodeChange}
          updateContact={updateContact}
          countryList={countryList}
          stateList={statesList}
          citiesList={citiesList}
          countryCodes={countryCodes}
          pinCodesInfo={pincodeData}
          cancelHandler={cancelHandler}
          handleCityStateCountryChange={handleCityStateCountryChange}
          responseData={responseData}
          isEditable={isEditable}
          contactPurposes={contactPurposes}
          switchToEditHandler={switchToEditHandler}
          handleDate={handleDate}
          handlePhoneChange={handleChange}
        />
      )}
      <SimpleModel
        dialogContent={<CommonDialogContent message={translate("update_contact")} />}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={updateContactAddress}
      />
    </>
  );
};

PartyContactsViewEdit.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  isEditable: PropTypes.bool.isRequired,
};

PartyContactsViewEdit.defaultProps = {
  history: {},
};

export default PartyContactsViewEdit;
