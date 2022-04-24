/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Admin, Resource } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { ThemeProvider } from "@material-ui/core/styles";
import enMessages from "./i18n/en";
import URLRedirectList from "./pages/BeautyPlus/UrlRedirectTool";
import ViewUrlRedirect from "./pages/BeautyPlus/UrlRedirectTool/ViewUrlRedirectTool";
import UpdateUrlRedirect from "./pages/BeautyPlus/UrlRedirectTool/UpdateUrlRedirect";
import CreateNewUrlRedirect from "./pages/BeautyPlus/UrlRedirectTool/CreateNewUrlRedirect";
import { Login } from "./pages";
import { MyLayout, Dashboard } from "./layout";
import customRoutes from "./Router";
import columbus from "./reducer/columbus";
import TagDropdownData from "./reducer/domain";
import baseCategoryUrl from "./reducer/baseCategoryUrl";
import messagecard from "./reducer/messagecard";
import theme from "./assets/theme/theme";
import authProvider from "./authServices/authProvider";
import AdminResources from "./resourcesData/AdminResources";
import { customDataProvider } from "./dataServices/httpClient";
import {
  EntityList,
  EntityEdit,
  EntityCreate,
  EntityShow,
  EntityEngineList,
  Reviews,
  PromotionList,
  PromotionCreate,
  PromotionEdit,
  PromotionShow,
  TagList,
  ProductListing,
  OccasionList,
  CreateFreeMessageCard,
  EditFreeMessageCard,
  ProductCreate,
} from "./imports/imports";

/**
 * i18n
 *
 * @param {string} locale Locale to be loaded.
 * @returns {object} translation
 */
const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "hi") {
      return import("./i18n/hi").then((messages) => messages.default);
    }
    // Always fallback on english
    return enMessages;
  },
  "en",
  { allowMissing: true, onMissingKey: (key) => key },
);

/**
 * Main App component which will be mounted by React on a root node.
 *
 * @returns {React.ReactElement} returns a React element
 */
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Admin
      dataProvider={customDataProvider}
      i18nProvider={i18nProvider}
      disableTelemetry
      theme={theme}
      loginPage={Login}
      authProvider={authProvider}
      layout={MyLayout}
      customRoutes={customRoutes}
      dashboard={Dashboard}
      customReducers={{ TagDropdownData, columbus, baseCategoryUrl, messagecard }}
    >
      {AdminResources && <Resource {...AdminResources()} />}
      <Resource
        name="beautyplus/v1/sites/urlRedirect"
        create={CreateNewUrlRedirect}
        list={URLRedirectList}
        show={ViewUrlRedirect}
        edit={UpdateUrlRedirect}
      />
      <Resource
        name="cockpit/v1/entitygroups/entities/query/select"
        list={EntityList}
        create={EntityCreate}
        edit={EntityEdit}
        show={EntityShow}
      />
      <Resource name="kitchen/v1/campaigns/preview" />
      <Resource name="cockpit/v1/entitygroups" list={EntityEngineList} />
      <Resource name="moody/v1/moderation/reviews" list={Reviews} />
      <Resource
        name="minecraft/v1/promotions"
        list={PromotionList}
        create={PromotionCreate}
        edit={PromotionEdit}
        show={PromotionShow}
      />
      <Resource name="galleria/v1/tags" list={TagList} />
      <Resource name="gems/v1/products" list={ProductListing} create={ProductCreate} />
      <Resource
        name="beautyplus/v1/sites/messages/occasion"
        create={CreateFreeMessageCard}
        edit={EditFreeMessageCard}
      />
      <Resource name="beautyplus/v1/sites/messages" list={OccasionList} />
    </Admin>
  </ThemeProvider>
);

export default App;
