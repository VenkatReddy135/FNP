import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    color: "white",
    fontSize: "16px",
    minWidth: "120px",
  },
  verticalDivider: {
    width: "4px",
    height: "18px",
    background: "#FF9212",
    marginTop: "25px",
    marginLeft: "90px",
    marginRight: "15px",
  },
  arrowDivider: {
    marginLeft: "24px",
    width: "23px",
    background: "#FFFFFF00",
    boxShadow: "5px 0px 6px #95959550",
  },
  nav: {
    "& a": {
      display: "block",
      textDecoration: "none",
      padding: "5px 20px",
      textTransform: "capitalize",
      fontSize: "16px",
      letterSpacing: "2px",
      position: "relative",
      cursor: "pointer",
    },

    "& li": {
      position: "relative",
      width: "auto",
      textAlign: "left",
      textDecoration: '"none"',
      listStyle: "none",
    },

    "& li a": {
      color: "white",
      fontWeight: 500,
    },

    "& li ul li a": {
      color: "black",
      fontSize: "12px",
    },

    "& li ul li ul": {
      background: "white",
    },
    "& li ul": {
      background: "white",
    },
    "& li ul li:hover > a": {
      fontWeight: 500,
      color: "green",
    },
    "& li a:first-child:nth-last-child(2):before": {
      content: '""',
      position: "absolute",
      height: "0",
      width: "0",
      border: "5px solid transparent",
      top: "50%",
      right: "5px",
    },
    "& ul": {
      margin: "0",
      padding: "0",
      listStyle: "none",
      position: "absolute",
      whiteSpace: "nowrap",
      borderBottom: "5px solid green",
      zIndex: 1,
      left: "-99999em",
    },
    "& > li:hover > ul": {
      left: "auto",
      minWidth: "100%",
    },
    "& > li li:hover > ul": {
      left: "100%",
      top: "0",
    },
    "& > li > a:first-child:nth-last-child(2):before": {
      borderTopColor: "white",
      marginTop: "-2px",
    },
    "& > li:hover > a:first-child:nth-last-child(2):before": {
      border: "5px solid transparent",
      borderBottomColor: "white",
      marginTop: "-7px",
    },
    "& li li > a:first-child:nth-last-child(2):before": {
      borderLeftColor: "green",
      marginTop: "-5px",
    },
    "& li li:hover > a:first-child:nth-last-child(2):before": {
      border: "5px solid transparent",
      borderRightColor: "green",
      right: "10px",
    },
  },
});

export default useStyles;
