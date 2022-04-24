/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { SelectInput, AutocompleteArrayInput, useTranslate, required } from "react-admin";
import { Grid, Checkbox } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import useStyles from "../../../assets/theme/common";
import partyStyles from "./PartyCreateStyle";
import { EMPLOYEE } from "./CreatePartyConstants";

/**
 * @param {object} props all the props required
 * @returns {React.ReactElement} returns a create party form
 */
const Roles = (props) => {
  const [addOtherRoles, setAddOtherRoles] = useState(true);
  const classes = useStyles();
  const { partyObj, partyClassification, partyRoles, updatePartyObj } = props;
  const partyClasses = partyStyles();
  const translate = useTranslate();

  /**
   * @function handleRole for Create Party
   * @param {Event} event is passed
   */
  const handleRole = (event) => {
    const { value } = event.target;
    updatePartyObj((prevState) => ({
      ...prevState,
      role: value,
      otherRoles: partyObj.otherRoles ? partyObj.otherRoles.filter((role) => role !== value) : [],
      notAvailable: value !== EMPLOYEE ? false : partyObj.notAvailable,
      username: value !== EMPLOYEE ? "" : partyObj.username,
    }));
  };

  /**
   * @function handleOtherRole for Create Party
   * @param {Event} event is passed
   */
  const handleOtherRole = (event) => {
    updatePartyObj((prevState) => ({
      ...prevState,
      otherRoles: event,
    }));
  };

  /**
   * @function handleIsPrimary for Create Party
   * @param {Event} event is passed
   */
  const handleIsPrimary = (event) => {
    const { name, checked } = event.target;
    updatePartyObj((prevState) => ({
      ...prevState,
      [name]: checked,
      otherRoles: checked ? partyObj.otherRoles : [],
    }));
    setAddOtherRoles(true);
  };

  /**
   * @function getOtherRoles for Create Party
   * @param {string} allRoles value of selected field
   * @returns {Array} will be returned of roles
   */
  const getOtherRoles = (allRoles) => {
    return allRoles ? allRoles.filter((role) => role.id !== partyObj.role) : [];
  };

  const otherRoles = getOtherRoles(partyRoles) || [];
  return (
    <>
      <>
        <Grid container direction="row" spacing={6} className={partyClasses.gridContainer}>
          <Grid item>
            <SelectInput
              source="role"
              choices={partyRoles}
              optionText="name"
              optionValue="id"
              className={classes.autoCompleteItem}
              onChange={handleRole}
              validate={required(translate("required"))}
            />
            <Grid item>
              <Checkbox
                name="isPrimaryRole"
                disabled={!partyObj.role}
                checked={partyObj.isPrimaryRole}
                onChange={handleIsPrimary}
              />
              <span>{translate("primary_checkbox_label")}</span>
            </Grid>
          </Grid>
          {partyObj.isPrimaryRole && otherRoles && (
            <Grid item>
              {addOtherRoles ? (
                <Grid item>
                  <IconButton
                    className={partyClasses.addOtherRolesButton}
                    onClick={() => {
                      setAddOtherRoles(false);
                    }}
                  >
                    <AddCircleIcon />
                    <Grid item>{translate("select_other_role_label")}</Grid>
                  </IconButton>
                </Grid>
              ) : (
                <>
                  <AutocompleteArrayInput
                    source="otherRoles"
                    choices={otherRoles}
                    optionText="name"
                    optionValue="id"
                    className={classes.autoCompleteItem}
                    label={translate("other_roles_label")}
                    onChange={handleOtherRole}
                  />
                </>
              )}
            </Grid>
          )}
        </Grid>
        <Grid item className={partyClasses.gridContainer}>
          <AutocompleteArrayInput
            source="classifications"
            choices={partyClassification}
            optionText="name"
            optionValue="id"
          />
        </Grid>
      </>
    </>
  );
};

Roles.propTypes = {
  partyObj: PropTypes.objectOf(PropTypes.any).isRequired,
  partyClassification: PropTypes.arrayOf(PropTypes.any).isRequired,
  partyRoles: PropTypes.arrayOf(PropTypes.any).isRequired,
  updatePartyObj: PropTypes.func.isRequired,
};

export default React.memo(Roles);
