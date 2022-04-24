// constant values
const color = {
  white: "#ffffff",
  green: "#009212",
  lightGray: "#F8F6F7",
  black: "#000000",
  red: "#FF0000",
  gray: "#E5E5E5",
  darkGray: "#555555",
  yellow: "#F68808",
  neroBlack: "#222222",
  whiteSmoke: "#F8F8F8",
  smokyGray: "#D6D6D6",
  orange: "#FF9212",
  darkOrange: "#F68808",
  spanishBlue: "#2874bb",
};
const statusCodes = {
  NOT_FOUND: 404,
  SUCCESS: 200,
  CREATED: 201,
};
const SECURITY_SETTING_LIMITS = {
  passwordRecoveryLinkExpiration: 15,
  maximumAllowedPasswordRecoveryAttemptsPerHour: 15,
  lockOutTime: 60,
  maximumLoginAttemptsBeforeLockout: 15,
  passwordLifetime: 30,
  minimumPasswordLength: 6,
  maximumPasswordLength: 32,
  loginOTPExpirationTimeFrame: 300,
  numberOfCharacterClassesForPassword: 1,
};
const STORAGE_KEY = "DATA_GRID_HEADER_CUSTOMIZATION";
const TIMEOUT = 3000;
const INITIAL_INTERVAL = 500;
const INTERVAL_DELAY = 1000;
const SUCCESS = "SUCCESS";
const IN_PROGRESS = "IN_PROGRESS";
const FILTER_TAG_TYPE_ID = "tagTypeId";
const FILTER_TAG_OPERATOR_LIKE = "Like";
const FILTER_TAG_VALUE_DOMAIN = "D";
const DROPDOWN_PER_PAGE = 500;
const FILTER_TAG_VALUE_GEO = "G";
const FILTER_TAG_VALUE_PRODUCT = "PT";
const FILTER_TAG_NAME = "tagName";
const ACTIVE = "Active";

// services
window.REACT_APP_SIMSIM_SERVICE = "simsim/v1";
window.REACT_APP_GALLERIA_SERVICE = "galleria/v1";
window.REACT_APP_PARTY_SERVICE = "pawri/v1";
window.REACT_APP_TIFFANY_SERVICE = "tiffany/v1";
window.REACT_APP_COLUMBUS_SERVICE = "columbus/v1";
window.REACT_APP_BEAUTYPLUS_SERVICE = "beautyplus/v1";
window.REACT_APP_TUSKER_SERVICE = "tusker/v1";
window.REACT_APP_KITCHEN_SERVICE = "kitchen/v1";
window.REACT_APP_NIFTY_SERVICE = "nifty/v1";
window.REACT_APP_COCKPIT_SERVICE = "cockpit/v1/";
window.REACT_APP_MOODY_SERVICE = "moody/v1/";
window.REACT_APP_GEMS_SERVICE = "gems/v1/";
window.REACT_APP_MINECRAFT_SERVICE = "minecraft/v1";
window.REACT_APP_HENDRIX_SERVICE = "hendrix/v1";
window.REACT_APP_SIMULATOR_SERVICE = "simulator/v1/psa";
window.REACT_APP_MEGAMENU_SERVICE = "megamenu/v1/";

export const ENVIRONMENT = {
  "production-blue": "production-blue",
  "production-green": "production-green",
  "uat-blue": "uat-blue",
  "uat-green": "uat-green",
};

export const MODULE_DICTIONARY = [
  "cockpit",
  "beautyplus",
  "columbus",
  "kitchen",
  "galleria",
  "parties",
  "pawri",
  "simsim",
];

const shippingMethodTotal = 10;
const DESC = "DESC";
const plpFallbackImage = "https://i7.fnp.com/images/pr/l/v20190122233455/romantic-20-red-roses-bouquet_3.jpg";

const tagDropDownMapping = {
  domainData: "domain",
  geoData: "geo",
};
const reviewStatus = {
  approved: "APPROVED",
  rejected: "REJECTED",
};
const COCKPIT_SELECT_API = "query/select";
const PASSWORD_CONSTRAINT_DOMAIN = "zeus.com";

const DEBOUNCE_INTERVAL = 500;
const rowsPerPageOptions = [20, 40, 60, 80, 100];
const defaultRowPerPageOption = [5, 10, 25, 50];
const campaignPreviewOptions = [
  { id: 10, name: "Top 10 Items" },
  { id: 20, name: "Top 20 Items" },
];
const manageContentLink = `${window.REACT_APP_CONTENT_LINK}/cms/content/path/content/documents`;
export {
  color,
  statusCodes,
  STORAGE_KEY,
  TIMEOUT,
  INITIAL_INTERVAL,
  INTERVAL_DELAY,
  FILTER_TAG_VALUE_GEO,
  FILTER_TAG_VALUE_PRODUCT,
  SUCCESS,
  IN_PROGRESS,
  ACTIVE,
  FILTER_TAG_NAME,
  FILTER_TAG_TYPE_ID,
  FILTER_TAG_OPERATOR_LIKE,
  FILTER_TAG_VALUE_DOMAIN,
  DESC,
  tagDropDownMapping,
  COCKPIT_SELECT_API,
  SECURITY_SETTING_LIMITS,
  PASSWORD_CONSTRAINT_DOMAIN,
  DROPDOWN_PER_PAGE,
  shippingMethodTotal,
  DEBOUNCE_INTERVAL,
  reviewStatus,
  plpFallbackImage,
  rowsPerPageOptions,
  defaultRowPerPageOption,
  campaignPreviewOptions,
  manageContentLink,
};
