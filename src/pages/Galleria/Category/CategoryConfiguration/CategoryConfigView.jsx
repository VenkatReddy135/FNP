/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { Button, SimpleForm, NumberInput, useTranslate, SaveButton, Toolbar } from "react-admin";
import GenericRadioGroup from "../../../../components/RadioGroup";
import useStyles from "./CategoryConfigStyle";
import { options, optionsMicrosite, optionsDisplayName, getDisplayText } from "./CategoryConfigConstants";
import LoaderComponent from "../../../../components/LoaderComponent";

/**
 *
 * @param {*} props props for category config
 * @returns {React.ReactElement} category config view
 */
const CategoryConfigView = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const {
    formattedResponseData,
    editObj,
    radioGroupOptions,
    handleCheckboxUpdate,
    handleReset,
    editable,
    setEditable,
    backupData,
    handleCategoryTypeUpdate,
    loading,
    updateConfiguration,
  } = props;

  const showInheritCheckbox = editObj["is-derived"] && editable;

  /**
   * @param {object} customProps props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (customProps) => {
    return (
      <Toolbar {...customProps}>
        <Button variant="outlined" label="Cancel" onClick={handleReset} />
        <SaveButton label="Update" icon={<></>} variant="contained" />
      </Toolbar>
    );
  };
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm
          initialValues={formattedResponseData}
          save={updateConfiguration}
          toolbar={editable ? <CustomToolbar /> : null}
        >
          <Grid container direction="row">
            <Typography variant="subtitle1">{translate("configuration_title")}</Typography>
            {!editable ? (
              <IconButton className={classes.buttonAlignment} onClick={() => setEditable(true)}>
                <EditOutlinedIcon />
              </IconButton>
            ) : null}
          </Grid>
          <Grid item container spacing={3} justify="space-between" md={12}>
            {radioGroupOptions.row1.map((option) => {
              const { label, key, inheritKey } = option;
              return (
                <Grid key={key} item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <GenericRadioGroup
                    name={key}
                    label={label}
                    source={key}
                    choices={options}
                    editable={editable}
                    displayText={getDisplayText(options, editObj[key])}
                  />
                  {showInheritCheckbox ? (
                    <Grid item>
                      <Checkbox
                        color="primary"
                        name={inheritKey}
                        onChange={(e) => handleCheckboxUpdate(e)}
                        checked={editObj[inheritKey] || false}
                        defaultValue={editObj[inheritKey]}
                      />
                      <span>{translate("inherit_from_base")}</span>
                    </Grid>
                  ) : null}
                </Grid>
              );
            })}
            <Grid item className={editable ? classes.checkboxPadding : classes.disablePadding} xs>
              <p className={classes.checkboxWrapper}>{translate("category_type")}</p>
              <Checkbox
                name="is-base"
                source="is-base"
                disabled
                onChange={(e) => handleCheckboxUpdate(e)}
                checked={editObj["is-base"] || false}
                value={editObj["is-base"]}
              />
              {translate("base_label")}
              <Checkbox
                disabled
                source="is-derived"
                name="is-derived"
                classes={{
                  label: classes.label,
                }}
                onChange={(e) => handleCheckboxUpdate(e)}
                checked={editObj["is-derived"] || false}
                value={editObj["is-derived"]}
              />
              {translate("derived_label")}
              <Checkbox
                name="is-independent"
                source="is-independent"
                classes={{
                  label: classes.label,
                }}
                onChange={(e) => handleCategoryTypeUpdate(e)}
                checked={editObj["is-independent"] || false}
                value={editObj["is-independent"]}
                disabled={backupData["is-independent"] ? true : !editable}
              />
              {translate("independent_label")}
            </Grid>
          </Grid>
          <Grid item container spacing={3} justify="space-between" md={8}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <GenericRadioGroup
                name="is-microsite-plp"
                label={translate("microsite_standard_label")}
                source="is-microsite-plp"
                choices={optionsMicrosite}
                editable={editable}
                displayText={getDisplayText(optionsMicrosite, editObj["is-microsite-plp"])}
              />
            </Grid>
            <GenericRadioGroup
              name="site-map"
              source="site-map"
              label={translate("sitemap_label")}
              choices={options}
              editable={editable}
              displayText={getDisplayText(options, editObj["site-map"])}
            />
          </Grid>
          <Grid item container spacing={3} justify="space-between" md={12}>
            {radioGroupOptions.row3.map((option) => {
              const { label, key, inheritKey } = option;
              return (
                <Grid key={key} item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <GenericRadioGroup
                    name={key}
                    label={label}
                    source={key}
                    choices={options}
                    editable={editable}
                    displayText={getDisplayText(options, editObj[key])}
                  />
                  {showInheritCheckbox ? (
                    <Grid item className={classes.inheritCheck}>
                      <Checkbox
                        color="primary"
                        name={inheritKey}
                        onChange={(e) => handleCheckboxUpdate(e)}
                        checked={editObj[inheritKey] || false}
                        value={editObj[inheritKey]}
                      />
                      <span>{translate("inherit_from_base")}</span>
                    </Grid>
                  ) : null}
                </Grid>
              );
            })}
          </Grid>
          <Grid item container spacing={3} justify="space-between" md={8}>
            {radioGroupOptions.row4.map((option) => {
              const { label, key, inheritKey } = option;
              return (
                <Grid key={key} item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                  <GenericRadioGroup
                    name={key}
                    label={label}
                    source={key}
                    choices={options}
                    editable={editable}
                    displayText={getDisplayText(options, editObj[key])}
                  />
                  {showInheritCheckbox ? (
                    <Grid item className={classes.inheritCheck}>
                      <Checkbox
                        color="primary"
                        name={inheritKey}
                        onChange={(e) => handleCheckboxUpdate(e)}
                        checked={editObj[inheritKey] || false}
                        value={editObj[inheritKey]}
                      />
                      <span>{translate("inherit_from_base")}</span>
                    </Grid>
                  ) : null}
                </Grid>
              );
            })}
          </Grid>
          <Grid container direction="column">
            <Typography variant="subtitle1">{translate("featured_category_title")}</Typography>
            <Grid item container spacing={3} justify="space-between" md={12}>
              <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                {editable ? (
                  <NumberInput
                    source="feature-sequence"
                    label={translate("featured_search_label")}
                    value={editObj["feature-sequence"]}
                    autoComplete="off"
                    type="tel"
                    className={classes.InputWrapper}
                  />
                ) : (
                  <>
                    <Typography variant="caption">{translate("featured_search_label")}</Typography>
                    <Typography variant="subtitle2">{editObj["feature-sequence"]}</Typography>
                  </>
                )}
                {showInheritCheckbox ? (
                  <Grid item className={classes.inheritCheck}>
                    <Checkbox
                      color="primary"
                      name="inherit-feature-sequence"
                      onChange={(e) => handleCheckboxUpdate(e)}
                      checked={editObj["inherit-feature-sequence"] || false}
                      value={editObj["inherit-feature-sequence"]}
                    />
                    <span>{translate("inherit_from_base")}</span>
                  </Grid>
                ) : null}
              </Grid>
              {radioGroupOptions.row5.map((option) => {
                const { label, key, inheritKey } = option;
                const optionChoices = key === "feature-display" ? optionsDisplayName : options;
                return (
                  <Grid key={key} item container direction="column" justify="flex-start" alignItems="flex-start" xs>
                    <GenericRadioGroup
                      name={key}
                      label={label}
                      source={key}
                      choices={optionChoices}
                      editable={editable}
                      displayText={getDisplayText(optionChoices, editObj[key])}
                    />
                    {showInheritCheckbox ? (
                      <Grid item className={classes.inheritCheck}>
                        <Checkbox
                          color="primary"
                          name={inheritKey}
                          onChange={(e) => handleCheckboxUpdate(e)}
                          checked={editObj[inheritKey] || false}
                          value={editObj[inheritKey]}
                        />
                        <span>{translate("inherit_from_base")}</span>
                      </Grid>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </SimpleForm>
      )}
    </>
  );
};

CategoryConfigView.propTypes = {
  formattedResponseData: PropTypes.objectOf(PropTypes.any).isRequired,
  editObj: PropTypes.objectOf(PropTypes.any).isRequired,
  radioGroupOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  handleCheckboxUpdate: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  updateConfiguration: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  setEditable: PropTypes.func.isRequired,
  backupData: PropTypes.objectOf(PropTypes.any).isRequired,
  handleCategoryTypeUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default React.memo(CategoryConfigView);
