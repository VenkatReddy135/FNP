/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(() => ({
  titleText: {
    marginTop: 25,
    marginBottom: 20,
    color: "#000000",
    fontWeight: "500",
  },
  editorWrap: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#EDEDED",
    padding: 15,
    "& textarea": {
      outline: "none",
    },
  },
  editorView: {
    color: "grey",
    height: 180,
    overflow: "auto",
  },
}));

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#000000",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    color: "#000000",
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "#000000",
      opacity: 1,
    },
    "&$selected": {
      color: "#000000",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#000000",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export { useStyles, AntTabs, AntTab };
