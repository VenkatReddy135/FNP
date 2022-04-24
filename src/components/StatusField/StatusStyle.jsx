import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

const { green, red } = color;

const useStyles = makeStyles(() => ({
  statusActive: {
    color: green,
  },
  statusInActive: {
    color: red,
  },
}));

export default useStyles;
