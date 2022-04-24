/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { SimpleForm, RadioButtonGroupInput, DateInput } from "react-admin";
import Dropdown from "../../../../components/Dropdown";
import AutoComplete from "../../../../components/AutoComplete";
import CustomToolbar from "../../../../components/CustomToolbar";
import CustomTextInput from "../../../../components/TextInput";

/**
 * Advanced search tool
 *
 * @param {object} props props
 * @returns {React.Component} //return component
 */
const AdvanceSearchCategoryForm = (props) => {
  const {
    searchTagsHandler,
    cancelHandler,
    translate,
    classes,
    handleAutocomplete,
    operatorList,
    apiParams,
    tagTypes,
    values,
    apiPartyParams,
    handleFromDateChange,
    minValue,
    selectedFromDate,
    handleThruDateChange,
    selectedThruDate,
  } = props;
  return (
    <SimpleForm
      save={searchTagsHandler}
      toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("apply")} />}
    >
      <Grid container>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              xs={6}
              className={classes.dropdownStyle}
              label="contains"
              source="category_name_operator"
              data={operatorList}
              edit
            />
            <CustomTextInput label="category_name" edit gridSize={{ xs: 6 }} />
          </Grid>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              xs={6}
              className={classes.dropdownStyle}
              label="contains"
              source="category_type_operator"
              data={operatorList}
              edit
            />
            <Dropdown gridSize={{ md: 6 }} className={classes.fullWidth} label="category_type" data={tagTypes} edit />
          </Grid>
        </Grid>
        <Grid item fullWidth md={12} className={classes.gapParent}>
          <Dropdown
            xs={6}
            className={classes.dropdownStyle}
            label="contains"
            source="category_url_operator"
            data={operatorList}
            edit
          />
          <CustomTextInput gridSize={{ md: 9 }} label="category_url" edit />
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              xs={6}
              className={classes.dropdownStyle}
              label="contains"
              source="category_id_operator"
              data={operatorList}
              edit
            />
            <CustomTextInput label="category_id" edit gridSize={{ xs: 6 }} />
          </Grid>
          <Grid item xs={12}>
            <RadioButtonGroupInput
              label={translate("category_classification")}
              source="categoryClassification"
              choices={[
                { id: "All", name: "All" },
                { id: "url", name: "Url" },
                { id: "non-url", name: "Non-Url" },
              ]}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={6} className={classes.gapParent}>
            <DateInput
              label={translate("from_date_between")}
              source="fromDate"
              onChange={handleFromDateChange}
              className={classes.dateParent}
            />
            <DateInput
              label={null}
              source="from_date_between"
              validate={minValue(new Date(selectedFromDate), translate("to_date_validation_message"))}
              className={classes.dateParent}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={6} className={classes.gapParent}>
            <DateInput
              label={translate("to_date_between")}
              source="thruDate"
              onChange={handleThruDateChange}
              validate={minValue(new Date(selectedFromDate), translate("to_date_validation_message"))}
              className={classes.dateParent}
            />
            <DateInput
              label={null}
              source="thru_date_between"
              validate={minValue(new Date(selectedThruDate), translate("to_date_validation_message"))}
              className={classes.dateParent}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <RadioButtonGroupInput
            label={translate("isEnabled")}
            source="isEnabled"
            choices={[
              { id: "All", name: "All" },
              { id: "true", name: "Yes" },
              { id: "false", name: "No" },
            ]}
          />
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="domain_operator"
              data={operatorList}
              edit
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("domain")}
                dataId="domain"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagId" }}
                onOpen
                value={values.domain}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "domain");
                }}
                fullWidth
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "D" }]}
              />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="geography_operator"
              data={operatorList}
              edit
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("category_geography")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={values.geography}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "geography");
                }}
                fullWidth
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "G" }]}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="product_type_operator"
              data={operatorList}
              edit
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("plp_global_filter.product_type")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={values.productType}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "productType");
                }}
                fullWidth
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "PT" }]}
              />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="occasion_type_operator"
              data={operatorList}
              edit
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("category_occ")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={values.occasion}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "occasion");
                }}
                fullWidth
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "O" }]}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.flexParent}>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="city_operator"
              data={operatorList}
              edit
              disabled={!values?.geography?.name}
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("city")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={values.city}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "city");
                }}
                fullWidth
                additionalFilters={[
                  { fieldName: "geography", operatorName: "EqualTo", fieldValue: values.geography.name },
                  { fieldName: "tagTypeId", operatorName: "EqualTo", fieldValue: "C" },
                ]}
                disabled={!values?.geography?.name}
              />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.gapParent}>
            <Dropdown
              className={classes.dropdownStyle}
              label="contains"
              source="recipient_operator"
              data={operatorList}
              edit
            />
            <div className={classes.newtagPickerDropdown}>
              <AutoComplete
                label={translate("category_recipient")}
                dataId="tagName"
                apiParams={{ ...apiParams, fieldName: "tagName", fieldId: "tagName" }}
                onOpen
                value={values.recipient}
                onChange={(e, newValue) => {
                  handleAutocomplete(e, newValue, "recipient");
                }}
                fullWidth
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "R" }]}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.gapParent}>
          <Dropdown
            className={classes.dropdownStyle}
            label="contains"
            source="party_operator"
            data={operatorList}
            edit
          />
          <div className={classes.newtagPickerDropdown}>
            <AutoComplete
              label={translate("category_party")}
              dataId="tagName"
              apiParams={{ ...apiPartyParams, fieldName: "name", fieldId: "id" }}
              onOpen
              value={values.party}
              onChange={(e, newValue) => {
                handleAutocomplete(e, newValue, "party");
              }}
              fullWidth
            />
          </div>
        </Grid>
      </Grid>
    </SimpleForm>
  );
};
AdvanceSearchCategoryForm.propTypes = {
  searchTagsHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  handleAutocomplete: PropTypes.func.isRequired,
  operatorList: PropTypes.objectOf(PropTypes.any).isRequired,
  apiParams: PropTypes.objectOf(PropTypes.any).isRequired,
  apiPartyParams: PropTypes.objectOf(PropTypes.any).isRequired,
  tagTypes: PropTypes.objectOf(PropTypes.any).isRequired,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  handleFromDateChange: PropTypes.func.isRequired,
  handleThruDateChange: PropTypes.func.isRequired,
  minValue: PropTypes.func.isRequired,
  selectedFromDate: PropTypes.string.isRequired,
  selectedThruDate: PropTypes.string.isRequired,
};
export default React.memo(AdvanceSearchCategoryForm);
