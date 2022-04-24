import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

/**
 *  @function useCountryList Custom hook to fetch geography data
 *
 * @returns {Array} geography
 */
const useCountryList = () => {
  const [geography, setGeography] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    /**
     * @function fetchCountryList To Fetch country names and populate on Geography dropwown
     *
     * @returns {null | object} null/Error
     */
    const fetchCountryList = async () => {
      const path = "tiffany/v1/countries";
      try {
        const {
          data: { data },
        } = await dataProvider.getData(path);
        const countries = data?.map((country) => {
          return { id: country.countryCode, name: country.countryName };
        });
        setGeography(countries);
      } catch (error) {
        return error.response ? error.response.data : null;
      }
      return null;
    };
    fetchCountryList();
  }, [dataProvider]);

  return geography;
};
export default useCountryList;
