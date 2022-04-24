import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../../config/GlobalConfig";

const { white, green, lightGray, black, gray } = color;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    marginTop: 20,
  },
  tabWrapper: {
    boxShadow: "none",
    backgroundColor: white,
  },
  tabsMinHeight: {
    minHeight: 35,
  },
  customTabsIndicator: {
    backgroundColor: green,
  },
  tabRoot: {
    backgroundColor: lightGray,
    borderRadius: "4px 4px 0px 0px",
    height: 20,
    color: black,
    maxWidth: 200,
    fontWeight: 500,
  },
  marginRight5: {
    marginRight: 5,
  },
  activeTabColor: {
    color: green,
  },
  tabFlexContainer: {
    borderBottom: `1px solid ${gray}`,
  },
  firstTab: {
    marginLeft: 0,
  },
}));

export default useStyles;
