import React from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { InputLabel, Button, Select, MenuItem, FormControl, Grid } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";

/**
 * Component for  PreSignedUrl for Import in  Cockpit.
 *
 * @param {object} props all the props required by Presigned Request Form
 * @param {Function}props.handleInputChange Function to update the state of input fields dynamically
 * @param {object}props.entityGroupNamesData Api used to get the Entity Group Names Data
 * @param {object}props.responseEntityName set response entity name
 * @param {Function}props.handleOnSubmit Function to handle action when Submit Button is clicked.
 * @param {Function}props.onHandlePresignedFormValidation Function to check validation on Next button.
 * @returns {React.ReactElement} returns a Import component
 */
const PreSignedRequestForm = (props) => {
  const {
    entityGroupNamesData,
    responseEntityName,
    handleOnSubmit,
    onHandlePresignedFormValidation,
    handleInputChange,
  } = props;

  const classes = useStyles();
  const translate = useTranslate();
  const DatabaseName = translate("databaseName");
  const EntityName = translate("entityName");
  const continueLabel = translate("continueLabel");
  const FileType = translate("file_type");
  const selectEntityLabel = translate("select_entity_name");
  const selectFileTypeLabel = translate("select_file_type");

  const fileType = [
    { value: "xml", label: translate("xml") },
    { value: "json", label: translate("json") },
  ];

  return (
    <>
      <Grid>
        <Grid
          item
          container
          direction="row"
          className={classes.customMargin}
          alignItems="flex-start"
          justify="space-between"
          md={8}
        >
          <Grid item container direction="column" md={3} justify="flex-start" alignItems="flex-start" xs>
            <FormControl>
              <InputLabel id="database">{DatabaseName}</InputLabel>
              <Select
                className={classes.autoCompleteItem}
                labelId="database"
                name="selectedEntityGroup"
                onChange={handleInputChange}
                defaultValue=""
              >
                {entityGroupNamesData?.map((dbName) => (
                  <MenuItem key={dbName} value={dbName}>
                    {dbName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container direction="column" md={3} justify="flex-start" alignItems="flex-start" xs>
            <FormControl>
              <InputLabel id="entity_name">{EntityName}</InputLabel>
              <Select
                className={classes.autoCompleteItem}
                label={selectEntityLabel}
                labelId="entity_name"
                name="selectedEntityName"
                onChange={handleInputChange}
                defaultValue=""
              >
                {responseEntityName?.map(({ entityName, id }) => (
                  <MenuItem defaultValue="" key={id + entityName} value={entityName}>
                    {entityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container direction="column" md={3} justify="flex-start" alignItems="flex-start" xs>
            <FormControl>
              <InputLabel id="file_type">{FileType}</InputLabel>
              <Select
                labelId="file_type"
                className={classes.autoCompleteItem}
                label={selectFileTypeLabel}
                name="selectedFileType"
                onChange={handleInputChange}
                defaultValue=""
              >
                {fileType.map(({ label: dbName, value }) => (
                  <MenuItem defaultValue="" key={value} value={value}>
                    {dbName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          className={classes.customMargin}
          justify="flex-start"
          alignItems="flex-start"
          xs
        >
          <Button
            data-at-id="btnLogout"
            variant="outlined"
            size="small"
            onClick={handleOnSubmit}
            disabled={onHandlePresignedFormValidation}
          >
            {continueLabel}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

PreSignedRequestForm.propTypes = {
  entityGroupNamesData: PropTypes.arrayOf(PropTypes.string),
  responseEntityName: PropTypes.arrayOf(PropTypes.object),
  handleOnSubmit: PropTypes.func,
  onHandlePresignedFormValidation: PropTypes.func,
  handleInputChange: PropTypes.func,
};

PreSignedRequestForm.defaultProps = {
  entityGroupNamesData: [""],
  responseEntityName: [{}],
  handleOnSubmit: () => {},
  onHandlePresignedFormValidation: () => {},
  handleInputChange: () => {},
};

export default React.memo(PreSignedRequestForm);
