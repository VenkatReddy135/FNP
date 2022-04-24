import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  labelText: {
    fontSize: "13px",
    color: "#9e9e9e",
  },
  valueText: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#000000",
  },
  selectView: {
    "& >.MuiFormLabel-root": {
      fontSize: "12px !important",
    },
    "& >.MuiFormLabel-root.Mui-focused ": {
      color: "#009D43 !important",
    },
    "& > .MuiInput-underline:after": {
      borderBottom: "2px solid #009D43 !important",
    },
  },
}));

export default useStyles;
