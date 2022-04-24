import React from "react";
import { useTranslate, SimpleForm, required, SaveButton, TextInput, SelectInput } from "react-admin";
import PropTypes from "prop-types";
import { Grid, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import useStyles from "./styles";
import { operators } from "../../pages/Hendrix/common";

/**
 * Component for SearchFilterInput
 *
 * @param {object} props props of the SearchFilterInput
 * @returns {React.Component} return component
 */
const SearchFilterInput = (props) => {
  const { setSearchInput, searchCall, menuItem, placeholder } = props;
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function to handle the  input change
   * @param {string} value value
   * @param {string} field property name
   */
  const handleChange = (value, field) => {
    setSearchInput((prev) => {
      return { ...prev, [field]: value };
    });
  };

  return (
    <SimpleForm
      className={classes.pageSimpleForm}
      save={searchCall}
      submitOnEnter={false}
      toolbar={<SaveButton className={classes.searchBtn} variant="outlined" icon={<></>} label={translate("search")} />}
    >
      <Grid container spacing={24}>
        <Grid item xs>
          <SelectInput
            source="operators.id"
            choices={operators}
            label={translate("select_operator")}
            className={classes.catBasic}
            validate={[required()]}
            data-at-id="createOperatorType"
            variant="standard"
            onChange={(e) => handleChange(e.target.value, "operator")}
          />
        </Grid>
        <Grid item xs>
          <TextInput
            resettable
            helperText={false}
            autoComplete="off"
            focused={false}
            source="fieldValues"
            onChange={(e) => (e.target ? handleChange(e.target.value, "fieldValues") : null)}
            placeholder={placeholder}
            variant="standard"
            className={classes.catBasic}
            validate={[required()]}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon fontSize="small" color="disabled" mr={2} disabled />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs>
          <SelectInput
            source="menuItem.id"
            choices={menuItem}
            label={translate("column_name")}
            className={classes.catBasic}
            validate={[required()]}
            data-at-id="createCategoryType"
            variant="standard"
            onChange={(e) => handleChange(e.target.value, "fieldName")}
          />
        </Grid>
      </Grid>
    </SimpleForm>
  );
};
SearchFilterInput.propTypes = {
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  menuItem: PropTypes.arrayOf(PropTypes.any).isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default SearchFilterInput;
