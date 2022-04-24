import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../config/GlobalConfig";

const { orange } = color;

const productStyles = makeStyles({
  populateLabel: {
    fontSize: "15px",
    fontWeight: "500",
    verticalAlign: "middle",
  },
  inActiveDropdown: {
    pointerEvents: "none",
    opacity: 0.4,
    marginRight: "12px",
  },
  productDropdown: {
    marginTop: "4px",
    fontSize: "15px",
    marginRight: "10px",
    padding: "0px 5px",
    minWidth: "125px",
  },
  productButton: {
    fontSize: "15px",
    padding: "8px 10px",
    marginRight: "14px",
  },
  textUppercase: {
    textTransform: "uppercase",
  },
  checkboxAlign: {
    padding: "0px 4px 0px 0px",
  },
  addProductContainer: {
    minHeight: "250px",
  },
  optionColor: {
    color: orange,
  },
  findProductHeading: {
    marginBottom: "15px",
  },
  disabledOptionColor: {
    color: "rgba(0, 0, 0, 0.26)",
  },
});
export default productStyles;
