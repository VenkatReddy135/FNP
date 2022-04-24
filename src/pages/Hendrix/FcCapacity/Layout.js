import React from "react";
import { Divider, Grid, Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, required, SaveButton } from "react-admin";
import { useHistory } from "react-router-dom";
import { stubTrue } from "lodash";
import TextEditor from "../../../components/DataGridtable/TextEditor";
import FormatterView from "../../../components/DataGridtable/FormatterView";
import PopupView from "../../../components/DataGridtable/PopupView";
import CommonDialogContent from "../../../components/CommonDialogContent";
import useStyles from "../styles";
import TableGrid from "../../../components/TableGrid";
import SearchComponent from "../../../components/SearchComponent";
import PageHeader from "../../../components/PageHeader";
import DropdownGroups from "../../../components/DropdownGroup";
import { menuOptions, menuRuleOptions, fcFieldNameArray } from "../common";

/**
 * Component for FC Capacity contains a simple grid with configurations
 *
 * @param {*}  props all the props required for FC Capacity grid
 * @returns {React.ReactElement} returns a FC Capacity component
 */
const FcLayout = (props) => {
  const {
    rowValues,
    dropDownListArray,
    selectedInput,
    setSelectedInput,
    onViewClick,
    searchInput,
    setSearchInput,
    searchCall,
    onUpdateCall,
    setConfirmDialog,
    toggleFlag,
    setDeleteId,
    showUpdateButton,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const gridTitle = translate(`fc_gridTitle`);

  /**
   * @function onPopupClick To perform Menu Operations based on the selected value from grid row popup
   *
   * @param {object} rowList current row
   * @param {string} key selected menu
   */
  const onPopupClick = (rowList, key) => {
    const stateVal = { inputData: selectedInput, editList: rowList };
    if (key === "Edit") {
      history.push({
        pathname: "/hendrix/v1/fccapacity/show",
        search: `?add=${JSON.stringify(stateVal)}&edit=${true}`,
      });
    }
    if (key === "Add New Rule") {
      history.push({
        pathname: "/hendrix/v1/fccapacity/show",
        search: `?add=${JSON.stringify(stateVal)}`,
      });
    } else if (key === "Delete") {
      setDeleteId(rowList);
      const message = translate(`delete_rule`);
      const dialogObj = {
        dialogContent: <CommonDialogContent message={message} />,
        showButtons: true,
        closeText: translate("No"),
        actionText: translate("Yes"),
      };
      setConfirmDialog(dialogObj);
      toggleFlag(true);
    }
  };

  const filteredMenuOptions = menuOptions.filter(
    (item) => translate(item.key) === "Edit" || translate(item.key) === "Delete",
  );

  const columns = [
    {
      key: "Menu",
      name: "",
      width: 80,
      resizable: true,
      frozen: true,
      formatter: (p) => PopupView(p, filteredMenuOptions, onPopupClick, menuRuleOptions),
    },
    {
      key: "fullFilmentcenterName",
      name: translate("fc_fulfillmentCenterName"),
      width: 200,
      resizable: true,
      frozen: true,
      formatter: (p) => FormatterView(p),
    },
    {
      key: "fullFilmentcenterId",
      name: translate("fc_fulfillmentCenterID"),
      width: 200,
      resizable: true,
      formatter: (p) => FormatterView(p),
      frozen: true,
    },
    {
      key: "configName",
      name: translate("fc_configName"),
      width: 200,
      resizable: true,
      formatter: (p) => FormatterView(p),
      frozen: true,
    },
    {
      key: "fromDate",
      name: translate("fc_fromDate"),
      width: 200,
      resizable: true,
      formatter: (p) => FormatterView(p),
      frozen: true,
    },
    {
      key: "thruDate",
      name: translate("fc_toDate"),
      width: 200,
      resizable: true,
      formatter: (p) => FormatterView(p),
      frozen: true,
    },
    {
      key: "capacity",
      name: translate("fc_capacity"),
      width: 200,
      resizable: true,
      editor: (e) => TextEditor(e, onUpdateCall, stubTrue),
      formatter: (p) => FormatterView(p),
      editable: true,
    },
  ];
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
      {(rowValues.length > 0 ||
        (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
        (searchInput.fieldName && searchInput.operator)) && (
        <Box>
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            placeholder={translate("fc_searchPlaceholder")}
            menuItem={fcFieldNameArray}
          />
          <Divider variant="fullWidth" />
          {rowValues.length > 0 ? (
            <Grid container>
              <TableGrid
                /* eslint-disable react/jsx-props-no-spreading */
                {...props}
                columns={columns}
                rowValues={rowValues}
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

FcLayout.propTypes = {
  actionButtonsForGrid: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  onUpdateCall: PropTypes.func.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  toggleFlag: PropTypes.func.isRequired,
  setDeleteId: PropTypes.func.isRequired,
  showUpdateButton: PropTypes.bool.isRequired,
};

export default FcLayout;
