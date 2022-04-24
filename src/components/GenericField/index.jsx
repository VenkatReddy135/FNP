/* eslint-disable react/jsx-props-no-spreading */
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import * as React from "react";
import { TextInput } from "react-admin";
import config from "../../config/CockpitConfig";
import mapping from "./mapping";
import useStyles from "../../assets/theme/common";
import JsonEditorField from "../jsonEditorField";

/**
 * Component for creating generic fields
 *
 * @param {object} props all the props required for GenericField
 * @param {object}props.configForEntitySqlForm This is an Array of Object which holds the configuration for Sql Entity Form
 * @param {object}props.configForEntityNoSqlForm This is an Object of Object which holds the configuration of Non Sql Entity like arango of mongo db
 * @param {string}props.dbType This is of string type which helps us to create the dynamic fields based on the type of database weather sql or non-sql
 * @returns {React.ReactElement} returns a React component
 */
const GenericField = (props) => {
  const { configForEntitySqlForm, dbType, configForEntityNoSqlForm } = props;
  const useDefaultProps = { fullWidth: true };
  const componentTypes = mapping[dbType];
  const classes = useStyles();
  return (
    <>
      {dbType === config.dbType.mysql ? (
        configForEntitySqlForm.map(({ fieldType, source, label, disabled }, idx) => {
          if (componentTypes[fieldType]) {
            const { type: Component, ...rest } = componentTypes[fieldType];
            return (
              <Grid container key={+idx} direction="row" justify="space-between" alignItems="center" xs={5}>
                {disabled ? (
                  <TextInput
                    label={label}
                    source={source}
                    disabled={disabled}
                    {...useDefaultProps}
                    {...rest}
                    className={classes.autoCompleteItem}
                  />
                ) : (
                  <Component label={label} source={source} {...useDefaultProps} hasSeconds {...rest} />
                )}
              </Grid>
            );
          }
          return null;
        })
      ) : (
        <JsonEditorField jsonObj={configForEntityNoSqlForm} label="document" source="document" />
      )}
    </>
  );
};

GenericField.propTypes = {
  dbType: PropTypes.string,
  configForEntitySqlForm: PropTypes.arrayOf(PropTypes.object),
  configForEntityNoSqlForm: PropTypes.arrayOf(PropTypes.object),
};

GenericField.defaultProps = {
  configForEntitySqlForm: [{}],
  configForEntityNoSqlForm: [{}],
  dbType: "",
};

export default GenericField;
