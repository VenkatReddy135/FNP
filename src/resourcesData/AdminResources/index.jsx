/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  CategoryList,
  CategoryRelation,
  RedirectSearchList,
  RedirectSearchCreate,
  RedirectSearchEdit,
  PartyList,
  CampaignList,
  PublisherList,
  RelationshipList,
  ContactList,
  ExpiredContactList,
  PartyUsernames,
  ViewChangeHistory,
  CampaignCreate,
  CampaignEdit,
  AddPublisher,
  PublisherEdit,
  CampaignChangeHistory,
  CategoryProducts,
  PLPFilterList,
  TagRelationList,
  AttributesList,
  DomainSettingsList,
  PaymentGroupList,
  PaymentOptionsList,
  BasePriceList,
  BasePriceCreate,
  BasePriceView,
  BasePriceEdit,
} from "../../imports/imports";
import { ENVIRONMENT, MODULE_DICTIONARY } from "../../config/GlobalConfig";

/**
 * Function to resource object according to the fetched resource name from url.
 *
 * @function AdminResources
 * @returns {React.ReactElement} react-admin resource.
 */
const AdminResources = () => {
  const [resourceToBeLoaded, setResourceToBeLoaded] = useState("");
  const location = useLocation();
  const resourceName = location.hash.split("?")[0];
  let id = "";
  const tagId = location.hash.split("/")[4];

  // regex is modified for alphanumeric id i.e P_0001 and numeric id i.e 0001. It will be modifiable in future as per need and discussion.
  if (resourceName.match(/[A-Z\d+_]{2,}/g)) {
    const dynamicId = resourceName && resourceName.match(/[A-Z\d+_]{2,}/g).join("");
    id = dynamicId;
  }
  if (resourceName.includes("beautyplus/")) {
    // eslint-disable-next-line prefer-destructuring
    id = resourceName.split("/")[5];
  }

  const history = useHistory();

  const megaMenuResource = location.hash.split("#")[1]?.toLowerCase();
  useEffect(() => {
    if (megaMenuResource && megaMenuResource !== "/")
      if (ENVIRONMENT[window.REACT_APP_ENVIRONMENT?.toLowerCase()]) {
        if (!MODULE_DICTIONARY.find((item) => megaMenuResource?.includes(item))) {
          history.push("/");
        }
      }
  }, [megaMenuResource]);

  useEffect(() => {
    const obj = {
      "#/galleria/v1/categories": {
        name: "galleria/v1/categories",
        list: CategoryList,
      },
      "#/kitchen/v1/campaigns": {
        name: "kitchen/v1/campaigns",
        list: CampaignList,
        create: CampaignCreate,
        edit: CampaignEdit,
      },
      "#/pawri/v1/publishers": {
        name: "pawri/v1/publishers",
        list: PublisherList,
        create: AddPublisher,
        edit: PublisherEdit,
      },
      "#/kitchen/v1/campaigns/statuses/": {
        name: "kitchen/v1/campaigns/statuses",
      },
      [`#/kitchen/v1/campaigns/${id}/history`]: {
        name: `kitchen/v1/campaigns/history/${id}`,
        list: CampaignChangeHistory,
      },
      [`#/galleria/v1/categories/${id}/show/relationship`]: {
        name: "galleria/v1/categories/associations",
        list: CategoryRelation,
      },
      [`#/galleria/v1/categories/${id}/show/attributes`]: {
        name: `galleria/v1/categories/${id}/attributes`,
      },
      [`#/galleria/v1/tags/${tagId}/show/relations`]: {
        name: `galleria/v1/tags/${tagId}/relations`,
        list: TagRelationList,
      },
      [`#/galleria/v1/tags/${tagId}/history`]: {
        name: `galleria/v1/tags/history`,
      },
      [`#/gems/v1/products/${id}/show/attributes`]: {
        name: `gems/v1/products/attributes`,
        list: AttributesList,
      },
      [`#/pawri/v1/parties/search/${id}/show/usernames`]: {
        name: `simsim/v1/logins`,
        list: PartyUsernames,
      },
      [`#/simsim/v1/logins/${id}/securitygroups`]: {
        name: "simsim/v1/logins/securitygroups",
      },
      [`#/simsim/v1/logins/${id}/permissions`]: {
        name: `simsim/v1/logins/permissions/${id}`,
      },
      "#/pawri/v1/parties/search": {
        name: "pawri/v1/parties/search",
        list: PartyList,
      },
      [`#/pawri/v1/parties/search/${id}/show/relations`]: {
        name: "pawri/v1/parties/relations",
        list: RelationshipList,
      },
      [`#/galleria/v1/categories/${id}/history`]: {
        name: `galleria/v1/categories/history`,
      },
      [`#/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/${id}/history`]: {
        name: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/history`,
      },
      [`#/pawri/v1/parties/search/${id}/show/contact-info`]: {
        name: `pawri/v1/partycontacts/${id}`,
        list: ContactList,
      },
      [`#/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaign`]: {
        name: `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaign`,
      },
      [`#/pawri/v1/partycontacts/${id}/expired-contacts`]: {
        name: `pawri/v1/partycontacts/${id}`,
        list: ExpiredContactList,
      },
      [`#/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`]: {
        name: `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`,
        list: RedirectSearchList,
        create: RedirectSearchCreate,
        edit: RedirectSearchEdit,
      },
      "#/kitchen/v1/campaigns/history": {
        name: "kitchen/v1/campaigns/history",
        list: ViewChangeHistory,
      },
      [`#/${window.REACT_APP_NIFTY_SERVICE}/base-price-model`]: {
        name: `${window.REACT_APP_NIFTY_SERVICE}/base-price-model`,
        list: BasePriceList,
        create: BasePriceCreate,
        show: BasePriceView,
        edit: BasePriceEdit,
      },
      [`#/galleria/v1/categories/${id}/show/products`]: {
        name: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products`,
        list: CategoryProducts,
      },
      [`#/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`]: {
        name: `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`,
        list: PLPFilterList,
      },
      [`#/gems/v1/products/${id}/show/composition`]: {
        name: `gems/v1/products/compositions`,
      },

      [`#/gems/v1/products/${id}/show/features`]: {
        name: `gems/v1/products/features`,
      },
      [`#/gems/v1/products/${id}/show/personalizations`]: {
        name: `gems/v1/products/personalizations`,
      },
      [`#/gems/v1/products/${id}/show/tags`]: {
        name: `gems/v1/products/tags`,
      },
      "#/gucci/v1/addresstemplate": {
        name: "galleria/v1/categories",
      },
      "#/gucci/v1/payment/options": {
        name: "pawri/v1/parties/search",
        list: PaymentOptionsList,
      },
      "#/gucci/v1/payment": {
        name: "galleria/v1/categories",
        list: DomainSettingsList,
      },
      "#/gucci/v1/payment/group": {
        name: "galleria/v1/categories",
        list: PaymentGroupList,
      },
      "#/gucci/v1/payment/providers": {
        name: "galleria/v1/categories",
      },
    };
    if (obj[resourceName]) {
      setResourceToBeLoaded(obj[resourceName]);
    }
  }, [resourceName, id, tagId]);

  return resourceToBeLoaded;
};

export default AdminResources;
