import PropTypes from "prop-types";
import React from "react";
import { TextInput, required } from "react-admin";
import { Grid } from "@material-ui/core";
import Dropdown from "../Dropdown";
import useStyles from "../../assets/theme/common";

/**
 * @function HendrixList Component used to show input field to be filled for Module.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @returns {React.ReactElement} react-admin resource.
 */
const DropdownGroups = (props) => {
  const { onDropdownSelection, dropdownObj } = props;
  const classes = useStyles();

  /**
   * @function getMappedValues To map the type of input field to be shown.
   * @returns {React.ReactElement} react-admin component.
   */
  const GetMappedValues = () => {
    const { key, placeholder, type, Dataset, defaultValue } = dropdownObj;

    switch (type) {
      case "Dropdown":
        return (
          <>
            <Grid item xs className={classes.maxWidthWrap}>
              <Dropdown
                className={classes.dropdown}
                value={defaultValue}
                key={key}
                label={placeholder}
                data={Dataset}
                validate={[required()]}
                onSelect={(e) => onDropdownSelection(key, e, type)}
                edit
              />
            </Grid>
          </>
        );
      case "TextInput": {
        return (
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <TextInput
              source="selectText"
              label="Select Operator"
              className={classes.catBasic}
              validate={required()}
              autoComplete="off"
              variant="standard"
            />
          </Grid>
        );
      }
      default:
        return <></>;
    }
  };
  return (
    <>
      <Grid item container direction="row" alignItems="flex-start" justify="flex-start" md={10}>
        {GetMappedValues()}
      </Grid>
    </>
  );
};

DropdownGroups.propTypes = {
  dropdownObj: PropTypes.arrayOf(PropTypes.any).isRequired,
  onDropdownSelection: PropTypes.func.isRequired,
};

export default DropdownGroups;
