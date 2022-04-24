import React from "react";
import { Divider, Grid, Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, required, SaveButton } from "react-admin";
import useStyles from "../styles";
import TableGrid from "../../../components/TableGrid";
import PageHeader from "../../../components/PageHeader";
import LoaderComponent from "../../../components/LoaderComponent";
import SearchComponent from "../../../components/SearchComponent";
import { fcFieldNameArray, carrierFieldNameArray } from "../common";
import DropdownGroups from "../../../components/DropdownGroup";

/**
 * Component for Rating PG Specific FC
 *
 * @param {object}  props all the props needed for component
 * @returns {React.ReactElement} returns a Rating PG Specific FC component with datagrid
 */
const RatingPgFCLayout = (props) => {
  const {
    columns,
    rows,
    gridTitle,
    onUpdate,
    dropDownListArray,
    selectedInput,
    setSelectedInput,
    searchInput,
    setSearchInput,
    onViewClick,
    searchCall,
    showUpdateButton,
    status,
    vendorDetail,
    handleDropdown,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const { loading } = status;

  /**
   * @function To update the state value based on dropdown change
   *
   * @param {string} key property name
   * @param {object} e event object
   * @param {object} type contains field name
   */
  const onDropdownSelection = (key, e, type) => {
    const { value } = e.target;
    if (type === "Dropdown") {
      handleDropdown(key, value);
      setSelectedInput({ ...selectedInput, [key]: value });
    }
  };

  return (
    <>
      <Box>
        <PageHeader
          header={{
            ruleName: gridTitle,
          }}
          buttonName={translate("update")}
          onUpdateClick={onUpdate}
          enableButton={showUpdateButton}
        />
      </Box>
      <SimpleForm
        className={classes.pageSimpleForm}
        save={onViewClick}
        submitOnEnter={false}
        toolbar={<SaveButton className={classes.saveBtn} variant="outlined" icon={<></>} label={translate("view")} />}
      >
        <Grid container spacing={24}>
          {dropDownListArray.map((dropdownObj) => (
            <Grid item xs className={classes.dropdownContainer}>
              <DropdownGroups
                key={dropdownObj.key}
                defaultValue={selectedInput[dropdownObj.key]}
                dropdownObj={dropdownObj}
                onDropdownSelection={onDropdownSelection}
                validate={[required()]}
              />
            </Grid>
          ))}
        </Grid>
      </SimpleForm>
      {loading && (
        <Grid item sm={10} data-testid="loader">
          <LoaderComponent />
        </Grid>
      )}
      {(rows.length > 0 ||
        (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
        (searchInput.fieldName && searchInput.operator)) && (
        <Box>
          {" "}
          <Divider variant="fullWidth" />
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            placeholder={
              vendorDetail?.vendorType?.includes("Carrier") ? translate("search_by_carrier") : translate("search_by_fc")
            }
            menuItem={vendorDetail?.vendorType === "CR" ? carrierFieldNameArray : fcFieldNameArray}
          />
          <Divider variant="fullWidth" />
          {rows.length > 0 ? (
            <Grid container>
              <TableGrid
                /* eslint-disable react/jsx-props-no-spreading */
                {...props}
                columns={columns}
                rowValues={rows}
              />
            </Grid>
          ) : (
            <Grid>
              <Typography variant="h6">{translate("no_records")}</Typography>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};

RatingPgFCLayout.propTypes = {
  dropDownListArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  showUpdateButton: PropTypes.bool.isRequired,
  gridTitle: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedInput: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
  status: PropTypes.objectOf(PropTypes.any).isRequired,
  vendorDetail: PropTypes.objectOf(PropTypes.any).isRequired,
  handleDropdown: PropTypes.func.isRequired,
};

export default RatingPgFCLayout;
