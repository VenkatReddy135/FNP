import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { gray, black, darkGray } = color;
const useStyles = makeStyles(() => ({
  formHeader: {
    borderTop: `1px solid ${gray}`,
    borderBottom: `1px solid ${gray}`,
    padding: 10,
    marginTop: 10,
  },
  formHeaderLabel: {
    color: black,
    fontWeight: 500,
  },
  textRight: {
    textAlign: "right",
  },
  formContent: {
    borderBottom: `1px solid ${gray}`,
    padding: "4px 10px",
  },
  formContentLabel: {
    color: darkGray,
    fontSize: "14px",
    fontWeight: 400,
  },
  formInputClass: {
    width: 60,
  },
  inputPadding: {
    padding: "5px 0px 5px 5px",
    textAlign: "center",
  },
}));

export default useStyles;
