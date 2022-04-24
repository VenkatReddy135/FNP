import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

const { spanishBlue } = color;
const useStyles = makeStyles(() => ({
  show: {
    color: spanishBlue,
    textDecoration: "underline",
    textDecorationColor: spanishBlue,
    fontWeight: "bold",
    backgroundColor: "Transparent",
    backgroundRepeat: "no-repeat",
    border: "none",
    cursor: "pointer",
    outline: "none",
    textDecorationSkipInk: "none",
  },
  hide: {
    color: spanishBlue,
    textDecoration: "underline",
    backgroundColor: "Transparent",
    border: "none",
    outline: "none",
    textDecorationSkipInk: "none",
    fontWeight: "bold",
    opacity: 1,
  },
  linkUnavailable: {
    opacity: "0.5 !important",
  },
}));
export default useStyles;
