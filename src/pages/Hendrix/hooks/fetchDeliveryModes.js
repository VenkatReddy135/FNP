import { useCallback, useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

/**
 * Custom hook to fetch Delivery modes data
 *
 * @param {string} selectedVendorType vendorType(FC/CR)
 * @returns {Array}  Delivery modes data
 */
const useDeliveryModeFetch = (selectedVendorType) => {
  const [deliveryMode, setDeliveryMode] = useState([]);
  const dataProvider = useDataProvider();
  /**
   * To Fetch Delivery modes and populate on dropdown based on vendorType
   *
   * @param {string} vendorType vendorType(FC/CR)
   * @returns {null | object} null/Error
   */
  const fetchDeliveryModes = useCallback(
    async (vendorType) => {
      const payload = {
        vendorType,
      };
      const path = `${window.REACT_APP_SIMULATOR_SERVICE}/delivery-modes`;

      try {
        const { data } = await dataProvider.getData(path, payload);
        const deliveryModes = data.map((value) => {
          return { id: value, name: value };
        });
        setDeliveryMode(deliveryModes);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
      return null;
    },
    [dataProvider],
  );
  useEffect(() => {
    if (selectedVendorType) {
      fetchDeliveryModes(selectedVendorType);
    }
  }, [selectedVendorType, fetchDeliveryModes]);

  return [deliveryMode, fetchDeliveryModes];
};
export default useDeliveryModeFetch;
