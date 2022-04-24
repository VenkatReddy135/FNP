/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTranslate, useRefresh, useMutation, useNotify } from "react-admin";
import { useHistory, useParams } from "react-router-dom";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import SimpleGrid from "../../../../components/SimpleGrid";
import SimpleModel from "../../../../components/CreateModal";
import useStyles from "../../../../assets/theme/common";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";
/**
 * @function SecurityGroupList component for the list of security groups assigned to party login
 * @param {object} props is passed
 * @returns {React.ReactElement} returns list
 */
const SecurityGroupList = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const [open, toggleModal] = useState(false);
  const [securityGroupId, setSecurityGroupId] = useState();

  const partyId = JSON.parse(localStorage.getItem("partyId"));

  /**
   * @function createHandler will redirect to assign security group page
   * @param {string} event contains required details to redirect
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_SIMSIM_SERVICE}/logins/securitygroups/${id}/create`,
    });
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response contains message
   */
  const handleUpdateSuccess = (response) => {
    notify(response.data.message || translate("delete_security_group_notification", "info", TIMEOUT));
    refresh();
  };

  /**
   * @function deassociateHandler to deassociate list
   */
  const deassociateHandler = async () => {
    toggleModal(false);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_SIMSIM_SERVICE}/logins/${id}/securitygroups/${securityGroupId}`,
        payload: {},
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
   * @function deleteHandler to set permission Id  and toggle the dialog
   * @param {string} record contains permission id
   */
  const deleteHandler = (record) => {
    setSecurityGroupId(record);
    toggleModal(true);
  };

  const dialogContent = (
    <Grid className={classes.centerAlignContainer}>
      <DeleteIcon className={classes.deleteIconStyle} />
      <CommonDialogContent message={translate("delete_security_group")} />
    </Grid>
  );

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "Delete",
      leftIcon: <DeleteOutlineIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationForSecurityGroupGrid = [
    {
      source: "id",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("security_group_id"),
      tabPath: "",
      isLink: false,
    },
    { source: "securityGroupCode", type: "TextField", label: translate("security_group_name") },
  ];

  const actionButtonsForSecurityGroupGrid = [
    {
      type: "CreateButton",
      label: translate("assign_user_login"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const actionButtonsForEmptySecurityGroupGrid = [
    {
      type: "CreateButton",
      label: translate("assign_user_login"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];
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
    },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_SIMSIM_SERVICE}/logins/securitygroups`}
        actionButtonsForGrid={actionButtonsForSecurityGroupGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptySecurityGroupGrid}
        configurationForGrid={configurationForSecurityGroupGrid}
        isSearchEnabled={false}
        searchLabel=""
        gridTitle={translate("assign_security_group")}
        filter={{ partyLoginId: id }}
        sortField={{ field: "securityGroupCode", order: "ASC" }}
      />
      <SimpleModel
        dialogContent={dialogContent}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("delete")}
        openModal={open}
        handleClose={() => {
          toggleModal(false);
        }}
        handleAction={deassociateHandler}
      />
    </>
  );
};

export default SecurityGroupList;
