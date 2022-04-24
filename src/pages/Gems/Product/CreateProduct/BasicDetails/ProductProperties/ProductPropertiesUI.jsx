/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, NumberInput, SelectInput, TextInput } from "react-admin";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";

const useStyleHooks = makeStyles(() => ({
  minwidth: {
    width: "180px",
  },
  marginright: {
    marginRight: "10px",
  },
}));

/**
 * Component to render the product properties UI for create product
 *
 * @param {object} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const ProductPropertiesUI = (props) => {
  const { state } = props;
  const { lengthArray, weightArray, volumeArray, countryArray } = state;

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
        <Grid item data-testid="minimum_order_quantity_corporate" xs={4}>
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
        </Grid>
        <Grid item data-testid="maximum_order_quantity_b2c" xs={4}>
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
        </Grid>
        <Grid item data-testid="brand_name" xs={4}>
          <TextInput
            source="brandName"
            label={translate("brand_name")}
            className={classes.newtagPickerDropdown}
            data-testid="brandName"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container className={classes.dividerStyle}>
        <Grid item data-testid="test_product_country" xs={4}>
          <SelectInput
            source="countryOfOrigin"
            choices={countryArray}
            label={translate("product_country")}
            className={classes.newtagPickerDropdown}
            data-testid="product_country"
          />
        </Grid>
        <Grid item data-testid="test_length" xs={4}>
          <Grid container>
            <SelectInput
              source="lengthUnitId"
              choices={lengthArray}
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
        </Grid>
        <Grid item data-testid="test_breadth" xs={4}>
          <SelectInput
            source="breadthUnitId"
            choices={lengthArray}
            label={translate("breadth")}
            className={`${minwidth} ${marginright}`}
            data-testid="breadthUnitId"
          />
          <NumberInput source="breadth" className={minwidth} label="" data-testid="breadth" type="tel" />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item data-testid="test_height" xs={4}>
          <SelectInput
            source="heightUnitId"
            choices={lengthArray}
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
        </Grid>
        <Grid item data-testid="test_weight" xs={4}>
          <Grid container>
            <SelectInput
              source="weightUnitId"
              choices={weightArray}
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
        </Grid>
        <Grid item data-testid="cubic_volume" xs={4}>
          <SelectInput
            source="volumeUnitId"
            choices={volumeArray}
            label={translate("volumetric_weight")}
            className={`${minwidth} ${marginright}`}
            data-testid="cubicVolumeId"
            fullWidth
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
        </Grid>
      </Grid>
    </>
  );
};

ProductPropertiesUI.propTypes = {
  state: PropTypes.objectOf(PropTypes.any),
};

ProductPropertiesUI.defaultProps = {
  state: {},
};

export default React.memo(ProductPropertiesUI);
