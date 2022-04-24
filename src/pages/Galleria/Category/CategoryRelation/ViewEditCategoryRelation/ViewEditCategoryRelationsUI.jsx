/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  SimpleForm,
  SelectInput,
  RadioButtonGroupInput,
  NumberInput,
  DateInput,
  required,
  Toolbar,
  Button,
  SimpleShowLayout,
  SaveButton,
} from "react-admin";
import { Typography, Grid, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../../../assets/theme/common";
import { primaryChoices } from "./ViewEditCategoryRelationConstants";
import { getFormattedDate } from "../../../../../utils/formatDateTime";
import LoaderComponent from "../../../../../components/LoaderComponent";
import AutoComplete from "../../../../../components/AutoComplete";
import SwitchComp from "../../../../../components/switch";
import { minValue } from "../../../../../utils/validationFunction";

const requiredValidate = [required()];

/**
 * Function renderRelationFields returns a re-usable Grid component that is being rendered at multiple places
 *
 * @param {object} classes css styles for typography
 * @param {string} firstFieldTitle first Paramter Title of the Grid component
 * @param {string} firstFieldValue first Paramter Value of the Grid component
 * @param {string} secondFieldTitle second Paramter Title of the Grid component
 * @param {string} secondFieldValue second Paramter Value of the Grid component
 * @returns {React.ReactElement} returns a re-usable Grid component
 */
const renderRelationFields = (classes, firstFieldTitle, firstFieldValue, secondFieldTitle, secondFieldValue) => {
  return (
    <Grid className={classes.customMargin} item container justify="space-evenly" alignItems="center" md={6}>
      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
        <Typography variant="caption">{firstFieldTitle}</Typography>
        <Typography variant="h6">{firstFieldValue}</Typography>
      </Grid>
      <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
        <Typography variant="caption">{secondFieldTitle}</Typography>
        <Typography variant="h6">{secondFieldValue}</Typography>
      </Grid>
    </Grid>
  );
};

/**
 * Component to render the View/Edit Page UI for Category Relation Management
 *
 * @param {*} props props for category config
 * @returns {React.ReactElement} category config view
 */
const ViewEditCategoryRelationsUI = (props) => {
  const {
    responseData,
    isEditable,
    selectedCategoryId,
    relationTypes,
    cancelTagHandler,
    handleCategoryNameChange,
    handleFromDateChange,
    handleToDateChange,
    deleteToggleOpen,
    switchToEditHandler,
    handleIsEnabledChange,
    isEnabled,
    loading,
    categoryNameVal,
    handleUpdatedObj,
    fromDate,
    errorMsg,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const selectedAssociationId = localStorage.getItem("selectedAssociationId");

  /**
   * @function viewModeText function renders the Typography text for View Mode
   * @param {string } label field label
   * @param {inputData} inputData field input data from API response
   * @returns {React.createElement} returns a Typography label and text
   */
  const viewModeText = (label, inputData) => (
    <>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="h6">{inputData}</Typography>
    </>
  );

  /**
   * CustomToolbar for Category Relation View/Edit component
   *
   * @param {*} toolbarProps all the toolbarProps required by CustomToolbar of Category Relation View/Edit component
   * @returns {React.ReactElement} CustomToolbar of Category Relation View/Edit component
   */
  const CustomToolbar = (toolbarProps) => (
    <Toolbar {...toolbarProps}>
      <Button variant="outlined" label={translate("cancel")} onClick={cancelTagHandler} />
      <SaveButton icon={<></>} variant="contained" label={translate("update")} />
    </Toolbar>
  );

  const apiParams = {
    fieldName: "categoryName",
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
    sortParam: "categoryName",
    fieldId: "categoryId",
  };
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleShowLayout component="div">
          <SimpleForm
            save={handleUpdatedObj}
            initialValues={responseData}
            toolbar={isEditable ? <CustomToolbar /> : null}
          >
            <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={12}>
              <Grid item className={classes.titleGridStyle}>
                <Typography variant="h4">{selectedAssociationId}</Typography>
                <SwitchComp record={isEnabled} disable={!isEditable} onChange={(val) => handleIsEnabledChange(val)} />
              </Grid>
              {isEditable ? null : (
                <Grid item className={classes.titleGridStyle}>
                  <IconButton onClick={switchToEditHandler}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteOutlinedIcon onClick={deleteToggleOpen} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid
              className={classes.customMargin}
              item
              container
              direction="row"
              alignItems="flex-start"
              justify="space-between"
              md={9}
            >
              <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                {viewModeText(translate("category_id"), selectedCategoryId)}
              </Grid>
              <Grid
                item
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                xs
                className={classes.categoryRelationLeft}
              >
                <AutoComplete
                  label={translate("category_name")}
                  dataId="categoryEditRelationName"
                  apiParams={apiParams}
                  disabled={!isEditable}
                  value={categoryNameVal}
                  onOpen
                  required
                  autoCompleteClass={classes.autoCompleteItem}
                  onChange={(e, newValue) => {
                    handleCategoryNameChange(e, newValue);
                  }}
                  errorMsg={errorMsg}
                />
              </Grid>
              <Grid
                item
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                xs
                className={classes.relationShipType}
              >
                {isEditable && responseData.associationType !== "Derived" && responseData.associationType !== "Base" ? (
                  <SelectInput
                    source="associationTypeId"
                    choices={relationTypes}
                    validate={requiredValidate}
                    label={translate("relation_type")}
                    className={classes.autoCompleteItem}
                    data-at-id="relation_type"
                    value={responseData?.associationTypeId}
                  />
                ) : (
                  viewModeText(
                    translate("relation_type"),
                    responseData.associationType ? responseData.associationType : "",
                  )
                )}
              </Grid>
            </Grid>
            <Grid className={classes.customMargin} item container justify="space-evenly" alignItems="center" md={6}>
              <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                {isEditable ? (
                  <RadioButtonGroupInput
                    source="isPrimary"
                    choices={primaryChoices}
                    label={translate("primary")}
                    className={classes.radioButtons}
                  />
                ) : (
                  viewModeText(translate("primary"), responseData.isPrimary ? translate("yes") : translate("no"))
                )}
              </Grid>
              <Grid
                item
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                xs
                className={classes.categoryRelationLeft}
              >
                <NumberInput
                  source="sequence"
                  className={classes.sequence}
                  label={translate("sequence")}
                  autoComplete="off"
                  min={1}
                  type="tel"
                  data-at-id="sequence"
                  disabled={!isEditable}
                />
              </Grid>
            </Grid>
            <Grid className={classes.customMargin} item container justify="space-evenly" alignItems="center" md={6}>
              <Grid
                item
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                xs
                className={classes.categoryRelationLeft}
              >
                <DateInput
                  source="fromDate"
                  label={translate("from_date")}
                  className={classes.dateField}
                  format={getFormattedDate}
                  disabled={!isEditable}
                  onChange={handleFromDateChange}
                />
              </Grid>
              <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                <DateInput
                  source="thruDate"
                  label={translate("to_date")}
                  format={getFormattedDate}
                  className={classes.dateField}
                  validate={minValue(getFormattedDate(fromDate), translate("to_date_validation_message"))}
                  disabled={!isEditable}
                  onChange={handleToDateChange}
                />
              </Grid>
            </Grid>
            {renderRelationFields(
              classes,
              translate("relations_created_by"),
              responseData.createdByName,
              translate("relations_created_date"),
              getFormattedDate(responseData.createdAt),
            )}
            {renderRelationFields(
              classes,
              translate("last_modified_by"),
              responseData.updatedByName,
              translate("last_modified_date"),
              getFormattedDate(responseData.updatedAt),
            )}
          </SimpleForm>
        </SimpleShowLayout>
      )}
    </>
  );
};

ViewEditCategoryRelationsUI.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  errorMsg: PropTypes.bool,
  selectedCategoryId: PropTypes.string.isRequired,
  responseData: PropTypes.objectOf(PropTypes.any).isRequired,
  relationTypes: PropTypes.arrayOf(PropTypes.any).isRequired,
  fromDate: PropTypes.objectOf(PropTypes.any).isRequired,
  handleUpdatedObj: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  handleCategoryNameChange: PropTypes.func.isRequired,
  handleFromDateChange: PropTypes.func.isRequired,
  handleToDateChange: PropTypes.func.isRequired,
  deleteToggleOpen: PropTypes.func.isRequired,
  switchToEditHandler: PropTypes.func.isRequired,
  handleIsEnabledChange: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  categoryNameVal: PropTypes.string.isRequired,
};

ViewEditCategoryRelationsUI.defaultProps = {
  errorMsg: false,
};

export default React.memo(ViewEditCategoryRelationsUI);
