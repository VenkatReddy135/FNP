export default {
  gridOptionalColumns: ["couponCode", "categoryName", "geoId", "productName"],
  allGridColumns: [
    "id",
    "promotionName",
    "domain",
    "geoId",
    "fromDate",
    "thruDate",
    "status",
    "couponCode",
    "categoryName",
    "productName",
    "createdBy",
    "createdAt",
  ],
  stepperForms: [
    { type: "basicProperties" },
    { type: "manageCodes" },
    { type: "criteria" },
    { type: "actionAndPrice" },
  ],
  defaultStepperCount: 0,
  initialMasterFormValue: {
    promotionName: null,
    promotionDescription: null,
    promotionTypeId: null,
    status: "active",
    thruDate: null,
    fromDate: null,
    couponRequired: false,
    useLimitPerCode: null,
    useLimitPerCustomer: null,
    autoCodeConfigs: [
      {
        id: 1,
        noOfCodes: null,
        fromDate: null,
        thruDate: null,
        lengthOfCode: null,
        codeStartsWith: null,
        isValid: false,
      },
    ],
    manualCodes: [],
    domainId: null,
    geoId: [],
    criteria: [],
    action: {
      actionId: null,
      afterOfferMessage: null,
      beforeOfferMessage: null,
      maxCap: null,
      price: {
        priceId: null,
        amount: null,
        currency: null,
        amountOff: null,
        values: [],
        amountRange: [],
      },
    },
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null,
  },
  initialMasterFormValidity: {
    basicProperties: false,
    manageCodes: false,
    criteria: false,
    actionAndPrice: false,
  },
  autoCodeDefaultConfig: {
    id: 1,
    noOfCodes: null,
    fromDate: null,
    thruDate: null,
    lengthOfCode: null,
    codeStartsWith: null,
    isValid: false,
  },
  promotionStatusOptions: [
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" },
  ],
  promotionCouponRequiredOptions: [
    { id: true, name: "Yes" },
    { id: false, name: "No" },
  ],
  basicPropertiesRequiredFields: ["promotionName", "promotionDescription", "promotionTypeId", "fromDate", "thruDate"],
  manageCodesRequiredFields: [],
  criteriaRequiredFields: ["domainId", "geoId"],
  advanceSearchSingleValueFields: ["fromDate", "thruDate", "status"],
  operators: {
    EQUAL_TO: "EqualTo",
    IN: "In",
  },
};
