import React from "react";
import PropTypes from "prop-types";
import { TextInput, required, Button, useTranslate } from "react-admin";
import { Box, Grid } from "@material-ui/core";
import useStyles from "../../../../assets/theme/common";
import useStylesProduct from "../PopulateAndSequence/PopulateSequenceCategoryStyle";
import DateTimeInput from "../../../../components/CustomDateTimeV2";

/**
 * AddProductCategory component to Populate Category
 *
 *  @param {object} props all the props required by Add Category page
 * @returns {React.ReactElement} Add Category page.
 */
const AddProductForm = (props) => {
  const classes = useStyles();
  const classesProduct = useStylesProduct();
  const { productInputAlign, addProductList } = classesProduct;
  const translate = useTranslate();
  const { continueHandler, validateToDate, handleDateChange, handleChange, productData } = props;
  const { productId, sequence, fromDate, thruDate } = productData;
  return (
    <>
      <Box maxWidth="85%" mb={2}>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <TextInput
              source="productId"
              label={translate("product_id")}
              validate={[required()]}
              value={productId}
              onChange={handleChange}
              className={productInputAlign}
            />
          </Grid>
          <Grid item xs={4}>
            <TextInput
              source="sequence"
              label={translate("sequence")}
              validate={[required()]}
              value={sequence}
              onChange={handleChange}
              className={productInputAlign}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <DateTimeInput
              source="fromDate"
              label={translate("from_date")}
              value={fromDate}
              validate={[required()]}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid item md={4}>
            <DateTimeInput
              source="thruDate"
              label={translate("through_date")}
              value={thruDate}
              onChange={handleDateChange}
              validate={[validateToDate(fromDate)]}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              className={` ${classes.blueBtn} ${addProductList}`}
              onClick={continueHandler}
              label={translate("add_to_list")}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
AddProductForm.propTypes = {
  productData: PropTypes.objectOf(PropTypes.any).isRequired,
  continueHandler: PropTypes.func.isRequired,
  validateToDate: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
export default AddProductForm;
