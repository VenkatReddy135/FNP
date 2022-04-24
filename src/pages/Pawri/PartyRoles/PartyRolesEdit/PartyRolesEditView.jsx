/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import { SimpleForm, AutocompleteInput, Button, useTranslate, required } from "react-admin";
import { useParams } from "react-router-dom";
import { Grid, Typography, Divider, Paper, Chip, IconButton, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PropTypes from "prop-types";
import useStyles from "../../../../assets/theme/common";
import CommonButtonRow from "../../../../components/CommonButtonRow";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { requiredValidation } from "../../../../utils/validationFunction";
/**
 * @param {object} props contains the data and function required for this component
 * @returns {React.ReactElement} returns PartyUserRolesEditView form
 */
const PartyRolesEditView = (props) => {
  const { id } = useParams();
  const classes = useStyles();
  const translate = useTranslate();
  const [data, setData] = useState({ addOtherRoles: false, otherRoles: [] });
  const { setPartyData, deleteRole, handleSubmit, cancelTagHandler, partyData, roles } = props;
  const requiredValidate = [requiredValidation(translate("required")), required()];

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/roles`,
    },
    { displayName: translate("party_roles") },
  ];
  /**
   *  @function initialPrimaryRoleValue used to set the  initial primary role value for the SimpleForm
   *  @returns {object} returns data for initialization
   */
  const initialPrimaryRoleValue = () => ({
    primaryRole: partyData?.primary?.roleName,
  });

  /**
   * @function handleOtherRole to handle otherRoles set in the form
   * @param {event} event contains event value
   * @param {Array} value contains array of  roles that are selected
   */
  const handleOtherRole = (event, value) => {
    setData((prevState) => ({ ...prevState, otherRoles: [...value] }));
  };
  /**
   * @function handleAddButton used to set the added otherRoles to the partyData.
   * And also used to set aadOtherRoles and otherRoles
   */
  const handleAddButton = () => {
    const arr = data?.otherRoles.map((role) => ({ roleId: role?.id, roleName: role?.name, primary: false }));
    setPartyData((prevState) => ({ ...prevState, other: [...partyData.other, ...arr] }));
    setData((prevState) => ({ ...prevState, addOtherRoles: false, otherRoles: [] }));
  };

  /**
   * @function handleDelete used to delete the otherRole and also call delete API
   * @param {object} chipToDelete contains the role to delete
   * @returns {Function} return function for onDelete props of chip
   */
  const handleDelete = (chipToDelete) => () => {
    const arr = partyData?.other.filter((chip) => chip?.roleName !== chipToDelete?.roleName);
    setPartyData((prevState) => ({ ...prevState, other: [...arr] }));
    deleteRole(chipToDelete.roleId);
  };

  /**
   * @function handlePrimary used to set the primary role.
   * And also filters the other roles if it contains the newly selected primary role
   * @param {string} primaryRoleName contains name of the primary role
   */
  const handlePrimary = (primaryRoleName) => {
    const selected = partyData.other ? partyData.other.filter((value) => value?.roleName !== primaryRoleName) : [];
    const primaryRole = roles?.find((role) => role?.name === primaryRoleName);
    const updatedPrimary = { roleId: primaryRole?.id, roleName: primaryRoleName, primary: true };
    setPartyData((prevState) => ({ ...prevState, primary: updatedPrimary, other: [...selected] }));
    setData((prevState) => ({
      ...prevState,
      otherRoles: data?.otherRoles.filter((role) => role?.name !== primaryRoleName),
    }));
  };

  /**
   * @function handlePlusIcon used to handle the AddCircleIcon button
   */
  const handlePlusIcon = () => {
    setData((prevState) => ({ ...prevState, addOtherRoles: !data.addOtherRoles }));
  };

  /**
   * @function getOtherRoles filters the roles according to primary role
   * @param {Array} optionalRoles array filtered to remove the selected primary role from the choices
   * @returns {Array} return filtered data
   */
  const getOtherRoles = (optionalRoles) => {
    return optionalRoles ? optionalRoles.filter((role) => role?.name !== partyData?.primary?.roleName) : [];
  };
  const otherChoices = getOtherRoles(roles) || [];

  /**
   * filter to remove the party's fetched other roles from the choices
   */
  const results = otherChoices?.filter((value) => !partyData?.other.some((value1) => value?.name === value1?.roleName));

  /**
   *
   * @returns {React.Component} return component
   */
  const PartyRoleTitleView = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("party_roles")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );
  /**
   *
   * @returns {React.Component} return component
   */
  const PartyRoleView = useMemo(
    () => (
      <SimpleForm
        toolbar={<CommonButtonRow onClickCancel={cancelTagHandler} onClickUpdate={handleSubmit} />}
        initialValues={initialPrimaryRoleValue}
      >
        <>
          <Grid container direction="row" spacing={6}>
            <Grid item>
              <AutocompleteInput
                source="primaryRole"
                label={translate("primary_role")}
                choices={roles}
                optionText="name"
                optionValue="name"
                onChange={handlePrimary}
                validate={requiredValidate}
              />
            </Grid>
          </Grid>
          {data.addOtherRoles && (
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={results}
                  disableClearable
                  freeSolo
                  value={data.otherRoles}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => value.name === option.name}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label={translate("other_roles")} />
                  )}
                  onChange={handleOtherRole}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" label={translate("add")} onClick={handleAddButton} />
              </Grid>
            </Grid>
          )}
          <Grid container direction="row" spacing={1}>
            <Grid item>
              {!data.addOtherRoles && <Typography variant="caption">{translate("other_roles")}</Typography>}

              <Paper variant="elevation" elevation={0}>
                {partyData?.other.map((role) => {
                  return (
                    <Chip
                      label={role.roleName}
                      key={role.roleName}
                      onDelete={handleDelete(role)}
                      className={classes.chipMargin}
                    />
                  );
                })}
              </Paper>
            </Grid>
            {!data.addOtherRoles && (
              <Grid item>
                <IconButton className={classes.plusButton} onClick={handlePlusIcon}>
                  <AddCircleIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </>
      </SimpleForm>
    ),
    [roles, partyData, data, results],
  );
  return (
    <>
      {PartyRoleTitleView}
      {PartyRoleView}
    </>
  );
};
PartyRolesEditView.propTypes = {
  deleteRole: PropTypes.func.isRequired,
  setPartyData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  partyData: PropTypes.shape({
    primary: PropTypes.shape({
      roleId: PropTypes.string.isRequired,
      roleName: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired,
    }).isRequired,
    other: PropTypes.arrayOf(
      PropTypes.shape({
        roleId: PropTypes.string.isRequired,
        roleName: PropTypes.string.isRequired,
        primary: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, id: PropTypes.string.isRequired }).isRequired,
  ).isRequired,
};
export default PartyRolesEditView;
