import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { neroBlack, smokyGray, gray } = color;
const useStyles = makeStyles(() => ({
  formHeader: {
    borderTop: `1px solid ${gray}`,
    borderBottom: `1px solid ${gray}`,
    padding: 10,
    marginTop: 10,
  },
  formHeaderLabel: {
    color: neroBlack,
    fontWeight: 500,
  },
  textRight: {
    textAlign: "right",
  },
  sortIcon: {
    paddingLeft: 4,
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
  },
  textIconAlign: {
    display: "inline-flex",
    "& .MuiSvgIcon-root": {
      fill: smokyGray,
    },
  },
}));

export default useStyles;
