import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Divider, Grid, Typography, makeStyles } from "@material-ui/core";
import {
  FormWithRedirect,
  FormDataConsumer,
  SelectInput,
  NumberInput,
  DateInput,
  useTranslate,
  useRedirect,
  useNotify,
} from "react-admin";
import { isEmpty } from "lodash";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import CustomAutoComplete from "../../../../../components/CustomAutoComplete";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import {
  OPERATOR_LIST,
  DEFAULT_CONTAINS_OPERATOR,
  DEFAULT_EQUALS_OPERATOR,
  SEARCH_STATE_MUTATORS,
  dateRangeValidation,
  filterReducer,
  resetFieldBySource,
  isMultiSelection,
} from "../../../niftyConfig";
import useNiftyStyles from "../../../niftyStyle";
import useCommonStyles from "../../../../../assets/theme/common";
import CommonImport from "../../../../../components/CommonImport";

const useStyles = makeStyles(() => ({
  autoCompleteRoot: {
    width: 220,
    marginBottom: 26,
  },
  priceField: {
    width: 102,
  },
  singlePriceField: {
    width: 220,
  },
}));

/**
 * Operator dropdown component
 *
 * @param {object} props search FC-Component Price Master
 * @returns {React.ReactElement} search FC-Component Price Master
 */
const OperatorDropdown = React.memo((props) => {
  const { source, label, onChange, testId } = props;
  return (
    <SelectInput
      data-test-id={testId}
      label={label}
      source={source}
      choices={OPERATOR_LIST}
      variant="standard"
      margin="normal"
      onChange={onChange}
    />
  );
});

OperatorDropdown.propTypes = {
  source: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string,
  onChange: PropTypes.func,
};

OperatorDropdown.defaultProps = {
  testId: "",
  onChange: () => {},
};

const PRICE_OPERATOR_LIST = [
  { id: "Equals", name: "Equals" },
  { id: "Does not Equal", name: "Does not Equal" },
  { id: "Between", name: "Between" },
];

const importConfig = {
  fileType: "csv",
  specName: "CategoryImportJobSpec",
};

const domainApiParams = {
  fieldName: "tagId",
  type: "getData",
  url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
  sortParam: "tagName",
  fieldId: "tagId",
};

const fulfillmentGeoApiParams = {
  fieldName: "countryName",
  type: "getData",
  url: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
  sortParam: "countryName",
  fieldId: "countryId",
};

/**
 * FC-Component Price Master search component
 *
 * @returns {React.ReactElement} search FC-Component Price Master
 */
const FCComponentPriceMasterSearch = () => {
  const classes = useStyles();
  const niftyClasses = useNiftyStyles();
  const commonClasses = useCommonStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const [urlFlag, setUrlFlag] = useState(false);
  const [filterFields] = useState([
    "fcGroupName",
    "fulfillmentGeo",
    "componentName",
    "fromPrice",
    "toPrice",
    "fromDate",
    "toDate",
    "price",
  ]);
  const [searchState] = useState({
    fcGroupName: "",
    fcGroupNameOperator: DEFAULT_CONTAINS_OPERATOR,
    fulfillmentGeo: "",
    fulfillmentGeoOperator: DEFAULT_CONTAINS_OPERATOR,
    componentName: "",
    componentNameOperator: DEFAULT_CONTAINS_OPERATOR,
    fromPrice: "",
    toPrice: "",
    priceOperator: DEFAULT_EQUALS_OPERATOR,
    fromDate: "",
    fromDateOperator: DEFAULT_CONTAINS_OPERATOR,
    toDate: "",
    toDateOperator: DEFAULT_CONTAINS_OPERATOR,
  });

  const breadcrumbs = [
    {
      displayName: translate("fcComponentPriceMaster.price_master"),
    },
  ];

  /**
   * Function to handle search apply action and redirect with query param to list page
   *
   * @function searchSubmitHandler handler function for search submit
   * @param {object} searchData update form data
   */
  const searchSubmitHandler = (searchData) => {
    const userInputs = { ...searchData };
    const mappedData = filterReducer(userInputs, filterFields);
    if (isEmpty(mappedData)) {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    } else {
      redirect(
        `/${window.REACT_APP_NIFTY_SERVICE}/price-master?search=${encodeURIComponent(JSON.stringify(mappedData))}`,
      );
    }
  };

  /**
   *  Function to return Price fields based on selected operator
   *
   * @param {object} formData current form data
   * @returns {React.ReactElement} search FC-Component Price Master
   */
  const priceFieldRenderer = (formData) => {
    return formData.priceOperator === PRICE_OPERATOR_LIST[2].id ? (
      <>
        <Grid item>
          <NumberInput
            data-test-id="fromPrice"
            label={translate("From Price")}
            source="fromPrice"
            autoComplete="off"
            classes={{ root: classes.priceField }}
            variant="standard"
            margin="normal"
          />
        </Grid>
        <Grid item>
          <NumberInput
            data-test-id="toPrice"
            label={translate("To Price")}
            source="toPrice"
            autoComplete="off"
            classes={{ root: classes.priceField }}
            variant="standard"
            margin="normal"
          />
        </Grid>
      </>
    ) : (
      <Grid item>
        <NumberInput
          data-test-id="price"
          label={translate("Price")}
          source="price"
          autoComplete="off"
          classes={{ root: classes.singlePriceField }}
          variant="standard"
          margin="normal"
        />
      </Grid>
    );
  };

  /**
   *Function to fetch pre-signed url.
   *
   * @function fetchUrl
   */
  const fetchUrl = () => {
    setUrlFlag(true);
  };

  /**
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setUrlFlag(false);
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid item className={commonClasses.gridStyle}>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {translate("fcComponentPriceMaster.price_master")}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={fetchUrl}>
            {translate("importTitle")}
          </Button>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" style={{ marginBottom: 20 }} />
      <FormWithRedirect
        initialValues={searchState}
        save={searchSubmitHandler}
        mutators={SEARCH_STATE_MUTATORS}
        render={({ handleSubmitWithRedirect, form }) => (
          <form>
            <FormDataConsumer>
              {({ formData }) => (
                <>
                  <Grid container wrap="nowrap" direction="row" justify="flex-start" alignItems="center" spacing={2}>
                    <Grid item>
                      <OperatorDropdown
                        label={translate("operator")}
                        testId="fcGroupNameOperator"
                        source="fcGroupNameOperator"
                        onChange={() => {
                          resetFieldBySource("fcGroupName", "fcGroupNameOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.fcGroupNameOperator)}
                        source="fcGroupName"
                        label={translate("FC Group Name")}
                        apiParams={domainApiParams}
                        additionalFilter={[
                          {
                            fieldName: "TagTypeId",
                            operatorName: "Like",
                            fieldValue: "PT",
                          },
                        ]}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        label={translate("operator")}
                        testId="fulfillmentGeoOperator"
                        source="fulfillmentGeoOperator"
                        onChange={() => {
                          resetFieldBySource("fulfillmentGeo", "fulfillmentGeoOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.fulfillmentGeoOperator)}
                        label={translate("Fulfillment Geo")}
                        source="fulfillmentGeo"
                        apiParams={fulfillmentGeoApiParams}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                    <Grid item>
                      <OperatorDropdown
                        label={translate("operator")}
                        testId="componentNameOperator"
                        source="componentNameOperator"
                        onChange={() => {
                          resetFieldBySource("componentName", "componentNameOperator", form, formData);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <CustomAutoComplete
                        multipleSelect={isMultiSelection(formData.componentNameOperator)}
                        label={translate("Component Name")}
                        source="componentName"
                        apiParams={domainApiParams}
                        additionalFilter={[
                          {
                            fieldName: "TagTypeId",
                            operatorName: "Like",
                            fieldValue: "PT",
                          },
                        ]}
                        rootClass={classes.autoCompleteRoot}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} wrap="nowrap" direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <SelectInput
                        data-test-id="priceOperator"
                        source="priceOperator"
                        label={translate("operator")}
                        variant="standard"
                        choices={PRICE_OPERATOR_LIST}
                        className={`${classes.operatorField}`}
                        margin="normal"
                      />
                    </Grid>
                    {priceFieldRenderer(formData)}
                    <Grid item>
                      <SelectInput
                        data-test-id="fromDateOperator"
                        source="fromDateOperator"
                        label={translate("operator")}
                        variant="standard"
                        choices={OPERATOR_LIST}
                        className={`${niftyClasses.configField}`}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <DateInput
                        source="fromDate"
                        label={translate("from_date")}
                        data-test-id="fromDate"
                        margin="normal"
                        variant="standard"
                        classes={{ root: niftyClasses.searchField }}
                      />
                    </Grid>
                    <Grid item>
                      <SelectInput
                        data-test-id="toDateOperator"
                        source="toDateOperator"
                        label={translate("operator")}
                        variant="standard"
                        choices={OPERATOR_LIST}
                        className={`${niftyClasses.configField}`}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <DateInput
                        source="toDate"
                        label={translate("to_date")}
                        data-test-id="toDate"
                        margin="normal"
                        variant="standard"
                        validate={[dateRangeValidation(form, translate("to_date_validation_message"), "fromDate")]}
                        classes={{ root: niftyClasses.searchField }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </FormDataConsumer>

            <Grid style={{ marginTop: 40 }}>
              <Button variant="outlined" color="default">
                {translate("cancel")}
              </Button>
              <Button variant="contained" color="default" onClick={handleSubmitWithRedirect}>
                {translate("apply")}
              </Button>
            </Grid>
          </form>
        )}
      />
      {urlFlag ? (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
          acceptFileType=".csv"
        />
      ) : null}
    </>
  );
};

export default React.memo(FCComponentPriceMasterSearch);
