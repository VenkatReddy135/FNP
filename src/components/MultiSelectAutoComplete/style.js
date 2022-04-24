import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  multiAutoComplete: {
    width: "100%",
    position: "relative",
    "&>p": {
      position: "absolute",
      top: "52px",
    },
    "&>div": {
      width: "100%",
      paddingBottom: "5px!important",
      /** for scroll */
      flexWrap: "nowrap",
      overflowX: "auto",
      "&>div:last-child": {
        width: "99%" /** to avoid scroll before adding values */,
      },
      "&::-webkit-scrollbar": {
        height: "5px",
      },
      /* Track */
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 5px grey",
        borderRadius: "10px",
      },
      /* Handle */
      "&::-webkit-scrollbar-thumb": {
        background: "#009d43",
        borderRadius: "10px",
      },
      /* Handle on hover */
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#01883b",
      },
    },
    /** styles for the value appearing as button */
    "& div[role='button']": {
      maxWidth: "150px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "11px",
      padding: "5px 2px",
      margin: "5px 2px 4px 0",
      height: "22px",
      "& span": {
        padding: "0 2px",
        cursor: "pointer",
      },
      "& svg": {
        zIndex: 1,
        marginRight: 0,
        marginLeft: "5px",
        cursor: "pointer",
      },
    },
  },
}));
export default useStyles;
