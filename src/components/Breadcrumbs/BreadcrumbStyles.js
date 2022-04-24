import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  arrow: {
    padding: "5px",
    boxSizing: "content-box",
  },
  breadcrumbContainer: {
    "& a": {
      color: "#111",
      textDecoration: "none",
      fontSize: "12px",
    },
    "& li": {
      margin: "0px !important",
    },
  },
  landingPage: {
    fontSize: "12px",
  },
});

export default useStyles;
