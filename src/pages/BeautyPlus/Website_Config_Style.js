/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */

import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Switch from "@material-ui/core/Switch";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(() => ({
  headerText: {
    color: "#009D43",
    fontWeight: "bold",
    fontSize: 20,
  },
  editIcon: {
    color: "#000000",
    right: "20px",
    position: "absolute",
  },
  fullWidth: {
    width: "100% !important",
  },
  editView: {
    paddingBottom: 50,
  },
  Paper: {
    marginTop: 20,
    marginBottom: 20,
    width: "auto",
    padding: 20,
    height: 60,
    alignSelf: "center",
    backgroundColor: "#F9F6F8",
  },
  labelText: {
    width: "100%",
    fontSize: "13px !important",
    fontFamily: "Helvetica !important",
    fontWeight: 100,
    color: "#9e9e9e",
  },
  valueText: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#000000",
  },
  previewText: {
    fontSize: "12px",
    color: "#1F77CE",
  },
  form: {
    width: "100%",
  },
  activeOption: {
    background: "#009d43",
    "& span": {
      color: "#fff !important",
      fontWeight: "normal !important",
    },
  },
  editLabelText: {
    color: "#9e9e9e",
    fontSize: "12px !important",
  },
  domainView: {
    backgroundColor: "#F8F6F7",
    width: "calc(100% + 48px)",
    margin: "0px 0 0 -24px",
    padding: "20px 0px 20px 15px",
  },
  domainViewSmall: {
    backgroundColor: "#F8F6F7",
    padding: "20px 0px 20px 15px",
  },
  sideBarMain: {
    height: "100%",
    width: "calc(100% + 24px)",
    margin: "0 -12px -12px -12px",
  },
  gridStyle: {
    padding: "25px",
  },
  subTitle1: {
    fontSize: "20px",
    color: "#222222",
    fontWeight: "550",
    marginTop: "20px",
    marginBottom: "20px",
  },

  titleGridStyle: {
    display: "flex",
    "& .MuiSwitch-root": {
      marginTop: "18px",
      marginLeft: "30px",
    },
  },
  gridStyleNew: {
    width: "auto",
  },
  categoryContent: {
    marginLeft: "55px",
    paddingLeft: "42px",
  },
  autoCompleteItem: {
    width: "350px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
  },
  textItem: {
    width: "850px",
    "& .MuiFilledInput-root": {
      backgroundColor: "#fafafa",
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#fafafa",
  },
  cancelBtn: {
    width: "98px",
    height: "41px",
    border: "1px solid #FF9212",
    borderRadius: "5px",
    color: "#FF9212",
    fontSize: "16px",
    fontWeight: "600",
    marginRight: "20px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    "&:hover": {
      color: "#F68808",
      backgroundColor: "#FFFFFF",
    },
  },
  historyBtn: {
    width: "150px",
    height: "41px",
    border: "1px solid #FF9212",
    borderRadius: "5px",
    color: "#FF9212",
    fontSize: "16px",
    fontWeight: "600",
    marginRight: "20px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    "&:hover": {
      color: "#F68808",
      backgroundColor: "#FFFFFF",
    },
  },
  createBtn: {
    width: "150px",
    height: "41px",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#FFFFFF",
    background: "#FF9212 0% 0% no-repeat padding-box",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#F68808",
    },
  },
  divider: {
    height: "65%",
    marginLeft: "10px",
    marginTop: "5px !important",
  },
  gridHead: {
    display: "flex",
    marginBottom: "1rem",
  },
  urlToolHead: {
    display: "flex",
    margin: "0.7rem 0 0.5rem",
  },
  iconStyle: {
    color: "black",
    width: 20,
    height: 20,
    margin: 5,
    cursor: "pointer",
  },
}));
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },

  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },

  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const CustomSwitch = withStyles({
  switchBase: {
    color: "#fff",
    "&$checked": {
      color: "#fff",
    },
    "&$checked + $track": {
      backgroundColor: "#009D43",
    },
  },
  checked: {},
  track: {},
})(Switch);

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

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export { useStyles, Accordion, AccordionSummary, AccordionDetails, CustomSwitch, AntTabs, AntTab, StyledTabs };
