import { useState } from "react";
import { useDataProvider } from "react-admin";

/**
 * Custom hook to fetch Vendors data
 *
 * @param {string} inputs  Vendors data
 * @returns  {Array} VendorList
 */
const useVendorList = (inputs) => {
  const [vendorIDs, setVendorIDs] = useState([]);
  const dataProvider = useDataProvider();

  /**
   * To Fetch FC ids and populate on VendorList dropdown
   *
   *  @param {*} props all Vendor List
   *  @returns {*} null/Error
   */
  const fetchVendorList = async ({ geoId, geoGroupId, deliveryMode }) => {
    const payload = {
      geoId,
      geoGroupId,
      deliveryMode,
      vendorType: "FC",
    };
    const path = `${window.REACT_APP_SIMULATOR_SERVICE}/vendors`;
    try {
      const { data } = await dataProvider.getData(path, payload);
      const vendors = data.map((vendor) => {
        return { id: vendor, name: vendor };
      });
      setVendorIDs(vendors);
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
  };

  if (inputs) {
    fetchVendorList(inputs);
  }

  return [vendorIDs, fetchVendorList];
};
export default useVendorList;
