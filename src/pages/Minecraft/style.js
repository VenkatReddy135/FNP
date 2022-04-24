import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  maxWidthWrap: {
    "&>div": {
      maxWidth: "90%",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      height: "100%",
    },
    overflow: "hidden",
  },
  spacing: {
    paddingRight: "5%",
  },
  geo: {
    width: "100%",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "500",
  },
  fullwidth: {
    "& label": {
      transform: "translate(0px, 7px) scale(0.75)!important",
    },
    "& input": {
      paddingLeft: "0px",
      color: "#898989",
    },
    width: "90%",
  },
  deleteBtn: {
    marginTop: "26px",
    marginRight: "-20px",
    transform: "translate(-25px, 0)",
  },
  addCodeBtn: {
    margin: "30px 0",
    color: "#FF9212",
  },
  dateTimeGrid: {
    "&>div": {
      width: "90%",
    },
  },
  gridHeight: {
    height: "96px",
  },
  criteriaRow: {
    paddingTop: "12px",
    paddingBottom: "24px",
    position: "relative",
  },
  childCriteriaRow: {
    maxHeight: "123.58px",
    paddingTop: "12px",
    paddingBottom: "24px",
    position: "relative",
    backgroundColor: "#f4f4f4",
    "& div": {
      backgroundColor: "transparent",
    },
  },
  gridGap: {
    marginTop: "12px",
    marginBottom: "24px",
    position: "relative",
  },
  atachAtEnd: {
    position: "absolute",
    right: "-14px",
    top: "15px",
  },
  setMargin: {
    marginBottom: "-40px",
  },
  wildSearch: {
    height: "100px",
    "&>div": {
      maxWidth: "95%",
    },
    marginBottom: "-44px",
  },
  plusBtn: {
    marginBottom: "48px",
  },
  validateBtn: {
    marginTop: "22px",
    padding: "2px",
    textTransform: "capitalize",
    color: "#2076cb",
    fontWeight: "600",
    "&:hover": {
      backgroundColor: "none",
      textShadow: " 1px 1px #e2e2e2",
      background: "none",
    },
  },
  valueAndRangeBtns: {
    position: "absolute",
    left: "98.5%",
  },
  subCdnBtn: {
    padding: "2px",
    textTransform: "capitalize",
    color: "#2076cb",
    fontWeight: "600",
    zIndex: 10,
    "&:hover": {
      backgroundColor: "none",
      background: "none",
    },
  },
  subCdnBtnWrapper: {
    whiteSpace: "nowrap",
    position: "absolute",
    left: "85%",
    zIndex: 10,
  },
  criteriaForm: {
    position: "relative",
    marginBottom: "30px",
  },
  criteriaAddBtn: {
    color: "#FF9212",
    strokeWidth: "1",
    display: "block",
  },
  createCriteriaBtns: {
    position: "absolute",
    display: "flex",
    top: "35px",
    left: "95%",
  },
  updateCriteriaBtns: {
    position: "absolute",
    display: "flex",
    top: "35px",
    left: "97%",
  },
  dateAndTime: {
    "& input[type='date']": {
      marginRight: "-15px",
    },
  },
  radioBtn: {
    color: "black",
  },
}));

export default useStyles;
