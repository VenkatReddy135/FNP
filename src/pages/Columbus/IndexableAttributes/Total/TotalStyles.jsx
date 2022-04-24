import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { neroBlack, whiteSmoke, red, gray } = color;

const useStyles = makeStyles(() => ({
  formHeader: {
    borderTop: `1px solid ${gray}`,
    borderBottom: `1px solid ${gray}`,
    padding: "12px 10px 10px",
    backgroundColor: whiteSmoke,
    color: neroBlack,

    "& .MuiTypography-body1": {
      fontWeight: 900,
    },
  },
  formHeaderLabel: {
    color: neroBlack,
    fontWeight: 900,
    fontSize: 16,
  },
  textRight: {
    textAlign: "right",
    paddingRight: "2%",
  },
  isInvalidColor: {
    color: red,
  },
}));

export default useStyles;
