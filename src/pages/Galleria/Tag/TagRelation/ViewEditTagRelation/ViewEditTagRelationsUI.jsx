/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, SelectInput, NumberInput, required } from "react-admin";
import { Typography, Grid, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../../../assets/theme/common";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import AutoComplete from "../../../../../components/AutoComplete";
import SwitchComp from "../../../../../components/switch";
import CustomToolbar from "../../../../../components/CustomToolbar";
import CustomTextInput from "../../../../../components/TextInput";

const requiredValidate = [required()];

/**
 * Component to render the View/Edit Page UI for Tag Relation
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const ViewEditTagRelationsUI = (props) => {
  const {
    responseData,
    isEditable,
    editRelationObj,
    relationTypes,
    cancelTagHandler,
    deleteToggleOpen,
    switchToEditHandler,
    handleIsEnabledChange,
    handleUpdatedObj,
    errorMsg,
    handleAutocompleteChange,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();

  const apiParams = {
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
    fieldId: "tagId",
    fieldName: "tagName",
    sortParam: "tagName",
  };

  return (
    <>
      <SimpleForm
        save={handleUpdatedObj}
        initialValues={responseData}
        toolbar={isEditable && <CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("update")} />}
      >
        <Grid container justify="space-between">
          {!isEditable && (
            <Grid container justify="flex-end">
              <Grid item>
                <IconButton onClick={switchToEditHandler}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton>
                  <DeleteOutlinedIcon onClick={deleteToggleOpen} />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid container justify="space-between">
          <Grid item md={4}>
            {!isEditable ? (
              <CustomTextInput
                label={translate("relation_type")}
                value={responseData?.tagRelationType?.name}
                gridSize={{ xs: 12, sm: 12, md: 12 }}
              />
            ) : (
              <SelectInput
                source="tagRelationType.id"
                choices={relationTypes}
                validate={requiredValidate}
                label={translate("relation_type")}
                className={classes.autoCompleteItem}
                data-at-id="relation_type"
                options={{ disabled: !isEditable }}
              />
            )}
          </Grid>
          <Grid item md={4}>
            <AutoComplete
              label={translate("relation_type_value")}
              data-at-id="relationTypeValue"
              apiParams={apiParams}
              onOpen
              value={editRelationObj.targetTagId}
              autoCompleteClass={classes.autoCompleteItem}
              onChange={handleAutocompleteChange}
              required
              disabled={!isEditable}
              errorMsg={errorMsg}
            />
          </Grid>
          <Grid item md={4}>
            {!isEditable ? (
              <CustomTextInput
                label={translate("sequence")}
                value={responseData.sequence}
                gridSize={{ xs: 12, sm: 12, md: 12 }}
              />
            ) : (
              <NumberInput
                source="sequence"
                className={classes.sequence}
                label={translate("sequence")}
                data-at-id="sequence"
                autoComplete="off"
                min={1}
                type="tel"
              />
            )}
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Typography variant="caption">{translate("is_tag_relation_enabled")}</Typography>
          <SwitchComp record={editRelationObj.isEnabled} disable={!isEditable} onChange={handleIsEnabledChange} />
        </Grid>
        <Grid container>
          <CustomTextInput label={translate("relations_created_by")} value={responseData.createdByName} />
          <CustomTextInput
            label={translate("relations_created_date")}
            value={responseData.createdAt ? formatDateTime(responseData.createdAt) : "-"}
          />
        </Grid>
        <Grid container>
          <CustomTextInput
            label={translate("last_modified_by")}
            value={responseData.updatedByName !== null ? responseData.updatedByName : "-"}
          />
          <CustomTextInput
            label={translate("last_modified_date")}
            value={responseData.updatedAt !== null ? formatDateTime(responseData.updatedAt) : "-"}
          />
        </Grid>
      </SimpleForm>
    </>
  );
};

ViewEditTagRelationsUI.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  errorMsg: PropTypes.bool,
  responseData: PropTypes.objectOf(PropTypes.any).isRequired,
  editRelationObj: PropTypes.objectOf(PropTypes.any).isRequired,
  relationTypes: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleUpdatedObj: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  deleteToggleOpen: PropTypes.func.isRequired,
  switchToEditHandler: PropTypes.func.isRequired,
  handleIsEnabledChange: PropTypes.func.isRequired,
  handleAutocompleteChange: PropTypes.func.isRequired,
};

ViewEditTagRelationsUI.defaultProps = {
  errorMsg: false,
};

export default React.memo(ViewEditTagRelationsUI);
