/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, required, NumberInput, SelectInput, TextInput } from "react-admin";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";

const useStyleHooks = makeStyles(() => ({
  minwidth: {
    minWidth: "150px",
    width: "150px",
  },
  marginright: {
    marginRight: "10px",
  },
}));

const requiredValidate = [required()];

/**
 * Component to render the Geo Launch Date UI for GEMS PIM
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const ProductPropertiesUI = (props) => {
  const { formData = {}, isEditable, state } = props;
  const { lengthArray, weightArray, volumeArray, countryArray } = state;

  const {
    minOrderQtyCorporate,
    maxOrderQtyB2c,
    brandName,
    countryOfOrigin,
    length,
    lengthUnitId,
    breadth,
    breadthUnitId,
    height,
    heightUnitId,
    weight,
    weightUnitId,
    volume,
    volumeUnitId,
  } = formData;

  const classes = useStyles();
  const customStyle = useStyleHooks();
  const { minwidth, marginright } = customStyle;
  const translate = useTranslate();

  return (
    <>
      <Grid>
        <Typography data-testid="product_properties" variant="h4">
          {translate("product_properties")}
        </Typography>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="minimum_order_quantity_corporate" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("minimum_order_quantity_corporate")}
              value={minOrderQtyCorporate}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <NumberInput
              source="minOrderQtyCorporate"
              label={translate("minimum_order_quantity_corporate")}
              data-at-id="sequence"
              autoComplete="off"
              min={1}
              type="tel"
              value={1}
              className={classes.newtagPickerDropdown}
            />
          )}
        </Grid>
        <Grid item data-testid="maximum_order_quantity_b2c" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("maximum_order_quantity_b2c")}
              value={maxOrderQtyB2c}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <NumberInput
              source="maxOrderQtyB2c"
              className={classes.newtagPickerDropdown}
              label={translate("maximum_order_quantity_b2c")}
              data-at-id="sequence"
              autoComplete="off"
              min={1}
              type="tel"
              value={1}
            />
          )}
        </Grid>
        <Grid item data-testid="brand_name" md={4}>
          {!isEditable ? (
            <CustomViewUI label={translate("brand_name")} value={brandName} gridSize={{ xs: 12, sm: 12, md: 12 }} />
          ) : (
            <TextInput
              source="brandName"
              validate={requiredValidate}
              label={translate("brand_name")}
              className={classes.newtagPickerDropdown}
              data-testid="brandName"
            />
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="test_product_country" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("product_country")}
              value={countryOfOrigin}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <SelectInput
              source="countryOfOrigin"
              choices={countryArray}
              validate={requiredValidate}
              label={translate("product_country")}
              className={classes.newtagPickerDropdown}
              data-testid="product_country"
            />
          )}
        </Grid>
        <Grid item data-testid="test_length" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("length")}
              value={`${length} ${lengthUnitId}`}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <Grid container>
              <SelectInput
                source="lengthUnitId"
                choices={lengthArray}
                validate={requiredValidate}
                label={translate("length")}
                className={`${minwidth} ${marginright}`}
                data-testid="lengthUnitId"
              />
              <NumberInput
                source="length"
                className={minwidth}
                label=""
                data-testid="length"
                autoComplete="off"
                min={1}
                type="tel"
                value={1}
              />
            </Grid>
          )}
        </Grid>
        <Grid item data-testid="test_breadth" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("breadth")}
              value={`${breadth} ${breadthUnitId}`}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <>
              <SelectInput
                source="breadthUnitId"
                choices={lengthArray}
                validate={requiredValidate}
                label={translate("breadth")}
                className={`${minwidth} ${marginright}`}
                data-testid="breadthUnitId"
              />
              <NumberInput
                source="breadth"
                validate={requiredValidate}
                className={minwidth}
                label=""
                data-testid="breadth"
                type="tel"
              />
            </>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item data-testid="test_height" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("height")}
              value={`${height} ${heightUnitId}`}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <>
              <SelectInput
                source="heightUnitId"
                choices={lengthArray}
                validate={requiredValidate}
                label={translate("height")}
                className={`${minwidth} ${marginright}`}
                data-testid="heightUnitId"
              />
              <NumberInput
                source="height"
                className={minwidth}
                label=""
                data-testid="height"
                autoComplete="off"
                min={1}
                type="tel"
                value={1}
              />
            </>
          )}
        </Grid>
        <Grid item data-testid="test_weight" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("weight")}
              value={`${weight} ${weightUnitId}`}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <Grid container>
              <SelectInput
                source="weightUnitId"
                choices={weightArray}
                validate={requiredValidate}
                label={translate("weight")}
                className={`${minwidth} ${marginright}`}
                data-testid="weightUnitId"
              />
              <NumberInput
                source="weight"
                className={minwidth}
                label=""
                data-testid="weight"
                autoComplete="off"
                min={1}
                type="tel"
                value={1}
              />
            </Grid>
          )}
        </Grid>
        <Grid item data-testid="cubic_volume" md={4}>
          {!isEditable ? (
            <CustomViewUI
              label={translate("volumetric_weight")}
              value={`${volume} ${volumeUnitId}`}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          ) : (
            <>
              <SelectInput
                source="volumeUnitId"
                choices={volumeArray}
                validate={requiredValidate}
                label={translate("volumetric_weight")}
                className={`${minwidth} ${marginright}`}
                data-testid="cubicVolumeId"
              />
              <NumberInput
                source="volume"
                className={minwidth}
                label=""
                data-testid="cubicVolume"
                autoComplete="off"
                min={1}
                type="tel"
                value={1}
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

ProductPropertiesUI.propTypes = {
  isEditable: PropTypes.bool,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
};

ProductPropertiesUI.defaultProps = {
  isEditable: false,
};

export default React.memo(ProductPropertiesUI);
