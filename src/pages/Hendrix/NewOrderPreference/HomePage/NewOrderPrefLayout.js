/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { Divider, Grid, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { stubTrue } from "lodash";
import { useTranslate, DateInput, required, SimpleForm, SaveButton, useDataProvider } from "react-admin";
import GridActions from "../../../../components/GridActionButtons";
import DropdownGroups from "../../../../components/DropdownGroup";
import useStyles from "../../styles";
import TableGrid from "../../../../components/TableGrid";
import Modal from "../../../../components/CreateModal";
import PageHeader from "../../../../components/PageHeader";
import SearchComponent from "../../../../components/SearchComponent";
import TextEditor from "../../../../components/DataGridtable/TextEditor";
import PopupView from "../CustomPopupView";
import CustomPopup from "../CustomPopup";
import { newFcFieldNameArray, formatDateConvert, menuOptions } from "../../common";
import { validateToDateField } from "../../../../utils/validationFunction";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/new-vendor-allocation-preferences`;

/**
 * Component for New Order Preference
 *
 * @param {*} all the props needed
 * @returns {React.ReactElement}  New Order Preference component
 */
const NewOrderPrefLayout = ({
  rowValues,
  updatedRows,
  setRowsVal,
  loadMoreRows,
  pgNames,
  callDetails,
  setcolumns,
  createRows,
  updateRowsValue,
  pageData,
  actionMasterGridRuleButton,
  gridTitle,
  dropDownListArray,
  selectedInput,
  setSelectedInput,
  onViewClick,
  searchCall,
  searchInput,
  setSearchInput,
  handleDropdown,
  updatedRowDetails,
  fetchData,
  selectedData,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [importPopupFlag, toggleFlag] = React.useState(false);
  const [dialogObject, setConfirmDialog] = React.useState("");
  const dataProvider = useDataProvider();

  /**
   *
   * @function to make bulk update call with modified rows
   * @returns {*} updated rows for grid
   */
  const onBulkUpdateCall = async () => {
    toggleFlag(false);
    if (updatedRows.current.rows.length > 0) {
      const payload = updatedRows.current.rows
        .filter((item) => item.quotas.length > 0)
        .map((element) => {
          return { ...element, quotas: element.quotas.filter((subElement) => subElement.value !== null) };
        });
      // updateList put
      const resp = await dataProvider.put(resource, {
        id: "",
        data: payload,
      });
      updateRowsValue(resp);
      if (resp.status === "success") {
        try {
          const key = "defaultSearch";
          const { data } = await fetchData(key);
          const nextRows = createRows(data);
          if (nextRows.length > 0) setRowsVal(nextRows);
        } catch (error) {
          return error.response ? error.response.data : null;
        }
      }
    }

    return null;
  };

  /**
   * @function to update dialogContents for popup based on event(bulkupdate / cell validation)
   *
   * @param {object} param0 contains destructured values
   * @param {string} param0.title title
   * @param {boolean} param0.showButtons button bool
   * @param {string} param0.closeText closed text
   * @param {string} param0.actionText action text
   */
  const onUpdateCall = ({
    title = translate(`update_modal_message`),
    showButtons = true,
    closeText = translate(`update_deny`),
    actionText = translate(`update_confirm`),
  }) => {
    const dialogObj = {
      dialogContent: title,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    toggleFlag(true);
  };

  /**
   * @function onDropdownSelection To update the state value based on dropdown change
   *
   * @param {string} key property name
   * @param {object} e event object
   * @param {string} type contains field name
   */
  const onDropdownSelection = (key, e, type) => {
    const { value } = e.target;
    if (type === "Dropdown") {
      handleDropdown(key, value);
      setSelectedInput({ ...selectedInput, [key]: value });
    } else {
      setSelectedInput({ ...selectedInput, [key]: value });
    }
  };

  // default column
  const defaultColumns = [
    {
      key: "baseGeoId",
      name: "Pincode",
      width: 200,
      resizable: true,
      frozen: true,
      formatter: (p) =>
        PopupView(
          p,
          menuOptions.filter((item) => translate(item.key) === "Delete"),
          callDetails,
        ),
    },
  ];

  // columns generated dynamically based on response
  const productColumns =
    pgNames &&
    pgNames.map((col) => {
      return {
        key: col.id,
        name: col.name,
        width: 200,
        resizable: true,
        editor: (e) => TextEditor(e, onUpdateCall, stubTrue),
        // editor: (e) => TextEditor(e, onUpdateCall),
        MoreVertIcon: true,
        formatter: (p) => CustomPopup(p, callDetails, stubTrue),
        editable: true,
      };
    });
  const columns = productColumns ? [...defaultColumns, ...productColumns] : [];

  useEffect(() => {
    setcolumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   *@function handleFromDateChange function called on change of From date in Advance search Page
   *@param {*} event event called on change of From date
   */
  const handleFromDateChange = (event) => {
    setSelectedInput({ ...selectedInput, fromDate: formatDateConvert(event.target.value) });
  };

  /**
   *@function handleThruDateChange function called on change of Thru date in Advance search Page
   *@param {*} event event called on change of Thru date
   */
  const handleThruDateChange = (event) => {
    setSelectedInput({ ...selectedInput, thruDate: formatDateConvert(event.target.value) });
  };

  /**
   * @function validateToDate function to validate Through date
   * @param {string} fromDateSelected Contains selected from date
   * @returns {string} returns the validation result and displays error message
   */
  const validateToDate = (fromDateSelected) => (value) => {
    return validateToDateField(fromDateSelected, value, translate("minValueMessage"));
  };
  /**
   *@function handleChangeDate function called on change of dd/mm/yyyy
   *@param {*} obj event called on change of date
   * @returns {string} returns date value
   */
  const handleChangeDate = (obj) => {
    return formatDateConvert(obj).replaceAll("-", "/");
  };

  return (
    <>
      <PageHeader
        header={{
          ruleName: gridTitle,
          ruleLabel: !gridTitle.includes("New FC") && "New FC Preference for",
        }}
        buttonName="UPDATE"
        onUpdateClick={onUpdateCall}
        enableButton={rowValues.length > 0}
      />
      <SimpleForm
        className={classes.pageSimpleForm}
        save={onViewClick}
        submitOnEnter={false}
        toolbar={<SaveButton className={classes.saveBtn} variant="outlined" icon={<></>} label="VIEW" />}
      >
        <Grid container item xs spacing={24}>
          {dropDownListArray.map((dropdownObj) => (
            <Grid item xs className={classes.dropdownContainer}>
              <DropdownGroups
                key={dropdownObj.key.toString()}
                label={dropdownObj.placeholder}
                dropdownObj={dropdownObj}
                onDropdownSelection={onDropdownSelection}
                validate={[required()]}
                edit
              />
            </Grid>
          ))}
          <Box width={300}>
            <DateInput
              source="fromDate"
              label={translate(`mapCarrier_fromDate`)}
              className={classes.dateField}
              defaultValue={selectedData.inputVal !== undefined ? handleChangeDate(selectedData.inputVal.fromDate) : ""}
              onChange={handleFromDateChange}
              validate={required()}
            />
          </Box>
          <Box width={300}>
            <DateInput
              source="thruDate"
              label={translate("mapCarrier_toDate")}
              className={classes.dateField}
              defaultValue={selectedData.inputVal !== undefined ? handleChangeDate(selectedData.inputVal.thruDate) : ""}
              onChange={handleThruDateChange}
              validate={[required(), validateToDate(selectedInput.fromDate)]}
            />
          </Box>
        </Grid>
      </SimpleForm>
      <Divider variant="fullWidth" />
      {(rowValues.length > 0 ||
        (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
        (searchInput.fieldName && searchInput.operator)) && (
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

          <Divider variant="fullWidth" />
          {rowValues.length > 0 ? (
            <TableGrid
              {...props}
              columns={columns}
              loadMoreRows={loadMoreRows}
              rowValues={rowValues}
              updatedRowDetails={updatedRowDetails}
            />
          ) : (
            <Box>
              <h4>No records found</h4>
            </Box>
          )}
        </>
      )}
      <Modal
        {...dialogObject}
        openModal={importPopupFlag}
        handleClose={() => toggleFlag(false)}
        handleAction={onBulkUpdateCall}
      />
    </>
  );
};

NewOrderPrefLayout.propTypes = {
  pageData: PropTypes.objectOf(PropTypes.any).isRequired,
  actionMasterGridRuleButton: PropTypes.arrayOf(PropTypes.object).isRequired,
  gridTitle: PropTypes.string.isRequired,
  rowValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  props: PropTypes.string.isRequired,
  dropDownListArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedInput: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  updatedRowDetails: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  pgNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  callDetails: PropTypes.func.isRequired,
  setcolumns: PropTypes.func.isRequired,
  createRows: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  updatedRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRowsVal: PropTypes.func.isRequired,
  updateRowsValue: PropTypes.func.isRequired,
  selectedData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NewOrderPrefLayout;
