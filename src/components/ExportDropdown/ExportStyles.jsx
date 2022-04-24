import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

const { spanishBlue } = color;
const useStyles = makeStyles(() => ({
  root: {
    fontSize: 12,
    padding: "5px 10px",
    boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.24)",
    borderRadius: "4px",
    "&:focus": {
      borderRadius: "4px",
      backgroundColor: "inherit",
    },
  },
  popover: {
    marginTop: 2,
  },
  input: {
    borderBottom: "initial",
  },
  formControl: {
    minWidth: 105,
  },
  show: {
    color: spanishBlue,
    fontWeight: "bold",
    fontSize: "12px",
  },
  arrowIcon: {
    fill: "#2874bb",
    fontSize: "16px",
    marginTop: "4px",
    marginRight: "7px",
    display: "block !important",
  },
  disabled: {
    color: spanishBlue,
    height: 16,
  },
  item: {
    fontSize: "12px",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#f8f8f8",
    },
  },
}));
export default useStyles;
