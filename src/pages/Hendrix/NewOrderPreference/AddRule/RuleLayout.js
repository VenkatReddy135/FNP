/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Divider, Grid, Box } from "@material-ui/core";
import { useTranslate, DateInput, SimpleForm, SaveButton, required } from "react-admin";
import PropTypes from "prop-types";
import Modal from "../../../../components/CreateModal";
import GridActions from "../../../../components/GridActionButtons";
import useStyles from "../../styles";
import TableGrid from "../../../../components/TableGrid";
import PageHeader from "../../../../components/PageHeader";
import SearchComponent from "../../../../components/SearchComponent";
import { newFcFieldNameArray, formatDateConvert, formatDateConvertmonth } from "../../common";
import { validateToDateField } from "../../../../utils/validationFunction";
import TemplateComponent from "../../common/TemplateComponent";
/**
 * Component for New Order Preference component
 *
 * @param {*} props all the props needed for New Order Preference component
 * @returns {React.ReactElement} returns New Order Preference component component with datagrid
 */
const RuleLayout = ({
  columns,
  rowValues,
  updateFromDate,
  updateToDate,
  selectedInput,
  onRowsUpdate,
  searchCall,
  searchInput,
  setSearchInput,
  onUpdateCall,
  gridTitle,
  selectedFromDate,
  selectedToDate,
  loadMoreRows,
  toggleFlag,
  dialogObject,
  importPopupFlag,
  onSelectingTemplate,
  setDates,
  templateDropdownValues,
  setConfirmDialog,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("minValueMessage"));
  };

  /**
   * @function handleFromDateChange function called on change of From date in Advance search Page
   * @param {*} event event called on change of From date
   */
  const handleFromDateChange = (event) => {
    updateFromDate(formatDateConvert(event.target.value));
  };

  /**
   * @function handleThruDateChange function called on change of Thru date in Advance search Page
   * @param {*} event event called on change of Thru date
   */
  const handleThruDateChange = (event) => {
    updateToDate(formatDateConvert(event.target.value));
  };

  /**
   * @function handleChangeDate function called on change of dd/mm/yyyy
   * @param {*} obj event called on change of date
   * @returns {string} date value
   */
  const handleChangeDate = (obj) => {
    return formatDateConvertmonth(obj);
  };

  /**
   * To update dialogContent values based on change
   *
   * @returns {*} null/Error
   */
  const onTemplateCall = () => {
    const dialogObj = {
      dialogTitle: "Select Template",
      dialogContent: <TemplateComponent templateDropdownValues={templateDropdownValues} setDates={setDates} />,
      showButtons: true,
      closeText: "No",
      actionText: "Yes",
      showTitle: true,
    };
    setConfirmDialog(dialogObj);
    toggleFlag(true);
    return null;
  };

  const actionMasterGridRuleButton = [
    {
      type: "Button",
      label: translate("copy_from_template"),
      icon: <></>,
      variant: "outlined",
      onClick: onTemplateCall,
    },
  ];

  return (
    <>
      <PageHeader
        header={{
          ruleName: gridTitle.RuleName,
          ruleLabel: gridTitle.RuleLabel,
        }}
        buttonName="Save"
      />
      <Grid container className={classes.dateInputs}>
        <SimpleForm
          className={classes.pageSimpleForm}
          save={onUpdateCall}
          submitOnEnter={false}
          toolbar={<SaveButton className={classes.saveBtn} variant="outlined" icon={<></>} label="Save" />}
        >
          <Grid container item xs spacing={24}>
            <Box width={300}>
              <DateInput
                source="fromDate"
                label={translate(`mapCarrier_fromDate`)}
                className={classes.dateField}
                defaultValue={selectedFromDate.length > 0 ? handleChangeDate(selectedFromDate) : ""}
                onChange={handleFromDateChange}
                validate={required()}
              />
            </Box>
            <Box width={300}>
              <DateInput
                source="thruDate"
                label={translate("mapCarrier_toDate")}
                className={classes.dateField}
                defaultValue={selectedToDate.length > 0 ? handleChangeDate(selectedToDate) : ""}
                onChange={handleThruDateChange}
                validate={[required(), validateToDate(selectedFromDate)]}
              />
            </Box>
          </Grid>
        </SimpleForm>
      </Grid>
      <Divider variant="fullWidth" />
      {rowValues.length > 0 ? (
        <>
          <Grid container>
            <Grid item lg={8}>
              <SearchComponent
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                searchCall={searchCall}
                menuItem={newFcFieldNameArray}
              />
            </Grid>
            <Grid item lg={4}>
              <Box className={classes.actionBtn}>
                <GridActions actionButtonsForGrid={actionMasterGridRuleButton} />
              </Box>
            </Grid>
          </Grid>
        </>
      ) : null}
      <Divider variant="fullWidth" />
      <Grid container className={classes.TableStyle}>
        <TableGrid
          {...props}
          columns={columns}
          loadMoreRows={loadMoreRows}
          rowValues={rowValues}
          updatedRowDetails={onRowsUpdate}
        />
      </Grid>
      <Modal
        {...dialogObject}
        openModal={importPopupFlag}
        handleClose={() => toggleFlag(false)}
        handleAction={onSelectingTemplate}
      />
    </>
  );
};

RuleLayout.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  gridTitle: PropTypes.string.isRequired,
  rowValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateFromDate: PropTypes.func.isRequired,
  updateToDate: PropTypes.func.isRequired,
  onRowsUpdate: PropTypes.func.isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  onUpdateCall: PropTypes.func.isRequired,
  selectedFromDate: PropTypes.string.isRequired,
  selectedToDate: PropTypes.string.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  toggleFlag: PropTypes.func.isRequired,
  dialogObject: PropTypes.arrayOf(PropTypes.object).isRequired,
  importPopupFlag: PropTypes.bool.isRequired,
  onSelectingTemplate: PropTypes.func.isRequired,
  setDates: PropTypes.arrayOf(PropTypes.object).isRequired,
  templateDropdownValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  setConfirmDialog: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RuleLayout;
