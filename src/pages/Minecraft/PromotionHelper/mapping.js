const entityMappings = {
  CATEGORY: {
    apiParams: {
      url: `galleria/v1/category-names`,
      fieldName: "categoryName",
      type: "getData",
      fieldId: "categoryId",
      localSearch: true,
    },
  },
  PRODUCT_TYPE: {
    apiParams: {
      fieldName: "tagId",
      type: "getData",
      url: `galleria/v1/tags`,
      fieldId: "tagName",
    },
  },
  OCCASION: {
    apiParams: {
      fieldName: "tagId",
      type: "getData",
      url: `galleria/v1/tags`,
      fieldId: "tagName",
    },
  },
  RECIPIENT: {
    apiParams: {
      fieldName: "tagId",
      type: "getData",
      url: `galleria/v1/tags`,
      fieldId: "tagName",
    },
  },
  PRODUCT: {
    apiParams: {
      fieldName: "productName",
      type: "getData",
      url: "columbus/v1/productList",
      fieldId: "productId",
      searchParams: "qs",
    },
  },
  FROM_COUNTRY: {
    apiParams: {
      fieldName: "countryName",
      type: "getData",
      url: `tiffany/v1/countries`,
      fieldId: "countryId",
      localSearch: true,
    },
  },
  FROM_CITY: {
    apiParams: {
      fieldName: "cityName",
      type: "getData",
      url: `tiffany/v1/cities/country`,
      fieldId: "cityId",
      searchParams: "simpleSearchValue",
      formatterFunction: (data) => {
        return `${data.cityName} (${data.countryId})`;
      },
    },
  },
  DELIVERY_CITY: {
    apiParams: {
      fieldName: "cityName",
      type: "getData",
      url: `tiffany/v1/cities/country`,
      fieldId: "cityId",
      searchParams: "simpleSearchValue",
      formatterFunction: (data) => {
        return `${data.cityName} (${data.countryId})`;
      },
    },
  },
  DELIVERY_COUNTRY: {
    apiParams: {
      fieldName: "countryName",
      type: "getData",
      url: `tiffany/v1/countries`,
      fieldId: "countryId",
      localSearch: true,
    },
  },
  PARTY_CLASSIFICATION: {
    apiParams: {
      fieldName: "description",
      type: "getData",
      url: `pawri/v1/classifications`,
      fieldId: "id",
    },
  },
  PARTY_ROLE: {
    apiParams: {
      defaultOptions: [
        {
          name: "B2C",
          id: "S_00300",
        },
        {
          name: "Employee",
          id: "S_00301",
        },
      ],
      fieldName: "name",
      type: "getData",
      url: `pawri/v1/partytypes/S_70001/roles`,
      fieldId: "id",
    },
  },
  CUSTOMER: {
    apiParams: {
      fieldName: "name",
      type: "getData",
      url: "pawri/v1/parties/suggestion?partyType=Individual",
      fieldId: "id",
    },
  },
  CURRENCY_ID: {
    apiParams: { fieldName: "uomId", type: "getData", url: `tiffany/v1/uoms?uomType=CURRENCY`, fieldId: "uomId" },
  },
  PRODUCT_PRICE: {
    apiParams: {
      fieldName: "productName",
      type: "getData",
      url: "columbus/v1/productList",
      fieldId: "productId",
      searchParams: "qs",
    },
  },
};

export default entityMappings;
