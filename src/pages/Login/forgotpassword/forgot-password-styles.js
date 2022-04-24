import { makeStyles } from "@material-ui/core/styles";
/**
 * makeStyles hook of material-ui to apply style for Forgot password form
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    height: "677px",
    width: "1134px",
    borderRadius: "3px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  flowerImg: {
    height: "677px",
    width: "593px",
    marginRight: "64px",
  },
  logoClass: {
    height: "73px",
    width: "204px",
    margin: "130px 0px 29px 0px",
  },
  subtitle1: {
    fontSize: "22px",
    fontWeight: "550",
    color: "#333333",
    marginBottom: "10px",
  },
  body2: {
    fontSize: "16px",
    color: "#555555",
    width: "330px",
    marginBottom: "20px",
  },
  inputClass: {
    width: "315px",
    background: "#FFFFFF",
  },
  checkedLogo: {
    fontSize: "40px",
    color: "#009D43",
    marginTop: "10px",
    marginBottom: "20px",
  },
  btnContained: {
    width: "315px",
    height: "52px",
    marginTop: "40px",
    backgroundColor: "#FF9212",
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: "500",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#F68808",
    },
  },
  errorClass: {
    color: "red",
    fontSize: "13px",
  },
  backToLoginBtn: {
    color: "#2076CB",
    cursor: "pointer",
    fontSize: "15px",
    pointerEvents: "auto",
    fontWeight: "550",
    marginBottom: "20px",
    marginTop: "20px",
    textDecoration: "none",
  },
  customBackground: {
    background: "#FFFFFF",
  },
}));

export default useStyles;
