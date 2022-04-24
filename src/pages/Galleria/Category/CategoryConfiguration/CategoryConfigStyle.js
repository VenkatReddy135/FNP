import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply style for Category Relation Create Page
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
  checkboxWrapper: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "0.00938em",
    margin: 0,
    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
  },
  inheritCheck: {
    "& .MuiCheckbox-root": {
      paddingLeft: 0,
    },
  },
  buttonAlignment: {
    marginLeft: "auto",
    order: 2,
    width: "48px",
    height: "48px",
  },
  InputWrapper: {
    width: "255px",
  },
  checkboxPadding: {
    padding: "12px",
  },
  disablePadding: {
    padding: "0px",
  },
}));

export default useStyles;
