import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  wrapper: {
    margin: "-28px 0",
    "& fieldset": {
      display: "none",
    },
    "&>div": {
      padding: "10px 0px 0px 0px",
    },
    "&>p": {
      marginTop: "-35px",
    },
  },
  toLeft: {
    paddingLeft: "10px",
  },
  toRight: {
    paddingRight: "10px",
  },
}));

export default useStyles;
