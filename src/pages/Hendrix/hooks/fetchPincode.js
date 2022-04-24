import { useState, useEffect, useCallback } from "react";
import { useDataProvider } from "react-admin";

/**
 * Custom hook to fetch BaseGeoId data
 *
 * @param {object} inputValues selected dropdown values
 * @returns {Array} baseGeoIds
 */
const useBaseGeoId = (inputValues) => {
  const [baseGeoIds, setBaseGeoIds] = useState([]);
  const dataProvider = useDataProvider();
  /**
   * @function fetchBaseGeoIds To Fetch BaseGeoIds and populate on Pincode dropdown
   *
   * @param {object} inputs selected dropdown values
   * @returns {null | object} null/Error
   */
  const fetchBaseGeoIds = useCallback(
    async (inputs) => {
      const payload = {
        geoId: inputs.geoId,
        vendorType: inputs.vendorType,
        geoGroupId: inputs.geoGroupId,
        productGroup: inputs.pgId,
      };
      const path = `${window.REACT_APP_SIMULATOR_SERVICE}/baseGeoIds`;
      try {
        const { data } = await dataProvider.getData(path, payload);
        const baseIds = data.map((value) => {
          return { id: value, name: value };
        });
        setBaseGeoIds(baseIds);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
      return null;
    },
    [dataProvider],
  );
  useEffect(() => {
    if (inputValues) {
      fetchBaseGeoIds(inputValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return baseGeoIds;
};
export default useBaseGeoId;
