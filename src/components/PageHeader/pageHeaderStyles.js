import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply style for PageHeader
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
  pageHeadContainer: {
    display: "flex",
    justifyContent: "space-between",
    // marginTop: "-30px",
    "& button": {
      marginTop: "10px",
    },
  },
  pathContainer: {
    fontSize: "12px",
    fontWeight: "500",
    marginBottom: "5px",
  },
  pathEndName: {
    color: "#555555",
    fontSize: "12px",
    fontWeight: "500",
  },
  pageHeader: {
    fontSize: "24px",
    color: "#555555",
    fontWeight: "500",
    marginBottom: "10px",
    padding: "15px",
  },
  headingColor: {
    color: "#009212",
  },
  buttonStyle: {
    position: "absolute",
    right: "20px",
  },
}));

export default useStyles;
