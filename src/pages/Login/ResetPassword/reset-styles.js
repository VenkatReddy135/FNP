import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply style for Reset form
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
  subtitle1: {
    fontSize: "22px",
    fontWeight: "550",
    color: "#333333",
    marginBottom: "10px",
  },
  caption: {
    color: "#555555",
    fontSize: "17px",
    marginLeft: "5px",
  },
  inputClass: {
    width: "315px",
    marginTop: "28px",
    height: "50px",
    backgroundColor: "#FFFFFF",
    "& .MuiFormHelperText-root.Mui-error": {
      fontSize: "10px",
    },
  },
  checkedLogo: {
    fontSize: "40px",
    color: "green",
    marginTop: "10px",
    marginBottom: "20px",
  },
  boxClass: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userIconClass: {
    fontSize: "25px",
    color: "#555555",
  },
  errorClass: {
    color: "#E83133",
    marginTop: "10px",
  },
  btnContained: {
    width: "315px",
    height: "52px",
    marginTop: "35px",
    backgroundColor: "#FF9212",
    color: "#FFFFFF",
    fontSize: "18px",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#F68808",
    },
  },
  body2: {
    fontSize: "16px",
    color: "#555555",
    width: "315px",
    marginBottom: "10px",
  },
}));

export default useStyles;
