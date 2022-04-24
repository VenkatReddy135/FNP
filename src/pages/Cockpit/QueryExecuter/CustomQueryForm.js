import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import { useTranslate } from "react-admin";
import useStyles from "../../../assets/theme/common";

/**
 * Component for CustomQueryForm contains a Custom Query Form with configurations for Query Executer Component
 *
 * @param {object} props all the props required by Custom Query Form
 * @param {Function}props.handleInputChange Function to update the state of input fields dynamically
 * @param {Function}props.handleChange Function that performs the action when apply button is clicked and display the Dynamic Datagrid
 * @param {object}props.entityGroupNamesData Api used to get the Entity Group Names Data
 * @param {object}props.entityNames api used to get response entity name
 * @param {string}props.databaseEngineName get database engine name
 * @param {Function}props.onHandleClose Function to close the Dynamic Grid on Clicking the Close Button
 * @returns {React.ReactElement} returns a CustomQueryForm component
 */
const CustomQueryForm = (props) => {
  const {
    handleInputChange,
    handleChange,
    entityGroupNamesData,
    entityNames,
    databaseEngineName,
    onHandleClose,
  } = props;
  const classes = useStyles();

  const translate = useTranslate();

  /* Custom Query translate variables */

  const QueryExecuterTitle = translate("queryExecuterTitle");
  const DatabaseEngineName = translate("databaseEngineName");
  const DatabaseName = translate("databaseName");
  const EntityName = translate("sqlEntityName");
  const mongoDb = translate("mongoDatabase");
  const arangoDb = translate("arangoDatabase");
  const sqlDb = translate("sqlDatabase");
  const cancelBtn = translate("cancel");
  const submitBtn = translate("submit");
  const enterLabel = translate("enterLabel");
  const queryLabel = translate("query");
  const limitRows = translate("limit_rows");

  const rowsData = [20, 30, 50, 100];

  const databaseEngine = [
    { value: "mongo_database", label: mongoDb },
    { value: "mysql_database", label: sqlDb },
    { value: "arango_database", label: arangoDb },
  ];

  let labelDatabaseEngineName = "";
  if (databaseEngineName.length > 1) {
    labelDatabaseEngineName = databaseEngine.filter((itr) => {
      return itr.value === databaseEngineName;
    });
  }

  return (
    <>
      <Grid>
        <Grid item className={classes.gridStyle}>
          <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
            {`${labelDatabaseEngineName && labelDatabaseEngineName[0]?.label} ${" "} ${QueryExecuterTitle}`}
          </Typography>
        </Grid>

        <Grid
          item
          container
          direction="row"
          className={classes.gridContainer}
          alignItems="flex-start"
          justify="space-between"
          md={8}
        >
          <Grid item container direction="column" md={3} justify="flex-start" alignItems="flex-start" xs>
            <FormControl>
              <InputLabel>{DatabaseEngineName}</InputLabel>
              <Select
                defaultValue=""
                name="databaseEngineName"
                className={classes.autoCompleteItem}
                onChange={handleInputChange}
              >
                {databaseEngine.map(({ label: engine, value }) => (
                  <MenuItem key={value} value={value} defaultValue="">
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            className={classes.label}
            item
            container
            direction="column"
            md={3}
            justify="flex-start"
            alignItems="flex-start"
            xs
          >
            <FormControl>
              <InputLabel id="database">{DatabaseName}</InputLabel>
              <Select
                name="selectedDatabaseName"
                className={classes.autoCompleteItem}
                labelId="database"
                defaultValue=""
                onChange={handleInputChange}
              >
                {entityGroupNamesData?.map((entityGroupName) => {
                  return (
                    <MenuItem key={entityGroupName} value={entityGroupName} defaultValue="">
                      {entityGroupName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container direction="column" md={3} justify="flex-start" alignItems="flex-start" xs>
            <FormControl>
              <InputLabel>{EntityName}</InputLabel>
              <Select
                defaultValue=""
                name="selectedTableName"
                className={classes.autoCompleteItem}
                onChange={handleInputChange}
              >
                {entityNames?.map(({ entityName, id }) => (
                  <MenuItem key={id + entityName} value={entityName} defaultValue="">
                    {entityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item container alignItems="flex-start" direction="row" className={classes.gridContainer} xs={8}>
          <TextField
            multiline
            name="query"
            label={`${enterLabel} ${labelDatabaseEngineName && labelDatabaseEngineName[0]?.label} ${queryLabel}`}
            data-at-id="contentDetails"
            className={classes.textInputWrap}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item container justify="space-around" alignItems="flex-start" md={3}>
          <Grid
            item
            container
            direction="row"
            className={classes.gridContainer}
            justify="flex-start"
            alignItems="flex-start"
            xs
          >
            <FormControl>
              <InputLabel>{limitRows}</InputLabel>
              <Select defaultValue="" name="rows" className={classes.autoCompleteItem} onChange={handleInputChange}>
                {rowsData.map((egName) => (
                  <MenuItem key={egName} value={egName} defaultValue="">
                    {egName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item container justify="space-around" alignItems="flex-start" md={3}>
          <Grid
            item
            container
            direction="column"
            className={classes.gridContainer}
            justify="flex-start"
            alignItems="flex-start"
            xs
          >
            <Button variant="outlined" className={classes.btnClass} size="small" onClick={onHandleClose}>
              {cancelBtn}
            </Button>
          </Grid>
          <Grid
            item
            container
            direction="column"
            className={classes.gridContainer}
            justify="flex-start"
            alignItems="flex-start"
            xs
          >
            <Button variant="contained" className={classes.btnClass} size="small" onClick={handleChange}>
              {submitBtn}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

CustomQueryForm.propTypes = {
  handleInputChange: PropTypes.func,
  handleChange: PropTypes.func,
  entityGroupNamesData: PropTypes.arrayOf(PropTypes.object),
  entityNames: PropTypes.arrayOf(PropTypes.object),
  databaseEngineName: PropTypes.string,
  onHandleClose: PropTypes.func,
};

CustomQueryForm.defaultProps = {
  entityNames: [{}],
  entityGroupNamesData: [{}],
  handleInputChange: () => {},
  handleChange: () => {},
  databaseEngineName: "",
  onHandleClose: () => {},
};

export default React.memo(CustomQueryForm);
