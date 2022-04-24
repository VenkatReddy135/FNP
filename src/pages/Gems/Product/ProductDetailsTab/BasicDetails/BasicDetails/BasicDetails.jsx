/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SelectInput, required, TextInput } from "react-admin";
import { Grid } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";

const requiredValidate = [required()];

/**
 * Component to render the View/Edit Page UI for Tag Relation
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const BasicDetails = (props) => {
  const { isEditable, formData = {} } = props;
  const [basicDetailsList, setBasicDetailsList] = useState({
    productState: [],
  });
  const { productState } = basicDetailsList;
  const classes = useStyles();
  const translate = useTranslate();
  const { id, classification, url, skuCode, name, displayName, state, type, subType } = formData;

  /**
   * @function handleStateDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleStateDataSuccess = (res) => {
    const { data } = res?.data;
    const stateArray = data.map(({ id: pId, name: pState }) => {
      return { id: pId, name: pState };
    });
    setBasicDetailsList((prev) => {
      return { ...prev, productState: stateArray };
    });
  };
  const stateResource = `${window.REACT_APP_GEMS_SERVICE}products/states`;
  useCustomQueryWithStore("getData", stateResource, handleStateDataSuccess);

  return (
    <>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="product_id" md={4}>
          <CustomViewUI label={translate("product_id")} value={id} gridSize={{ xs: 12, sm: 12, md: 12 }} />
        </Grid>
        <Grid item data-testid="product_classification" md={4}>
          <CustomViewUI
            label={translate("product_classification")}
            value={classification?.name}
            gridSize={{ xs: 12, sm: 12, md: 12 }}
          />
        </Grid>
        <Grid item data-testid="product_url" md={4}>
          <CustomViewUI label={translate("product_url")} value={url} gridSize={{ xs: 12, sm: 12, md: 12 }} />
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="sku_code" md={4}>
          <CustomViewUI label={translate("sku_code")} value={skuCode} gridSize={{ xs: 12, sm: 12, md: 12 }} />
        </Grid>
        <Grid item data-testid="product_name" md={4}>
          {!isEditable ? (
            <CustomViewUI label={translate("product_name")} value={name} gridSize={{ xs: 12, sm: 12, md: 12 }} />
          ) : (
            <TextInput
              source="name"
              validate={requiredValidate}
              label={translate("product_name")}
              className={classes.newtagPickerDropdown}
              data-testid="productName"
            />
          )}
        </Grid>
        <Grid item data-testid="display_name" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("display_product_name")}
              value={displayName}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <TextInput
              source="displayName"
              validate={requiredValidate}
              label={translate("display_product_name")}
              className={classes.newtagPickerDropdown}
              data-testid="display_product_name"
            />
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="productState" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("product_state")}
              value={state?.name}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <SelectInput
              source="state.id"
              choices={productState}
              validate={requiredValidate}
              label={translate("product_state")}
              className={classes.newtagPickerDropdown}
              data-testid="product_state"
            />
          )}
        </Grid>
        <Grid item data-testid="type_id" md={4}>
          <CustomViewUI label={translate("type")} value={type?.name} gridSize={{ xs: 12, sm: 12, md: 12 }} />
        </Grid>
        <Grid item data-testid="sub_type_id" md={4}>
          <CustomViewUI label={translate("sub_type")} value={subType?.name} gridSize={{ xs: 12, sm: 12, md: 12 }} />
        </Grid>
      </Grid>
    </>
  );
};

BasicDetails.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(BasicDetails);
