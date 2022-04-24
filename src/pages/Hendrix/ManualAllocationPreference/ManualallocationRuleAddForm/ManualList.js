import React from "react";
import PropTypes from "prop-types";
import { useTranslate, DateInput, SimpleForm, SaveButton, required, minValue } from "react-admin";
import { Divider, Button, Grid, Box } from "@material-ui/core";
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
 * Component for common file Add and edit page
 *
 * @param {object} root0  for new list
 * @param {Array} root0.pageData totalpage and pagecount values
 * @param {Array} root0.rowValues table rows
 * @param {Function} root0.onButtonClick to call API
 * @param {Array} root0.editList List of row data
 * @param {Function} root0.updateFromDate update fromdate
 * @param {Function} root0.updateToDate update todate
 * @param {Function} root0.onTemplateCall  show template dropdown values
 * @param {Function} root0.quotaHandle Capturing the modified rows for making update call
 * @param  {Array} root0.searchInput search fields
 * @param {Function} root0.setSearchInput update search fields
 * @param {Function} root0.searchCall fetch the filtered data based on the selected fieldValues
 * @param {Function} root0.onChangeStateValues update the fromDate & toDate and ruleName based on changes
 * @param {Function} root0.setConfirmDialog show the popup
 * @param {Function} root0.setModalOpen show and hide popup
 * @param {Function} root0.selectedFromDate update frodate
 * @param {Function} root0.selectedToDate update todate
 * @returns {React.ReactElement} returns a updated rule
 */
const ManualList = ({
  pageData,
  rowValues,
  onButtonClick,
  editList,
  updateFromDate,
  updateToDate,
  onTemplateCall,
  quotaHandle,
  searchInput,
  setSearchInput,
  searchCall,
  onChangeStateValues,
  setConfirmDialog,
  setModalOpen,
  selectedFromDate,
  selectedToDate,
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
   * @function to fetch new rows on scrolling down the grid
   * @returns {*} null/Error
   *
   */
  const loadMoreRows = async () => {
    if (pageData.current && pageData.current.filter) {
      const { totalPages, currentPage } = pageData.current;
      if (currentPage + 1 < totalPages) {
        const { fieldName, fieldValues, operator } = searchInput;
        let payload = {};
        if (fieldName && fieldValues && operator)
          payload = { ...searchInput, page: pageData.current.currentPage + 1, size: 20 };
        else payload = { page: pageData.current.currentPage + 1, size: 20 };
        try {
          await searchCall("", payload);
        } catch (err) {
          return err.response ? err.response.data : null;
        }
      }
    }
    return null;
  };

  const { configName } = editList;

  return (
    <>
      <SimpleForm
        className={classes.pageSimpleForm}
        save={onButtonClick}
        submitOnEnter={false}
        toolbar={
          <SaveButton className={classes.updateBtn} variant="contained" icon={<></>} label={translate("save")} />
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
        <SearchComponent
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchCall={searchCall}
          menuItem={carrierFieldNameArray}
        />
        <Box>
          <Button variant="outlined" onClick={onTemplateCall}>
            {translate(`mapCarrier_useTemplateButton`)}
          </Button>
        </Box>
      </SimpleForm>
      <TableGrid
        columns={columns}
        loadMoreRows={loadMoreRows}
        rowValues={rowValues}
        currentRow={(data) => quotaHandle(data, "qt")}
        updatedRowDetails={() => null}
      />
    </>
  );
};

ManualList.propTypes = {
  pageData: PropTypes.objectOf(PropTypes.any).isRequired,
  rowValues: PropTypes.objectOf(PropTypes.any).isRequired,
  onButtonClick: PropTypes.func.isRequired,
  editList: PropTypes.objectOf(PropTypes.any).isRequired,
  updateFromDate: PropTypes.func.isRequired,
  updateToDate: PropTypes.func.isRequired,
  onTemplateCall: PropTypes.func.isRequired,
  quotaHandle: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  onChangeStateValues: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  selectedFromDate: PropTypes.string.isRequired,
  selectedToDate: PropTypes.string.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
};

export default ManualList;
