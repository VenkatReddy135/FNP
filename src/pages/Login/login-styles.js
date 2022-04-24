import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply style for Login form
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
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
  logo: {
    height: "74px",
    width: "203px",
    marginTop: "130px",
  },
  flowerImg: {
    height: "677px",
    width: "593px",
    marginRight: "64px",
  },
  heading: {
    fontSize: "22px",
    marginTop: "34px",
    color: "#333333",
  },
  error: {
    color: "#8B0000",
  },
  usernameInput: {
    marginTop: "40px",
    fontSize: "16px",
    color: "#9B9B9B",
    width: "315px",
    backgroundColor: "#FFFFFF",
  },
  loginBtn: {
    width: "315px",
    height: "52px",
    color: "#FFFFFF",
    backgroundColor: "#FF9212",
    borderRadius: "4px",
    fontSize: "18px",
    paddingLeft: "0px",
    marginLeft: "0px",
    marginTop: "20px",
    marginBottom: "20px",
    fontWeight: "500",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#F68808",
    },
  },
  forgotPasswordBtn: {
    color: "#2076CB!important",
    cursor: "pointer!important",
    fontSize: "12px",
    pointerEvents: "auto!important",
    fontWeight: "bold",
    marginTop: "20px",
    textDecoration: "none",
    textAlign: "center",
  },
  customBackground: {
    background: "#FFFFFF",
  },
}));

export default useStyles;
