import { useTranslate } from "react-admin";
import { useMemo } from "react";

const sideBarMenuItems = [
  {
    title: "GALLERIA",
    route: `/galleria/v1/categories`,
    image: "homeIcon",
    id: 1,
  },
  {
    title: "Redirect",
    route: "/columbus/v1/configurations/redirect-campaigns",
    image: "domainIcon",
    id: 2,
  },
  {
    title: "PARTY",
    route: "/parties/search",
    image: "domainIcon",
    id: 3,
  },
  {
    title: "CONFIGURATIONS",
    route: "/beautyplus/v1/securitysetting",
    image: "configIcon",
    id: 4,
  },
  {
    title: "Indexable Attribute",
    route: "/columbus/indexable-attributes",
    image: "domainIcon",
    id: 5,
  },
  {
    title: "Image Search",
    route: "/columbus/image-search",
    image: "domainIcon",
    id: 6,
  },
  {
    title: "Voice Search",
    route: "/columbus/voice-search",
    image: "domainIcon",
    id: 7,
  },
  {
    title: "ORDER",
    route: "/order",
    image: "domainIcon",
    id: 8,
  },
  {
    title: "Feed Management",
    route: "/kitchen/v1/campaigns",
    image: "kitchenIcon",
    id: 9,
  },
  {
    title: "Publisher Manager",
    route: "/pawri/v1/publishers",
    image: "kitchenIcon",
    id: 10,
  },
  {
    title: "PLP Filter",
    route: "/columbus/v1/productfilterconfigs",
    image: "domainIcon",
    id: 11,
  },
  {
    title: "Moody",
    route: "/moody/v1/moderation/reviews",
    image: "rateReview",
    id: 12,
  },
  {
    title: "Tag Management",
    route: "/galleria/v1/tags",
    image: "rateReview",
    id: 13,
  },
  {
    title: "Product Management",
    route: "/gems/v1/productsearch",
    image: "domainIcon",
    id: 14,
  },
  {
    title: "Promotions",
    translationKey: "promotion_title",
    route: "/minecraft/v1/promotions",
    image: "domainIcon",
    id: 15,
  },
  {
    title: "Free Message Card",
    route: "/beautyplus/v1/sites/messages",
    image: "domainIcon",
    id: 16,
  },
  {
    title: "Address Template",
    route: "/gucci/v1/address-template",
    image: "domainIcon",
    id: 17,
  },
  {
    title: "Payment",
    route: "/gucci/v1/payment-config",
    image: "domainIcon",
    id: 18,
  },
  {
    title: "Hendrix (Allocation Manager)",
    route: "/hendrix/v1/allocationmanager",
    image: "rateReview",
    id: 19,
  },
  {
    title: "Hendrix (Rating PG)",
    route: "/hendrix/v1/ratingpg",
    image: "rateReview",
    id: 20,
  },
  {
    title: "Hendrix (Carrier Rating)",
    route: "/hendrix/v1/carrierrating",
    image: "rateReview",
    id: 21,
  },
  {
    title: "Hendrix (FC Capacity)",
    route: "/hendrix/v1/fccapacity",
    image: "rateReview",
    id: 22,
  },
  {
    title: "Hendrix (Allocation Logic)",
    route: "/hendrix/v1/allocationlogic",
    image: "rateReview",
    id: 23,
  },
  {
    title: "Hendrix (Manual Allocation)",
    route: "/hendrix/v1/manualallocation",
    image: "rateReview",
    id: 24,
  },
  {
    title: "Hendrix (new order)",
    route: "/hendrix/v1/new-fc-preference",
    image: "rateReview",
    id: 25,
  },
];
/**
 * @function useMegaMenuItems This is hook to transform config which is adding translated keys
 * @returns {Array} Array of object where each object contains configurations of mega menu items
 */
const useMegaMenuItems = () => {
  const translate = useTranslate();

  return useMemo(
    () =>
      sideBarMenuItems.map(({ route, image, id, title, translationKey }) => ({
        route,
        image,
        id,
        title: translationKey ? translate(translationKey) : title,
      })),
    [translate],
  );
};

export default useMegaMenuItems;
