import React, { useState } from "react";
import PropTypes from "prop-types";
import { SimpleForm } from "react-admin";
import { Box } from "@material-ui/core";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import BasicDetails from "./BasicDetails/BasicDetails";
import ProductConfigurations from "./ProductConfigurations/ProductConfigurations";
import ProductProperties from "./ProductProperties/ProductProperties";
import OtherSKUIDs from "./OtherSKUIDs/OtherSKUIDs";
import LoaderComponent from "../../../../../components/LoaderComponent";

/**
 * Component to render the View/Edit Page of BasicDetailsTab
 *
 * @param {*} props all the props required by the Tag Relation  - View/Edit
 * @returns {React.ReactElement} returns the View/Edit Page of Tag Relation
 */
const BasicDetailsTab = (props) => {
  const { id: productId, isEditable } = props;

  const [responseData, setResponseData] = useState({});

  const [otherSKUTypesData, setOtherSKUTypesData] = useState([]);

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const { data } = res;
    const { identification, tags = [] } = data;
    const otherSKUTypes = identification.map((item) => {
      return item?.skuType?.name;
    });
    const skuTypeValues = identification.reduce((total, curr) => {
      return { ...total, [curr?.skuType?.name]: curr?.skuTypeValue };
    }, {});

    const geoDetailsData = tags.map((item) => {
      return item?.tag?.tagName;
    });
    const geoDetailsValues = tags.reduce((total, curr) => {
      return { ...total, [curr?.tag?.tagName]: { fromDate: curr?.fromDate, thruDate: curr?.thruDate } };
    }, {});
    setResponseData({ ...data, otherSKUTypes, ...skuTypeValues, geoDetailsData, ...geoDetailsValues });
  };

  const resource = `${window.REACT_APP_GEMS_SERVICE}products/${productId}`;
  const { loading } = useCustomQueryWithStore("getData", resource, handleSetDataSuccess);

  /**
   * @function handleIdentificationsDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleIdentificationsDataSuccess = (res) => {
    const { data } = res?.data;
    setOtherSKUTypesData(data);
  };
  const identificationsResource = `${window.REACT_APP_GEMS_SERVICE}products/identifications`;
  useCustomQueryWithStore("getData", identificationsResource, handleIdentificationsDataSuccess);

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm initialValues={responseData} toolbar={<></>}>
          <Box padding="10px" display="flex" flexDirection="column" alignItems="center">
            <Box width="1300px">
              <BasicDetails formData={responseData} isEditable={isEditable} />
              <ProductConfigurations formData={responseData} isEditable={isEditable} />
              <ProductProperties formData={responseData} isEditable={isEditable} />
              <OtherSKUIDs formData={responseData} otherSKUTypesData={otherSKUTypesData} isEditable={isEditable} />
            </Box>
          </Box>
        </SimpleForm>
      )}
    </>
  );
};

BasicDetailsTab.propTypes = {
  id: PropTypes.string,
  isEditable: PropTypes.bool,
};

BasicDetailsTab.defaultProps = {
  id: "",
  isEditable: true,
};

export default BasicDetailsTab;
