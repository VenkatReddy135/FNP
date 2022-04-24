import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

/**
 * makeStyles hook of material-ui to apply common style for any components
 *
 *  @function useStyles
 */
const { darkGray } = color;
const useStyles = makeStyles(() => ({
  titleGridStyle: {
    display: "flex",
    "& .MuiSwitch-root": {
      marginTop: "18px",
      marginLeft: "30px",
    },
  },
  arrayIterator: {
    display: "flex",
    marginBottom: "30px",
  },
  emptyRecords: {
    marginTop: "30px",
    textAlign: "center",
  },
  addressInputField: {
    width: "55%",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  autoCompleteItem: {
    width: "250px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  tagPickerDropdown: {
    margin: "3px 0 0 20px",
    width: "350px",
  },
  newtagPickerDropdown: {
    marginTop: "3px",
    width: "310px",
  },
  selectItem: {
    width: "250px",
    "& .Mui-disabled": {
      color: "#000000",
    },
    "& .MuiSelect-root.MuiSelect-select:focus": {
      backgroundColor: "#fafafa",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #D3D3D3",
    },
  },
  textFieldItem: {
    width: "400px",
    marginTop: "unset",
    marginLeft: "60px",
    "& .Mui-disabled": {
      color: "#000000",
    },
    "& .MuiInput-underline:before": {},
  },
  sequence: {
    width: "250px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
      fontSize: "16px",
      fontWeight: "700",
      marginTop: "0px",
    },
    "& .MuiInputBase-input": {
      fontSize: "16px",
      fontWeight: "700",
      backgroundColor: "white",
    },
    "& .MuiFormControl-marginNormal": {
      marginTop: "0px",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  relationShipType: {
    marginLeft: "0px",
    paddingLeft: "0px",
  },
  dateField: {
    width: "250px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  customDateTimeInput: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& input": {
      fontWeight: "bold",
    },
  },
  typographyText: {
    fontSize: "13px",
    marginLeft: "13px",
  },
  label: {
    marginLeft: "13px",
  },
  categoryContent: {
    marginLeft: "55px",
    paddingLeft: "42px",
  },
  customMargin: {
    marginBottom: "34px",
  },
  bottomMargin: {
    marginBottom: "50px",
  },
  container: {
    color: "#FFFFFF",
    height: "677px",
    width: "100%",
    borderRadius: "3px",
    position: "absolute",
    left: "50%",
    top: "50%",
  },
  switchPosition: {
    marginLeft: "32px",
    marginTop: "18px",
  },
  autoCompleteStyle: {
    width: "250px",
    marginLeft: "6px",
    marginTop: "0px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
    "& input": {
      fontWeight: "bold",
    },
  },
  formLabelStyle: {
    paddingRight: "10px",
    color: "#222222",
  },
  headerClass: {
    marginBottom: "10px",
    marginTop: "10px",
  },
  message: {
    fontSize: "16px",
    color: "#555555",
    width: "330px",
    marginBottom: "20px",
  },
  errorClass: {
    color: "red",
    fontSize: "13px",
  },
  dialogContentStyle: {
    color: "black",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  contentStyle: {
    textAlign: "center",
    marginBottom: "20px",
  },
  actionContentStyle: {
    margin: "auto",
    marginBottom: "20px",
  },
  titleStyle: {
    color: "#222222",
    fontSize: "22px",
    fontWeight: 600,
    display: "flex",
    justifyContent: "center",
  },
  closeStyle: {
    opacity: "0.5",
    position: "absolute",
    top: "5px",
    right: "5px",
    cursor: "pointer",
  },
  closeWithoutHeaderStyle: {
    opacity: "0.5",
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  },
  gridStyle: {
    color: "#009D43",
  },
  disabled: {
    "& .Mui-disabled": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
    borderBottomStyle: "hidden",
    color: "black",
    backgroundColor: "#fafafa",
    fontSize: "16px",
    fontWeight: "700",
  },
  containerWrapper: {
    paddingTop: "18px",
    backgroundColor: "#fafafa",
  },
  titleLineHeight: {
    lineHeight: "50px",
  },
  gridContainer: {
    marginBottom: "10px",
    width: "auto",
  },
  parentBox: {
    display: "flex",
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#fafafa",
  },
  menuItemDialog: {
    marginTop: "50px",
    marginLeft: "30px",
  },
  buttonAlignment: {
    marginLeft: "auto",
    order: 2,
    width: "48px",
    height: "48px",
  },
  refineButtonStyle: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#3282D0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    margin: "10px 0px",
    width: "150px",
    textDecoration: "none",
  },
  textInputField: {
    width: "250px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  numberInputField: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input": {
      "-moz-appearance": "textField",
    },
    width: "250px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  dividerStyle: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  verticalDivider: {
    marginLeft: "10px",
    alignSelf: "center",
    height: "20px",
  },
  tabStyle: {
    marginTop: "15px",
  },
  listStyle: {
    marginTop: "60px",
  },
  gridMarginStyle: {
    marginLeft: "10px",
  },
  autoCompleteCode: {
    width: "70px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  categoryMarginTop: {
    marginTop: "12px",
  },
  labelText: {
    fontSize: "13px",
    color: "#9e9e9e",
  },
  valueText: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#000000",
  },
  categoryRelationLeft: {
    marginLeft: "-15px",
  },
  textInputWrap: {
    width: "100%",
  },
  keywordChip: {
    border: "1px solid #cccccc",
    height: "150px",
    "overflow-y": "auto",
    marginTop: 15,
  },
  chipInputInner: {
    margin: 5,
  },
  mainTitleHeading: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#009D43",
  },
  plusButton: {
    marginTop: "18px",
  },
  formHelperText: {
    color: "#999999",
    fontSize: "12px",
    fontStyle: "italic",
    marginLeft: "12px",
  },
  colorRed: {
    color: "red",
  },
  canonicalUrl: {
    width: "100%",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
    "& .Mui-disabled:before": {
      borderBottomStyle: "hidden",
    },
  },
  fileContainerStyle: {
    width: "100%",
    minWidth: "150px",
    marginTop: "19px",
  },
  containerStyle: {
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
    justifyContent: "flex-end",
  },
  centerAlignContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  deleteIconStyle: {
    color: "#FF0000",
  },
  chipMargin: {
    margin: "4px",
  },
  formInputWidth: {
    width: "100%",
  },
  fullWidthTable: {
    display: "inline-table",
    tableLayout: "fixed",
  },
  flexParent: {
    display: "flex",
  },
  gapParent: {
    gap: "30px",
    display: "flex",
  },
  childAlignRight: {
    marginLeft: "auto",
  },
  smallInputNumber: {
    padding: "5px",
    textAlign: "center",
    width: "70px",
    margin: "0 auto",
    borderBottom: 0,
    border: `1px solid #eee`,
  },
  gridButtonContainer: {
    "& Button": {
      marginBottom: "10px",
    },
  },
  textAlignRight: { textAlign: "right" },
  textAlignCenter: { textAlign: "center" },
  redirectLink: {
    margin: "0 11% 0 0",
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  search: {
    float: "right",
    color: "#4d4dff",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
  },
  gridStyleNew: {
    width: "auto",
  },
  errorGridStyle: {
    color: darkGray,
  },
  errorIcon: {
    fontSize: "50px",
  },
  errorMsg: {
    fontWeight: "700",
    fontSize: "20px",
  },
  previewButtonShadow: {
    boxShadow: "none",
  },
  previewButton: {
    marginRight: "1px",
    "&:not(:last-child)": {
      borderColor: "#ffffff",
    },
  },
  previewButtonPaper: {
    marginLeft: "-1em",
    width: "160px",
  },
  previewPopper: {
    zIndex: "1",
  },
  tableFullWidth: { display: "table" },
  blueBtn: {
    color: "#2076cb",
    fontSize: "15px",
    border: "1px solid #ddd",
    padding: "2px 14px",
    textTransform: "inherit",
    "&:hover": { color: "#2076cb", border: "1px solid #ddd" },
  },
  pageTitleHeading: { fontSize: "24px", fontWeight: "500" },
  formControl: {
    margin: "1rem 1.5rem 1rem 0",
    minWidth: "140px",
  },
  helperTextAlign: {
    marginLeft: "14px",
  },
  labelMargin: {
    marginLeft: "10px",
    marginTop: "-6px",
  },
  textAreaAutoSize: {
    minHeight: "100px",
    width: "100%",
    margin: "10px 5px 20px 5px",
    padding: "10px",
  },
  secondaryText: {
    fontSize: "12px",
    fontWeight: "400",
  },
  italicFontStyle: {
    fontStyle: "italic",
  },
  iconCursorPointer: {
    cursor: "pointer",
    color: "#555555",
  },
  secondaryHeading: {
    fontSize: "18px",
    fontWeight: "500",
  },
  chipGap: {
    margin: "5px",
  },
  importErrorMsg: {
    color: "red",
    fontSize: "13px",
    position: "absolute",
    top: "55px",
  },
  divideend: {
    display: "flex",
    justifyContent: "space-between",
  },
  dropdownStyle: {
    maxWidth: "200px",
  },
  pageHeaderWithButton: {
    display: "flex",
    margin: "0.7rem 0 0.5rem",
  },
  checkboxGroupInput: {
    padding: "8px 0 0 0",
  },
  topMargin: {
    marginTop: "-15px",
  },
  marginTopNone: {
    marginTop: "0px",
  },
  fullWidth: {
    width: "100%",
  },

  toolbarStyle: {
    flexDirection: "column",
    alignItems: "flex-end",
    rowGap: "15px",
  },
  multiLineTypography: {
    overflow: "hidden", // if text is long it will limit the length
    textOverflow: "ellipsis", // if text is long it will add '...' to the end for thr hidden part
  },
  disabledText: {
    marginTop: "8px",
  },
  dateParent: {
    width: "200px",
  },
  refineSearchBackIcon: {
    verticalAlign: "top",
  },
  customSourceDataSpan: {
    height: "25px",
  },
  breadcrumbTop: {
    marginTop: "-16px",
  },
}));

export default useStyles;
