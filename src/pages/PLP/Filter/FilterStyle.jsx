import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../config/GlobalConfig";

const { green } = color;

const useStyles = makeStyles(() => ({
  filterConfigHeading: {
    borderBottom: "1px solid #ddd",
    paddingLeft: "8px",
  },
  filterConfigHeadingRow: {
    padding: `10px 0`,
    fontWeight: "bold",
    fontSize: "16px",
  },
  filterConfigRow: {
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid #eee`,
    paddingLeft: "6px",
    padding: "5px 0",
  },
  sortIcon: {
    paddingLeft: 4,
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
    color: "#DCDCDC",
  },
  chipIconFilter: {
    fontSize: "9px",
    display: "table-cell",
    height: "12px",
    backgroundColor: "#E53333",
    color: "#FFFFFF",
  },
  chipIconLabel: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  inActiveIcon: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  createButtonToolbar: {
    justifyContent: "center",
    paddingLeft: "10px",
  },
  overrideDisable: {
    pointerEvents: "none",
    opacity: "0.3",
  },
  checkboxIcon: {
    padding: "0 10px 0 0",
  },
  categoryFilterHeading: {
    color: green,
  },
}));

export default useStyles;
