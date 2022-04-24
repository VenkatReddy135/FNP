/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { SimpleForm, useTranslate, useRedirect, useNotify, useMutation, useUnselectAll } from "react-admin";
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
  Grid,
  Divider,
  Box,
  DialogContent,
  DialogContentText,
  Link,
} from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
import { TIMEOUT } from "../../../config/GlobalConfig";
import LoaderComponent from "../../../components/LoaderComponent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
import { validateToDateField } from "../../../utils/validationFunction";
import CustomToolbar from "../../../components/CustomToolbar";
import SimpleModel from "../../../components/CreateModal";
import { formatDateTime } from "../../../utils/formatDateTime";
import DateTimeInput from "../../../components/CustomDateTimeV2";
import Breadcrumbs from "../../../components/Breadcrumbs";

/**
 * Component to edit products for a category
 *
 * @param {object} props for the edit products page
 * @returns {React.ReactElement} returns edit products for category
 */
const EditProductCategory = (props) => {
  const { match } = props;
  const { categoryId, id } = match.params;
  const translate = useTranslate();
  const classes = useStyles();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const unselectAll = useUnselectAll();
  const [confirmationBox, setConfirmationBox] = useState(false);
  const [editProductObj, setEditProductObj] = useState({
    fromDate: null,
    productsequence: [],
    thruDate: null,
  });
  const { productsequence } = editProductObj;
  const notify = useNotify();
  /**
   * @function handleSetDataSuccess to handle success of the API
   * @param {object} res response object
   */
  const handleSetDataSuccess = (res) => {
    setEditProductObj((prevState) => ({ ...prevState, productsequence: res.data }));
  };

  const { loading } = useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/select`,
    handleSetDataSuccess,
    {
      payload: {
        categoryId,
        productIds: id,
        extraHeaders: { "Accept-Language": "en" },
      },
    },
  );

  const tableHead = {
    ProductNameID: translate("product_list.product_url"),
    Sequence: translate("sequence"),
    LastUpdatedStamp: translate("last_updated_stamp"),
    CreatedBy: translate("created_by"),
    LastUpdatedBy: translate("last_updated_by"),
  };
  /**
   * @function cancelHandler
   */
  const cancelHandler = () => {
    unselectAll(`${window.REACT_APP_COLUMBUS_SERVICE}/categories/products`);
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/products`);
  };
  /**
   * @param {object} event change event object
   * @function handleDateChange  date change
   */
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setEditProductObj((prevState) => ({ ...prevState, [name]: value }));
  };
  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res response object
   * @property {object} res get the response the API
   */
  const handleSuccess = (res) => {
    notify(res.data.message, "info", TIMEOUT);
    unselectAll(`${window.REACT_APP_COLUMBUS_SERVICE}/categories/products`);
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/products`);
  };

  /**
   * @function sequenceChangeHandler function to update sequence value
   * @param {object} event change event object
   */
  const sequenceChangeHandler = (event) => {
    const { name, value } = event.target;
    const elementIndex = productsequence.findIndex((el) => el.productId === name);
    const updatedSequence = [...productsequence];
    updatedSequence[elementIndex].sequence = value * 1;
    setEditProductObj((prevState) => ({
      ...prevState,
      productsequence: updatedSequence,
    }));
  };
  /**
   * @function validateThruDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateThruDate = (fromDateSelected) => (value) => {
    if (fromDateSelected === null) {
      return false;
    }
    return validateToDateField(fromDateSelected, value, translate("thru_date_error_message"));
  };
  /**
   *@function dialogContent
   *@param {string } message name of the action
   *@returns {React.createElement} returning ui for hide and show suppressed product page
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };
  /**
   *@function checkFormValidation function to validate form data
   * @returns {boolean} returning boolean value
   */
  const checkFormValidation = () => {
    let error = false;
    const invalidSequenceData = editProductObj.productsequence.filter((item) => item.sequence < 1);
    if (invalidSequenceData.length) {
      notify(translate("edit_products.sequence_field_error"), "error", TIMEOUT);
      setConfirmationBox(false);
      error = true;
    } else if (editProductObj.fromDate === null && editProductObj.thruDate === null) {
      notify(translate("edit_products.products_update_validate_message"), "error", TIMEOUT);
      setConfirmationBox(false);
      error = true;
    }
    return error;
  };
  /**
   * @function saveHandler function to save edited products details
   */
  const saveHandler = () => {
    if (!checkFormValidation()) {
      const updatedProductSequence = editProductObj.productsequence.map((item) => ({
        productId: item.productId,
        sequence: item.sequence,
      }));
      const payloadObj = { ...editProductObj, productsequence: updatedProductSequence };
      mutate(
        {
          type: "put",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/${categoryId}`,
          payload: {
            data: payloadObj,
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
      setConfirmationBox(false);
    }
  };
  /**
   *@function updateFormData function called on click of edit
   */
  const updateFormData = () => {
    setConfirmationBox(true);
  };

  const tableHeading = (
    <TableHead>
      <TableRow>
        {Object.values(tableHead).map((key) => (
          <TableCell align="center" key={key}>
            <Typography variant="h6">{key}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: `${categoryId}`,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show`,
    },
    {
      displayName: translate("products"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/products`,
    },
    { displayName: translate("edit_products.edit_title") },
  ];
  const editPageHeading = useMemo(
    () => (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Typography variant="h5" className={classes.pageTitleHeading}>
          {translate("edit_products.edit_header")}
          <span className={classes.mainTitleHeading}>{`[${translate("edit_products.id")}${categoryId}]`}</span>
        </Typography>
        <Divider variant="fullWidth" className={classes.headerClass} />
      </>
    ),
    [],
  );

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      {editPageHeading}
      <SimpleForm
        save={updateFormData}
        toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("save")} />}
      >
        <TableContainer component={Paper} align-items="center">
          <Table>
            {tableHeading}
            <TableBody>
              {productsequence.map((key) => {
                const { productUrl, productName, updatedAt, createdBy, updatedBy, sequence, productId } = key;
                return (
                  <TableRow key={productId}>
                    <TableCell align="center">
                      <Link href={productUrl} target="_blank">
                        {`${productName} [${productId}]`}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        name={productId}
                        disabled
                        defaultValue={sequence}
                        variant="outlined"
                        InputProps={{
                          inputProps: { min: 0, className: classes.smallInputNumber },
                        }}
                        onChange={sequenceChangeHandler}
                        error={sequence < 1}
                      />
                    </TableCell>
                    <TableCell align="center">{formatDateTime(updatedAt)}</TableCell>
                    <TableCell align="center">{createdBy}</TableCell>
                    <TableCell align="center">{updatedBy}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box maxWidth="59%">
          <Grid container alignItems="center" justify="space-between">
            <Grid item xs={5}>
              <DateTimeInput
                source="fromDate"
                label={translate("from_date")}
                data-at-id="fromDate"
                className={classes.formInputWidth}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={5}>
              <DateTimeInput
                source="thruDate"
                label={translate("through_date")}
                data-at-id="throughDate"
                className={classes.formInputWidth}
                onChange={handleDateChange}
                validate={validateThruDate(editProductObj.fromDate)}
              />
            </Grid>
          </Grid>
        </Box>
      </SimpleForm>
      <SimpleModel
        dialogContent={dialogContent(translate("save_confirmation_message"))}
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
        openModal={confirmationBox}
        handleClose={() => setConfirmationBox(false)}
        handleAction={saveHandler}
      />
    </>
  );
};
EditProductCategory.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  categoryId: PropTypes.string.isRequired,
  id: PropTypes.arrayOf(PropTypes.any).isRequired,
};
export default EditProductCategory;
