import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Grid,
  Chip,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import useStyles from "../../assets/theme/common";

/**
 *
 * @param {object}props  all props needed in the Dialog Box
 * @param {Function}props.setData This is Callback function which is used to set the data.
 * @param {boolean}props.showButtons This is showing button status
 * @param {string}props.closeText This field is of string type which refers to label of cancel button.
 * @param {string}props.actionText This field is of a string type which refers to label of the filter button
 * @param {boolean}props.openModal This field is of boolean type which tell when the modal need to be open or when it need to be closed
 * @param {string}props.selectedEntityName This prop shows the selected Entity Group Name which is selected by the user.
 * @param {string}props.selectedEntityGroup This props shows the selected Entity Group which is selected by the user.
 * @param {string}props.selectedColumnField This props shows the selected Column Field which is selected by the user.
 * @param {string}props.value get the data
 * @param {string}props.operationType get the type of operation
 * @param {Function}props.handleClose This is a Callback function which is used to close the Modal
 * @param {Function}props.handleKeyUp This Callback is used to set the data when user press Enter button.
 * @param {Function}props.handleDelete This Callback works in order to delete the chip from the array
 * @param {Function}props.handleAction This callback is used to save the value which is being filtered by the user.
 * @param {Function}props.handleOperatorChange This callback is used to select the operation type.
 * @param {object}props.chipArray  chipArray
 * @function DialogBox pops up when user want to filter and field based on selected Entity group and Entity Name.
 * @returns {React.createElement} DialogBox
 */
export default function DialogBox(props) {
  const classes = useStyles();

  const translate = useTranslate();
  const entityGroup = translate("entityGroupName");
  const entityName = translate("entityName");
  const selectedField = translate("selectedField");
  const filterLabel = translate("filterLabel");

  const {
    showButtons,
    closeText,
    actionText,
    openModal,
    selectedEntityName,
    selectedEntityGroup,
    selectedColumnField,
    handleClose,
    setData,
    handleKeyUp,
    chipArray,
    handleDelete,
    handleAction,
    value,
    handleOperatorChange,
    operationType,
  } = props;

  const operatorList = [
    // { label: translate("equalTo"), value: "EqualTo", disabled: chipArray.length > 1 },
    // { label: translate("notEqualTo"), value: "NotEqualTo", disabled: chipArray.length > 1 },
    { label: translate("in"), value: "In" },
    { label: translate("notIn"), value: "NotIn" },
  ];

  // in future if we implement equal or not equal then we may use below function/

  // /**
  //  * @function getOperatorList Method used to get the operator List.
  //  * @returns {Array}object returns operator list array.
  //  */
  // const getOperatorList = () => {
  //   if (chipArray.length > 1) {
  //     return [operatorList[2], operatorList[3]];
  //   }
  //   return [...operatorList];
  // };

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>
        <CloseIcon onClick={handleClose} className={classes.closeStyle} />
      </DialogTitle>
      <DialogActions className={classes.actionContentStyle} disableSpacing>
        {showButtons && (
          <>
            <Grid container>
              <Grid container className={classes.headerClass} justify="space-between">
                <Grid item xs={4}>
                  <TextField label={entityGroup} value={selectedEntityGroup} disabled />
                </Grid>
                <Grid item xs={3}>
                  <TextField label={entityName} value={selectedEntityName} disabled />
                </Grid>
                <Grid item xs={3}>
                  <TextField label={selectedField} value={selectedColumnField} disabled />
                </Grid>
              </Grid>
              <Grid container xs={12} justify="space-between">
                <Grid item xs={6}>
                  <TextField
                    label={filterLabel}
                    className={classes.textInputWrap}
                    autoComplete
                    value={value}
                    onChange={(e) => {
                      setData(e.target.value);
                    }}
                    onKeyUp={handleKeyUp}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl className={classes.textInputWrap}>
                    <InputLabel>{translate("operator")}</InputLabel>
                    <Select name="selectedOperator" value={operationType} onChange={handleOperatorChange}>
                      {operatorList?.map((item) => (
                        <MenuItem key={item.value} value={item.value} disabled={item.disabled}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container direction="column" className={classes.headerClass}>
                <Grid container>
                  {chipArray?.map((i) => (
                    <Chip
                      className={classes.chipGap}
                      key={i}
                      label={i}
                      onDelete={() => handleDelete(i, selectedColumnField)}
                    />
                  ))}
                </Grid>
                <Grid className={classes.headerClass} container justify="center">
                  <Button
                    variant="outlined"
                    size="medium"
                    className={classes.actionStyle}
                    data-at-id="cancelButton"
                    onClick={handleClose}
                  >
                    {closeText}
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    className={classes.actionButtonStyle}
                    data-at-id="actionButton"
                    onClick={handleAction}
                  >
                    {actionText}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

DialogBox.propTypes = {
  setData: PropTypes.func,
  showButtons: PropTypes.bool,
  closeText: PropTypes.string,
  actionText: PropTypes.string,
  openModal: PropTypes.bool,
  selectedEntityName: PropTypes.string,
  selectedEntityGroup: PropTypes.string,
  selectedColumnField: PropTypes.string,
  handleClose: PropTypes.func,
  handleKeyUp: PropTypes.func,
  chipArray: PropTypes.arrayOf(PropTypes.string),
  handleDelete: PropTypes.func,
  handleAction: PropTypes.func,
  value: PropTypes.string,
  handleOperatorChange: PropTypes.func,
  operationType: PropTypes.string,
};

DialogBox.defaultProps = {
  chipArray: [""],
  setData: () => {},
  showButtons: false,
  closeText: "",
  actionText: "",
  openModal: false,
  selectedEntityName: "",
  selectedEntityGroup: "",
  selectedColumnField: "",
  handleClose: () => {},
  handleKeyUp: () => {},
  handleDelete: () => {},
  handleAction: () => {},
  value: "",
  operationType: "",
  handleOperatorChange: () => {},
};
