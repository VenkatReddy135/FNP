const maxCharacterConfig = {
  promotionName: {
    maxLength: 100,
  },
  promotionDescription: {
    maxLength: 500,
  },
  useLimitPerCode: {
    maxLength: 10,
    maxNumber: 9999999999,
  },
  useLimitPerCustomer: {
    maxLength: 3,
    maxNumber: 999,
  },
  lengthOfCode: {
    maxLength: 2,
    maxNumber: 25,
  },
  codeStartsWith: {
    maxLength: 3,
  },
  maxCap: {
    maxLength: 5,
    maxNumber: 99999,
  },
  amount: {
    maxLength: 11,
    maxNumber: 10000000000,
  },
  percentAmountOff: {
    maxLength: 3,
    maxNumber: 100,
  },
  flatAmountOff: {
    maxLength: 7,
    maxNumber: 1000000,
  },
};

export default maxCharacterConfig;
