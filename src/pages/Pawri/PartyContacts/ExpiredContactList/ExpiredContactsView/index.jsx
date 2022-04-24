/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTranslate, Button } from "react-admin";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../../assets/theme/common";
import LoaderComponent from "../../../../../components/LoaderComponent";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import { EMAIL_ADDRESS, PHONE_NUMBER, POSTAL_ADDRESS } from "../../PartyContactsConstants";

/**
 * Component for Expired Contacts View
 *
 * @returns {React.ReactElement} returns Expired contacts view
 */
const ExpiredContactsView = () => {
  const { partyId, contactTypeId } = useParams();
  const history = useHistory();
  const [data, setData] = useState();
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState([]);
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    setData(res.data);
  };

  /**
   * @function handleSetDataCountrySuccess This function will set country name
   * @param {object} res is passed to the function
   */
  const handleSetDataCountrySuccess = (res) => {
    setCountryName(res.data.countryName);
  };

  /**
   * @function handleSetDataCountrySuccess This function will set state name
   * @param {object} res is passed to the function
   */
  const handleSetDataStateSuccess = (res) => {
    setStateName(res.data.stateName);
  };

  /**
   * @function handleSetDataStateSuccess This function will set the city name
   * @param {object} res is passed to the function
   */
  const handleSetDataCitySuccess = (res) => {
    setCityName(res.data.cityName);
  };

  const resource = `${window.REACT_APP_PARTY_SERVICE}/partycontacts/${partyId}/${contactTypeId}`;

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  const {
    contactPurpose,
    contactType,
    email,
    status,
    phone,
    addressLine1,
    addressLine2,
    attentionName,
    cityId,
    toName,
    stateId,
    pincode,
    countryId,
    doorbell,
  } = data || {};

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${partyId}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/contact-info`,
    },
    {
      displayName: translate("contact_info"),
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/contact-info`,
    },
    {
      displayName: translate("label_expired_contact"),
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/partycontacts/${partyId}/expired-contacts`,
    },
    { displayName: `${contactType}` },
  ];

  const resourceCountry = `${window.REACT_APP_TIFFANY_SERVICE}/countries/${countryId}`;
  const enabled = Boolean(countryId);

  const resourceState = `${window.REACT_APP_TIFFANY_SERVICE}/states/${stateId}`;
  const enabledState = Boolean(stateId);

  const resourceCity = `${window.REACT_APP_TIFFANY_SERVICE}/cities/${cityId}`;
  const enabledCity = Boolean(cityId);

  useCustomQueryWithStore("getData", resourceCountry, handleSetDataCountrySuccess, {
    enabled,
  });

  useCustomQueryWithStore("getData", resourceState, handleSetDataStateSuccess, {
    enabled: enabledState,
  });

  useCustomQueryWithStore("getData", resourceCity, handleSetDataCitySuccess, {
    enabled: enabledCity,
  });

  const contactStatus = status ? translate("active") : translate("expired");

  /**
   *
   * @returns {React.ReactElement} returns Contact Type Postal view
   */
  const ContactTypePostal = () => {
    return (
      <>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("contact_type")}</Typography>
            <Typography variant="subtitle2">{contactType}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("contact_purpose")}</Typography>
            <Typography variant="subtitle2">{contactPurpose}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("status")}</Typography>
            <Typography variant="subtitle2">{contactStatus}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("to_name")}</Typography>
            <Typography variant="subtitle2">{toName}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("attention_name")}</Typography>
            <Typography variant="subtitle2">{attentionName}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("doorbell")}</Typography>
            <Typography variant="subtitle2">{doorbell}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("address_line_1")}</Typography>
            <Typography variant="subtitle2">{addressLine1}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("address_line_2")}</Typography>
            <Typography variant="subtitle2">{addressLine2}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("city")}</Typography>
            <Typography variant="subtitle2">{cityName}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("state")}</Typography>
            <Typography variant="subtitle2">{stateName}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("pincode")}</Typography>
            <Typography variant="subtitle2">{pincode}</Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("country")}</Typography>
            <Typography variant="subtitle2">{countryName}</Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  /**
   *
   * @returns {React.ReactElement} returns Contact Type Email and Phone view
   */
  const ContactTypeEmailAndPhone = () => {
    return (
      <>
        <Grid container direction="row" className={classes.customMargin}>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("contact_type")}</Typography>
            <Typography variant="subtitle2">{contactType}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("contact_purpose")}</Typography>
            <Typography variant="subtitle2">{contactPurpose}</Typography>
          </Grid>
          <Grid item container direction="column" md={3}>
            {contactType === EMAIL_ADDRESS && (
              <>
                <Typography variant="caption">{translate("contact_email")}</Typography>
                <Typography variant="subtitle2">{email}</Typography>
              </>
            )}
            {contactType === PHONE_NUMBER && (
              <>
                <Typography variant="caption">{translate("contact_phone")}</Typography>
                <Typography variant="subtitle2">{phone}</Typography>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item container direction="column" md={3}>
            <Typography variant="caption">{translate("status")}</Typography>
            <Typography variant="subtitle2">{contactStatus}</Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Grid container direction="row">
            <Typography variant="h5" className={classes.gridStyle}>
              {contactType}
            </Typography>
          </Grid>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
          {(contactType === EMAIL_ADDRESS || contactType === PHONE_NUMBER) && <ContactTypeEmailAndPhone />}
          {contactType === POSTAL_ADDRESS && <ContactTypePostal />}
          <Grid item className={classes.plusButton}>
            <Button label={translate("back")} variant="outlined" onClick={() => history.goBack()} />
          </Grid>
        </>
      )}
    </>
  );
};

export default ExpiredContactsView;
