/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { SimpleShowLayout, useTranslate } from "react-admin";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Grid, IconButton, Typography } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../assets/theme/common";
import LoaderComponent from "../../../components/LoaderComponent";
import { formatDate } from "../../../utils/formatDateTime";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import { INDIVIDUAL, ORGANIZATION } from "../PartyCreate/CreatePartyConstants";

/**
 * Component for Party Personal information
 *
 * @param {object} props required for this Personal Info page
 * @returns {React.ReactElement} returns component for party personal information
 */
const PartyPersonalInfo = (props) => {
  const classes = useStyles();
  const [editMode, setEditable] = useState(false);
  const { id, partyType } = props;
  const [data, setData] = useState();
  const history = useHistory();
  const translate = useTranslate();

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res API response
   */
  const handleSetDataSuccess = (res) => {
    setData(res.data);
  };

  const resource =
    partyType === INDIVIDUAL
      ? `${window.REACT_APP_PARTY_SERVICE}/party-individuals/${id}`
      : `${window.REACT_APP_PARTY_SERVICE}/party-organizations/${id}`;

  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  /**
   * @function editHandler will navigate to edit page
   */
  const editHandler = () => {
    setEditable(true);
    history.push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/${id}/personalinfo/edit/${partyType}`,
    });
  };

  const {
    name,
    gender,
    dateOfBirth,
    dateOfAnniversary,
    designation,
    contactPersonName,
    taxNumber,
    faxNumber,
    organizationName,
  } = data || {};
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleShowLayout {...props}>
          {partyType === INDIVIDUAL && (
            <>
              <Grid container direction="row" className={classes.customMargin}>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("personalInfo_name")}</Typography>
                  <Typography variant="subtitle2">{name}</Typography>
                </Grid>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("gender")}</Typography>
                  <Typography variant="subtitle2">{gender}</Typography>
                </Grid>
                {!editMode && (
                  <IconButton className={classes.buttonAlignment}>
                    <EditOutlinedIcon onClick={editHandler} />
                  </IconButton>
                )}
              </Grid>
              <Grid item container direction="row">
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("date_of_birth")}</Typography>
                  <Typography variant="subtitle2">{dateOfBirth ? formatDate(dateOfBirth) : null}</Typography>
                </Grid>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("date_of_anniversary")}</Typography>
                  <Typography variant="subtitle2">
                    {dateOfAnniversary ? formatDate(dateOfAnniversary) : null}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
          {partyType === ORGANIZATION && (
            <>
              <Grid container direction="row">
                <Typography variant="subtitle1">{translate("orgInfo")}</Typography>
                {!editMode && (
                  <IconButton className={classes.buttonAlignment}>
                    <EditOutlinedIcon onClick={editHandler} />
                  </IconButton>
                )}
              </Grid>
              <Grid item container direction="row">
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("contactPerson")}</Typography>
                  <Typography variant="subtitle2">{contactPersonName}</Typography>
                </Grid>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("designation")}</Typography>
                  <Typography variant="subtitle2">{designation}</Typography>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Typography variant="subtitle1">{translate("business_information")}</Typography>
              </Grid>
              <Grid item container direction="row" className={classes.customMargin}>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("orgName")}</Typography>
                  <Typography variant="subtitle2">{organizationName}</Typography>
                </Grid>
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("tax_vat_number")}</Typography>
                  <Typography variant="subtitle2">{taxNumber}</Typography>
                </Grid>
              </Grid>
              <Grid item container direction="row">
                <Grid item container direction="column" md={3}>
                  <Typography variant="caption">{translate("fax_number")}</Typography>
                  <Typography variant="subtitle2">{faxNumber}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </SimpleShowLayout>
      )}
    </>
  );
};

PartyPersonalInfo.propTypes = {
  id: PropTypes.string.isRequired,
  partyType: PropTypes.string.isRequired,
};

export default PartyPersonalInfo;
