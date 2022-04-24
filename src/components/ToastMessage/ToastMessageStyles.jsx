import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

const { black, white, red } = color;
const useStyles = makeStyles(() => ({
  successAlert: {
    color: white,
    backgroundColor: black,
  },
  errorAlert: {
    color: white,
    backgroundColor: red,
  },
  marginTop: {
    marginTop: 50,
  },
}));

export default useStyles;
