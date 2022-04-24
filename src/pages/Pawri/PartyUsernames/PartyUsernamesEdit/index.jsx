/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SimpleForm, useTranslate, TextInput, BooleanInput, useNotify, useMutation, useRedirect } from "react-admin";
import { Grid, Typography, Divider, FormHelperText } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks/HelperFunctions";
import CustomToolbar from "../../../../components/CustomToolbar";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * @returns {React.ReactElement} returns a username edit form
 */
const PartyUsernamesEdit = () => {
  const { id, partyId } = useParams();
  const translate = useTranslate();
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const notify = useNotify();
  const [mutate] = useMutation();
  const redirect = useRedirect();
  /**
   * @function handleUserData This function will setData for required User
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleUserData = (res) => setUserData(res.data);

  const resourceForUserData = `${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}`;
  const { loading: userDataLoading } = useCustomQueryWithStore("getOne", resourceForUserData, handleUserData);

  /**
   * @function postObject will return tha updated values of Post object
   * @param {object} obj contains form field values
   * @returns {object} updated object
   */
  const postObject = (obj) => {
    const { active, disabledDateTime } = obj;
    const date = disabledDateTime || null;
    return {
      disabledDate: obj && date,
      status: obj && active,
    };
  };
  /**
   * @function handleSuccess to redirect on Success of Put Call
   * @param {object} response contains data on API call
   */
  const handleSuccess = (response) => {
    notify(response.data.message || translate("personalInfo_updateSuccessMessage"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/usernames`);
  };

  /**
   * @function putData used to update the user data
   * @param {object} obj contains form field values
   */
  const putData = (obj) => {
    const postData = postObject(obj);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}`,
        payload: {
          data: postData,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
        },
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };

  /**
   *  @function initialUsernameValue used to set the  initial value of the simpleform
   *  @returns {object} returns data for initialization
   */
  const initialUsernameValue = () => ({
    loginId: userData && userData.username,
    active: userData && userData.active,
    disabledDateTime: userData && userData.disabledDateTime,
    successiveFailedAttempt: userData && userData.successiveFailedAttempt,
  });
  /**
   * @function cancelTagHandler function called on click of cancel button of username edit form
   */
  const cancelTagHandler = () => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/usernames`);
  };

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${partyId}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/usernames`,
    },
    {
      displayName: `${userData && userData.username}`,
    },
  ];

  const EditUsernameForm = useMemo(
    () => (
      <>
        <SimpleForm
          initialValues={initialUsernameValue}
          save={putData}
          toolbar={<CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("update")} />}
        >
          <>
            <Grid container direction="row" spacing={6}>
              <Grid item>
                <TextInput source="loginId" label={translate("login_id")} disabled className={classes.disabled} />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={6}>
              <Grid item md={3}>
                <FormHelperText>{translate("party_id_status")}</FormHelperText>
                <BooleanInput label="" source="active" />
              </Grid>
              <Grid item md={3}>
                <DateTimeInput
                  source="disabledDateTime"
                  label={translate("disabled_date_and_time")}
                  className={classes.customDateTimeInput}
                />
              </Grid>
              <Grid item>
                <TextInput
                  source="successiveFailedAttempt"
                  label={translate("successive_failed_logins")}
                  disabled
                  className={classes.disabled}
                />
              </Grid>
            </Grid>
          </>
        </SimpleForm>
      </>
    ),
    [userData],
  );

  return (
    <>
      {userDataLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Grid container direction="row">
            <Typography variant="h5" className={classes.gridStyle}>
              {userData?.username}
            </Typography>
          </Grid>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
          {EditUsernameForm}
        </>
      )}
    </>
  );
};

export default PartyUsernamesEdit;
