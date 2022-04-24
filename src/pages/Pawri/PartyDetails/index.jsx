/* eslint-disable react/jsx-props-no-spreading */
import { Divider, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslate, SimpleShowLayout, BooleanInput, SimpleForm, useMutation, useNotify } from "react-admin";
import useStyles from "../../../assets/theme/common";
import PartyPersonalInfo from "../PartyPersonalInfo";
import PartyUsernames from "../PartyUsernames";
import RelationshipList from "../Relationship/RelationshipList";
import ContactList from "../PartyContacts/ContactInformationList";
import PartyRoles from "../PartyRoles";
import { TIMEOUT, ACTIVE } from "../../../config/GlobalConfig";
import GenericTabComponent from "../../../components/GenericTab";
import LoaderComponent from "../../../components/LoaderComponent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import pollingService from "../../../utils/pollingService";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
/**
 * Component for Party View Dashboard with data in tabs
 *
 * @param {*} props all the props needed for Party View
 * @returns {React.ReactElement} returns a Party View Dashboard Component
 */
const PartyDetails = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { id } = useParams();
  const [mutate] = useMutation();
  const [data, setData] = useState();
  const [statusLoader, setStatusLoader] = useState(false);
  const [partyStatus, setPartyStatus] = useState({ status: false });
  const notify = useNotify();

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    { displayName: `${id}` },
  ];

  const PartyTabArray = [
    {
      key: "personal",
      title: translate("personal_information"),
      path: "",
      componentToRender: PartyPersonalInfo,
    },
    {
      key: "username",
      title: translate("usernames"),
      path: "usernames",
      componentToRender: PartyUsernames,
    },
    {
      key: "contactInfo",
      title: translate("contact_info"),
      path: "contact-info",
      componentToRender: ContactList,
    },
    {
      key: "relationship",
      title: translate("relationship"),
      path: "relations",
      componentToRender: RelationshipList,
    },
    { key: "roles", title: translate("roles"), path: "roles", componentToRender: PartyRoles },
  ];

  /**
   * @function handleSetDataSuccess This function will setData for Party details
   * @param {object} res API response
   */
  const handleSetDataSuccess = (res) => {
    setData(res.data);
    setPartyStatus({ status: res?.data?.status === ACTIVE });
  };

  const resource = `${window.REACT_APP_PARTY_SERVICE}/parties/${id}`;

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  const { partyType, classifications } = data || {};

  /**
   * @param {object} res includes response of API success
   * @function onPollingSuccess to handle polling success after submitting request for party status
   */
  const onPollingSuccess = (res) => {
    setPartyStatus({ status: res?.data?.messageCode === ACTIVE });
  };

  const { handlePollingSuccess } = pollingService({
    notify,
    mutate,
    translate,
    url: `${window.REACT_APP_PARTY_SERVICE}/request-status`,
    successMessage: translate("success_message_party_status"),
    setLoader: setStatusLoader,
    onPollingSuccess,
  });

  /**
   * @function handleSuccessForStatus to handle success on submitting request to update party status
   * @param {object} response from API
   */
  const handleSuccessForStatus = (response) => {
    setStatusLoader(true);
    handlePollingSuccess(response?.data?.requestId);
  };
  /**
   * @param {object} res response from API
   * @function to handle errors from while updating party status
   */
  const handleBadRequest = (res) => {
    setStatusLoader(false);
    notify(res.data?.errors[0]?.message, "error", TIMEOUT);
  };

  /**
   * @function handleToggleStatus This function will be called while updating party status
   * @param {boolean} event value of toggle
   */
  const handleToggleStatus = (event) => {
    setStatusLoader(true);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_PARTY_SERVICE}/parties/${id}?status=${event}`,
        payload: {},
      },
      {
        onSuccess: (response) =>
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleSuccessForStatus,
            handleBadRequest,
          }),
        onFailure: (error) => {
          setStatusLoader(false);
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  return (
    <>
      {loading || statusLoader ? (
        <LoaderComponent />
      ) : (
        <>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Grid item className={classes.gridStyle}>
            <Typography variant="h5" color="inherit">
              {id}
            </Typography>
          </Grid>
          <Divider className={classes.dividerStyle} />
          <SimpleShowLayout {...props}>
            <SimpleForm initialValues={partyStatus} toolbar={<></>}>
              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <Typography variant="caption">{translate("party_id")}</Typography>
                  <Typography variant="subtitle2">{id}</Typography>
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <Typography variant="caption">{translate("party_status")}</Typography>
                  <BooleanInput source="status" label="" onChange={handleToggleStatus} />
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <Typography variant="caption">{translate("party_type")}</Typography>
                  <Typography variant="subtitle2">{partyType}</Typography>
                </Grid>
                <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <Typography variant="caption">{translate("party_classification")}</Typography>
                  <Typography variant="subtitle2">{classifications}</Typography>
                </Grid>
              </Grid>
              <GenericTabComponent tabArray={PartyTabArray} {...data} {...props} className={classes.tabStyle} />
            </SimpleForm>
          </SimpleShowLayout>
        </>
      )}
    </>
  );
};

export default PartyDetails;
