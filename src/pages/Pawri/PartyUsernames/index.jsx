/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import SimpleGrid from "../../../components/SimpleGrid";
import useStyles from "../../../assets/theme/common";

/**
 * @function PartyUsernames to the list of usernames
 * @param {object} props is passed contains party id
 * @returns {React.ReactElement} returns party usernames list
 */
const PartyUsernames = (props) => {
  const { id } = props;
  const history = useHistory();
  const translate = useTranslate();
  const classes = useStyles();
  localStorage.setItem("partyId", JSON.stringify(id));
  /**
   * @function createHandler will redirect to create new username page
   * @param {string} event event contains required details to redirect
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_SIMSIM_SERVICE}/logins/usernames/${id}/create`,
    });
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: translate("edit"),
      leftIcon: <EditIcon />,
      path: "",
      routeType: `/partyId=${id}`,
      isEditable: true,
    },
    {
      id: "2",
      type: translate("assign_security_group"),
      leftIcon: <SwapHorizIcon />,
      path: "",
      routeType: "/securitygroups",
      isEditable: true,
    },
    {
      id: "3",
      type: translate("permissions"),
      leftIcon: <LockOpenIcon />,
      path: "",
      routeType: "/permissions",
      isEditable: true,
    },
  ];

  const configurationForUsernamesGrid = [
    {
      source: "loginName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("party_login_names"),
      tabPath: "",
      sortable: true,
      isLink: false,
    },
    {
      source: "status",
      type: "StatusField",
      label: translate("party_id_status"),
      displayStatusText: {
        trueText: translate("active"),
        falseText: translate("inactive"),
      },
      sortable: true,
    },
  ];

  const actionButtonsForUsernamesGrid = [
    {
      type: "CreateButton",
      label: translate("new_username"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const actionButtonsForEmptyUsernamesGrid = [
    {
      type: "CreateButton",
      label: translate("new_username"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];
  return (
    <>
      <div className={classes.listStyle}>
        <SimpleGrid
          {...props}
          resource={`${window.REACT_APP_SIMSIM_SERVICE}/logins`}
          actionButtonsForGrid={actionButtonsForUsernamesGrid}
          actionButtonsForEmptyGrid={actionButtonsForEmptyUsernamesGrid}
          configurationForGrid={configurationForUsernamesGrid}
          isSearchEnabled={false}
          gridTitle=""
          searchLabel=""
          filter={{ partyId: id }}
          sortField={{ field: "loginName", order: "ASC" }}
        />
      </div>
    </>
  );
};

PartyUsernames.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PartyUsernames;
