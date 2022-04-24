import cockpitConfig from "../../../config/CockpitConfig";
/**
 * Function to find the dbType.
 *
 * @param {string} dbType holds value to dbType.
 * @returns {string} giving return value as a dbType.
 * @name getDbTypeKey
 */
const getDbTypeKey = (dbType) => {
  switch (dbType) {
    case cockpitConfig.dbType.mysql:
      return cockpitConfig.dbKey.id;
    case cockpitConfig.dbType.mongo:
      return cockpitConfig.dbKey.mongoId;
    case cockpitConfig.dbType.arango:
      return cockpitConfig.dbKey.key;
    default:
      return "";
  }
};

export default getDbTypeKey;
