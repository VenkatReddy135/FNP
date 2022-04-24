/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import {
  useTranslate,
  SimpleForm,
  AutocompleteInput,
  required,
  SimpleShowLayout,
  useMutation,
  useNotify,
} from "react-admin";
import { Typography, Grid, Divider, IconButton, TextField, FormHelperText, makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../../assets/theme/common";
import CustomToolbar from "../../../../components/CustomToolbar";
import formatDateValue, { fetchDateString } from "../../../../utils/formatDateTime";
import viewEditRelationPropType from "./ViewEditRelationPropType";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks/HelperFunctions";
import DateTimeInput from "../../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../../components/Breadcrumbs";
/**
 * required styles for the ViewEditRelationshipUI component
 */
const partyStyles = makeStyles({
  partyToStyle: { marginTop: "-32px", marginLeft: "9px" },
  gridMargin: {
    marginTop: "-40px",
    marginLeft: "5px",
  },
});

/**
 * Component to view/edit a party relationship
 *
 *@returns {React.createElement} returns view-edit relation form
 * @param {object} props all the props required by Relationship view edit  component
 */
const ViewEditRelationshipUI = (props) => {
  const {
    isEditable,
    responseData,
    cancelHandler,
    showPopup,
    formUpdateData,
    switchToEditHandler,
    handlePartyChange,
    handleDate,
    partyToRoles,
    relationTypes,
    fromPartyRoles,
    editRelationObj,
  } = props;
  const { partyId } = useParams();
  const classes = useStyles();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const partyClasses = partyStyles();
  const notify = useNotify();
  const [partyList, setPartyList] = useState([]);
  const [party, setParty] = useState({ id: responseData.fromThePartyId, partyName: responseData.ofPartyName });
  const [touchedField, setTouchedField] = useState(false);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${partyId}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${partyId}/show/relations`,
    },
    { displayName: translate("relationship_create_title") },
  ];
  /**
   *@function toDateValidation to validate the toDate field
   * @param {Date} value date value to be validated
   * @returns {(string | undefined)} returns string or undefined
   */
  const toDateValidation = (value) => {
    return value && fetchDateString(new Date(value)) <= fetchDateString(new Date(editRelationObj.fromDate))
      ? translate("to_date_validation_message")
      : undefined;
  };
  /**
   * @function handleSuccess This function will handle success of the mutation
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    setPartyList([...res.data.data]);
  };
  /**
   * @function handleInputChange function that updates the changed value of selected base category url dropdown
   * @param {string} newValue value key
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
   * @function handlerFromPartyChange function to change the party id
   * @param {Event} event object value
   * @param {string} newVal value entered in the field
   * @param {string} reason user input reason
   */
  const handlerFromPartyChange = (event, newVal, reason) => {
    if (isEditable && reason === "input") {
      handleChange(newVal);
      handlePartyChange(null);
      setParty(null);
    } else if (party) {
      handleChange(party.id);
    }
  };
  /**
   * @function updateFromPartyVal function called on  fromParty change
   * @param {Event} event object value
   * @param {string} newValue value selected
   */
  const updateFromPartyVal = (event, newValue) => {
    if (newValue) {
      handlePartyChange(newValue);
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
        onClickCancel={cancelHandler}
        saveButtonLabel={translate("update")}
        onClickSubmit={() => setTouchedField(true)}
      />
    ),
    [],
  );
  /**
   * @function RelationTitleView relation edit view component
   * @returns {React.createElement} returns relation edit view
   */
  const RelationView = useMemo(
    () => (
      <SimpleShowLayout component="div">
        <SimpleForm initialValues={editRelationObj} save={formUpdateData} toolbar={isEditable ? Toolbar : null}>
          <Grid className={classes.containerMarginTop}>
            <Grid container direction="row">
              {isEditable ? null : (
                <Grid container justify="flex-end">
                  <Grid item>
                    <IconButton onClick={switchToEditHandler}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => showPopup("Delete")}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Grid container alignItems="center" spacing={8}>
                <Grid item className={isEditable ? partyClasses.partyToStyle : classes.gridMarginStyle} xs={4}>
                  <Typography variant="caption">{translate("party_to")}</Typography>
                  <Typography variant="subtitle2">{responseData.partyName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <AutocompleteInput
                    source="inTheRoleOfPartyTo"
                    choices={partyToRoles.toRole}
                    helperText={false}
                    validate={required(translate("mandatory_field_message"))}
                    data-at-id="inTheRoleOf"
                    label={translate("in_the_role_of")}
                    fullWidth
                    className={classes.disabled}
                    disabled={!isEditable}
                  />
                  {isEditable && partyToRoles?.toRole.length !== 0 && CustomHelperText(partyToRoles)}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              <Grid item direction="column" xs={4}>
                <AutocompleteInput
                  source="isA"
                  choices={relationTypes}
                  data-at-id="isAId"
                  validate={required(translate("mandatory_field_message"))}
                  label={translate("is_A")}
                  fullWidth
                  className={classes.disabled}
                  disabled={!isEditable}
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="center" className={isEditable ? classes.customMargin : null}>
              <Grid
                item
                className={
                  isEditable && fromPartyRoles?.fromRole.length !== 0
                    ? partyClasses.gridMargin
                    : classes.gridMarginStyle
                }
                xs={4}
              >
                <Autocomplete
                  value={party}
                  getOptionLabel={(option) => `${option.id} ${option.partyName}`}
                  data-at-id="fromThePartyId"
                  onInputChange={(event, newVal, reason) => {
                    handlerFromPartyChange(event, newVal, reason);
                  }}
                  className={classes.disabled}
                  disableClearable
                  disabled={!isEditable}
                  freeSolo
                  onChange={(event, newValue) => {
                    updateFromPartyVal(event, newValue);
                  }}
                  renderOption={(option) => <>{`${option.id} ${option.partyName}`}</>}
                  options={partyList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      FormHelperTextProps={{
                        className: classes.helperTextAlign,
                      }}
                      onBlur={() => setTouchedField(true)}
                      helperText={touchedField && party === null ? translate("mandatory_field_message") : ""}
                      error={touchedField && party === null}
                      label={translate("from_party_id")}
                      margin="dense"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <AutocompleteInput
                  source="inTheRoleOfFromTheParty"
                  choices={fromPartyRoles.fromRole}
                  helperText={false}
                  data-at-id="inTheRoleOfFromTheParty"
                  validate={required(translate("mandatory_field_message"))}
                  label={translate("in_the_role_of")}
                  fullWidth
                  className={classes.disabled}
                  disabled={!isEditable}
                />
                {isEditable && fromPartyRoles?.fromRole.length !== 0 && CustomHelperText(fromPartyRoles)}
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="center">
              {isEditable ? (
                <Grid item xs={4}>
                  <DateTimeInput
                    source="fromDate"
                    label={translate("from_date")}
                    data-at-id="fromDate"
                    className={classes.customDateTimeInput}
                    validate={required(translate("mandatory_field_message"))}
                    onChange={handleDate}
                  />
                </Grid>
              ) : (
                <Grid item xs={4} className={classes.gridMarginStyle}>
                  <Typography variant="caption">{translate("from_date")}</Typography>
                  <Typography variant="subtitle2">{formatDateValue(responseData.fromDate)}</Typography>
                </Grid>
              )}
              {isEditable ? (
                <Grid item xs={4}>
                  <DateTimeInput
                    source="toDate"
                    validate={toDateValidation}
                    label={translate("to_date")}
                    className={classes.customDateTimeInput}
                    data-at-id="toDate"
                    onChange={handleDate}
                  />
                </Grid>
              ) : (
                <Grid item xs={4} className={classes.helperTextAlign}>
                  <Typography variant="caption">{translate("to_date")}</Typography>
                  <Typography variant="subtitle2">{formatDateValue(responseData.toDate)}</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </SimpleForm>
      </SimpleShowLayout>
    ),
    [fromPartyRoles, partyList, party, editRelationObj, partyToRoles, relationTypes, touchedField],
  );
  return (
    <>
      {RelationTitleView}
      {RelationView}
    </>
  );
};

ViewEditRelationshipUI.propTypes = {
  ...viewEditRelationPropType,
};

export default ViewEditRelationshipUI;
