/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, SelectInput, DateInput, required, TextInput } from "react-admin";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography, Grid, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ViewTaxonomy from "../CategoryTaxonomy";
import useStyles from "../../../../../assets/theme/common";
import CustomToolbar from "../../../../../components/CustomToolbar";
import CustomTextInput from "../../../../../components/TextInput";
import { minValue } from "../../../../../utils/validationFunction";
import CustomViewUI from "../../../../../components/CustomViewUI/CustomViewUI";
import { getFormattedDateValue } from "../../../../../utils/formatDateTime";

/**
 * Component to render the View/Edit Page UI for Tag Relation
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const CategoryViewUI = (props) => {
  const {
    cancelTagHandler,
    categoryObj,
    onUpdateHandler,
    editable,
    deleteHandler,
    updateCheckbox,
    categoryTypes,
    checkedState,
    handleEditable,
  } = props;

  const { inheritCheckboxName, inheritCheckboxType } = checkedState;

  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <SimpleForm
        initialValues={categoryObj}
        save={onUpdateHandler}
        toolbar={
          editable ? <CustomToolbar saveButtonLabel={translate("Update")} onClickCancel={cancelTagHandler} /> : null
        }
      >
        <Grid container direction="row" className={classes.divideend}>
          <Typography variant="subtitle1">{translate("category_details")}</Typography>
          {!editable ? (
            <>
              <Grid item>
                <IconButton className={classes.buttonAlignment} onClick={handleEditable}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton onClick={deleteHandler}>
                  <DeleteOutlinedIcon />
                </IconButton>
              </Grid>
            </>
          ) : null}
        </Grid>

        <Grid container>
          <CustomViewUI gridSize={{ xs: 12, sm: 12, md: 3 }} label={translate("category_id")} value={categoryObj.id} />
          {!editable ? (
            <CustomViewUI
              gridSize={{ xs: 12, sm: 12, md: 3 }}
              label={translate("name")}
              value={categoryObj?.categoryName?.value}
            />
          ) : (
            <>
              <Grid item md={3}>
                <TextInput
                  source="categoryName.value"
                  type="text"
                  label={translate("name")}
                  value={categoryObj?.categoryName?.value}
                  validate={[required()]}
                />
                {editable && categoryObj.isBase ? (
                  <FormControlLabel
                    control={
                      <Checkbox checked={inheritCheckboxName} onChange={updateCheckbox} name="inheritCheckboxName" />
                    }
                    label={translate("inherit_value_from_base")}
                    className={classes.topMargin}
                  />
                ) : null}
              </Grid>
            </>
          )}
          <CustomViewUI
            gridSize={{ xs: 12, sm: 12, md: 3 }}
            label={translate("Classification")}
            value={categoryObj.categoryClassification}
          />
        </Grid>
        <Grid container>
          <Grid item md={3}>
            {!editable ? (
              <CustomViewUI
                gridSize={{ xs: 12, sm: 12, md: 12 }}
                label={translate("type_label")}
                value={categoryObj.categoryTypeNameShow}
              />
            ) : (
              <SelectInput
                source="categoryTypeName"
                optionText="name"
                optionValue="id"
                choices={categoryTypes}
                label="Type"
                className={classes.autoCompleteItem}
                disabled={!editable}
              />
            )}
            {editable && categoryObj.isBase ? (
              <FormControlLabel
                control={
                  <Checkbox checked={inheritCheckboxType} onChange={updateCheckbox} name="inheritCheckboxType" />
                }
                label={translate("inherit_value_from_base")}
                className={classes.topMargin}
              />
            ) : null}
          </Grid>
          <Grid item md={3}>
            {!editable ? (
              <CustomViewUI
                label={translate("from_date")}
                value={categoryObj.fromDate ? getFormattedDateValue(new Date(categoryObj.fromDate)) : ""}
              />
            ) : (
              <DateInput
                source="fromDate"
                label={translate("from_date")}
                className={classes.dateField}
                data-at-id="relationFromDate"
                disabled={!editable}
              />
            )}
          </Grid>
          <Grid item md={3}>
            {!editable ? (
              <CustomViewUI
                label={translate("to_date")}
                value={categoryObj.thruDate ? getFormattedDateValue(new Date(categoryObj.thruDate)) : ""}
              />
            ) : (
              <DateInput
                source="thruDate"
                label={translate("to_date")}
                className={classes.dateField}
                data-at-id="relationToDate"
                validate={minValue(categoryObj.fromDate, translate("to_date_validation_message"))}
                disabled={!editable}
              />
            )}
          </Grid>
        </Grid>
        <Grid container md={6} className={classes.bottomMargin}>
          <CustomTextInput
            label="URL"
            type="url"
            value={categoryObj?.categoryUrl}
            validate={[required()]}
            edit={editable}
            gridSize={{ xs: 12, sm: 12, md: 11 }}
            gridClass={classes.fullWidth}
          />
        </Grid>

        {categoryObj ? <ViewTaxonomy category={categoryObj} /> : null}
      </SimpleForm>
    </>
  );
};

CategoryViewUI.propTypes = {
  editable: PropTypes.bool.isRequired,
  categoryObj: PropTypes.objectOf(PropTypes.any).isRequired,
  checkedState: PropTypes.objectOf(PropTypes.any).isRequired,
  categoryTypes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  updateCheckbox: PropTypes.func.isRequired,
  handleEditable: PropTypes.func.isRequired,
};

export default React.memo(CategoryViewUI);
