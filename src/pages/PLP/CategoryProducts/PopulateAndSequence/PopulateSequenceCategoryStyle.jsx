import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { darkGray } = color;
const useStyles = makeStyles(() => ({
  formInputWidth: {
    padding: "5px",
    textAlign: "center",
    width: "110px",
    margin: "0 auto",
  },
  textCenter: { textAlign: "center" },
  disabled: { opacity: 0.3 },
  alignTotal: {
    textAlign: "center",
    width: "105px",
    marginLeft: "-5px",
  },
  errorHighlight: { color: "red" },
  productInputAlign: { width: "90%" },
  textUppercase: { textTransform: "uppercase" },

  addProductList: {
    marginLeft: "20px",
  },
  noDaysAlign: {
    paddingLeft: "0px",
  },
  alignShipping: {
    textAlign: "right",
  },
  shippingTitle: {
    color: darkGray,
    fontSize: "15px",
    paddingRight: "53px",
  },
  totalLabelAlign: {
    textAlign: "right",
    paddingRight: "15px",
  },
}));

export default useStyles;
