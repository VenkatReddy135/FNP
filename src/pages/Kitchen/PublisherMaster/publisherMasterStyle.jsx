import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../config/GlobalConfig";

const { green, darkGray, black } = color;
const usePublisherMasterStyles = makeStyles(() => ({
  titleStyle: {
    color: green,
  },
  titleLineHeight: {
    lineHeight: "50px",
  },
  titleColor: {
    color: black,
    lineHeight: "50px",
  },
  attributeRowStyle: {
    padding: "0.6em",
    marginLeft: "2em",
  },
  attributeNameStyle: {
    wordBreak: "break-all",
  },
  disabledAttribute: {
    opacity: "0.38",
    fontSize: "initial",
    fontWeight: "inherit",
  },
  errorTextStyle: {
    "& p": {
      height: "0px",
    },
  },
  textFieldStyle: {
    marginLeft: "2.9em",
    "& div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: "3px",
      marginBottom: "-2px",
    },
    "& div>input": {
      width: "300px",
      paddingLeft: "1px",
    },
    "& div>p": {
      paddingLeft: "1em",
    },
    "& label": {
      marginTop: "-13px",
    },
  },
  checkboxStyle: {
    "& span": {
      padding: "0px",
    },
    "& span>span>svg": {
      color: darkGray,
    },
  },
  saveButtonStyle: {
    "& span>svg": {
      display: "none",
    },
    padding: "8px 30px",
  },
}));

export default usePublisherMasterStyles;
