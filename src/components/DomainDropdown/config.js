import { FILTER_TAG_TYPE_ID, FILTER_TAG_OPERATOR_LIKE, FILTER_TAG_VALUE_GEO } from "../../config/GlobalConfig";

const tagConfig = {
  domainData: {
    label: "Domain",
    reduxKey: "domain",
    resource: `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites`,
    apiLabel: "name",
    apiValue: "id",
    sortParam: `name:asc`,
    size: 100,
    encryption: "base64",
  },
  geoData: {
    label: "Select Geography",
    reduxKey: "geo",
    resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
    apiLabel: "tagName",
    apiValue: "tagId",
    sortParam: `tagName:asc`,
    size: 100,
    extraCondition: {
      fieldName: FILTER_TAG_TYPE_ID,
      operatorName: FILTER_TAG_OPERATOR_LIKE,
      fieldValue: FILTER_TAG_VALUE_GEO,
    },
    encryption: "encode",
  },
};

export default tagConfig;
