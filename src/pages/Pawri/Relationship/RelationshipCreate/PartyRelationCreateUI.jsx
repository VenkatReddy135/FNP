/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import { useTranslate, SimpleForm, AutocompleteInput, useNotify, useMutation, required } from "react-admin";
import { useParams } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, Grid, Divider, FormHelperText, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useStyles from "../../../../assets/theme/common";
import CustomToolbar from "../../../../components/CustomToolbar";
import { fetchDateString } from "../../../../utils/formatDateTime";
import partyRelationCreatePropType from "./PartyRelationCreatePropType";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks/HelperFunctions";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * required styles for the PartyRelationCreateUI component
 */
const partyStyles = makeStyles({
  gridMargin: {
    marginTop: "-47px",
    marginLeft: "5px",
  },
});
/**
 * @function PartyRelationCreateUI Component to create a new relationship
 * @param {object} props all the props required by Relationship Create component
 * @returns {React.ReactElement} returns Create Relationship Create component
 */
const PartyRelationCreateUI = (props) => {
  const { id } = useParams();
  const classes = useStyles();
  const partyClasses = partyStyles();
  const translate = useTranslate();
  const {
    updateFormData,
    handleDate,
    cancelTagHandler,
    toRolesData,
    partyName,
    relationType,
    fromRolesData,
    handlePartyChange,
    relationData,
  } = props;
  const notify = useNotify();
  const [partyList, setPartyList] = useState([]);
  const [party, setParty] = useState(null);
  const [touchField, setTouchField] = useState(false);
  const [mutate] = useMutation();

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/relations`,
    },
    { displayName: translate("relationship_create_title") },
  ];
  /**
   *@function toDateValidation to validate the toDate field
   * @param {Date} value date value to be validated
   * @returns {(string | undefined)} returns string or undefined
   */
  const toDateValidation = (value) =>
    value && fetchDateString(new Date(value)) <= fetchDateString(new Date(relationData.fromDate))
      ? translate("to_date_validation_message")
      : undefined;
  /**
   * @function handleSuccess This function will handle success of the mutation
   * @param {object} res is passed to the function
   * @returns {Array} array of objects
   */
  const handleSuccess = (res) => setPartyList([...res.data.data]);
  /**
   * @function handleInputChange function that updates the changed value of selected party list dropdown
   * @param {string} newValue contains the value types in the search ahead component
   */
  const handleChange = (newValue) => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_PARTY_SERVICE}/partyid-search`,
        payload: { partyId: newValue || "null" },
      },
      {
        onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
        onFailure: (error) => onFailure({ error, notify, translate }),
      },
    );
  };
  /**
   * @function onAutoCompleteInputChange function fetches the party list based on search value
   * @param {event} event contains event data on Input change
   * @param {string} newInputValue contains the character value for search on input change
   */
  const onAutoCompleteInputChange = (event, newInputValue) => {
    handleChange(newInputValue);
    handlePartyChange(event, null);
    setParty(null);
  };

  /**
   * @function onFromPartyChange function to set the selected value from drop down
   * @param {event} event contains event data on Input change
   * @param {object} newValue contains the value to set from party Id field state
   */
  const onFromPartyChange = (event, newValue) => {
    if (newValue) {
      handlePartyChange(event, newValue);
      setParty({ id: newValue.id, partyName: newValue.partyName });
    }
  };
  /**
   * @function CustomHelperText return a custom react helperText component
   * @param {object} rolesData roles data
   * @returns {React.ReactElement} return custom helper text
   */
  const CustomHelperText = (rolesData) => {
    const { primary, other } = rolesData;
    return (
      <FormHelperText>
        <>
          {`${translate("primary_role")}: `}
          {primary?.roleName}
        </>
        <br />
        <>
          {`${translate("other_roles")}: `}
          {other?.map((role) => `${role.roleName}`).join(", ")}
        </>
      </FormHelperText>
    );
  };
  /**
   * @function RelationTitleView relation title view component
   * @returns {React.createElement} returns relation title view
   */
  const RelationTitleView = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Grid container direction="row">
          <Typography variant="h5" className={classes.gridStyle}>
            {translate("relationship_create_title")}
          </Typography>
        </Grid>
        <Divider variant="fullWidth" className={classes.dividerStyle} />
      </>
    ),
    [],
  );
  /**
   * @function Toolbar custom toolbar component
   * @returns {React.createElement} returns custom toolbar component
   */
  const Toolbar = useMemo(
    () => (
      <CustomToolbar
        onClickCancel={cancelTagHandler}
        saveButtonLabel={translate("create")}
        onClickSubmit={() => setTouchField(true)}
      />
    ),
    [],
  );
  /**
   * @function RelationTitleView relation create view component
   * @returns {React.createElement} returns relation create view
   */
  const RelationView = useMemo(
    () => (
      <>
        <SimpleForm initialValues={relationData} save={updateFormData} toolbar={Toolbar}>
          <Grid className={classes.containerMarginTop}>
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={4}>
                <Typography variant="caption">{translate("party_to")}</Typography>
                <Typography variant="subtitle2">{partyName}</Typography>
              </Grid>
              <Grid item xs={4}>
                <AutocompleteInput
                  source="inTheRoleOfPartyTo"
                  choices={toRolesData.toRole}
                  validate={required(translate("mandatory_field_message"))}
                  helperText={false}
                  label={translate("in_the_role_of")}
                  fullWidth
                />
                {CustomHelperText(toRolesData)}
              </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={4}>
              <Grid item direction="column" xs={4}>
                <AutocompleteInput
                  source="isA"
                  choices={relationType}
                  validate={required(translate("mandatory_field_message"))}
                  label={translate("is_A")}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid alignItems="center" container className={classes.customMargin} spacing={4}>
              <Grid item xs={4} className={fromRolesData?.fromRole.length !== 0 ? partyClasses.gridMargin : null}>
                <Autocomplete
                  value={party}
                  getOptionLabel={(option) => `${option.id} ${option.partyName}`}
                  data-at-id="fromThePartyId"
                  onInputChange={onAutoCompleteInputChange}
                  disableClearable
                  freeSolo
                  onChange={onFromPartyChange}
                  renderOption={(option) => <>{`${option.id} ${option.partyName}`}</>}
                  options={partyList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onBlur={() => setTouchField(true)}
                      helperText={touchField && party === null ? translate("mandatory_field_message") : ""}
                      error={touchField && party === null}
                      label={translate("from_party_id")}
                      required
                      FormHelperTextProps={{
                        className: classes.helperTextAlign,
                      }}
                      margin="dense"
                    />
                  )}
                />
              </Grid>
              <Grid item direction="column" xs={4}>
                <AutocompleteInput
                  source="inTheRoleOfFromTheParty"
                  choices={fromRolesData?.fromRole}
                  helperText={false}
                  validate={required(translate("mandatory_field_message"))}
                  label={translate("in_the_role_of")}
                  fullWidth
                />
                {fromRolesData?.fromRole.length !== 0 && CustomHelperText(fromRolesData)}
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <DateTimeInput
                  source="fromDate"
                  label={translate("from_date")}
                  onChange={handleDate}
                  className={classes.customDateTimeInput}
                  validate={required(translate("mandatory_field_message"))}
                />
              </Grid>
              <Grid item xs={4}>
                <DateTimeInput
                  source="toDate"
                  label={translate("to_date")}
                  onChange={handleDate}
                  className={classes.customDateTimeInput}
                  validate={toDateValidation}
                />
              </Grid>
            </Grid>
          </Grid>
        </SimpleForm>
      </>
    ),
    [toRolesData, relationType, fromRolesData, partyList, party, touchField, relationData],
  );
  return (
    <>
      {RelationTitleView}
      {RelationView}
    </>
  );
};
PartyRelationCreateUI.propTypes = {
  ...partyRelationCreatePropType,
};

export default PartyRelationCreateUI;
