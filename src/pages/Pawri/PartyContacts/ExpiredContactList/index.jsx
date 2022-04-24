/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import { useHistory, useParams } from "react-router-dom";
import { useTranslate } from "react-admin";
import SimpleGrid from "../../../../components/SimpleGrid";
import CustomFilters from "../../../../components/CustomFiltersForGrid";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { useCustomQuery } from "../../../../utils/CustomHooks";

/**
 * Component for Contact Information List contains a simple grid with list of Party Contacts
 *
 * @param {object} props all the props needed for Party Contact Information list
 * @returns {React.ReactElement} returns a Party Contact Information List component
 */
const ExpiredContactList = (props) => {
  const { id } = useParams();
  const { push } = useHistory();
  const translate = useTranslate();
  const [contactPurposes, setContactPurposes] = useState([]);
  const [contactTypesList, setContactTypes] = useState([]);

  const breadcrumbs = [
    {
      displayName: translate("party_management"),
      navigateTo: `/parties/search`,
    },
    {
      displayName: `${id}`,
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/contact-info`,
    },
    {
      displayName: translate("contact_info"),
      navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/contact-info`,
    },
    { displayName: translate("label_expired_contact") },
  ];
  const configurationForKebabMenu = [
    {
      id: "1",
      type: translate("view"),
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/show",
      isEditable: false,
    },
  ];

  const configurationForContactGrid = [
    {
      source: "contactType",
      type: "KebabMenuWithLink",
      configurationForKebabMenu,
      label: translate("contact_type"),
      tabPath: "/show",
      sortable: true,
    },
    {
      source: "contactPurpose",
      type: "TextField",
      label: translate("contact_purpose"),
      sortable: true,
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
        falseText: translate("expired"),
      },
    },
  ];

  /**
   * @function  contactInfoHandler redirects to list of contacts
   */
  const contactInfoHandler = () => {
    push({
      pathname: `/${window.REACT_APP_PARTY_SERVICE}/parties/search/${id}/show/contact-info`,
    });
  };

  const actionButtonsForContactGrid = [
    {
      type: "Button",
      label: "Contact Information",
      icon: <></>,
      onClick: contactInfoHandler,
      variant: "outlined",
    },
  ];

  const actionButtonsForEmptyContactGrid = [
    {
      type: "Button",
      label: "Contact Information",
      icon: <></>,
      onClick: contactInfoHandler,
      variant: "outlined",
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
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleGrid
        {...props}
        resource={`${window.REACT_APP_PARTY_SERVICE}/partycontacts/${id}`}
        configurationForGrid={configurationForContactGrid}
        actionButtonsForGrid={actionButtonsForContactGrid}
        actionButtonsForEmptyGrid={actionButtonsForEmptyContactGrid}
        searchLabel={translate("search")}
        gridTitle={translate("label_expired_contact")}
        sortField={{ field: "contactType", order: "DESC" }}
        filter={{ isContactExpired: true }}
        filters={<CustomFilters {...props} filtersForGrid={filtersForGrid} />}
        showAddFilterButton
      />
    </>
  );
};

export default ExpiredContactList;
