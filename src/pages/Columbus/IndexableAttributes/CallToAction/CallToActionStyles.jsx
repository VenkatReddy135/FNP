import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { white, yellow } = color;
const useStyle = makeStyles(() => ({
  updateButton: {
    color: white,
    backgroundColor: yellow,
    fontWeight: 700,
    marginTop: 20,
    "&:hover": {
      color: white,
      backgroundColor: yellow,
    },
  },
  resetButton: {
    color: yellow,
    backgroundColor: white,
    border: `1px solid ${yellow}`,
    marginRight: 15,
    fontWeight: 700,
    marginTop: 20,
    "&:hover": {
      color: yellow,
      backgroundColor: white,
    },
  },
}));

export default useStyle;
