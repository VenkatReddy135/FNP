import React from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, required, SaveButton, SimpleForm } from "react-admin";
import { useHistory } from "react-router-dom";
import { stubTrue } from "lodash";
import TextEditor from "../../../components/DataGridtable/TextEditor";
import FormatterView from "../../../components/DataGridtable/FormatterView";
import PopupView from "../../../components/DataGridtable/PopupView";
import DropdownGroups from "../../../components/DropdownGroup";
import TableGrid from "../../../components/TableGrid";
import PageHeader from "../../../components/PageHeader";
import CommonDialogContent from "../../../components/CommonDialogContent";
import useStyles from "../styles";
import SearchComponent from "../../../components/SearchComponent";
import { allocationLogicFieldNameArray, menuOptions, menuRuleOptions } from "../common";

/**
 * Component for Allocation logic contains a simple grid with configurations
 *
 * @param {object}  props all props required for Allocation logic grid
 * @returns {React.ReactElement} returns a Allocation logic component
 */
const AllocationLogicLayout = (props) => {
  const {
    rows,
    showUpdateButton,
    dropDownListArray,
    selectedInput,
    setSelectedInput,
    onViewClick,
    onUpdateCall,
    searchInput,
    setSearchInput,
    searchCall,
    handleDropdown,
    setConfirmDialog,
    toggleFlag,
    setDeleteId,
    vendor,
    pgGroup,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const gridTitle = translate("grid_title");
  const fcColumns = [
    { key: translate("column_distance"), name: translate("distance") },
    { key: translate("column_price"), name: translate("price") },
    { key: translate("column_capacityDone"), name: translate("capacity_done") },
    { key: translate("column_fcRating"), name: translate("fc_rating") },
    { key: translate("column_manualRating"), name: translate("manual_rating") },
  ];
  const carrierColumns = [
    { key: translate("column_leadHours"), name: translate("lead_hours") },
    { key: translate("column_shippingPrice"), name: translate("shipping_price") },
    { key: translate("column_carrierRating"), name: translate("carrier_rating") },
    { key: translate("column_manualRating"), name: translate("manual_rating") },
  ];

  /**
   * @function onPopupClick To perform Menu Operations based on the selected value from grid row popup
   * @param {object} rowList current row
   * @param {string} key selected menu
   */
  const onPopupClick = (rowList, key) => {
    const stateObj = { inputs: selectedInput, editList: rowList, pgValues: pgGroup };
    const encodedObj = btoa(JSON.stringify(stateObj));
    if (key === "Edit") {
      history.push({
        pathname: "/hendrix/v1/allocationlogic/rule",
        search: `?add=${encodedObj}&edit=${true}`,
      });
    } else if (key === "Delete") {
      setDeleteId(rowList);
      const message = translate("delete_modal_message");
      const dialogObj = {
        dialogContent: <CommonDialogContent message={message} />,
        showButtons: true,
        closeText: translate("delete_deny"),
        actionText: translate("delete_confirm"),
      };
      setConfirmDialog(dialogObj);
      toggleFlag(true);
    } else if (key === "Duplicate Rule") {
      history.push({
        pathname: "/hendrix/v1/allocationlogic/rule",
        search: `?add=${encodedObj}&edit=${true}&duplicate=${true}`,
      });
    } else {
      history.push({
        pathname: "/hendrix/v1/allocationlogic/rule",
        search: `?add=${encodedObj}`,
      });
    }
  };
  // default columns
  const defaultHeaders = [
    {
      key: translate("column_menu"),
      name: "",
      width: 80,
      resizable: true,
      frozen: true,
      formatter: (p) => PopupView(p, menuOptions, onPopupClick, menuRuleOptions),
    },
    {
      key: translate("column_baseGeoId"),
      name: translate("pincode"),
      width: 200,
      resizable: true,
      frozen: true,
      formatter: (p) => FormatterView(p),
    },
    {
      key: translate("column_configName"),
      name: translate("config_name"),
      width: 200,
      resizable: true,
      editor: TextEditor,
      formatter: (p) => FormatterView(p),
      editable: true,
      frozen: true,
    },
    {
      key: translate("column_fromDate"),
      name: translate("from_date"),
      width: 200,
      resizable: true,
      editor: TextEditor,
      formatter: (p) => FormatterView(p),
      editable: true,
      frozen: true,
    },
    {
      key: translate("column_thruDate"),
      name: translate("to_date"),
      width: 200,
      resizable: true,
      editor: TextEditor,
      formatter: (p) => FormatterView(p),
      editable: true,
      frozen: true,
    },
  ];
  const FcHeaders = fcColumns.map((item) => {
    return {
      key: item.key,
      name: item.name,
      width: 200,
      resizable: true,
      editor: (e) => TextEditor(e, onUpdateCall, stubTrue),
      formatter: (p) => FormatterView(p, "", stubTrue),
      editable: true,
    };
  });
  const CarrierHeaders = carrierColumns.map((item) => {
    return {
      key: item.key,
      name: item.name,
      width: 200,
      resizable: true,
      editor: (e) => TextEditor(e, onUpdateCall, stubTrue),
      formatter: (p) => FormatterView(p, "", stubTrue),
      editable: true,
    };
  });

  const columns = vendor === "FC" ? [...defaultHeaders, ...FcHeaders] : [...defaultHeaders, ...CarrierHeaders];
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
    }
  };
  return (
    <>
      <Grid container>
        <PageHeader
          header={{ ruleName: gridTitle }}
          buttonName={translate("update")}
          onUpdateClick={onUpdateCall}
          enableButton={showUpdateButton}
        />
      </Grid>
      <Divider variant="fullWidth" />
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
              />
            </Grid>
          ))}
        </Grid>
      </SimpleForm>
      <Divider variant="fullWidth" />
      {(rows.length > 0 ||
        (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
        (searchInput.fieldName && searchInput.operator)) && (
        <>
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            menuItem={allocationLogicFieldNameArray}
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
        </>
      )}
    </>
  );
};

AllocationLogicLayout.propTypes = {
  showUpdateButton: PropTypes.bool.isRequired,
  SearchactionViewButton: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  gridTitle: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  props: PropTypes.objectOf(PropTypes.any).isRequired,
  dropDownListArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedInput: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
  onUpdateCall: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  toggleFlag: PropTypes.func.isRequired,
  setDeleteId: PropTypes.func.isRequired,
  vendor: PropTypes.string.isRequired,
  productGroups: PropTypes.objectOf(PropTypes.any).isRequired,
  pgGroup: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AllocationLogicLayout;
