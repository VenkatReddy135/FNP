/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { SimpleShowLayout, useTranslate } from "react-admin";
import { Grid, IconButton, Typography, Chip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import LoaderComponent from "../../../components/LoaderComponent";
import useStyles from "../../../assets/theme/common";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";
import FilterRoles from "./PartyRolesCommon";

/**
 * @param {object} props id and partyTypeId required for component
 * @returns {React.ReactElement} returns PartyRoles view
 */
const PartyRoles = (props) => {
  const { id, partyTypeId } = props;
  const [data, setData] = useState({ primary: { roleId: "", roleName: "", primary: true }, other: [] });
  const partyClasses = useStyles();
  const history = useHistory();
  const translate = useTranslate();

  /**
   * useEffect is used to set  state data empty when component is unmounted
   */
  useEffect(() => {
    return () => setData();
  }, []);
  /**
   * @function handleRolesData This function will set roles data
   * @param {object} res is passed to the function
   * @returns {Array} object of object and array
   */
  const handleRolesData = (res) => {
    const filteredRoles = FilterRoles(res?.data?.data);
    return setData((prevState) => ({ ...prevState, primary: filteredRoles.primary, other: [...filteredRoles.other] }));
  };

  const resourceForRolesData = `${window.REACT_APP_SIMSIM_SERVICE}/party-roles/${id}`;
  const { loading } = useCustomQueryWithStore("getData", resourceForRolesData, handleRolesData);

  /**
   * @function  editHandler redirects to the edit page
   */
  const editHandler = () => {
    history.push({
      pathname: `/${window.REACT_APP_SIMSIM_SERVICE}/partyroles/${id}/role/edit/${partyTypeId}`,
    });
  };
  const { roleName } = data?.primary || " ";
  const { other } = data || [];
  /**
   *
   * @returns {React.Component} return component
   */
  const PartyRoleView = useMemo(
    () => (
      <SimpleShowLayout toolbar={null}>
        <>
          <Grid container direction="row" spacing={5} className={partyClasses.customMargin} justify="space-between">
            <Grid item>
              <Typography variant="caption">{translate("primary_role")}</Typography>
              <Typography variant="subtitle2">{roleName}</Typography>
            </Grid>
            <Grid item>
              <IconButton className={partyClasses.buttonAlignment} onClick={editHandler}>
                <EditOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item container direction="column">
              <Typography variant="caption">{translate("other_roles")}</Typography>
              <Typography variant="subtitle2">
                {other.map((role) => (
                  <Chip key={role.roleName} label={role.roleName} className={partyClasses.chipMargin} />
                ))}
              </Typography>
            </Grid>
          </Grid>
        </>
      </SimpleShowLayout>
    ),
    [roleName, other],
  );
  return loading ? <LoaderComponent /> : <Grid>{PartyRoleView}</Grid>;
};
PartyRoles.propTypes = {
  id: PropTypes.string.isRequired,
  partyTypeId: PropTypes.string.isRequired,
};

export default PartyRoles;
