import { makeStyles } from "@material-ui/core";

const useNiftyStyles = makeStyles(() => ({
  switchButton: {
    "& label": { paddingLeft: "4px", flexDirection: "column-reverse" },
  },
  basicField: {
    width: "250px",
  },
  configField: {
    width: "150px",
  },
  searchField: {
    width: "180px",
  },
  disableBorder: {
    "& .Mui-disabled:before": {
      borderBottomStyle: "none",
    },
  },
  formIterator: {
    marginTop: 0,

    "& li": {
      borderBottom: "none",
    },
    "& li>p": {
      display: "none",
    },
  },
  basicSwitchButton: {
    "& label": { marginLeft: "1px", flexDirection: "column-reverse" },
  },
  configSwitch: {
    "& label": { marginLeft: "16px", flexDirection: "column-reverse" },
    width: "150px",
  },
  viewSwitch: {
    marginLeft: "-10px",
  },
}));

export default useNiftyStyles;
