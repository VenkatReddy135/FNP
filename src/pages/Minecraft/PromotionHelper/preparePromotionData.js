import { isPlainObject, toString } from "lodash";

/**
 * @function prepareCriteriaData to manupulate incoming data.
 * @param {Array} criteria array of which is is to be modified.
 * @returns {Array} return updated data.
 */
const prepareCriteriaData = (criteria) => {
  if (!criteria?.length) return [];
  const conditionData = criteria
    ?.filter((item) => !item.parentId && !(item.conditionName === "GEO" || item.conditionName === "DOMAIN"))
    .map((item) => ({
      ...item,
      subConditionCount: 0,
      childIndex: 0,
      values: item.mapping?.length ? item.mapping : item.values,
    }));

  let childData = criteria.filter((item) => item.parentId);

  conditionData.forEach((item, index) => {
    const currentChilds = childData
      .filter((child) => child.parentId === item.conditionId && child.parentValue === item.values[0])
      .map((child) => ({ ...child, subConditionCount: 0, childIndex: item.childIndex + 1 }));

    if (currentChilds.length) {
      childData = childData.filter((child) => !currentChilds.includes(child));
      conditionData.splice(index + 1, 0, ...currentChilds);
      conditionData[index].subConditionCount = currentChilds.length;
    }
  });
  return conditionData;
};

/**
 * @function view to manupulate incoming data.
 * @param {object} data object which is is to be updated.
 * @returns {object} return updated data.
 */
const view = (data) => {
  const geo = data.criteria?.find((item) => item.conditionName === "GEO");
  const domain = data.criteria?.find((item) => item.conditionName === "DOMAIN");
  const amountRange = data.action?.price?.amountRange
    ? data.action.price.amountRange.map((item, index) => ({ ...item, id: `AMOUNT_${index}` }))
    : [];
  const { action } = data;
  action.maxCap = toString(action.maxCap);
  action.price.amountRange = amountRange;

  return {
    ...data,
    manualCodes: data.manualCodes.map((item) => ({
      ...item,
      id: item.batchId,
      code: item.code?.join(),
      isUpdated: false,
    })),
    autoCodes: data.autoCodes.map((item) => ({ ...item, id: item.batchId, code: item.code?.join(), isUpdated: false })),
    criteria: prepareCriteriaData(data.criteria).map((item, index) => ({ ...item, id: `CRITERIA_${index}` })),
    action,
    domainId: domain.values[0],
    geoId: geo.values,
    geoConditionId: geo.conditionId,
    domainConditionId: domain.conditionId,
  };
};

/**
 * @function create changes the form data to a required format.
 * @param {object} masterForm promotion data
 * @returns {object} returns modified data.
 */
const create = (masterForm) => {
  const autoCodeConfigs = masterForm.autoCodeConfigs[0].isValid ? masterForm.autoCodeConfigs : [];
  const data = {
    ...masterForm,
    manualCodes: masterForm.manualCodes.map((item) => ({ ...item, code: item.code?.split(",") })),
    autoCodeConfigs,
  };
  if (data.criteria) {
    data.criteria = [
      ...data.criteria.map(({ childIndex, subConditionCount, values, ...rest }) => ({
        ...rest,
        values: values.map((item) => (isPlainObject(item) ? item.id : item)),
      })),
      {
        conditionId: data.domainConditionId,
        operator: "contains",
        values: [data.domainId],
      },
      { conditionId: data.geoConditionId, operator: "contains", values: data.geoId },
    ];

    delete data.domainConditionId;
    delete data.geoConditionId;

    delete data.domainId;
    delete data.geoId;
  }

  return data;
};

export default { view, create };
