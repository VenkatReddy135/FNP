import React from "react";
import PropTypes from "prop-types";
import { useTranslate, DateInput, SimpleForm, SaveButton, required, minValue, SelectArrayInput } from "react-admin";
import { Divider, Grid, Box, Typography } from "@material-ui/core";
import { stubTrue } from "lodash";
import useStyles from "../../styles";
import TableGrid from "../../../../components/TableGrid";
import SearchComponent from "../../../../components/SearchComponent";
import FormatterView from "../../../../components/DataGridtable/FormatterView";
import TextEditor from "../../../../components/DataGridtable/TextEditor";
import TextInput from "../../../../components/TextInput";
import { carrierFieldNameArray } from "../../common";
import { validateToDateField } from "../../../../utils/validationFunction";

/**
 * Component for common file duplicate page
 *
 * @param {object} root0  for new list
 * @param {Array} root0.pageData totalpage and pagecount values
 * @param {Array} root0.rowValues table rows
 * @param {Array} root0.baseGeoIds list of
 * @param {Array} root0.pgArray To Fetch Product Groups and populate on ProductGroup dropdown
 * @param {Function} root0.onButtonClick to call API
 * @param {Array} root0.editList List of row data
 * @param {Function} root0.updateFromDate update fromdate
 * @param {Function} root0.updateToDate update todate
 * @param {Function} root0.quotaHandle Capturing the modified rows for making update call
 * @param  {Array} root0.searchInput search fields
 * @param {Function} root0.setSearchInput update search fields
 * @param {Function} root0.searchCall fetch the filtered data based on the selected fieldValues
 * @param {Function} root0.onChangeStateValues update the fromDate & toDate and ruleName based on changes
 * @param {Function} root0.setConfirmDialog show the popup
 * @param {Function} root0.setModalOpen show and hide popup
 * @param {Function} root0.selectedFromDate update frodate
 * @param {Function} root0.selectedToDate update todate
 * @param {Function} root0.onPincodeChange to update the Pincode values on change
 * @param {Function} root0.onProductGroupChange update the Productgroup values on change
 * @returns {React.ReactElement} returns a updated rule
 */
const DuplicateList = ({
  pageData,
  rowValues,
  baseGeoIds,
  pgArray,
  onButtonClick,
  editList,
  updateFromDate,
  updateToDate,
  quotaHandle,
  searchInput,
  setSearchInput,
  searchCall,
  onChangeStateValues,
  setConfirmDialog,
  setModalOpen,
  selectedFromDate,
  selectedToDate,
  onPincodeChange,
  onProductGroupChange,
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const today = new Date().toISOString().slice(0, 10);

  /**
   * @function to update state values for showing appropriate modal
   * @param {string } action name of the action
   */
  const onCellValidate = ({ title, showButtons, closeText, actionText }) => {
    const dialogObj = {
      dialogContent: title,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    setModalOpen(true);
  };

  const columns = [
    {
      key: "vendorName",
      name: translate(`mapCarrier_carrierName`),
      width: 300,
      resizable: true,
      editor: TextEditor,
      formatter: (p) => FormatterView(p),
      editable: false,
    },
    {
      key: "vendorId",
      name: translate(`mapCarrier_carrierID`),
      width: 300,
      resizable: true,
      editor: TextEditor,
      formatter: (p) => FormatterView(p),
      editable: false,
    },
    {
      key: "value",
      name: translate(`mapCarrier_quota`),
      width: 200,
      resizable: true,
      editor: (e) => TextEditor(e, onCellValidate, stubTrue),
      formatter: (p) => FormatterView(p),
      editable: true,
    },
  ];

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("minValueMessage"));
  };

  /**
   * @function loadMoreRows to fetch new rows on scrolling down the grid
   * @returns {*} null/Error
   */
  const loadMoreRows = async () => {
    if (pageData.current && pageData.current.filter) {
      const { totalPages, currentPage } = pageData.current;
      if (currentPage + 1 < totalPages) {
        const { fieldName, fieldValues, operator } = searchInput;
        if (fieldName && fieldValues && operator) {
          const payload = { ...searchInput, page: pageData.current.currentPage + 1, size: 20 };
          try {
            await searchCall(payload);
          } catch (err) {
            return err.response ? err.response.data : null;
          }
        }
      }
    }
    return null;
  };

  const { configName } = editList;

  return (
    <>
      <SimpleForm
        className={classes.pageSimpleFormTop}
        save={onButtonClick}
        submitOnEnter={false}
        toolbar={
          <SaveButton className={classes.updateBtn} variant="contained" icon={<></>} label={translate("duplicate")} />
        }
      >
        <Grid container item xs spacing={24}>
          <Box width={350}>
            <TextInput
              id="standard-required"
              value={configName}
              autoComplete="off"
              label={translate(`mapCarrier_ruleName`)}
              onChange={(data) => onChangeStateValues(data, "configName")}
              validate={required()}
              edit
            />
          </Box>
          <Box width={300}>
            <DateInput
              source="fromDate"
              label={translate("mapCarrier_fromDate")}
              className={classes.dateField}
              defaultValue={selectedFromDate}
              onChange={(date) => updateFromDate(date.target.value)}
              validate={[required(), minValue(today, translate("fromdate_error"))]}
            />
          </Box>
          <Box width={300}>
            <DateInput
              source="thruDate"
              label={translate("mapCarrier_toDate")}
              className={classes.dateField}
              defaultValue={selectedToDate}
              onChange={(date) => updateToDate(date.target.value)}
              validate={[required(), validateToDate(selectedFromDate)]}
            />
          </Box>
        </Grid>
        <Divider variant="fullWidth" />
        <Grid
          item
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          xs
          className={classes.duplicateTo}
        >
          <Typography variant="h6">{translate("duplicate_label")}</Typography>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={9}>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Box width={250}>
              <SelectArrayInput
                fullWidth
                source={translate("pincodes")}
                choices={baseGeoIds}
                optionText="name"
                onChange={onPincodeChange}
                optionValue="id"
                disableValue="not_available"
                validate={required()}
              />
            </Box>
          </Grid>
          <Grid item container direction="row" justify="flex-start" alignItems="center" xs display="inline">
            <Box width={250}>
              <SelectArrayInput
                fullWidth
                source={translate("productGroup_placeholder")}
                choices={pgArray}
                onChange={onProductGroupChange}
                optionText="name"
                optionValue="id"
                disableValue="not_available"
                validate={required()}
              />
            </Box>
          </Grid>
        </Grid>
      </SimpleForm>
      <Divider variant="fullWidth" />
      <div className={classes.searchContainer}>
        <div className={classes.boxContain}>
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            menuItem={carrierFieldNameArray}
          />
        </div>
      </div>
      <TableGrid
        columns={columns}
        loadMoreRows={loadMoreRows}
        rowValues={rowValues}
        updatedRowDetails={() => ""}
        currentRow={(data) => quotaHandle(data, "qt")}
      />
    </>
  );
};

DuplicateList.propTypes = {
  pageData: PropTypes.objectOf(PropTypes.any).isRequired,
  rowValues: PropTypes.objectOf(PropTypes.any).isRequired,
  pgArray: PropTypes.objectOf(PropTypes.any).isRequired,
  baseGeoIds: PropTypes.arrayOf.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  editList: PropTypes.objectOf(PropTypes.any).isRequired,
  updateFromDate: PropTypes.func.isRequired,
  updateToDate: PropTypes.func.isRequired,
  quotaHandle: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  onChangeStateValues: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  selectedFromDate: PropTypes.string.isRequired,
  selectedToDate: PropTypes.string.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  onPincodeChange: PropTypes.func.isRequired,
  onProductGroupChange: PropTypes.func.isRequired,
};

export default DuplicateList;
