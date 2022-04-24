import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm } from "react-admin";
import { Typography, Grid, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import CustomToolbar from "../../../../../components/CustomToolbar";
import BasicDetails from "./BasicDetails/BasicDetails";
import GeoLaunchDate from "./GeoLaunchDate/GeoLaunchDate";
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
  const { id: productId, isEditable, history } = props;
  const translate = useTranslate();

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
      return item.skuType.name;
    });
    const skuTypeValues = identification.reduce((total, curr) => {
      return { ...total, [curr.skuType.name]: curr.skuTypeValue };
    }, {});

    const geoDetailsData = tags.map((item) => {
      return item.tag.tagName;
    });
    const geoDetailsValues = tags.reduce((total, curr) => {
      return { ...total, [curr.tag.tagName]: { fromDate: curr.fromDate, thruDate: curr.thruDate } };
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

  /**
   * @function cancelEditHandler function called on click of cancel button of Create Relation Page
   */
  const cancelEditHandler = () => {
    history.goBack();
  };

  /**
   *@function switchToEditHandler function called on edit icon to navigate to edit page.
   */
  const switchToEditHandler = () => {
    history.push(`/${window.REACT_APP_GEMS_SERVICE}products/${productId}/edit`);
  };
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm
          // save={(formData) => console.log("dataform", { formData })}
          initialValues={responseData}
          toolbar={
            isEditable ? (
              <CustomToolbar onClickCancel={cancelEditHandler} saveButtonLabel={translate("update")} />
            ) : (
              <></>
            )
          }
        >
          <Grid container justify="space-between">
            {!isEditable && (
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="h4">{translate("basic_details")}</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={switchToEditHandler}>
                    <EditOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Grid>
          <BasicDetails formData={responseData} isEditable={isEditable} />
          <GeoLaunchDate formData={responseData} isEditable={isEditable} />
          <ProductConfigurations formData={responseData} isEditable={isEditable} />
          <ProductProperties formData={responseData} isEditable={isEditable} />
          <OtherSKUIDs formData={responseData} otherSKUTypesData={otherSKUTypesData} isEditable={isEditable} />
        </SimpleForm>
      )}
    </>
  );
};

BasicDetailsTab.propTypes = {
  id: PropTypes.string,
  isEditable: PropTypes.bool,
  history: PropTypes.objectOf(PropTypes.any),
};

BasicDetailsTab.defaultProps = {
  id: "",
  isEditable: false,
  history: {},
};

export default BasicDetailsTab;
