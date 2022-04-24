/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  SimpleForm,
  Toolbar,
  Button,
  SaveButton,
  useTranslate,
  useRedirect,
  useMutation,
  useNotify,
} from "react-admin";
import { Grid, Typography, Divider, Checkbox, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import useStyles from "../../../../assets/theme/common";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * @returns {React.ReactElement} returns a form to assign permissions to party login
 */
const AssignPermissions = () => {
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  const notify = useNotify();
  const { id } = useParams();
  const [mutate] = useMutation();
  const redirect = useRedirect();
  const [errorMsg, setErrorMsg] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);

  const partyId = JSON.parse(localStorage.getItem("partyId"));

  /**
   * @function handlePermissionList This function will set list of permissions
   * @param {object} response is passed to the function
   * @returns {Array} array of objects
   */
  const handlePermissionList = (response) => setPermissionsList(response.data);
  const resourceForPermissions = `${window.REACT_APP_SIMSIM_SERVICE}/permissions`;
  const { loading } = useCustomQueryWithStore("getList", resourceForPermissions, handlePermissionList, {
    payload: {
      pagination: { page: 1, perPage: 1000 },
      filter: { q: "" },
      sort: { field: "permissionName", order: "ASC" },
    },
  });

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response contains message
   */
  const handleUpdateSuccess = (response) => {
    notify(response.data.message || translate("assignedPermission_updateSuccessMessage"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/permissions`);
  };

  /**
   * @function assignPermissionToPartyLogin used to update the the list of assigned permissions
   */
  const assignPermissionToPartyLogin = () => {
    const postData = permissions;
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/permissions`,
        payload: {
          data: postData,
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
   * @function handleCancelButton function called on click of cancel button to navigate back to previous route
   * @returns {React.ReactElement} returns the previously loaded component
   */
  const handleCancelButton = () => history.goBack();

  /**
   * @function handleSubmit to call api to assign permission
   */
  const handleSubmit = () => {
    if (!permissions.length) {
      setErrorMsg(true);
      return;
    }
    assignPermissionToPartyLogin();
  };

  /**
   * @function handleChange to set the state of assigned permissions
   * @param {event} event contains info of handle change
   * @param {value} value contains selected permission object
   */
  const handleChange = (event, value) => {
    const assignedPermission = [];
    if (value) {
      value.forEach((permissionObject) => {
        assignedPermission.push(permissionObject.id);
      });
    }
    setPermissions(assignedPermission);
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
      displayName: translate("permissions"),
      navigateTo: `/${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/permissions`,
    },
    {
      displayName: translate("assign_user_logins"),
    },
  ];

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
  const AssignPermissionsForm = useMemo(
    () => (
      <>
        <SimpleForm save={handleSubmit} toolbar={CustomToolbar}>
          <Grid container direction="row" spacing={6}>
            <Grid item>
              <Autocomplete
                multiple
                id="permissions"
                freeSolo
                options={permissionsList}
                disableCloseOnSelect
                getOptionLabel={(option) => option.permissionCode}
                renderOption={(option, { selected }) => (
                  <>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                    {option.permissionCode}
                  </>
                )}
                style={{ border: "white" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate("permission_name_required")}
                    helperText={errorMsg && !permissions.length && translate("required_permission_message")}
                    error={errorMsg && !permissions.length}
                  />
                )}
                onChange={handleChange}
                className={classes.autoCompleteItem}
              />
            </Grid>
          </Grid>
        </SimpleForm>
      </>
    ),
    [errorMsg, permissions.length, permissionsList],
  );

  return (
    <>
      {RenderTitle}
      {loading ? <LoaderComponent /> : <Grid>{AssignPermissionsForm}</Grid>}
    </>
  );
};

export default AssignPermissions;
