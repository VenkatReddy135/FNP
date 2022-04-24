import englishMessages from "ra-language-english";
import appBarMessages from "./Galleria/Dashboard/appbar";
import loginMessages from "./login";
import simpleGridMessages from "./Galleria/Category/SimpleGrid/simplegrid";
import copyright from "./Galleria/Dashboard/copyright";
import logout from "./logout";
import quicklinks from "./Galleria/Dashboard/quicklinks";
import dashboard from "./Galleria/Dashboard/dashboard";
import adminEmail from "./BeautyPlus/adminemail";
import securitySetting from "./BeautyPlus/GeneraConfiguration/securitySetting";
import generalEmailMessage from "./BeautyPlus/DomainConfiguration/generalEmail";
import columbus from "./columbus";
import categorycontent from "./Galleria/Category/CategoryContent/categorycontent";
import categoryRelationManagementMessages from "./Galleria/Category/CategoryRelation/categoryrelation";
import commondelete from "./Galleria/Category/Delete/commondelete";
import TagsList from "./Galleria/Tags/List";
import TagDetails from "./Galleria/Tags/Details";
import categoryConfigurationMessages from "./Galleria/Category/CategoryConfiguration/categoryconfiguration";
import partySearchLabels from "./Pawri/PartySearch/partysearchform";
import commonLabels from "./common";
import siteMap from "./BeautyPlus/SeoConfiguration/SiteMap/siteMap";
import metaInformation from "./BeautyPlus/SeoConfiguration/MetaInformation/metaInformation";
import schemas from "./BeautyPlus/SeoConfiguration/Schemas/schemas";
import hrefLang from "./BeautyPlus/SeoConfiguration/HrefLang/hrefLang";
import ogFacebook from "./BeautyPlus/SeoConfiguration/OgFacebook/ogFacebook";
import urlRedirectMessages from "./BeautyPlus/UrlRedirect/urlredirect";
import categorySeoMessages from "./Galleria/Category/CategorySEO/seodetails";
import viewHistoryMessages from "./Galleria/Category/ViewHistory/viewhistory";
import categoryCreate from "./Galleria/Category/CategoryCreate/categorycreate";
import categoryMaster from "./Galleria/Category/CategoryMaster/categoryMaster";
import partyViewMessages from "./Pawri/PartyDetails/partyDetails";
import partyUsernames from "./Pawri/PartyUsernames/partyusernames";
import newUsername from "./Pawri/PartyUsernames/newUsername";
import partylist from "./Pawri/PartyList/partylist";
import cockpit from "./cockpit";
import commonText from "./commonText";
import partyRelationship from "./Pawri/PartyRelationship/partyRelationship";
import partyContacts from "./Pawri/PartyContacts/partyContacts";
import partyRoles from "./Pawri/PartyRoles/partyRoles";
import partyPersonalInfo from "./Pawri/PartyPersonalInfo/personalInfo";
import plpProductList from "./plpProductList";
import PLP from "./PLP";
import createPartyLabels from "./Pawri/PartyCreate/createparty";
import campaignGridMessages from "./Kitchen/CampaignMaster/CampaignGrid/campaignGrid";
import changeHistoryMessages from "./Kitchen/CampaignMaster/ChangeHistory/changeHistory";
import viewChangeHistory from "./Kitchen/CampaignMaster/ViewChangeHistory/viewChangeHistory";
import reviewLabels from "./Moody/reviewLabels";
import categoryAttributeLabels from "./Galleria/Category/CategoryAttribute/categoryAttributeLabels";
import publisherGridMessages from "./Kitchen/PublisherMaster/PublisherGrid/publisherGrid";
import campaignCreateMessages from "./Kitchen/CampaignMaster/CampaignCreate/campaignCreate";
import campaignEditMessages from "./Kitchen/CampaignMaster/CampaignEdit/campaignEdit";
import publisherCreate from "./Kitchen/PublisherMaster/PublisherCreate/publisherCreate";
import PublisherEdit from "./Kitchen/PublisherMaster/PublisherEdit/publisherEdit";
import promotionList from "./Minecraft/PromotionList/promotionList";
import promotionCreate from "./Minecraft/PromotionCreate/promotionCreate";
import promotionBasicProperties from "./Minecraft/PromotionBasicProperties/promotionBasicProperties";
import promotionManageCodes from "./Minecraft/PromotionManageCodes/promotionManageCodes";
import promotionCriteria from "./Minecraft/PromotionCriteria/promotionCriteria";
import promotionActionAndPrice from "./Minecraft/PromotionActionAndPrice/promotionActionAndPrice";
import promotionAdvanceFilter from "./Minecraft/PromotionAdvanceFilter/promotionAdvanceFilter";
import tagRelationManagementMessages from "./Galleria/Tags/TagRelation/tagrelation";
import product from "./Gems/Product/product";
import gems from "./Gems";
import hendrix from "./Hendrix";
import addressTemplates from "./Gucci/AddressTemplates";
import FreeMessageCard from "./Gucci/FreeMessageCard";
import PaymentMessages from "./Gucci/Payments";
import BasePriceModel from "./Nifty/BasePriceModel/basePriceModel";
import CustomerDeliveryCharges from "./Nifty/CustomerDeliveryCharges/customerDeliveryCharges";
import CarrierShippingPriceMaster from "./Nifty/CarrierShippingPriceMaster/carrierShippingPriceMaster";
import PriceMaster from "./Nifty/PriceMaster/priceMaster";
import PriceRuleManagement from "./Nifty/PriceRuleManagement/priceRuleManagement";
import PricingCRONConfigurations from "./Nifty/PricingCRONConfigurations/pricingCRONConfigurations";

const enMessages = {
  ...englishMessages,
  ...appBarMessages,
  ...loginMessages,
  ...simpleGridMessages,
  ...campaignGridMessages,
  ...changeHistoryMessages,
  ...copyright,
  ...logout,
  ...quicklinks,
  ...dashboard,
  ...adminEmail,
  ...securitySetting,
  ...generalEmailMessage,
  ...columbus,
  ...categorycontent,
  ...categoryRelationManagementMessages,
  ...commondelete,
  ...categoryConfigurationMessages,
  ...partySearchLabels,
  ...commonLabels,
  ...siteMap,
  ...metaInformation,
  ...schemas,
  ...hrefLang,
  ...ogFacebook,
  ...urlRedirectMessages,
  ...categorySeoMessages,
  ...createPartyLabels,
  ...commonLabels,
  ...partyViewMessages,
  ...partyUsernames,
  ...newUsername,
  ...partylist,
  ...cockpit,
  ...viewHistoryMessages,
  ...categoryCreate,
  ...categoryMaster,
  ...commonText,
  ...partyRelationship,
  ...partyContacts,
  ...partyRoles,
  ...partyPersonalInfo,
  ...plpProductList,
  ...PLP,
  ...viewChangeHistory,
  ...reviewLabels,
  ...publisherGridMessages,
  ...campaignCreateMessages,
  ...campaignEditMessages,
  ...publisherCreate,
  ...PublisherEdit,
  ...promotionList,
  ...promotionCreate,
  ...promotionBasicProperties,
  ...promotionManageCodes,
  ...promotionCriteria,
  ...promotionActionAndPrice,
  ...promotionAdvanceFilter,
  ...categoryAttributeLabels,
  ...TagsList,
  ...TagDetails,
  ...tagRelationManagementMessages,
  ...gems,
  ...product,
  ...hendrix,
  ...addressTemplates,
  ...FreeMessageCard,
  ...PaymentMessages,
  ...BasePriceModel,
  ...CustomerDeliveryCharges,
  ...CarrierShippingPriceMaster,
  ...PriceMaster,
  ...PriceRuleManagement,
  ...PricingCRONConfigurations,
};

export default enMessages;
