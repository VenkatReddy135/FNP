import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply style for Login form
 *
 *  @function useStyles
 */
const useStyles = makeStyles(() => ({
  categoryUrl: {
    width: "255px",
    marginTop: "8px",
  },
  catBasic: {
    width: "240px",
    marginRight: "0px",
  },
  pageSimpleForm: {
    display: "flex",
    alignItems: "center",
  },
  searchBtn: {
    margin: "0px 0px 25px 50px",
  },
}));

export default useStyles;
