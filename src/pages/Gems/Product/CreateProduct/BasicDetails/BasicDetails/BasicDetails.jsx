/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SelectInput, required, TextInput, useMutation } from "react-admin";
import { Grid } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../../utils/CustomHooks";

/**
 * Component to fill BasicDetails for create product
 *
 * @param {object} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const BasicDetails = (props) => {
  const { formData = {} } = props;
  const [mutate] = useMutation();
  const [basicDetailsList, setBasicDetailsList] = useState({
    productState: [],
    productType: [],
    selectedProductType: "",
    productSubType: [],
    requiredValidate: [required()],
  });
  const { productState, productType, productSubType, selectedProductType, requiredValidate } = basicDetailsList;
  const classes = useStyles();
  const translate = useTranslate();
  const { id, url, skuCode } = formData;

  /**
   * @function handleStateDataSuccess This function will setData
   * @param {object} res is passed to the function
   * @param {string} key state variable name
   */
  const handleStateDataSuccess = (res, key) => {
    const { data } = res?.data;
    const tempArray = data.map((val) => {
      return { id: val.id, name: val.name };
    });
    setBasicDetailsList((prev) => {
      return { ...prev, [key]: [...tempArray] };
    });
  };

  /**
   * @function handleSetSubtype This function will setData
   * @param {object} e event
   */
  const handleSetSubtype = (e) => {
    setBasicDetailsList((prevState) => ({
      ...prevState,
      selectedProductType: e.target.value,
    }));
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GEMS_SERVICE}products/states`, (data) =>
    handleStateDataSuccess(data, "productState"),
  );

  useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_GEMS_SERVICE}products/types?classificationId=${["PC_101"]}`,
    (data) => handleStateDataSuccess(data, "productType"),
  );

  useEffect(() => {
    if (selectedProductType) {
      mutate(
        {
          type: "getData",
          resource: `${window.REACT_APP_GEMS_SERVICE}products/sub-types?typeIds=${[selectedProductType]}`,
          payload: {},
        },
        {
          onSuccess: (response) => {
            onSuccess({
              response,
              notify: () => {},
              translate,
              handleSuccess: (data) => {
                handleStateDataSuccess(data, "productSubType");
              },
            });
          },
          onFailure: (error) => {
            onFailure({ error, notify: () => {}, translate });
          },
        },
      );
    }
  }, [selectedProductType]);

  return (
    <>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="product_id" xs={4}>
          <CustomViewUI label={translate("product_id")} value={id} gridSize={{ xs: 12 }} />
        </Grid>
        <Grid item data-testid="product_classification" xs={4}>
          <CustomViewUI
            label={translate("product_classification")}
            value={translate("product")}
            gridSize={{ xs: 12 }}
          />
        </Grid>
        <Grid item data-testid="product_url" xs={4}>
          <CustomViewUI label={translate("product_url")} value={url} gridSize={{ xs: 12 }} />
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="sku_code" xs={4}>
          <CustomViewUI label={translate("sku_code")} value={skuCode} gridSize={{ xs: 12 }} />
        </Grid>
        <Grid item data-testid="product_name" xs={4}>
          <TextInput
            source="name"
            validate={requiredValidate}
            label={translate("product_name")}
            className={classes.newtagPickerDropdown}
            data-testid="productName"
          />
        </Grid>
        <Grid item data-testid="display_name" xs={4}>
          <TextInput
            source="displayName"
            validate={requiredValidate}
            label={translate("display_product_name")}
            className={classes.newtagPickerDropdown}
            data-testid="display_product_name"
          />
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="productState" xs={4}>
          <SelectInput
            source="state.id"
            choices={productState}
            validate={requiredValidate}
            label={translate("product_state")}
            className={classes.newtagPickerDropdown}
          />
        </Grid>
        <Grid item data-testid="productType" xs={4}>
          <SelectInput
            source="state.type"
            choices={productType}
            validate={requiredValidate}
            label={translate("type")}
            className={classes.newtagPickerDropdown}
            onChange={handleSetSubtype}
          />
        </Grid>
        <Grid item data-testid="productSubType" xs={4}>
          <SelectInput
            source="state.SubType"
            choices={productSubType}
            validate={requiredValidate}
            label={translate("sub_type")}
            className={classes.newtagPickerDropdown}
            disabled={!selectedProductType}
          />
        </Grid>
      </Grid>
    </>
  );
};

BasicDetails.propTypes = {
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(BasicDetails);
