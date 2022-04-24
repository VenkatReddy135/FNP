/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback } from "react";
import {
  SimpleForm,
  TextInput,
  SelectInput,
  DateInput,
  useTranslate,
  required,
  useDataProvider,
  useQueryWithStore,
  useNotify,
} from "react-admin";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import { setUrlValue } from "../../../../../actions/galleria";
import GenericRadioGroup from "../../../../../components/RadioGroup";
import AutoComplete from "../../../../../components/AutoComplete";
import TaxonomyDetails from "../CategoryTaxonomyDetails";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { minValue } from "../../../../../utils/validationFunction";

const requiredValidate = [required()];
const useStyles = makeStyles(() => ({
  categoryUrl: {
    width: "100%",
    marginTop: "8px",
    marginRight: "10px",
  },
  catBasic: {
    width: "100%",
    marginRight: "10px",
  },
  gapParent: {
    gap: "60px",
    display: "flex",
  },
}));

/**
 * Component for category basic.
 *
 * @param {*} props for category Basic details
 * @returns {React.ReactElement} returns a Category create Basic component
 */
const CategoryBasic = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const dataprovider = useDataProvider();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { updatedResponse } = props;
  const optionsRadioBtn = [
    { id: "url", name: "Url" },
    { id: "non-url", name: "Non-Url" },
  ];
  const [url, setUrl] = useState(optionsRadioBtn[0].id);
  const [categoryObj, updateCategoryObj] = useState(updatedResponse);
  const [categoryType, setCategoryType] = useState([]);
  const [categoryurl, setCategoryUrl] = useState("");
  const [urlTypeError, setUrlTypeError] = useState(false);
  const {
    baseUrlData: { id },
  } = useSelector((state) => state.baseCategoryUrl);
  const [categoryUrlValue, setCategoryUrlValue] = useState({
    id: categoryObj.id,
    name: id,
  });
  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/category-types`,
      payload: {},
    },
    {
      onSuccess: (res) => {
        const response = res?.data?.data;
        const categoryTypeValue = [];
        if (response) {
          response.forEach((data) => {
            categoryTypeValue.push({ id: data.id, name: data.categoryTypeName });
          });
          setCategoryType(categoryTypeValue);
        } else if (
          (response && response.errors && response.errors[0] && response.errors[0].message, "error", TIMEOUT)
        ) {
          notify(response.errors[0].message, "error", TIMEOUT);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );

  /**
   * @function updateBaseCategory function that gives the getOne call response
   * @param {event} event selected base category id
   * @param {object} newValue Object containing selected base category
   */
  const updateBaseCategory = useCallback(
    (event, newValue) => {
      dispatch(setUrlValue({ id: newValue && newValue.name }));
      setCategoryUrlValue(newValue);
      const baseCategoryObj = newValue && newValue.id;
      if (newValue) {
        dataprovider
          .getOne(`${window.REACT_APP_GALLERIA_SERVICE}/categories/${baseCategoryObj}`, {
            data: null,
          })
          .then((response) => {
            if (response.data && response.status === "success") {
              updateCategoryObj(response.data);
              setUrlTypeError(false);
            } else if (
              (response.data.errors && response.data.errors[0].errorCode && response.data.errors[0].message,
              "error",
              TIMEOUT)
            ) {
              notify(response.data.errors[0].message, "error", TIMEOUT);
            }
          });
      }
    },
    [notify, dataprovider, dispatch],
  );

  /**
   * @function updateCategoryName updates category name onchange
   * @param {event} event changed value for category name
   */
  const updateCategoryName = useCallback(
    (event) => {
      if (categoryObj.categoryName && categoryObj.categoryName.value) {
        const newCategoryName = { ...categoryObj.categoryName };
        newCategoryName.value = event.target.value;
        updateCategoryObj({ ...categoryObj, categoryName: newCategoryName });
      } else {
        updateCategoryObj({ ...categoryObj, categoryName: { value: event.target.value } });
      }
    },
    [categoryObj],
  );

  /**
   * @function updateCategoryType updates category type onchange
   * @param {event} event changed value for category type
   */
  const updateCategoryType = useCallback(
    (event) => {
      if (categoryObj.categoryType && categoryObj.categoryType.value && categoryObj.categoryType.value.id) {
        categoryObj.categoryType.value.id = event.target.value;
      } else {
        categoryObj.categoryType = {};
        categoryObj.categoryType.value = {};
        categoryObj.categoryType.value.id = event.target.value;
      }
    },
    [categoryObj],
  );
  /**
   * @function updateCategoryUrl updates category type onchange
   * @param {event} event value of category url
   */
  const updateCategoryUrl = useCallback(
    (event) => {
      categoryObj.categoryUrl = event.target.value;
      updateCategoryObj(categoryObj);
      setCategoryUrl(event.target.value);
      props.categoryUrlVal(event.target.value.toLowerCase());
      setUrlTypeError(false);
    },
    [props, categoryObj],
  );
  /**
   * @function categoryUrlError checks the value of category url onBlur
   */
  const categoryUrlError = useCallback(() => {
    if (!categoryObj.categoryUrl) setUrlTypeError(true);
  }, [categoryObj]);

  /**
   * @function getDisplayText
   * @param {Array } optionsArr array of objects to filter
   * @param {string } propertyToMatch property of object to match
   * @param {string } propertyToReturn property of object expected to return
   * @returns {string} text to display is returned
   */
  const getDisplayText = useCallback((optionsArr, propertyToMatch, propertyToReturn) => {
    let result = optionsArr.filter((obj) => obj.id === propertyToMatch)[0];
    if (result) {
      result = propertyToReturn ? result[propertyToReturn] : result.name;
    }
    return result;
  }, []);
  /**
   * handle change event for radio group values
   *
   * @param {*} value value of selected radio group option
   * @param {*} name of radio group
   */
  const handleChange = useCallback(
    (value, name) => {
      setUrl({ [name]: value });
      categoryObj.categoryClassification = value;
      updateCategoryObj({ ...categoryObj, categoryClassification: value });
    },
    [categoryObj],
  );

  /**
   * @function getCatUrl
   * @param {event} event category url
   */
  const getCatUrl = useCallback(
    (event) => {
      setCategoryUrl(event);
      props.categoryUrlVal(event.toLowerCase());
      setUrlTypeError(false);
    },
    [props],
  );
  /**
   * @function getUpdatedVal
   * @param {event} event updated response
   */
  const getUpdatedVal = useCallback(
    (event) => {
      updateCategoryObj(event);
      props.ResponseData(event);
    },
    [props],
  );

  props.ResponseData(categoryObj);
  const apiParams = {
    fieldName: "categoryUrl",
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
    sortParam: "categoryName",
    fieldId: "categoryId",
  };
  return (
    <div>
      <SimpleForm initialValues={categoryObj} toolbar={<></>}>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" xs={3}>
          <AutoComplete
            label={translate("base_category")}
            dataId="baseCategory"
            value={categoryUrlValue}
            apiParams={apiParams}
            onOpen
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateBaseCategory(e, newValue);
            }}
          />
        </Grid>
        <Grid
          className={classes.gapParent}
          container
          direction="row"
          alignItems="flex-start"
          justify="space-between"
          xs={9}
        >
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs={4}>
            <GenericRadioGroup
              label={translate("category_classify")}
              source="categoryClassification"
              choices={optionsRadioBtn}
              editable
              displayText={getDisplayText(optionsRadioBtn, url)}
              onChange={(e) => handleChange(e, "Category-Classification")}
            />
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <TextInput
              source="categoryName.value"
              label={translate("category_name")}
              className={classes.catBasic}
              data-at-id="createCategoryName"
              validate={requiredValidate}
              autoComplete="off"
              variant="standard"
              onChange={updateCategoryName}
            />
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <SelectInput
              source="categoryType.value.id"
              choices={categoryType}
              label={translate("category_type")}
              className={classes.catBasic}
              validate={requiredValidate}
              data-at-id="createCategoryType"
              variant="standard"
              onChange={updateCategoryType}
            />
          </Grid>
        </Grid>
        <Grid
          className={classes.gapParent}
          container
          direction="row"
          alignItems="flex-start"
          justify="space-between"
          xs={12}
        >
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs={6}>
            <TextField
              label={translate("category_url")}
              className={classes.categoryUrl}
              data-at-id="createCategoryName"
              variant="standard"
              required
              value={categoryObj.categoryUrl || categoryurl}
              autoComplete="off"
              onChange={updateCategoryUrl}
              onBlur={categoryUrlError}
              error={urlTypeError}
              helperText={urlTypeError ? `* Required` : null}
            />
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <DateInput
              source="fromDate"
              label={translate("from_date")}
              className={classes.catBasic}
              data-at-id="createCategoryfromDate"
              onChange={(event) => updateCategoryObj({ ...categoryObj, fromDate: event.target.value })}
            />
          </Grid>
          <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
            <DateInput
              source="thruDate"
              label={translate("to_date")}
              className={classes.catBasic}
              data-at-id="createCategorytoDate"
              validate={minValue(categoryObj.fromDate, translate("to_date_validation_message"))}
              onChange={(event) => updateCategoryObj({ ...categoryObj, thruDate: event.target.value })}
            />
          </Grid>
        </Grid>
        <TaxonomyDetails catUrl={getCatUrl} taxonomyObj={categoryObj} updatedTaxonomy={getUpdatedVal} />
      </SimpleForm>
    </div>
  );
};
CategoryBasic.propTypes = {
  categoryUrlVal: PropTypes.func,
  ResponseData: PropTypes.objectOf(PropTypes.any),
  updatedResponse: PropTypes.objectOf(PropTypes.any),
};
CategoryBasic.defaultProps = {
  categoryUrlVal: () => {},
  ResponseData: {},
  updatedResponse: {},
};
export default React.memo(CategoryBasic);
