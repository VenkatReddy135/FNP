/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  SimpleForm,
  Toolbar,
  Button,
  useTranslate,
  useMutation,
  useNotify,
  useRedirect,
  SaveButton,
  AutocompleteArrayInput,
  required,
} from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * @returns {React.ReactElement} returns a form to assign security group to party login id
 */
const AssignSecurityGroup = () => {
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  const notify = useNotify();
  const { id } = useParams();
  const [mutate] = useMutation();
  const redirect = useRedirect();
  const [securityGroupNameList, setSecurityGroupNameList] = useState([]);

  const partyId = JSON.parse(localStorage.getItem("partyId"));

  /**
   * @function handleSecurityGroupList This function will set list of security groups
   * @param {object} response is passed to the function
   */
  const handleSecurityGroupList = (response) => {
    const assignedSecurityGroups = response.data.map((data) => {
      return { id: data.id, name: data.securityGroupCode };
    });
    setSecurityGroupNameList(assignedSecurityGroups);
  };
  const resourceForSecurityGroup = `${window.REACT_APP_SIMSIM_SERVICE}/securitygroups`;
  const { loading } = useCustomQueryWithStore("getList", resourceForSecurityGroup, handleSecurityGroupList, {
    payload: {
      pagination: { page: 1, perPage: 1000 },
      filter: { q: "" },
      sort: { field: "securityGroupName", order: "ASC" },
    },
  });

  /**
   * @function handleCancelButton function called on click of cancel button to navigate back to previous route
   * @returns {React.ReactElement} returns the previously loaded component
   */
  const handleCancelButton = () => history.goBack();

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response contains message
   */
  const handleUpdateSuccess = (response) => {
    notify(response.data.message || translate("assignedSecurityGroup_updateSuccessMessage"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/securitygroups`);
  };
  /**
   * @param {object} postObject contains assigned security group
   * @function handleSubmit to call api to assign security group
   */
  const handleSubmit = (postObject) => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/securitygroups`,
        payload: {
          data: postObject.securityGroupId,
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
  };

  /**
   * @function CustomToolbar
   * @param {object} customProps is passed to custom toolbar
   * @returns {React.ReactElement} CustomToolbar
   */
  const CustomToolbar = useMemo(
    (customProps) => (
      <Toolbar {...customProps}>
        <Button variant="outlined" type="button" label={translate("cancel")} onClick={handleCancelButton} />
        <SaveButton variant="contained" label={translate("assign")} icon={<></>} />
      </Toolbar>
    ),
    [],
  );

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
      displayName: translate("assign_security_group"),
      navigateTo: `/${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/securitygroups`,
    },
    {
      displayName: translate("assign_user_logins"),
    },
  ];

  /**
   * @returns {React.Component} return component
   */
  const RenderTitle = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row" className={classes.titleGridStyle} justify="space-between">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("assign_user_logins")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );

  /**
   * @returns {React.Component} return component
   */
  const RenderAssignSecurityGroupForm = useMemo(
    () => (
      <>
        <SimpleForm toolbar={CustomToolbar} save={handleSubmit}>
          <Grid container direction="row" spacing={6}>
            <Grid item>
              <AutocompleteArrayInput
                source="securityGroupId"
                label={translate("security_group_name")}
                choices={securityGroupNameList}
                validate={required(translate("required_securitygroup_message"))}
              />
            </Grid>
          </Grid>
        </SimpleForm>
      </>
    ),
    [securityGroupNameList],
  );

  return (
    <>
      {RenderTitle}
      {loading ? <LoaderComponent /> : <Grid>{RenderAssignSecurityGroupForm}</Grid>}
    </>
  );
};

export default AssignSecurityGroup;
