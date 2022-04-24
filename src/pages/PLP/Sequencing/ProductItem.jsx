import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { Grid, Typography, Tooltip, TextField, Link } from "@material-ui/core";
import useStyle from "./sequencingStyles";
import formatDateValue from "../../../utils/formatDateTime";
import { plpFallbackImage } from "../../../config/GlobalConfig";
/**
 * This component will display single products details
 *
 * @param {object} props contains data related to products
 * @returns {React.ReactElement} Product Item  Component.
 */
const ProductItem = (props) => {
  const { product } = props;
  const {
    productImage,
    productName,
    price,
    productId,
    createdAt,
    views,
    sales,
    status,
    quartile,
    shippingMode,
    suppressed,
    sequence,
    skuCode,
    cr,
  } = product;
  const classes = useStyle();
  const translate = useTranslate();
  const statusText = status ? translate("active") : translate("inactive");
  const statusColor = status ? classes.colorGreen : classes.colorRed;
  const [currentOrder, setCurrentOrder] = useState(sequence);
  const [imageErrorLoading, setImageErrorLoading] = useState(false);

  useEffect(() => {
    setCurrentOrder(sequence);
  }, [sequence]);
  /**
   * @function handleOrderChange To handle key change
   * @param {object} event info of the current product
   */
  const handleOrderChange = (event) => {
    setCurrentOrder(event.target.value);
  };

  /**
   * @function onImageError To handle image error
   */
  const onImageError = () => {
    setImageErrorLoading(true);
  };

  const imgSrc = !imageErrorLoading && productImage !== null ? productImage : plpFallbackImage;

  return (
    <Grid item xs={3} productId={productId} className={classes.productItemGrid}>
      <div className={`${classes.productItem} ${suppressed ? classes.productItemOverlay : ""}`}>
        <div className={classes.imgBlock}>
          <img width="100%" alt={productName} loading="lazy" onError={onImageError} src={imgSrc} />
          <div className={classes.productCode}>
            <Typography align="left" className={classes.orderCode}>
              {quartile}
            </Typography>
            <Typography align="right">{shippingMode}</Typography>
          </div>
        </div>
        <div className={classes.productInfoAlign}>
          <div className={classes.productNameDiv}>
            {/* //added temporary href cause url is not getting from backend */}
            <Link href="https://fnp.com" target="_blank" color="inherit">
              <Tooltip title={productName}>
                <Typography className={classes.productNameWrap}>{productName}</Typography>
              </Tooltip>
              <Typography>{`[${productId}]`}</Typography>
              {skuCode && (
                <Tooltip title={skuCode}>
                  <Typography className={classes.productNameWrap}>{`[${skuCode}]`}</Typography>
                </Tooltip>
              )}
            </Link>
          </div>
          <div>
            <Typography>{`${translate("price")} ₹${price}`}</Typography>
            <Typography>
              {`${translate("date_created")}: `}
              <span>{formatDateValue(createdAt)}</span>
            </Typography>
            <Typography>
              {translate("product_sequence.product_views")}
              <span>{` ${views}`}</span>
            </Typography>
            <Typography>{`${translate("product_sequence.sale")} ${sales}`}</Typography>
            <Typography>
              {translate("product_sequence.cr")}
              <span>{` ${cr}%`}</span>
            </Typography>
            <Typography>
              {`${translate("status")}: `}
              <span className={`${statusColor} ${classes.textUppercase}`}>{statusText}</span>
            </Typography>
          </div>
          <div className={classes.orderShow}>
            <TextField
              type="number"
              name={productId}
              variant="outlined"
              value={currentOrder}
              onChange={handleOrderChange}
              error={currentOrder < 0}
              className={classes.formInputClass}
              InputProps={{
                inputProps: { min: 1, className: classes.inputPadding },
              }}
            />
          </div>
        </div>
      </div>
    </Grid>
  );
};

ProductItem.propTypes = {
  product: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ProductItem;
