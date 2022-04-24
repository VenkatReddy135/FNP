import React from "react";
import { SimpleForm, useTranslate } from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  TextField,
  Link,
} from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../../../assets/theme/common";
import CustomToolbar from "../../../../components/CustomToolbar";
import AddProductForm from "./AddProductForm";
import useStylesProduct from "../../ProductFilterStyle";

/**
 * AddProductCategory component to Populate Category
 *
 *  @param {object} props all the props required by Add to list Category
 * @returns {React.ReactElement} AddProductToList
 */
const AddProductUI = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const classesProduct = useStylesProduct();
  const { addProductContainer } = classesProduct;
  const {
    tableHeading,
    handleManageSequence,
    formatDateTime,
    product,
    productData,
    cancelTagHandler,
    updateFormData,
    continueHandler,
    validateToDate,
    handleDateChange,
    handleChange,
  } = props;

  return (
    <>
      <SimpleForm
        save={updateFormData}
        toolbar={<CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("add")} />}
      >
        <AddProductForm
          productData={productData}
          continueHandler={continueHandler}
          validateToDate={validateToDate}
          handleDateChange={handleDateChange}
          handleChange={handleChange}
        />

        <TableContainer component={Paper} align-items="center" className={addProductContainer}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(tableHeading).map((key) => (
                  <TableCell align="center" key={key}>
                    <Typography variant="h6">{tableHeading[key]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {product.length > 0 && (
              <TableBody>
                {product.map((key) => {
                  const {
                    createdBy,
                    productName,
                    productUrl,
                    updatedAt,
                    updatedBy,
                    productId,
                    sequence,
                    fromDate,
                    thruDate,
                  } = key;
                  return (
                    <TableRow key={productId}>
                      <TableCell align="center">
                        <Link href={productUrl} target="_blank">
                          {`${productName} [${productId}]`}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          variant="outlined"
                          defaultValue={sequence}
                          value={sequence}
                          name={productId}
                          type="number"
                          min={1}
                          error={sequence < 1}
                          onChange={handleManageSequence}
                          InputProps={{
                            inputProps: { className: classes.smallInputNumber },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{fromDate && formatDateTime(fromDate)}</TableCell>
                      <TableCell align="center">{thruDate && formatDateTime(thruDate)}</TableCell>
                      <TableCell align="center">{updatedAt && formatDateTime(updatedAt)}</TableCell>
                      <TableCell align="center">{updatedBy}</TableCell>
                      <TableCell align="center">{createdBy}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </SimpleForm>
    </>
  );
};
AddProductUI.propTypes = {
  tableHeading: PropTypes.objectOf(PropTypes.any).isRequired,
  product: PropTypes.arrayOf.isRequired,
  productData: PropTypes.objectOf(PropTypes.any).isRequired,
  handleManageSequence: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  continueHandler: PropTypes.func.isRequired,
  validateToDate: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default AddProductUI;
