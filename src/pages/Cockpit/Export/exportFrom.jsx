import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect } from "react-admin";
import { InputLabel, Grid, Button, Select, MenuItem, FormControl } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import useStyles from "../../../assets/theme/common";
import cockpitConfig from "../../../config/CockpitConfig";

/**
 * Export Form Component used show the data based on selected entity group and entity name.
 *
 * @param {object} props all the props needed for Export
 * @param {object}props.entityGroups This is entity group
 * @param {object}props.entityNameData get response entity name
 * @param {Function}props.onApplyChange Method invokes when Apply button is clicked in order to get the Datagrid
 * @param {boolean}props.isApplied set is apply button clicked in order to get data grid
 * @param {Function}props.handleOnEditFields Method triggers when user click on Parent Edit button to change the Entity Value and Entity Name.
 * @param {Function}props.onHandleExportFormValidation Boolean used to check the validation on the Apply Button.
 * @param {Function}props.handleInputChange Function to update the state of input fields dynamically
 * @returns {React.ReactElement} returns a Export component
 */
const ExportForm = (props) => {
  const {
    entityGroups,
    entityNameData,
    onApplyChange,
    isApplied,
    handleOnEditFields,
    onHandleExportFormValidation,
    handleInputChange,
  } = props;

  const classes = useStyles();
  const redirect = useRedirect();

  const translate = useTranslate();
  const jsonFormatLabel = translate("jsonFormat");
  const xmlFormatLabel = translate("xmlFormatLabel");
  const EntityGroup = translate("entityGroupName");
  const EntityName = translate("entityName");
  const exportFileFormat = translate("exportFileFormat");
  const cancel = translate("cancel");
  const apply = translate("apply");

  const exportFormat = [
    { value: "xml", label: xmlFormatLabel },
    { value: "json", label: jsonFormatLabel },
  ];

  /**
   * @function onCancelHandler Method to cancel the operation and redirect user to main page.
   */
  const onCancelHandler = () => {
    redirect(`/${cockpitConfig.entityGroupsRoute}`);
  };

  return (
    <>
      <Grid item container direction="row" className={classes.customMargin}>
        <Grid item md={3}>
          <FormControl>
            <InputLabel>{EntityGroup}</InputLabel>
            <Select
              className={classes.autoCompleteItem}
              onChange={handleInputChange}
              disabled={isApplied}
              name="selectedEntityGroup"
              defaultValue=""
            >
              {entityGroups?.map((groupName) => (
                <MenuItem key={groupName} value={groupName} defaultValue="">
                  {groupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl>
            <InputLabel>{EntityName}</InputLabel>
            <Select
              className={classes.autoCompleteItem}
              onChange={handleInputChange}
              name="selectedEntityName"
              disabled={isApplied}
              defaultValue=""
            >
              {entityNameData?.map(({ entityName, id }) => (
                <MenuItem value={entityName} key={id + entityName}>
                  {entityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl>
            <InputLabel>{exportFileFormat}</InputLabel>
            <Select
              className={classes.autoCompleteItem}
              onChange={handleInputChange}
              disabled={isApplied}
              name="selectedExportFileFormat"
              defaultValue=""
            >
              {exportFormat?.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          {isApplied && (
            <Grid className={classes.headerClass} container justify="flex-end">
              <EditOutlinedIcon onClick={handleOnEditFields} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {!isApplied ? (
        <Grid item container justify="space-around" alignItems="flex-start" md={3}>
          <Grid item container direction="column" xs>
            <Button variant="outlined" onClick={onCancelHandler}>
              {cancel}
            </Button>
          </Grid>
          <Grid item container direction="column" xs>
            <Button variant="contained" onClick={onApplyChange} disabled={onHandleExportFormValidation}>
              {apply}
            </Button>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

ExportForm.propTypes = {
  entityGroups: PropTypes.arrayOf(PropTypes.string),
  entityNameData: PropTypes.arrayOf(PropTypes.object),
  onApplyChange: PropTypes.func.isRequired,
  isApplied: PropTypes.bool.isRequired,
  handleOnEditFields: PropTypes.func.isRequired,
  onHandleExportFormValidation: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

ExportForm.defaultProps = {
  entityGroups: [""],
  entityNameData: [{}],
};

export default memo(ExportForm);
