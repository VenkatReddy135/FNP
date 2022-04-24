import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";

/**
 * Custom hook to fetch ProductGroup data
 *
 * @returns {Array} pgGroup
 */
const useProductGroup = () => {
  const [pgGroup, setPgGroup] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    /**
     * @function fetchProductgroup To Fetch Product Groups and populate on ProductGroup dropdown
     * @returns {null | object} null/Error
     */
    const fetchProductgroup = async () => {
      const path = `${window.REACT_APP_SIMULATOR_SERVICE}/product-groups`;
      try {
        const { data } = await dataProvider.getData(path);
        const prodGroups = data?.map((pg) => {
          return { id: pg.pgId, name: pg.pgName };
        });
        setPgGroup(prodGroups);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
      return null;
    };
    fetchProductgroup();
  }, [dataProvider]);

  return pgGroup;
};
export default useProductGroup;
