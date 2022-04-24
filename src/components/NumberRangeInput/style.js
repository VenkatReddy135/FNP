import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  wrapper: {
    "& fieldset": {
      display: "none",
    },
    "&>div": {
      padding: "10px 0px 0px 0px",
      maxWidth: "100%",
    },
  },
  inputWrapper: {
    width: "100%",
  },
  toLeft: {
    paddingLeft: "10px",
  },
  toRight: {
    paddingRight: "10px",
  },
}));

export default useStyles;
