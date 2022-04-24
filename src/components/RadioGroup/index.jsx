/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { RadioButtonGroupInput } from "react-admin";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  setMargin: {
    marginBottom: "40px",
  },
});

/**
 * Generic Radio Group component
 *
 * @param {*} props receives props for radio groups
 * @returns {React.ReactElement} returns a radio group
 */
const GenericRadioGroup = (props) => {
  const classes = useStyles();
  const { label, name, source, choices, editable, displayText, disabled, onChange, defaultValue } = props;

  return (
    <>
      {editable ? (
        <Grid item container justify="flex-start" xs>
          <RadioButtonGroupInput
            row
            name={name}
            label={label}
            source={source}
            choices={choices}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange ? (event) => onChange(event, source) : null}
          />
        </Grid>
      ) : (
        <Grid
          className={classes.setMargin}
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          xs
        >
          <Typography variant="caption">{label}</Typography>
          <Typography variant="subtitle2">{displayText}</Typography>
        </Grid>
      )}
    </>
  );
};

GenericRadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  source: PropTypes.string.isRequired,
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool.isRequired,
  displayText: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.bool,
};

GenericRadioGroup.defaultProps = {
  disabled: null,
  displayText: "",
  name: "",
  onChange: () => {},
  defaultValue: null,
};

export default React.memo(GenericRadioGroup);
