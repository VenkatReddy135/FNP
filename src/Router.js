/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { Route } from "react-router-dom";
import ForgotPassword from "./pages/Login/forgotpassword";
import ResetPassword from "./pages/Login/ResetPassword";
import PartyDetails from "./pages/Pawri/PartyDetails";
import PartyPersonalViewEdit from "./pages/Pawri/PartyPersonalInfo/PartyPersonalEdit";
import PartySearch from "./pages/Pawri/PartySearch";
import PartyCreate from "./pages/Pawri/PartyCreate";
import SecuritySetting from "./pages/BeautyPlus/GeneraConfiguration/SecuritySetting";
import { IndexableAttributes } from "./pages/Columbus";
import PartyUsernamesEdit from "./pages/Pawri/PartyUsernames/PartyUsernamesEdit";
import NewUsername from "./pages/Pawri/PartyUsernames/PartyNewUsername";
import QueryExecuter from "./pages/Cockpit/QueryExecuter";
import Import from "./pages/Cockpit/Import";
import Export from "./pages/Cockpit/Export";
import CreateContact from "./pages/Pawri/PartyContacts/CreateContact";
import CategoryDetails from "./pages/Galleria/Category/CategoryDetails";
import CategoryCreate from "./pages/Galleria/Category/CategoryCreate/CreateStepper";
import CategoryRelationCreate from "./pages/Galleria/Category/CategoryRelation/CategoryRelationCreate";
import ViewEditCategoryRelation from "./pages/Galleria/Category/CategoryRelation/ViewEditCategoryRelation";
import AdvanceSearchCategory from "./pages/Galleria/Category/CategoryAdvanceSearch";
import ViewHistory from "./pages/Galleria/Category/CategoryViewHistory";
import UrlRedirectViewHistory from "./pages/BeautyPlus/UrlRedirectTool/ViewHistory";
import HrefLang from "./pages/BeautyPlus/SeoConfigurations/HrefLang";
import SiteMap from "./pages/BeautyPlus/SeoConfigurations/XMLSitemap";
import ImageSearch from "./pages/Columbus/SearchImageVoice/ImageSearch";
import ViewEditRelationship from "./pages/Pawri/Relationship/ViewEditRelationship";
import ExpiredContactList from "./pages/Pawri/PartyContacts/ExpiredContactList";
import PartyRolesEdit from "./pages/Pawri/PartyRoles/PartyRolesEdit";
import AssignSecurityGroup from "./pages/Pawri/PartyUsernames/AssignSecurityGroup";
import AssignPermissions from "./pages/Pawri/PartyUsernames/AssignPermissions";
import SecurityGroupList from "./pages/Pawri/PartyUsernames/SecurityGroupList";
import PermissionsList from "./pages/Pawri/PartyUsernames/PermissionsList";
import AddProductCategory from "./pages/PLP/CategoryProducts/AddProduct";
import PopulateAndSequenceCategory from "./pages/PLP/CategoryProducts/PopulateAndSequence/PopulateAndSequenceCategory";
import EditPLPFilter from "./pages/PLP/Filter/Edit";
import PartyContactsViewEdit from "./pages/Pawri/PartyContacts/PartyContactsViewEdit";
import ExpiredContactsView from "./pages/Pawri/PartyContacts/ExpiredContactList/ExpiredContactsView";
import PartyRelationCreate from "./pages/Pawri/Relationship/RelationshipCreate";
import AdvanceSearchUrlRedirect from "./pages/BeautyPlus/UrlRedirectTool/AdvanceSearchUrlRedirect";
import EditProductCategory from "./pages/PLP/EditProducts/EditProducts";
import CampaignChangeHistory from "./pages/Kitchen/CampaignMaster/CampaignChangeHistory";
import CampaignPreview from "./pages/Kitchen/CampaignMaster/CampaignPreview";
import AdvanceSearchEntityList from "./pages/Cockpit/EntityList/AdvanceSearchEntityList";
import { CategoryAttributesCreate, CategoryAttributesViewEdit, ProductDetailsTab } from "./imports/imports";
import AdvanceFilterPromotion from "./pages/Minecraft/PromotionList/AdvanceFilterPromotion";
import TagsAdvanceSearch from "./pages/Galleria/Tag/TagManagement/TagAdvanceSearch";
import TagView from "./pages/Galleria/Tag/TagManagement/TagView";
import ViewEditTagRelation from "./pages/Galleria/Tag/TagRelation/ViewEditTagRelation";
import TagRelationCreate from "./pages/Galleria/Tag/TagRelation/TagRelationCreate";
import TagCreate from "./pages/Galleria/Tag/TagManagement/TagCreate";
import ViewTagRelationsGraph from "./pages/Galleria/Tag/TagRelation/ViewTagRelationsGraph/ViewTagRelationsGraph";
import ProductSearch from "./pages/Gems/ProductRefineSearch";
import ProductNewComposition from "./pages/Gems/Product/ProductDetailsTab/Composition/CompositionCreate";
import ProductViewEditComposition from "./pages/Gems/Product/ProductDetailsTab/Composition/ViewEditComposition";
import EditAttribute from "./pages/Gems/Product/ProductDetailsTab/Attributes/EditAttribute";
import PresonalizationCreate from "./pages/Gems/Product/ProductDetailsTab/Personalizations/PersonalizationCreate/PersonalizationCreate";
import ProductAssociateFeatures from "./pages/Gems/Product/ProductDetailsTab/Feature/AssociateFeature";
import ProductEditFeatures from "./pages/Gems/Product/ProductDetailsTab/Feature/EditFeature";
import AssociateAttribute from "./pages/Gems/Product/ProductDetailsTab/Attributes/AssociateAttribute/AssociateAttribute";
import FreeMessagesList from "./pages/Gucci/FreeMessageCard/FreeMessagesList";
import AddresTemplatesList from "./pages/Gucci/AddressTemplates/AddressTemplatesList";
import PaymentDetails from "./pages/Gucci/Payments";
import ServiceProviderView from "./pages/Gucci/Payments/ServiceProviders/ServiceProviderView";
import TagViewHistory from "./pages/Galleria/Tag/TagManagement/TagView/TagHistory";

// RatingPg
import RatingPg from "./pages/Hendrix/RatingPg";
// Allocation Manager
import AllocationManager from "./pages/Hendrix/AllocationManager";
// Carrier Rating
import ViewCarrierRating from "./pages/Hendrix/CarrierRating";
// FC Capacity
import FcCapacity from "./pages/Hendrix/FcCapacity";
import FcCapacityShow from "./pages/Hendrix/FcCapacity/FcRuleForm";
// Allocation Logic
import AllocationLogic from "./pages/Hendrix/AllocationLogic";
import AllocationRulePage from "./pages/Hendrix/AllocationLogic/AllocationLogicRuleForm";
// ManualAllocation
import ManualAllocation from "./pages/Hendrix/ManualAllocationPreference/ManualallocationForm";
import ManualAllocationAddRule from "./pages/Hendrix/ManualAllocationPreference/ManualallocationRuleAddForm";
import ManualAllocationDuplicateRule from "./pages/Hendrix/ManualAllocationPreference/ManualallocationRuleDuplicateForm";
// New order
import Neworder from "./pages/Hendrix/NewOrderPreference/HomePage";
import Neworderadd from "./pages/Hendrix/NewOrderPreference/AddRule";
import ProductDetails from "./pages/Hendrix/NewOrderPreference/ProductDetails";

import CustomerDeliveryChargesSearch from "./pages/Nifty/CustomerDeliveryCharges/Search";
import CustomerList from "./pages/Nifty/CustomerDeliveryCharges/List";
import CustomerDeliveryChargesView from "./pages/Nifty/CustomerDeliveryCharges/View";
import CustomerDeliveryChargesCreate from "./pages/Nifty/CustomerDeliveryCharges/Create";
import CustomerDeliveryChargesEdit from "./pages/Nifty/CustomerDeliveryCharges/Edit";
import CustomerDeliveryChargesViewHistory from "./pages/Nifty/CustomerDeliveryCharges/History";

import BasePriceViewHistory from "./pages/Nifty/BasePriceModel/History";

import CarrierShippingMasterList from "./pages/Nifty/CarrierShippingMaster/List";
import CarrierShippingMasterSearch from "./pages/Nifty/CarrierShippingMaster/Search";
import CarrierShippingMasterCreate from "./pages/Nifty/CarrierShippingMaster/Create";
import CarrierShippingMasterEdit from "./pages/Nifty/CarrierShippingMaster/Edit";
import CarrierShippingMasterView from "./pages/Nifty/CarrierShippingMaster/View";
import ShippingConfiguration from "./pages/Nifty/CarrierShippingMaster/ShippingConfiguration";

import PriceMasterDetails from "./pages/Nifty/PriceMaster/PriceMasterDetails";
import FCComponentPriceMasterSearch from "./pages/Nifty/PriceMaster/FCComponentPriceMaster/Search";
import FCComponentPriceMasterCreate from "./pages/Nifty/PriceMaster/FCComponentPriceMaster/Create";
import FCComponentPriceMasterEdit from "./pages/Nifty/PriceMaster/FCComponentPriceMaster/Edit";
import FCComponentPriceMasterView from "./pages/Nifty/PriceMaster/FCComponentPriceMaster/View";
import FCComponentPriceMasterViewHistory from "./pages/Nifty/PriceMaster/FCComponentPriceMaster/History";

import ComponentPriceRuleManagerCreate from "./pages/Nifty/PriceMaster/ComponentPriceRuleManager/Create";
import ComponentPriceRuleManagerEdit from "./pages/Nifty/PriceMaster/ComponentPriceRuleManager/Edit";
import ComponentPriceRuleManagerView from "./pages/Nifty/PriceMaster/ComponentPriceRuleManager/View";

import PriceRuleManagementList from "./pages/Nifty/PriceRuleManagement/List";
import PriceRuleManagementDetails from "./pages/Nifty/PriceRuleManagement/PriceRuleManagementDetails";
import PriceRuleManagementProperties from "./pages/Nifty/PriceRuleManagement/Properties";
import PriceRuleManagementAction from "./pages/Nifty/PriceRuleManagement/Action";

import PricingCRONConfigurations from "./pages/Nifty/PricingCRONConfigurations";

export default [
  <Route history exact path="/forgotpassword" component={ForgotPassword} noLayout />,
  <Route exact path="/resetpassword" component={ResetPassword} noLayout />,
  <Route path="/pawri/v1/parties/search/:id/show" component={PartyDetails} />,
  <Route path="/pawri/v1/partycontacts/:id/expired-contacts" component={ExpiredContactList} />,
  <Route path="/pawri/v1/partycontacts/:partyId/:contactTypeId/show" component={ExpiredContactsView} />,
  <Route exact path="/parties/search" component={PartySearch} />,
  <Route
    path="/pawri/v1/parties/relations/:id/partyId=:partyId/show"
    render={(props) => <ViewEditRelationship {...props} isEditable={false} />}
  />,
  <Route
    exact
    path="/pawri/v1/parties/relations/:id/partyId=:partyId"
    render={(props) => <ViewEditRelationship {...props} isEditable />}
  />,
  <Route path="/gems/v1/products/:id/show" render={(props) => <ProductDetailsTab {...props} isEditable={false} />} />,
  <Route exact path="/gems/v1/products/:id/edit" render={(props) => <ProductDetailsTab {...props} isEditable />} />,
  <Route exact path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/securitysetting`} component={SecuritySetting} />,
  <Route exact path="/columbus/indexable-attributes" component={IndexableAttributes} />,
  <Route path="/pawri/v1/parties/:id/personalinfo/edit/:partyType" component={PartyPersonalViewEdit} />,
  <Route exact path="/simsim/v1/logins/:id/partyId=:partyId" component={PartyUsernamesEdit} />,
  <Route exact path="/simsim/v1/logins/usernames/:id/create" component={NewUsername} />,
  <Route exact path={`/${window.REACT_APP_COCKPIT_SERVICE}query-executer`} component={QueryExecuter} />,
  <Route exact path={`/${window.REACT_APP_COCKPIT_SERVICE}import`} component={Import} />,
  <Route exact path={`/${window.REACT_APP_COCKPIT_SERVICE}export`} component={Export} />,
  <Route exact path="/pawri/v1/parties/:id/create" component={CreateContact} />,
  <Route path="/galleria/v1/categories/:id/edit" render={(props) => <CategoryDetails {...props} isEditable />} />,
  <Route
    path="/galleria/v1/categories/:id/show"
    render={(props) => <CategoryDetails {...props} isEditable={false} />}
  />,
  <Route
    exact
    path="/galleria/v1/tags/:id/relations/:tagId/edit"
    render={(props) => <ViewEditTagRelation {...props} isEditable />}
  />,
  <Route
    path="/galleria/v1/tags/:id/relations/:tagId/show"
    render={(props) => <ViewEditTagRelation {...props} isEditable={false} />}
  />,
  <Route exact path="/gems/v1/products/personalizations/:id/create" component={PresonalizationCreate} />,
  <Route exact path="/gems/v1/products/attributes/:id/edit" component={EditAttribute} />,
  <Route exact path="/gems/v1/products/attributes/:id/create" component={AssociateAttribute} />,

  <Route path="/galleria/v1/tags/:id/relations/create" component={TagRelationCreate} />,
  <Route path="/galleria/v1/categories/:categoryId/attributes/create" component={CategoryAttributesCreate} />,
  <Route
    path="/galleria/v1/categories/:categoryId/attributes/:attributeId/show"
    render={(props) => <CategoryAttributesViewEdit {...props} isEditable={false} />}
  />,
  <Route
    path="/galleria/v1/categories/:categoryId/attributes/:attributeId/edit"
    render={(props) => <CategoryAttributesViewEdit {...props} isEditable />}
  />,
  <Route exact path="/galleria/v1/tags/create" component={TagCreate} />,
  <Route exact path="/galleria/v1/tags/advancesearch" component={TagsAdvanceSearch} />,
  <Route path="/galleria/v1/tags/:id/show/graph" component={ViewTagRelationsGraph} />,

  <Route path="/galleria/v1/tags/:id/update" render={(props) => <TagView {...props} isEditable />} />,
  <Route path="/galleria/v1/tags/:id/show" render={(props) => <TagView {...props} isEditable={false} />} />,
  <Route exact path="/galleria/v1/tags/:id/history" render={(props) => <TagViewHistory {...props} />} />,

  <Route exact path="/pawri/v1/parties/create" component={PartyCreate} />,
  <Route path="/kitchen/v1/campaigns/:id/history" render={(props) => <CampaignChangeHistory {...props} />} />,
  <Route path="/galleria/v1/categories/create" component={CategoryCreate} />,
  <Route path="/galleria/v1/categories/advancesearch" component={AdvanceSearchCategory} />,
  <Route
    exact
    path="/pawri/v1/partycontacts/:partyId/:partyContactId/view"
    render={(props) => <PartyContactsViewEdit {...props} isEditable={false} />}
  />,
  <Route
    exact
    path="/pawri/v1/partycontacts/:partyId/:partyContactId"
    render={(props) => <PartyContactsViewEdit {...props} isEditable />}
  />,
  <Route
    exact
    path="/galleria/v1/categories/associations/:id/create"
    render={(props) => <CategoryRelationCreate {...props} />}
  />,
  <Route
    path="/galleria/v1/categories/associations/:id/show"
    render={(props) => <ViewEditCategoryRelation {...props} isEditable={false} />}
  />,
  <Route
    exact
    path="/galleria/v1/categories/associations/:id"
    render={(props) => <ViewEditCategoryRelation {...props} isEditable />}
  />,
  <Route exact path="/galleria/v1/categories/:id/history" render={(props) => <ViewHistory {...props} />} />,
  <Route
    exact
    path={`/${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/:id/categoryId=:categoryId`}
    render={(props) => <EditProductCategory {...props} />}
  />,
  <Route exact path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/xmlsitemap`} component={SiteMap} />,
  <Route exact path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/hreflang`} component={HrefLang} />,
  <Route
    exact
    path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/urlRedirect/:id/history`}
    render={(props) => <UrlRedirectViewHistory {...props} />}
  />,
  <Route exact path="/columbus/image-search" component={ImageSearch} />,
  <Route exact path="/columbus/voice-search" component={ImageSearch} />,
  <Route exact path="/simsim/v1/partyroles/:id/role/edit/:partyTypeId" component={PartyRolesEdit} />,
  <Route exact path="/simsim/v1/logins/securitygroups/:id/create" component={AssignSecurityGroup} />,
  <Route exact path="/simsim/v1/logins/permissions/:id/create" component={AssignPermissions} />,
  <Route exact path="/simsim/v1/logins/:id/securitygroups" component={SecurityGroupList} />,
  <Route exact path="/simsim/v1/logins/:id/permissions" component={PermissionsList} />,
  <Route
    exact
    path="/galleria/v1/categories/products/:id/AddProduct/add-product-category"
    component={AddProductCategory}
  />,
  <Route exact path="/galleria/v1/categories/products/:id/category/:type" component={PopulateAndSequenceCategory} />,
  <Route
    exact
    path={`/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs/:id`}
    render={(props) => <EditPLPFilter {...props} isEditable />}
  />,
  <Route exact path="/pawri/v1/parties/relations/:id/create/:partyName" component={PartyRelationCreate} />,
  <Route exact path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/advancesearch`} component={AdvanceSearchUrlRedirect} />,
  <Route exact path="/kitchen/v1/campaigns/preview" component={CampaignPreview} />,
  <Route
    exact
    path={`/${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/advancesearch`}
    component={AdvanceSearchEntityList}
  />,
  <Route exact path="/gems/v1/productsearch" component={ProductSearch} />,
  <Route exact path="/gems/v1/products/composition/:id/create" component={ProductNewComposition} />,
  <Route
    exact
    path="/gems/v1/products/composition/:pid/show/:cid"
    render={(props) => <ProductViewEditComposition {...props} isEditable={false} />}
  />,
  <Route
    exact
    path="/gems/v1/products/composition/:pid/edit/:cid"
    render={(props) => <ProductViewEditComposition {...props} isEditable />}
  />,
  <Route exact path="/gems/v1/products/features/:id/associatefeatures" component={ProductAssociateFeatures} />,
  <Route exact path="/gems/v1/products/features/:pid/edit/:fid" component={ProductEditFeatures} />,
  <Route exact path="/minecraft/v1/promotions/advancesearch" component={AdvanceFilterPromotion} />,

  <Route exact path={`/${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/messages/:id/view`} component={FreeMessagesList} />,
  <Route path="/gucci/v1/payment" component={PaymentDetails} />,
  <Route exact path="/gucci/v1/addresstemplate" component={AddresTemplatesList} />,
  <Route path="/galleria/v1/categories/:id/view" component={ServiceProviderView} />,
  // Allocation Manager
  <Route exact path="/hendrix/v1/allocationmanager" component={AllocationManager} />,
  // Rating Pg
  <Route exact path="/hendrix/v1/ratingpg" component={RatingPg} />,
  // Carrier Rating
  <Route exact path="/hendrix/v1/carrierrating" component={ViewCarrierRating} />,
  // Fc capacity
  <Route exact path="/hendrix/v1/fccapacity" component={FcCapacity} />,
  <Route exact path="/hendrix/v1/fccapacity/show" component={FcCapacityShow} />,
  // Allocation logic
  <Route exact path="/hendrix/v1/allocationlogic" component={AllocationLogic} />,
  <Route exact path="/hendrix/v1/allocationlogic/rule" component={AllocationRulePage} />,
  // ManualAllocation
  <Route exact path="/hendrix/v1/manualallocation" component={ManualAllocation} />,
  <Route exact path="/hendrix/v1/manualallocation/rule" component={ManualAllocationAddRule} />,
  <Route exact path="/hendrix/v1/manualallocation/duplicate" component={ManualAllocationDuplicateRule} />,
  // New order
  <Route exact path="/hendrix/v1/new-fc-preference" component={Neworder} />,
  <Route exact path="/hendrix/v1/new-fc-preference/add" component={Neworderadd} />,
  <Route exact path="/hendrix/new-fc-preference/productdetails" component={ProductDetails} />,

  <Route exact path="/nifty/v1/customer-delivery-charges/search" component={CustomerDeliveryChargesSearch} />,
  <Route exact path="/nifty/v1/customer-delivery-charges" component={CustomerList} />,
  <Route exact path="/nifty/v1/customer-delivery-charges/show" component={CustomerDeliveryChargesView} />,
  <Route exact path="/nifty/v1/customer-delivery-charges/create" component={CustomerDeliveryChargesCreate} />,
  <Route exact path="/nifty/v1/customer-delivery-charges/:id" component={CustomerDeliveryChargesEdit} />,
  <Route exact path="/nifty/v1/customer-delivery-charges/:id/history" component={CustomerDeliveryChargesViewHistory} />,

  <Route exact path="/nifty/v1/base-price-model/:id/history" component={BasePriceViewHistory} />,

  <Route exact path="/nifty/v1/carrier-shipping-price-master" component={CarrierShippingMasterList} />,
  <Route exact path="/nifty/v1/carrier-shipping-price-master/search" component={CarrierShippingMasterSearch} />,
  <Route
    exact
    path="/nifty/v1/carrier-shipping-price-master/:id/shipping-configuration"
    component={ShippingConfiguration}
  />,
  <Route exact path="/nifty/v1/carrier-shipping-price-master/create" component={CarrierShippingMasterCreate} />,
  <Route exact path="/nifty/v1/carrier-shipping-price-master/blueDart" component={CarrierShippingMasterEdit} />,
  <Route exact path="/nifty/v1/carrier-shipping-price-master/show" component={CarrierShippingMasterView} />,

  <Route path="/nifty/v1/price-master" render={(props) => <PriceMasterDetails {...props} isEditable={false} />} />,
  <Route
    path="/nifty/v1/price-master-details/fc-component-price-master/search"
    component={FCComponentPriceMasterSearch}
  />,
  <Route
    path="/nifty/v1/price-master-details/fc-component-price-master/create"
    component={FCComponentPriceMasterCreate}
  />,
  <Route
    path="/nifty/v1/price-master-details/fc-component-price-master/:id/history"
    component={FCComponentPriceMasterViewHistory}
  />,
  <Route path="/nifty/v1/price-master-details/fc-component-price-master/:id" component={FCComponentPriceMasterEdit} />,
  <Route path="/nifty/v1/price-master-details/fc-component-price-master/show" component={FCComponentPriceMasterView} />,

  <Route
    path="/nifty/v1/price-master-details/component-price-rule-manager/create"
    component={ComponentPriceRuleManagerCreate}
  />,
  <Route
    path="/nifty/v1/price-master-details/component-price-rule-manager/rule_1"
    component={ComponentPriceRuleManagerEdit}
  />,
  <Route
    path="/nifty/v1/price-master-details/component-price-rule-manager/show"
    component={ComponentPriceRuleManagerView}
  />,

  <Route
    path="/nifty/v1/price-rule-management/price-rule-details/properties"
    component={PriceRuleManagementProperties}
  />,
  <Route path="/nifty/v1/price-rule-management/price-rule-details/action" component={PriceRuleManagementAction} />,
  <Route path="/nifty/v1/price-rule-management/price-rule-details" component={PriceRuleManagementDetails} />,
  <Route path="/nifty/v1/price-rule-management" component={PriceRuleManagementList} />,

  <Route path="/nifty/v1/pricing-cron-configurations" component={PricingCRONConfigurations} />,
];
