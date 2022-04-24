export const options = [
  { id: true, name: "Yes" },
  { id: false, name: "No" },
];
export const optionsMicrosite = [
  { id: "MICROSITE", name: "Microsite" },
  { id: "PLP", name: "Standard PLP" },
];
export const optionsDisplayName = [
  { id: "CATEGORYNAME", name: "Category Name" },
  { id: "H1", name: "H1" },
  { id: "ALTERNATENAME", name: "Alternate Name" },
];

/**
 *@function getDisplayText
 *@param {Array } optionsArr array of objects to filter
 *@param {string } propertyToMatch property of object to match
 *@param {string } propertyToReturn property of object expected to return
 *@returns {string} text to display is returned
 */
export const getDisplayText = (optionsArr, propertyToMatch, propertyToReturn) => {
  let result = optionsArr.filter((obj) => obj.id === propertyToMatch)[0];
  if (result) {
    result = propertyToReturn ? result[propertyToReturn] : result.name;
  }
  return result;
};
