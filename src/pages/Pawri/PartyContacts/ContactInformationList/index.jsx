/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { useHistory } from "react-router-dom";
import { useTranslate } from "react-admin";
import CreateIcon from "@material-ui/icons/Create";
import SimpleGrid from "../../../../components/SimpleGrid";
import useStyles from "../../../../assets/theme/common";
import CustomFilters from "../../../../components/CustomFiltersForGrid";
import { useCustomQuery } from "../../../../utils/CustomHooks";

/**
 * Component for Contact Information List contains a simple grid with list of Party Contacts
 *
 * @param {object} props all the props needed for Party Contact Information list
 * @returns {React.ReactElement} returns a Party Contact Information List component
 */
const ContactList = (props) => {
  const classes = useStyles();
  const { match } = props;
  const { push } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);
  const [contactTypesList, setContactTypes] = useState([]);

  const configurationForKebabMenu = [
    {
      id: "1",
      type: translate("view"),
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/view",
      isEditable: false,
    },
    {
      id: "2",
      type: translate("edit"),
      leftIcon: <CreateIcon />,
      path: "",
      routeType: "",
      isEditable: true,
    },
  ];

  const configurationForContactGrid = [
    {
      source: "contactType",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("contact_type"),
      sortable: true,
    },
    {
      source: "contactPurpose",
      type: "TextField",
      label: translate("contact_purpose"),
    },
    {
      source: "contactInformation",
      type: "TextField",
      field: "contacts",
      label: translate("contact_info"),
    },
    {
      source: "status",
      type: "StatusField",
      label: translate("status"),
      sortable: false,
      displayStatusText: {
        trueText: translate("active"),
        falseText: translate("inactive"),
      },
    },
    {
      source: "createdBy",
      type: "TextField",
      field: "contacts",
      label: translate("created_by"),
    },
    {
      source: "createdAt",
      type: "CustomDateField",
      label: translate("created_date"),
    },
    {
      source: "updatedBy",
      type: "TextField",
      label: translate("modified_by"),
    },
    {
      source: "updatedAt",
      type: "CustomDateField",
      label: translate("modified_date"),
    },
  ];

  /**
   * @param {string} event prop is passed to the function
   * @function expiredContacts redirects to Expired contact list
   */
  const expiredContacts = (event) => {
    event.preventDefault();
    push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/partycontacts/${match.params.id}/expired-contacts`,
    });
  };

  /**
   * @function createHandler will redirect to create new contact page
   * @param {string} event event contains required details to redirect
   */
  const createHandler = (event) => {
    event.preventDefault();
    push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/${match.params.id}/create`,
    });
  };

  const actionButtonsForContactGrid = [
    {
      type: "Button",
      label: translate("label_expired_contact"),
      icon: <></>,
      onClick: expiredContacts,
      variant: "outlined",
    },
    {
      type: "CreateButton",
      label: translate("label_new_contact"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  const actionButtonsForEmptyContactGrid = [
    {
      type: "Button",
      label: translate("label_expired_contact"),
      icon: <></>,
      onClick: expiredContacts,
      variant: "outlined",
    },
    {
      type: "CreateButton",
      label: translate("label_new_contact"),
      icon: <></>,
      variant: "outlined",
      onClick: createHandler,
    },
  ];

  /**
   * @function handleContactPurposes This function will set contact Info details of a party id
   * @param {object} response is passed to the function
   */
  const handleContactTypes = (response) => {
    const contactTypesLists = [];
    response?.data?.data?.forEach((data) => {
      contactTypesLists.push({ id: data.id, name: data.description });
    });
    setContactTypes(contactTypesLists);
  };
  const resourceForContactTypes = `${window.REACT_APP_PARTY_SERVICE}/contact-types`;
  useCustomQuery("getData", resourceForContactTypes, handleContactTypes);

  /**
   * @function handleContactPurposes This function will set contact purpose Info details of a party id
   * @param {object} response is passed to the function
   */
  const handleContactPurposes = (response) => {
    const contactPurposeValue = [];
    response?.data?.data?.forEach((data) => {
      contactPurposeValue.push({ id: data.id, name: data.description });
    });
    setContactPurposes(contactPurposeValue);
  };
  const resourceForContactPurpose = `${window.REACT_APP_PARTY_SERVICE}/contact-purposes`;
  useCustomQuery("getData", resourceForContactPurpose, handleContactPurposes);

  const filtersForGrid = [
    {
      type: "SearchInput",
      source: "q",
      alwaysOn: true,
      placeholder: translate("search"),
    },
    {
      type: "SelectInput",
      label: translate("contact_purpose"),
      source: "contactPurposeId",
      alwaysOn: false,
      choices: contactPurposes,
    },
    {
      type: "SelectInput",
      label: translate("contact_type"),
      source: "contactTypeId",
      alwaysOn: false,
      choices: contactTypesList,
    },
  ];
  return (
    <div className={classes.listStyle}>
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_PARTY_SERVICE}/partycontacts/${match.params.id}`}
        configurationForGrid={configurationForContactGrid}
        actionButtonsForGrid={actionButtonsForContactGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyContactGrid}
        searchLabel=""
        gridTitle=""
        sortField={{ field: "contactType", order: "DESC" }}
        filter={{ isContactExpired: false }}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
      />
    </div>
  );
};

ContactList.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ContactList;
