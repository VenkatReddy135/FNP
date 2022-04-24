/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import SimpleGrid from "../../../../components/SimpleGrid";
import useStyles from "../../../../assets/theme/common";
import SimpleModel from "../../../../components/CreateModal";
import CommonDialogContent from "../../../../components/CommonDialogContent";
import useRelationsShip from "../useRelationShip";

/**
 * Component for party relationship list management contains a simple grid with configurations for List of party relationships
 *
 * @param {object} props all the props needed for Party Relationship List
 * @param {string} props.id is required to get the id for Party Relationship List
 * @param {string} props.partyName is required to get the party name for Party Relationship List
 * @returns {React.ReactElement} returns a Party Relationship List component
 */
const RelationshipList = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [openDialog, toggleDialog] = useState(false);
  const [partyRelationId, setPartyRelationId] = useState();
  const deleteRelationship = useRelationsShip();
  const { id, partyName } = props;
  const history = useHistory();

  /**
   * @param {string} record id of the relation
   * @function deleteHandler function invoked on the click of delete option from kebab menu
   */
  const deleteHandler = (record) => {
    setPartyRelationId(record);
    toggleDialog(true);
  };
  /**
   * @function DialogContent  Dialog component
   * @returns {React.createElement} returns Dialog component
   */
  const DialogContent = useMemo(
    () => (
      <Grid className={classes.centerAlignContainer}>
        <DeleteIcon className={classes.deleteIconStyle} />
        <CommonDialogContent message={translate("delete_relationship")} />
      </Grid>
    ),
    [],
  );
  /**
   * @function deactivateHandler function invoked on delete pop up confirmation
   */
  const deactivateHandler = () => {
    deleteRelationship(partyRelationId, false);
    toggleDialog(false);
  };
  /**
   * @function createHandler used to redirect user to create relation page
   *
   * @param {Event} event to be used for preventDefault
   */
  const createHandler = (event) => {
    event.preventDefault();
    history.push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/relations/${id}/create/${partyName}`,
    });
  };
  const configurationForKebabMenu = [
    {
      id: "1",
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: `/partyId=${id}/show`,
      isEditable: false,
    },
    {
      id: "2",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: `/partyId=${id}`,
      isEditable: true,
    },
    {
      id: "3",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteHandler,
    },
  ];
  const configurationsForRelationGrid = [
    {
      source: "partyName",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("party_name"),
      isLink: true,
      tabPath: `/partyId=${id}/show`,
    },
    {
      source: "inTheRoleOfPartyTo",
      type: "TextField",
      label: translate("in_the_role_of"),
    },
    {
      source: "isA",
      type: "TextField",
      label: translate("is_A"),
    },
    {
      source: "fromThePartyId",
      type: "TextField",
      label: translate("party_id"),
    },
    {
      source: "ofPartyName",
      type: "TextField",
      label: translate("of_party"),
    },
    {
      source: "inTheRoleOfFromTheParty",
      type: "TextField",
      label: translate("in_the_role_of"),
    },
    {
      source: "fromDate",
      type: "CustomDateField",
      label: translate("from_date"),
    },
    {
      source: "toDate",
      type: "CustomDateField",
      label: translate("to_date"),
    },
  ];

  const actionButtonsForRelationsGrid = [
    {
      type: "CreateButton",
      label: translate("create_new_relationship"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];
  const actionButtonsForEmptyRelationsGrid = [
    {
      type: "CreateButton",
      label: translate("create_new_relationship"),
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
          resource={`${window.REACT_APP_PARTY_SERVICE}/parties/relations`}
          configurationForGrid={configurationsForRelationGrid}
          actionButtonsForGrid={actionButtonsForRelationsGrid}
          actionButtonsForEmptyGrid={actionButtonsForEmptyRelationsGrid}
          gridTitle=""
          isSearchEnabled={false}
          sortField={{ field: "partyName", order: "DESC" }}
          filter={{ partyId: id }}
          searchLabel=""
        />
      </div>
      <SimpleModel
        dialogContent={DialogContent}
        showButtons
        dialogTitle=""
        closeText={translate("cancel")}
        actionText={translate("delete")}
        openModal={openDialog}
        handleClose={() => {
          toggleDialog(false);
        }}
        handleAction={deactivateHandler}
      />
    </>
  );
};

RelationshipList.propTypes = {
  id: PropTypes.string.isRequired,
  partyName: PropTypes.string.isRequired,
};

export default RelationshipList;
