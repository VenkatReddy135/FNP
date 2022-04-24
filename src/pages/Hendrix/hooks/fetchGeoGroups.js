import { useState, useCallback, useEffect } from "react";
import { useDataProvider } from "react-admin";

/**
 * Custom hook to fetch geo-group data
 *
 * @param {string} geo geography
 * @returns {Array} geo group data
 */
const useGeoGroups = (geo) => {
  const [geoGroup, setGeoGroup] = useState([]);
  const dataProvider = useDataProvider();
  /**
   * To Fetch Geo Groups and populate on geoGroup dropdown based on geography
   *
   * @param {string} geoId selected geography
   * @returns {null | object} null/Error
   */
  const fetchGeoGroups = useCallback(
    async (geoId) => {
      const payload = {
        geoId,
      };
      const path = `${window.REACT_APP_SIMULATOR_SERVICE}/geo-groups`;
      try {
        const { data } = await dataProvider.getData(path, payload);
        const geoGroups = data.map((group) => {
          return {
            id: group.geoGroupId,
            name: group.geoGroupName,
          };
        });
        setGeoGroup(geoGroups);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
      return null;
    },
    [dataProvider],
  );
  useEffect(() => {
    if (geo) {
      fetchGeoGroups(geo);
    }
  }, [geo, fetchGeoGroups]);

  return [geoGroup, fetchGeoGroups];
};
export default useGeoGroups;
